<script setup lang="ts">
/**
 * sn-collapse-item (uni-end) — one expandable panel in a `sn-collapse`.
 *
 * Reference library: wot-ui `wd-collapse-item`
 *   (https://wot-ui.cn/component/collapse.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-collapse-item 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-collapse.vue` so the provide/inject contract types
 * (`sn-collapse-types.ts`) stay beside both halves of the pair.
 *
 * ## beforeExpend
 *
 * The upstream prop name is `before-expend` (a typo upstream, kept verbatim so
 * the surface stays 1:1). The hook may return `boolean` or
 * `Promise<boolean>`; a rejection is treated as "do not open" rather than an
 * unhandled rejection (§83 — a node-level failure must not crash the page).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 展开状态的持有 — 由 sn-collapse 持有
 *   - 内容排版 — 由使用方决定
 */

import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { ChevronDown } from '../sn-icon/sn-icon-set';
import { SN_COLLAPSE_KEY, type SnCollapseItemBeforeExpand } from './sn-collapse-types';

defineOptions({ name: 'SnCollapseItem' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-collapse-item` 1:1 surface ──────────────────────────── */

    /** 折叠栏唯一标识符。 */
    name?: string;
    /** 折叠栏标题，支持 title 插槽覆盖。 */
    title?: string;
    /** 是否禁用该折叠栏。 */
    disabled?: boolean;
    /** 打开前拦截函数，接收 name，返回 boolean 或 Promise<boolean>。 */
    beforeExpend?: SnCollapseItemBeforeExpand | undefined;
    /** 是否显示边框。 */
    border?: boolean;
    /** 折叠栏内容容器自定义类名。 */
    customBodyClass?: string;
    /** 折叠栏内容容器自定义样式。 */
    customBodyStyle?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    name: '',
    title: '',
    disabled: false,
    beforeExpend: undefined,
    border: true,
    customBodyClass: '',
    customBodyStyle: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** 展开状态变化时触发。 */
  (e: 'change', payload: { name: string; expanded: boolean }): void;
}>();

defineSlots<{
  /** 自定义标题区域，作用域 `{ expanded, disabled, isFirst }`。 */
  title?(scope: { expanded: boolean; disabled: boolean; isFirst: boolean }): unknown;
  /** 折叠栏内容。 */
  default?(): unknown;
}>();

const collapse = inject(SN_COLLAPSE_KEY, null);

const expanded = computed(() => collapse?.isExpanded(props.name) ?? false);
const isViewmore = computed(() => collapse?.viewmore.value ?? false);
const viewmoreExpanded = computed(() => collapse?.viewmoreExpanded.value ?? false);

/** In view-more mode the body is clamped to `lineNum` lines unless opened. */
const bodyStyle = computed(() => {
  const parts: string[] = [];
  if (isViewmore.value && !viewmoreExpanded.value) {
    parts.push(`-webkit-line-clamp: ${collapse?.lineNum.value ?? 2}`);
  }
  if (props.customBodyStyle) parts.push(props.customBodyStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

/** Runs the veto hook, treating a rejection as "stay closed". */
async function canExpand(): Promise<boolean> {
  if (!props.beforeExpend) return true;
  try {
    return await props.beforeExpend(props.name);
  } catch {
    return false;
  }
}

async function onTap(): Promise<void> {
  if (props.disabled || !collapse) return;
  /* Collapsing never needs a veto — only opening does. */
  if (!expanded.value && !(await canExpand())) return;
  collapse.toggle(props.name);
  /* `expanded` already reflects the post-toggle state, so it *is* the new one. */
  emit('change', { name: props.name, expanded: expanded.value });
}

/* The container needs the name list for `toggleAll`; report it on mount. */
onMounted(() => collapse?.registerName(props.name, props.disabled));
/* Keep the registered disabled state fresh so `skipDisabled` stays accurate. */
watch(
  () => props.disabled,
  (disabled) => collapse?.registerName(props.name, disabled),
);
onBeforeUnmount(() => collapse?.unregisterName(props.name));

/** Slot scope flags, narrowed to `boolean` for the template. */
const isExpandedForSlot = computed<boolean>(() => expanded.value === true);
const isDisabledForSlot = computed<boolean>(() => props.disabled === true);

const rootClass = computed(() => [
  'sn-collapse-item',
  {
    'sn-collapse-item--expanded': expanded.value,
    'sn-collapse-item--disabled': props.disabled,
    'sn-collapse-item--border': props.border,
  },
  props.customClass,
]);
</script>

<template>
  <view data-snui-component="collapse-item" :class="rootClass" :style="customStyle || undefined">
    <view
      class="sn-collapse-item__header"
      role="button"
      :aria-expanded="expanded"
      :aria-disabled="disabled"
      :aria-label="title || undefined"
      @tap="onTap"
    >
      <view class="sn-collapse-item__title">
        <slot
          name="title"
          :expanded="isExpandedForSlot"
          :disabled="isDisabledForSlot"
          :is-first="false"
        >
          <text class="sn-collapse-item__title-text">{{ title }}</text>
        </slot>
      </view>
      <view class="sn-collapse-item__arrow" aria-hidden="true">
        <SnIcon
          :icon="ChevronDown"
          :size="28"
          :style="expanded ? 'transform: rotate(180deg)' : 'transform: rotate(0deg)'"
        />
      </view>
    </view>

    <view
      v-show="isViewmore || expanded"
      :class="[
        'sn-collapse-item__body',
        { 'sn-collapse-item__body--clamped': isViewmore && !viewmoreExpanded },
        customBodyClass,
      ]"
      :style="bodyStyle"
      role="region"
    >
      <slot />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-collapse-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-collapse-item--border {
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-collapse-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  min-height: 96rpx;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-collapse-item__header:active:not(.sn-collapse-item--disabled *) {
  background-color: var(--sn-mp-color-background-soft);
}

.sn-collapse-item--disabled .sn-collapse-item__header {
  opacity: 0.5;
}

.sn-collapse-item__title {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
}

.sn-collapse-item__title-text {
  overflow: hidden;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-collapse-item__arrow {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  margin-left: var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-secondary);
  transition: transform 0.2s ease;
}

.sn-collapse-item__body {
  box-sizing: border-box;
  width: 100%;
  padding: 0 var(--sn-mp-spacing-4) var(--sn-mp-spacing-4);
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* View-more clamp — CSS-only, so no async height measurement is needed. */
.sn-collapse-item__body--clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

/* Doodle skin — heavier divider. */
.snui-skin-doodle .sn-collapse-item--border {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
