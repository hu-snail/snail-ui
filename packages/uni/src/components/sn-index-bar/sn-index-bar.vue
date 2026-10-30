<script setup lang="ts">
/**
 * sn-index-bar (uni-end) — alphabetical index list with a jump sidebar.
 *
 * Reference library: wot-ui `wd-index-bar`
 *   (https://wot-ui.cn/component/index-bar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-index-bar 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-index-bar/sn-index-bar.vue
 * → auto-registered as `<sn-index-bar>` in any .vue that uses it.
 *
 * ## Why the jump goes through `scroll-into-view`
 *
 * A miniprogram cannot query another node's offset synchronously, and
 * `uni.createSelectorQuery` is async and unavailable on some hosts. Each
 * anchor instead registers its DOM id, and the bar's `scroll-view` jumps to
 * that id — one declarative prop, no layout queries, identical behaviour on
 * H5 / WeChat / Alipay / App.
 *
 * ## Sticky headers
 *
 * `sticky` pins the current anchor header while its section is on screen. The
 * uni `scroll-view` supports `scroll-into-view` but not CSS `position: sticky`
 * inside it on every host, so the pinned header is rendered by the anchor
 * itself (`sn-index-anchor` reads the same flag).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 数据分组 / 排序 — 由使用方决定
 *   - 联系人列表业务逻辑 — 由宿主处理
 *
 * ## Additive: current-index indicator (additive (AUI-OPT-05, AGENTS.md §112.3a))
 *
 * `showIndicator` centres a bubble that echoes the active index inside the
 * list viewport. wd-index-bar paints such a tip unconditionally; here it is
 * exposed as an opt-in prop so the reference surface stays 1:1 (nothing
 * existing changed meaning). A full contact list reads better with the
 * current letter shown large while the reader scans.
 */

import { computed, onBeforeUnmount, provide, ref, watch } from 'vue';
import {
  SN_INDEX_BAR_KEY,
  type SnIndexAnchorEntry,
  type SnIndexBarValue,
} from './sn-index-bar-types';

defineOptions({ name: 'SnIndexBar' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-index-bar` 1:1 surface ──────────────────────────────── */

    /** 索引是否吸顶。 */
    sticky?: boolean;
    /**
     * 是否在列表视口中央显示当前索引提示气泡（AUI 追加能力，
     * additive (AUI-OPT-05, AGENTS.md §112.3a)；wd-index-bar 无对应 prop）。
     */
    showIndicator?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    sticky: false,
    showIndicator: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 索引列表内容（sn-index-anchor 列表）。 */
  default?(): unknown;
}>();

const emit = defineEmits<{
  /** 激活索引变化时触发。 */
  (e: 'change', payload: { index: SnIndexBarValue }): void;
}>();

/** Registered anchors in DOM order. */
const anchors = ref<SnIndexAnchorEntry[]>([]);

/** Id of the anchor currently in view (`scroll-into-view` target). */
const scrollTarget = ref('');

/** Index label of the active anchor, shown in the sidebar highlight. */
const activeIndexValue = ref<SnIndexBarValue | undefined>(undefined);

function registerAnchor(entry: SnIndexAnchorEntry): number {
  anchors.value = [...anchors.value, entry];
  return anchors.value.length - 1;
}

function unregisterAnchor(uid: number): void {
  anchors.value = anchors.value.filter((anchor) => anchor.uid !== uid);
}

function activeIndex(): SnIndexBarValue | undefined {
  return activeIndexValue.value;
}

/** Jump to the anchor carrying `index` by targeting its DOM id. */
function scrollTo(index: SnIndexBarValue): void {
  const anchor = anchors.value.find((entry) => entry.getIndex() === index);
  if (!anchor) return;
  activeIndexValue.value = index;
  scrollTarget.value = anchor.getId();
  emit('change', { index });
}

provide(SN_INDEX_BAR_KEY, { registerAnchor, unregisterAnchor, activeIndex });

/** Public imperative API — mirrors wd-index-bar's exposed methods (§14). */
defineExpose({ scrollTo });

const rootClass = computed(() => [
  'sn-index-bar',
  {
    'sn-index-bar--sticky': props.sticky,
  },
  props.customClass,
]);

/** Indicator renders only when opted in and an active index exists. */
const showIndicatorValue = computed(
  () => props.showIndicator && activeIndexValue.value !== undefined,
);

onBeforeUnmount(() => {
  anchors.value = [];
});

/* Keep the highlight honest when anchors come and go (e.g. filtering). */
watch(anchors, (list) => {
  if (list.length === 0) {
    activeIndexValue.value = undefined;
    return;
  }
  const stillThere = list.some((entry) => entry.getIndex() === activeIndexValue.value);
  if (!stillThere) activeIndexValue.value = list[0]!.getIndex();
});
</script>

<template>
  <view data-snui-component="index-bar" :class="rootClass" :style="customStyle || undefined">
    <view class="sn-index-bar__body">
      <scroll-view
        class="sn-index-bar__list"
        scroll-y
        :scroll-into-view="scrollTarget || undefined"
        :scroll-with-animation="true"
      >
        <slot />
      </scroll-view>

      <!-- Current-index indicator (additive): decorative, tab aria carries the state. -->
      <view v-if="showIndicatorValue" class="sn-index-bar__indicator" aria-hidden="true">
        <text class="sn-index-bar__indicator-text">{{ activeIndexValue }}</text>
      </view>
    </view>

    <view class="sn-index-bar__sidebar" role="tablist" aria-orientation="vertical">
      <view
        v-for="anchor in anchors"
        :key="anchor.uid"
        class="sn-index-bar__index"
        :class="{ 'sn-index-bar__index--active': anchor.getIndex() === activeIndexValue }"
        role="tab"
        :aria-selected="anchor.getIndex() === activeIndexValue"
        :aria-label="String(anchor.getIndex())"
        @tap="scrollTo(anchor.getIndex())"
      >
        <text class="sn-index-bar__index-text">{{ anchor.getIndex() }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-index-bar {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-index-bar__body {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
}

.sn-index-bar__list {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
}

/* ── Current-index indicator (additive) ─────────────────────────────────── */

.sn-index-bar__indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 112rpx;
  height: 112rpx;
  padding: 0 var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-action-primary);
  transform: translate(-50%, -50%);
}

.sn-index-bar__indicator-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xl);
  font-weight: var(--sn-mp-font-weight-semibold);
  line-height: 1;
}

.sn-index-bar__sidebar {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-1);
}

.sn-index-bar__index {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 var(--sn-mp-spacing-1);
  border-radius: var(--sn-mp-radius-full);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-index-bar__index--active {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-index-bar__index-text {
  color: inherit;
  font-size: inherit;
  line-height: 1;
}

/* Doodle skin — heavier active bubble. */
.snui-skin-doodle .sn-index-bar__index--active {
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
