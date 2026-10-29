<script setup lang="ts">
/**
 * sn-tabs (uni-end) — horizontal tab navigation container.
 *
 * Reference library: wot-ui `wd-tabs`
 *   (https://wot-ui.cn/component/tabs.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tabs 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-tabs/sn-tabs.vue
 * → auto-registered as `<sn-tabs>` in any .vue that uses it.
 *
 * ## How the container and its panes cooperate
 *
 * The container renders the nav strip only; each `sn-tab` renders its own
 * panel and registers a small `SnTabEntry` (getters, not snapshots) so the
 * nav strip stays reactive to a pane's `title` / `disabled` changes. See
 * `sn-tabs-types.ts`.
 *
 * ## Why the pane list is keyed by DOM order
 *
 * wd-tabs resolves `v-model` as "索引或名称". Panes register in mount order,
 * which is template order, so an unnamed pane's index is stable without the
 * container having to know the child count up front.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 面板内容本身 — 由 sn-tab 承载
 *   - 路由 / 页面切换 — 由宿主 AppBridge 处理，组件只 emit `change`
 *   - 底部标签栏 — 用 sn-tabbar
 */

import { computed, provide, ref, watch } from 'vue';
import { SN_TABS_KEY, type SnTabEntry, type SnTabsValue } from './sn-tabs-types';

defineOptions({ name: 'SnTabs' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-tabs` 1:1 surface ───────────────────────────────────── */

    /** 当前激活项，可为索引或名称。 */
    modelValue?: SnTabsValue;
    /** 自动开启滚动的标签数量阈值。 */
    slidableNum?: number;
    /** 显示导航地图的标签数量阈值（未实现：地图浮层，见文档）。 */
    mapNum?: number;
    /** 导航地图标题（未实现：地图浮层，见文档）。 */
    mapTitle?: string;
    /** 是否开启粘性布局。 */
    sticky?: boolean;
    /** 吸顶偏移量（px）。 */
    offsetTop?: number;
    /** 是否开启手势滑动切换。 */
    swipeable?: boolean;
    /** 底部条样式：normal / text / underline / dot。 */
    lineTheme?: 'normal' | 'text' | 'underline' | 'dot';
    /** 底部条宽度（数字按 px，字符串原样转发）。 */
    lineWidth?: number | string | undefined;
    /** 底部条高度（数字按 px，字符串原样转发）。 */
    lineHeight?: number | string | undefined;
    /** 激活项文字颜色（内联覆盖，空 = 令牌默认）。 */
    color?: string;
    /** 非激活项文字颜色（内联覆盖，空 = 令牌默认）。 */
    inactiveColor?: string;
    /** 是否开启切换动画。 */
    animated?: boolean;
    /** 动画时长，单位毫秒。 */
    duration?: number;
    /** 滚动导航：auto（超过阈值才滚动）/ always。 */
    slidable?: 'auto' | 'always';
    /** 滚动时是否显示滚动条。 */
    showScrollbar?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    modelValue: 0,
    slidableNum: 6,
    mapNum: 10,
    mapTitle: '',
    sticky: false,
    offsetTop: 0,
    swipeable: false,
    lineTheme: 'normal',
    lineWidth: undefined,
    lineHeight: undefined,
    color: '',
    inactiveColor: '',
    animated: false,
    duration: 300,
    slidable: 'auto',
    showScrollbar: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: SnTabsValue): void;
  /** 激活项变化时触发。 */
  (e: 'change', payload: { index: number; name: SnTabsValue | undefined }): void;
  /** 点击页签标题时触发。 */
  (e: 'click', payload: { index: number; name: SnTabsValue | undefined }): void;
  /** 点击禁用页签时触发。 */
  (e: 'disabled', payload: { index: number; name: SnTabsValue | undefined }): void;
}>();

defineSlots<{
  /** Tab 内容（sn-tab 列表）。 */
  default?(): unknown;
}>();

/** Registered panes in DOM order. */
const tabs = ref<SnTabEntry[]>([]);

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
const innerValue = ref<SnTabsValue>(props.modelValue);
watch(
  () => props.modelValue,
  (next) => {
    innerValue.value = next;
  },
);
const activeValue = computed<SnTabsValue>(() => innerValue.value);

/** Index of the active pane: matched by name first, then by position. */
const activeIndex = computed<number>(() => {
  const named = tabs.value.findIndex((tab) => {
    const name = tab.getName();
    return name !== undefined && name === activeValue.value;
  });
  if (named !== -1) return named;
  const asIndex = Number(activeValue.value);
  return Number.isNaN(asIndex) ? 0 : asIndex;
});

function isActive(index: number, name: SnTabsValue | undefined): boolean {
  return name !== undefined ? name === activeValue.value : index === activeIndex.value;
}

/** Append a pane and hand back its index (DOM order). */
function registerTab(entry: SnTabEntry): number {
  tabs.value = [...tabs.value, entry];
  return tabs.value.length - 1;
}

/** Drop a pane when it unmounts. */
function unregisterTab(uid: number): void {
  tabs.value = tabs.value.filter((tab) => tab.uid !== uid);
}

/** Commit a selection. Disabled panes emit `disabled` instead. */
function select(index: number): void {
  const tab = tabs.value[index];
  if (!tab) return;
  const name = tab.getName();
  if (tab.getDisabled()) {
    emit('disabled', { index, name });
    return;
  }
  emit('click', { index, name });
  const next: SnTabsValue = name ?? index;
  if (next === activeValue.value) return;
  innerValue.value = next;
  emit('update:modelValue', next);
  emit('change', { index, name });
}

/** Swipe support — a horizontal drag past the threshold steps one pane. */
const SWIPE_THRESHOLD = 40;
let touchStartX = 0;

function onTouchStart(event: TouchEvent): void {
  const touch = event.touches[0];
  touchStartX = touch ? touch.clientX : 0;
}

function onTouchEnd(event: TouchEvent): void {
  if (!props.swipeable) return;
  const touch = event.changedTouches[0];
  if (!touch) return;
  const delta = touch.clientX - touchStartX;
  if (Math.abs(delta) < SWIPE_THRESHOLD) return;
  const target = activeIndex.value + (delta < 0 ? 1 : -1);
  if (target < 0 || target >= tabs.value.length) return;
  select(target);
}

provide(SN_TABS_KEY, { activeValue, isActive, registerTab, unregisterTab });

/** Public imperative API — mirrors wd-tabs' exposed methods (§14). */
defineExpose({
  setActive: (value: SnTabsValue) => {
    innerValue.value = value;
  },
  activeIndex,
});

/** Whether the nav scrolls horizontally instead of giving each tab an equal share. */
const isScrollable = computed(
  () => props.slidable === 'always' || tabs.value.length > props.slidableNum,
);

const rootClass = computed(() => [
  'sn-tabs',
  `sn-tabs--line-${props.lineTheme}`,
  {
    'sn-tabs--sticky': props.sticky,
    'sn-tabs--animated': props.animated,
    'sn-tabs--scrollable': isScrollable.value,
    /* Equal-width items ride this class instead of
     * `:not(.sn-tabs--scrollable)` (§116.2 — App has no pseudo-classes). */
    'sn-tabs--fixed': !isScrollable.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.customStyle) parts.push(props.customStyle);
  if (props.animated) parts.push(`--snui-tabs-duration: ${props.duration}ms`);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

const navStyle = computed(() => {
  if (!props.sticky) return undefined;
  return `top: ${props.offsetTop}px`;
});

/** Inline width / height for the active bar (numbers are px). */
function toLength(value: number | string | undefined): string | undefined {
  if (value === undefined || value === '') return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

const lineStyle = computed(() => {
  const width = toLength(props.lineWidth);
  const height = toLength(props.lineHeight);
  const parts: string[] = [];
  if (width) parts.push(`width: ${width}`);
  if (height) parts.push(`height: ${height}`);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

function titleColor(index: number): string | undefined {
  const tab = tabs.value[index];
  if (!tab) return undefined;
  const active = isActive(index, tab.getName());
  const custom = active ? props.color : props.inactiveColor;
  return custom === '' ? undefined : custom;
}
</script>

<template>
  <view data-snui-component="tabs" :class="rootClass" :style="rootStyle">
    <scroll-view
      class="sn-tabs__nav"
      :class="{ 'sn-tabs__nav--sticky': sticky }"
      :style="navStyle"
      scroll-x
      :show-scrollbar="showScrollbar"
      role="tablist"
    >
      <view class="sn-tabs__nav-inner">
        <view
          v-for="(tab, index) in tabs"
          :key="tab.uid"
          class="sn-tabs__item"
          :class="{
            'sn-tabs__item--active': isActive(index, tab.getName()),
            'sn-tabs__item--disabled': tab.getDisabled(),
          }"
          role="tab"
          :aria-selected="isActive(index, tab.getName())"
          :aria-disabled="tab.getDisabled()"
          :aria-label="tab.getTitle()"
          :hover-class="tab.getDisabled() ? 'none' : 'sn-tabs__item--pressed'"
          @tap="select(index)"
        >
          <text
            class="sn-tabs__title"
            :style="titleColor(index) ? `color: ${titleColor(index)}` : undefined"
          >
            {{ tab.getTitle() }}
          </text>
          <view
            v-if="isActive(index, tab.getName())"
            class="sn-tabs__line"
            :style="lineStyle"
            aria-hidden="true"
          />
        </view>
      </view>
    </scroll-view>

    <view class="sn-tabs__body" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <slot />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-tabs__nav {
  width: 100%;
  white-space: nowrap;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-tabs__nav--sticky {
  position: sticky;
  z-index: 1;
}

.sn-tabs__nav-inner {
  display: flex;
  align-items: center;
  min-width: 100%;
  padding: 0 var(--sn-mp-spacing-2);
  box-sizing: border-box;
}

.sn-tabs__item {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-tabs--scrollable .sn-tabs__item {
  flex: 0 0 auto;
}

.sn-tabs--fixed .sn-tabs__item {
  flex: 1 1 0;
}

.sn-tabs__item--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-tabs__item--disabled {
  color: var(--sn-mp-color-text-disabled);
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-tabs__item--pressed {
  opacity: 0.7;
}

.sn-tabs__title {
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
}

.sn-tabs__line {
  position: absolute;
  bottom: 4rpx;
  left: 50%;
  width: 40rpx;
  height: 4rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
  transform: translateX(-50%);
}

.sn-tabs--animated .sn-tabs__line {
  transition:
    width var(--snui-tabs-duration, 300ms) ease,
    transform var(--snui-tabs-duration, 300ms) ease;
}

/* Line themes — geometry only; colour stays the action token. */
.sn-tabs--line-text .sn-tabs__line {
  width: 100%;
  height: 100%;
  border-radius: 0;
  background-color: transparent;
  transform: translateX(-50%);
}

.sn-tabs--line-underline .sn-tabs__line {
  bottom: 0;
  width: 100%;
  height: 4rpx;
  border-radius: 0;
}

.sn-tabs--line-dot .sn-tabs__line {
  bottom: 8rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: var(--sn-mp-radius-full);
}

.sn-tabs__body {
  width: 100%;
}

/* Doodle skin — heavier active bar. */
.snui-skin-doodle .sn-tabs__item--active {
  font-weight: var(--sn-mp-font-weight-bold);
}
.snui-skin-doodle .sn-tabs__line {
  height: 8rpx;
}
</style>
