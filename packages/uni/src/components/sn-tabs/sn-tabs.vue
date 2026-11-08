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
 * ## Additive abilities (AUI-OPT-10, AGENTS.md §112.3a)
 *
 * Beyond the 1:1 surface above:
 *   - `type`        导航形态 line / card / tag（下划线 / 卡片分段 / 独立胶囊）
 *   - `activeTheme` 选中态强调 text / fill / pill，与 `type` 正交组合
 *   - `sn-tab` 的 `icon` / `iconImage` / `badgeProps` 在导航项里渲染图标与角标
 *   - 导航条走 `scroll-into-view`：选中项变化即滚进可视区（点击/外部改值都生效）
 *   - `swipeable` 让内容区渲染为原生 `<swiper>`，`duration` / `swiperEasing` /
 *     `swiperHeight` 配置其滑动手感；面板此时渲染为 `swiper-item`
 *
 * ## Why the active pane drives `scroll-into-view`
 *
 * uni `scroll-view` cannot be scrolled by offset — `scroll-into-view` takes a
 * node id. The strip therefore stamps every item with a stable id and points
 * `scroll-into-view` at the active one, so both a tap and an external
 * `v-model` write pull the selection into view without measuring widths.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 面板内容本身 — 由 sn-tab 承载
 *   - 路由 / 页面切换 — 由宿主 AppBridge 处理，组件只 emit `change`
 *   - 底部标签栏 — 用 sn-tabbar
 */

import { computed, nextTick, provide, ref, watch } from 'vue';
import SnBadge from '../sn-badge/sn-badge.vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import {
  SN_TABS_KEY,
  type SnTabEntry,
  type SnTabsActiveTheme,
  type SnTabsLineTheme,
  type SnTabsSlidable,
  type SnTabsSwiperEasing,
  type SnTabsType,
  type SnTabsValue,
} from './sn-tabs-types';

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
    lineTheme?: SnTabsLineTheme;
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
    /** 动画时长，单位毫秒（swiper 模式下同时是内容区滑动时长）。 */
    duration?: number;
    /** 滚动导航：auto（超过阈值才滚动）/ always。 */
    slidable?: SnTabsSlidable;
    /** 滚动时是否显示滚动条。 */
    showScrollbar?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── AUI-OPT-10 追加能力（AGENTS.md §112.3a） ────────────────────────── */

    /** 导航形态：line 下划线 / card 卡片分段 / tag 独立胶囊。 */
    type?: SnTabsType;
    /** 选中态强调方式：text 仅文字 / fill 浅色圆角底 / pill 实心胶囊底。 */
    activeTheme?: SnTabsActiveTheme;
    /** 内容区 swiper 缓动函数（仅 `swipeable` 渲染 swiper 时生效）。 */
    swiperEasing?: SnTabsSwiperEasing;
    /** 内容区 swiper 高度（数字按 px，字符串原样转发；留空沿用平台默认高度）。 */
    swiperHeight?: number | string | undefined;
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
    type: 'line',
    activeTheme: 'text',
    swiperEasing: 'default',
    swiperHeight: '',
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

/** Commit a selection: mirror the value and emit the change pair. */
function commit(index: number): void {
  const tab = tabs.value[index];
  if (!tab) return;
  const next: SnTabsValue = tab.getName() ?? index;
  if (next === activeValue.value) return;
  innerValue.value = next;
  emit('update:modelValue', next);
  emit('change', { index, name: tab.getName() });
}

/** Commit a selection from a tap. Disabled panes emit `disabled` instead. */
function select(index: number): void {
  const tab = tabs.value[index];
  if (!tab) return;
  const name = tab.getName();
  if (tab.getDisabled()) {
    emit('disabled', { index, name });
    return;
  }
  emit('click', { index, name });
  commit(index);
}

/* ── Content area (native swiper when `swipeable`) ───────────────────────── */

/** True while the body renders as a `<swiper>` — shared with `sn-tab` via context. */
const swiperMode = computed(() => props.swipeable);

/**
 * Swiper's own position. It mirrors the active index, but stays separate so a
 * swipe onto a disabled pane can be pushed back to the committed one.
 */
const swiperCurrent = ref(0);
watch(
  activeIndex,
  (index) => {
    swiperCurrent.value = index;
  },
  { immediate: true, flush: 'post' },
);

/** uni's swiper only accepts named easings; `default` means "leave it unset". */
const swiperEasingValue = computed(() =>
  props.swiperEasing === 'default' ? undefined : props.swiperEasing,
);

const swiperStyle = computed(() => {
  const height = toLength(props.swiperHeight);
  return height === undefined ? undefined : `height: ${height}`;
});

/** A swipe landed on another pane: commit it, or snap back off a disabled one. */
function onSwiperChange(event: { detail: { current: number } }): void {
  const index = event.detail.current;
  if (index === activeIndex.value) return;
  const tab = tabs.value[index];
  if (!tab) return;
  if (tab.getDisabled()) {
    // Adopt where the gesture landed, then push `current` back on the next
    // tick: the native swiper only animates when the prop actually changes.
    swiperCurrent.value = index;
    void nextTick(() => {
      swiperCurrent.value = activeIndex.value;
    });
    return;
  }
  commit(index);
}

provide(SN_TABS_KEY, { activeValue, isActive, registerTab, unregisterTab, swiperMode });

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
  // 横条是激活态的一部分，跟随 `color`（回归：曾固定 action-primary，
  // 页面传入主题色后条仍是默认蓝）。空值回落令牌。
  const line = props.color !== '' ? props.color : 'var(--sn-mp-color-action-primary)';
  parts.push(`background-color: ${line}`);
  return parts.join('; ');
});

/** Inline label colour: `color` on the active pane, `inactiveColor` elsewhere.
 *  App renders `<text>` without inheriting the item's colour (§116.2), so the
 *  pill emphasis has to hand the inverted colour down explicitly. */
function titleStyle(index: number): string | undefined {
  const tab = tabs.value[index];
  if (!tab) return undefined;
  const active = isActive(index, tab.getName());
  const custom = active ? props.color : props.inactiveColor;
  if (custom !== '') return `color: ${custom}`;
  return active && emphasisClass(index) === 'sn-tabs__item--pill'
    ? 'color: var(--sn-mp-color-text-on-primary)'
    : undefined;
}

/** Nav-form modifiers (`type`): the strip box, its inner row, and every item. */
const formClasses = computed<{ box: string; nav: string; item: string }>(() => {
  if (props.type === 'card') {
    return {
      box: 'sn-tabs__nav--card',
      nav: 'sn-tabs__nav-inner--card',
      item: 'sn-tabs__item--card',
    };
  }
  if (props.type === 'tag') {
    return {
      box: 'sn-tabs__nav--tag',
      nav: 'sn-tabs__nav-inner--tag',
      item: 'sn-tabs__item--tag',
    };
  }
  return { box: '', nav: '', item: '' };
});

/**
 * Active emphasis (`activeTheme`). Only the active, enabled pane carries it —
 * a disabled pane must keep the disabled colour even when it is the value.
 */
function emphasisClass(index: number): string {
  if (props.activeTheme === 'text') return '';
  const tab = tabs.value[index];
  if (!tab || tab.getDisabled() || !isActive(index, tab.getName())) return '';
  return props.activeTheme === 'fill' ? 'sn-tabs__item--fill' : 'sn-tabs__item--pill';
}

/** The bottom bar belongs to the plain `line` look; other looks use a fill. */
const showsLineBar = computed(() => props.type === 'line' && props.activeTheme === 'text');

/** Nav icons ride the small tier of the icon-size tokens (AUI-OPT-10). */
const NAV_ICON_SIZE = 'var(--sn-mp-icon-size-small)';

/** DOM id that `scroll-into-view` targets — `nextUid()` is page-unique. */
function itemId(uid: number): string {
  return `sn-tabs-item-${uid}`;
}

/** The strip keeps the selected pane in view by pointing `scroll-into-view` at it. */
const scrollIntoViewId = computed(() => {
  const tab = tabs.value[activeIndex.value];
  return tab ? itemId(tab.uid) : '';
});
</script>

<template>
  <view data-snui-component="tabs" :class="rootClass" :style="rootStyle">
    <scroll-view
      class="sn-tabs__nav"
      :class="[{ 'sn-tabs__nav--sticky': sticky }, formClasses.box]"
      :style="navStyle"
      scroll-x
      :show-scrollbar="showScrollbar"
      :scroll-into-view="scrollIntoViewId"
      :scroll-with-animation="animated"
      role="tablist"
    >
      <view class="sn-tabs__nav-inner" :class="formClasses.nav">
        <view
          v-for="(tab, index) in tabs"
          :id="itemId(tab.uid)"
          :key="tab.uid"
          class="sn-tabs__item"
          :class="[
            formClasses.item,
            emphasisClass(index),
            {
              'sn-tabs__item--active': isActive(index, tab.getName()),
              'sn-tabs__item--disabled': tab.getDisabled(),
            },
          ]"
          role="tab"
          :aria-selected="isActive(index, tab.getName())"
          :aria-disabled="tab.getDisabled()"
          :aria-label="tab.getTitle()"
          :hover-class="tab.getDisabled() ? 'none' : 'sn-tabs__item--pressed'"
          @tap="select(index)"
        >
          <image
            v-if="tab.getIconImage()"
            class="sn-tabs__icon-image"
            :src="tab.getIconImage()"
            mode="aspectFit"
            aria-hidden="true"
          />
          <SnIcon
            v-else-if="tab.getIcon()"
            class="sn-tabs__icon"
            :icon="tab.getIcon()"
            :size="NAV_ICON_SIZE"
          />
          <!-- Explicit props, not `v-bind="obj"`: MP templates do not expand
               object spreads (same constraint sn-input documents). -->
          <sn-badge
            v-if="tab.getBadge()"
            :value="tab.getBadge()?.value"
            :max="tab.getBadge()?.max"
            :top="tab.getBadge()?.top"
            :right="tab.getBadge()?.right"
            :is-dot="tab.getBadge()?.isDot ?? false"
            :hidden="tab.getBadge()?.hidden ?? false"
            :type="tab.getBadge()?.type"
            :bg-color="tab.getBadge()?.bgColor ?? ''"
            :show-zero="tab.getBadge()?.showZero ?? false"
            :shape="tab.getBadge()?.shape ?? 'circle'"
            :border="tab.getBadge()?.border ?? false"
            :custom-class="tab.getBadge()?.customClass ?? ''"
            :custom-style="tab.getBadge()?.customStyle ?? ''"
          >
            <text class="sn-tabs__title" :style="titleStyle(index)">
              {{ tab.getTitle() }}
            </text>
          </sn-badge>
          <text v-else class="sn-tabs__title" :style="titleStyle(index)">
            {{ tab.getTitle() }}
          </text>
          <view
            v-if="showsLineBar && isActive(index, tab.getName())"
            class="sn-tabs__line"
            :style="lineStyle"
            aria-hidden="true"
          />
        </view>
      </view>
    </scroll-view>

    <swiper
      v-if="swiperMode"
      class="sn-tabs__body"
      :style="swiperStyle"
      :current="swiperCurrent"
      :duration="duration"
      :easing-function="swiperEasingValue"
      @change="onSwiperChange"
    >
      <slot />
    </swiper>
    <view v-else class="sn-tabs__body">
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

/* ── Nav forms (`type`, AUI-OPT-10) ────────────────────────────────────── */

/* card：描边分段条 —— 整条嵌进浅色容器，选中项抬到面板底色。
 * 外边距落在 scroll-view 上（内层 `min-width: 100%`，用 margin 会把条挤出视口）。 */
.sn-tabs__nav--card,
.sn-tabs__nav--tag {
  box-sizing: border-box;
  padding: 0 var(--sn-mp-spacing-3);
}

.sn-tabs__nav-inner--card {
  padding: var(--sn-mp-spacing-1);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-tabs__item--card {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-sm);
}

.sn-tabs__item--card.sn-tabs__item--active {
  background-color: var(--sn-mp-color-background-surface);
}

/* tag：独立胶囊 —— 每个标签自带描边与间距，选中项由 activeTheme 强调。 */
.sn-tabs__nav-inner--tag {
  padding: 0;
}

.sn-tabs__item--tag {
  margin: var(--sn-mp-spacing-1) var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
}

/* ── Active emphasis (`activeTheme`, AUI-OPT-10) ───────────────────────── */

/* fill：选中项浅色圆角底。两段 class 是为了盖过 card 选中态的面板底色。 */
.sn-tabs__item.sn-tabs__item--fill {
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-action-primary-soft);
}

/* pill：选中项实心胶囊底，文字取 on-primary 反色。 */
.sn-tabs__item.sn-tabs__item--pill {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-tabs__item--tag.sn-tabs__item--pill {
  border-color: var(--sn-mp-color-action-primary);
}

.sn-tabs__title {
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
}

/* Nav icons (AUI-OPT-10) — size comes from the icon-size tokens. */
.sn-tabs__icon {
  margin-right: var(--sn-mp-spacing-1);
}

.sn-tabs__icon-image {
  width: var(--sn-mp-icon-size-small);
  height: var(--sn-mp-icon-size-small);
  margin-right: var(--sn-mp-spacing-1);
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
