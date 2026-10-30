<script setup lang="ts">
/**
 * sn-sidebar (uni-end) — vertical side navigation container.
 *
 * Reference library: wot-ui `wd-sidebar`
 *   (https://wot-ui.cn/component/sidebar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-sidebar 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-sidebar/sn-sidebar.vue
 * → auto-registered as `<sn-sidebar>` in any .vue that uses it.
 *
 * The container owns the single-value `v-model`; children
 * (`sn-sidebar-item`) read the selection through `provide`/`inject`
 * (`sn-sidebar-types.ts`).
 *
 * ## Scroll linkage (additive — AUI-OPT-08, AGENTS.md §112.3a)
 *
 * `scroll-spy` makes the highlight follow the content area instead of the
 * finger: the host binds `scroll-top` from its own `scroll-view` `@scroll` (or
 * the page's `onPageScroll`), each `sn-sidebar-item` declares the content
 * section it belongs to through `anchor`, and the container measures those
 * sections with `anchor-selector` to resolve which entry is on screen. The
 * position travels in as a prop rather than through an internal listener —
 * the sidebar does not own the scroll container and a miniprogram cannot read
 * `window.scrollY`. Algorithm and measurement live in `sn-sidebar-scroll.ts`.
 *
 * Scroll-driven switches bypass `before-change`, which guards user taps only:
 * the position of the content is the source of truth, so a veto would desync
 * the highlight from what the reader sees. `refresh()` re-measures after the
 * content changes.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 右侧内容面板 — 由使用方按 `change` 自行切换
 *   - 滚动容器 — 由宿主提供 `scroll-top` / `onPageScroll`
 *   - 横向分段器 — 用 sn-segmented
 *   - 顶部 / 底部导航 — 用 sn-navbar / sn-tabbar
 */

import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import {
  measureSectionOffsets,
  resolveActiveSection,
  type SnSidebarAnchorRef,
  type SnSidebarSectionOffset,
} from './sn-sidebar-scroll';
import { SN_SIDEBAR_KEY, type SnSidebarAnchorEntry, type SnSidebarValue } from './sn-sidebar-types';

defineOptions({ name: 'SnSidebar' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-sidebar` 1:1 surface ────────────────────────────────── */

    /** 当前激活项的值。 */
    modelValue?: SnSidebarValue;
    /** 切换前钩子，接收目标值，返回 boolean 或 Promise<boolean>。 */
    beforeChange?: ((value: SnSidebarValue) => boolean | Promise<boolean>) | undefined;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── additive (AUI-OPT-08, AGENTS.md §112.3a) ───────────────────────── */

    /**
     * 打开右侧内容区滚动联动（scroll-spy）：`scrollTop` 变化时自动切换高亮。
     * 需要 item 声明 `anchor` 且 `anchorSelector` 能匹配到内容区块。
     */
    scrollSpy?: boolean;
    /**
     * 内容区滚动距离（px），由宿主的 `scroll-view` `@scroll` 或页面
     * `onPageScroll` 上报。`scrollSpy` 打开时作为联动输入。
     */
    scrollTop?: number;
    /** 内容区块的 CSS 选择器，每个区块的 `id` 需与 item 的 `anchor` 一致。 */
    anchorSelector?: string;
    /**
     * 激活判定的额外偏移（px），例如顶部吸顶头部的高度：区块顶部进入该偏移
     * 范围即视为激活。
     */
    scrollThreshold?: number;
  }>(),
  {
    modelValue: 0,
    beforeChange: undefined,
    customClass: '',
    customStyle: '',
    scrollSpy: false,
    scrollTop: 0,
    anchorSelector: '',
    scrollThreshold: 0,
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: SnSidebarValue): void;
  /** 激活项切换时触发。 */
  (e: 'change', payload: { value: SnSidebarValue; label: string }): void;
}>();

defineSlots<{
  /** SidebarItem 列表。 */
  default?(): unknown;
}>();

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
const innerValue = ref<SnSidebarValue>(props.modelValue);
watch(
  () => props.modelValue,
  (next) => {
    innerValue.value = next;
  },
);
const activeValue = computed<SnSidebarValue>(() => innerValue.value);

function isActive(value: SnSidebarValue): boolean {
  return activeValue.value === value;
}

/** Commit a switch. `beforeChange` can veto (sync `false` / rejected promise). */
async function select(value: SnSidebarValue, label: string): Promise<void> {
  if (isActive(value)) return;
  if (props.beforeChange) {
    let allowed: boolean;
    try {
      allowed = await props.beforeChange(value);
    } catch {
      return;
    }
    if (!allowed) return;
  }
  innerValue.value = value;
  emit('update:modelValue', value);
  emit('change', { value, label });
}

/* ── Scroll linkage (additive — AUI-OPT-08) ─────────────────────────────── */

/** Items that declared an `anchor`, in registration (mount) order. */
const anchorEntries = ref<SnSidebarAnchorEntry[]>([]);

/** Section offsets of the last successful measurement. */
const sectionOffsets = ref<SnSidebarSectionOffset[]>([]);

function registerAnchor(entry: SnSidebarAnchorEntry): void {
  if (anchorEntries.value.some((registered) => registered.uid === entry.uid)) return;
  anchorEntries.value = [...anchorEntries.value, entry];
}

function unregisterAnchor(uid: number): void {
  anchorEntries.value = anchorEntries.value.filter((registered) => registered.uid !== uid);
}

/** Only items that named a section participate. */
function anchorRefs(): SnSidebarAnchorRef[] {
  return anchorEntries.value.flatMap((entry) => {
    const anchor = entry.getAnchor();
    return anchor === '' ? [] : [{ value: entry.getValue(), anchor }];
  });
}

/** Re-measure the content sections; call after the linked content changes. */
function refresh(): void {
  if (!props.scrollSpy) return;
  measureSectionOffsets(props.anchorSelector, anchorRefs(), (offsets) => {
    sectionOffsets.value = offsets;
    // The host may already be scrolled when anchors land.
    syncScroll(props.scrollTop);
  });
}

/**
 * Follow the content position. Deliberately not routed through `select()`:
 * `beforeChange` guards user taps, and a veto here would leave the highlight
 * out of step with the visible section.
 */
function syncScroll(top: number): void {
  if (!props.scrollSpy) return;
  const next = resolveActiveSection(sectionOffsets.value, top, props.scrollThreshold);
  if (next === undefined || next === innerValue.value) return;
  const entry = anchorEntries.value.find((candidate) => candidate.getValue() === next);
  innerValue.value = next;
  emit('update:modelValue', next);
  emit('change', { value: next, label: entry?.getLabel() ?? '' });
}

watch(
  () => props.scrollTop,
  (top) => {
    syncScroll(top);
  },
);

/* Re-measure when linkage turns on, the selector changes, or the anchor set
 * moves — items added / removed, or an item's `anchor` renamed. */
watch(
  () => {
    const anchors = anchorEntries.value.map((entry) => entry.getAnchor());
    return [
      props.scrollSpy,
      props.anchorSelector,
      anchorEntries.value.length,
      anchors.join('\u0000'),
    ] as const;
  },
  () => {
    if (props.scrollSpy) refresh();
  },
  { flush: 'post' },
);

onMounted(() => {
  if (props.scrollSpy) refresh();
});

/* Both watchers and the measurement are one-shot reads — no listener, timer or
 * observer is created, so only the registry needs releasing (§41). */
onBeforeUnmount(() => {
  anchorEntries.value = [];
  sectionOffsets.value = [];
});

provide(SN_SIDEBAR_KEY, {
  activeValue,
  isActive,
  select: (value: SnSidebarValue, label: string) => {
    void select(value, label);
  },
  registerAnchor,
  unregisterAnchor,
});

/** Public imperative API — host pages can drive the sidebar from code (§14). */
defineExpose({ select, refresh });

const rootClass = computed(() => ['sn-sidebar', props.customClass]);
</script>

<template>
  <view
    data-snui-component="sidebar"
    :class="rootClass"
    :style="customStyle || undefined"
    role="tablist"
    aria-orientation="vertical"
  >
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-sidebar {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 200rpx;
  height: 100%;
  overflow-y: auto;
  background-color: var(--sn-mp-color-background-soft);
}

/* Doodle skin — heavier left rule so the column reads as a drawn divider. */
.snui-skin-doodle .sn-sidebar {
  border-right: 4rpx solid var(--sn-mp-color-text-primary);
}
</style>
