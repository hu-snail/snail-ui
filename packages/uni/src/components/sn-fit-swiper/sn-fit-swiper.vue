<script setup lang="ts">
/**
 * sn-fit-swiper (uni-end) — adaptive-height carousel (Taobao "King Kong" grid).
 *
 * Each page renders arbitrary slot content with its own intrinsic height; the
 * container height follows the ACTIVE page and animates between pages, the way
 * Taobao's 金刚区 re-flows when you swipe between icon-grid pages.
 *
 * Reference library: wot-ui `wd-swiper` for the shared carousel prop surface
 *   (https://wot-ui.cn/component/swiper.html).
 * The adaptive-height engine and the indicator styles are AUI-additive — the
 * reference has no fit-height counterpart (its `adjust-height` is
 * Alipay-MP-only and resizes to slide heights declaratively, not by measuring
 * arbitrary slot content), registered in AGENTS.md §112.3a. Anything new added
 * here MUST also be added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-fit-swiper/sn-fit-swiper.vue
 * → auto-registered as `<sn-fit-swiper>` in any .vue that uses it.
 *
 * ## How the height fits (why a selector query, not CSS)
 *
 * Pages live inside native `<swiper-item>` nodes, which are absolutely
 * positioned at 100% of the swiper height on every platform. CSS alone cannot
 * grow the swiper to "the current page's content height" — content would clip
 * (or the tallest page would win). So the component measures every page's
 * content box once via `uni.createSelectorQuery().selectAll()` and keeps a
 * px height table; the container height then switches to the active row of
 * that table (ceil px, transition animated) and re-measures when the list
 * changes or a swipe finishes (async images may have settled while a page was
 * off screen). Content must be intrinsic-height (no `height: 100%` chains) —
 * a page content box is measured, not stretched.
 *
 * ## Autoplay is the platform's, not a timer here (AGENTS.md §41)
 *
 * The native `<swiper>` element owns the autoplay interval and its own touch
 * handling, so no `setInterval` / listener is created by this component —
 * there is nothing to dispose on unmount. Measurements are one-shot selector
 * queries, not observers, so unmounting needs no cleanup either.
 *
 * ## Active index is mirrored, not read-only
 *
 * `current` (v-model:current) seeds the index, but the swiper can move without
 * a bound parent (uncontrolled usage), so the component mirrors the native
 * position in `activeIndex` and keeps indicator / height / `active` slot flag
 * on that mirror. Parent re-seeding via `current` syncs back through a watch.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 固定高度图片轮播 — 用 sn-swiper
 *   - 页面内容本身的数据请求 / 业务状态 — 由调用方的插槽内容负责
 */

import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';

defineOptions({ name: 'SnFitSwiper' });

/** One page's data row, handed back to the default slot verbatim. */
export type SnFitSwiperPage = Record<string, unknown>;

/** Indicator style. `dots-bar` is the Taobao-style elongating active dot. */
type FitSwiperIndicatorType = 'dots' | 'dots-bar' | 'fraction';

/** Indicator anchor. Mirrors the shared sn-swiper position set. */
type FitSwiperIndicatorPosition =
  'left' | 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'right';

/** Indicator config. */
export interface SnFitSwiperIndicator {
  /** Indicator style. */
  type?: FitSwiperIndicatorType;
  /** Hide the indicator below this page count. */
  minShowNum?: number;
}

/** Height rect returned by the platform selector query (px). */
interface FitRect {
  height?: number;
}

interface SelectorQueryLike {
  in(context?: unknown): SelectorQueryLike;
  selectAll(selector: string): SelectorQueryLike;
  boundingClientRect(callback: (rects: Array<FitRect | null>) => void): SelectorQueryLike;
  exec(): void;
}

interface UniHost {
  createSelectorQuery?: () => SelectorQueryLike;
}

function readUniHost(): UniHost | undefined {
  return (globalThis as { uni?: UniHost }).uni;
}

const props = withDefaults(
  defineProps<{
    /** Page data rows; each is handed to the default slot verbatim. */
    list?: SnFitSwiperPage[];
    /** Current page index (v-model:current). */
    current?: number;
    /** Autoplay. */
    autoplay?: boolean;
    /** Autoplay interval in ms. */
    interval?: number;
    /** Slide transition duration in ms. */
    duration?: number;
    /** Loop the pages. */
    loop?: boolean;
    /**
     * Placeholder height before the first measurement lands — a bare number is
     * treated as rpx. Once pages are measured the real px height takes over.
     */
    height?: string | number;
    /** Corner radius — a bare number is treated as rpx. */
    radius?: string | number;
    /** Animate the container height when the page changes. */
    animateHeight?: boolean;
    /** Height transition duration in ms. */
    heightDuration?: number;
    /** Indicator config; `false` hides it. */
    indicator?: boolean | SnFitSwiperIndicator;
    /** Indicator anchor. */
    indicatorPosition?: FitSwiperIndicatorPosition;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /** Custom class for each page item. */
    customPageClass?: string;
    /** Custom class for the indicator node. */
    customIndicatorClass?: string;
    /** Custom inline style for the indicator node. */
    customIndicatorStyle?: string;
  }>(),
  {
    list: () => [],
    current: 0,
    autoplay: true,
    interval: 5000,
    duration: 300,
    loop: true,
    height: 320,
    radius: '',
    animateHeight: true,
    heightDuration: 300,
    indicator: true,
    indicatorPosition: 'bottom',
    customClass: '',
    customStyle: '',
    customPageClass: '',
    customIndicatorClass: '',
    customIndicatorStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:current', value: number): void;
  (e: 'change', payload: { current: number; source: string }): void;
  (e: 'animationfinish', payload: { current: number; source: string }): void;
  (e: 'click', payload: { index: number; page: SnFitSwiperPage }): void;
  (e: 'heightchange', payload: { height: number }): void;
}>();

/** Resolve a numeric-or-string length (bare number = rpx). */
function toLength(value: string | number | undefined, fallback?: number): string | undefined {
  if (value === undefined || value === '') {
    return fallback === undefined ? undefined : `${fallback}rpx`;
  }
  return typeof value === 'number' ? `${value}rpx` : value;
}

/** Clamp an index into the current list range. */
function clampIndex(value: number): number {
  const max = Math.max(props.list.length - 1, 0);
  return Math.min(Math.max(Math.trunc(value), 0), max);
}

/** Component proxy, needed for `createSelectorQuery().in()`. */
const instance = getCurrentInstance();

/**
 * Mirrored native position — moves on native change events even when the
 * parent never binds `current` back (uncontrolled usage), and follows parent
 * re-seeding when it does.
 */
const activeIndex = ref(clampIndex(props.current));

/** Measured content height per page (px), indexed like `props.list`. */
const pageHeights = ref<number[]>([]);

/** Applied container height once fitted (`''` = keep the placeholder). */
const fittedHeight = ref('');

/** True after the first successful measurement round. */
const fitted = ref(false);

/** Last height announced through `heightchange` (dedupe). */
let lastEmittedHeight = -1;

watch(
  () => props.current,
  (value) => {
    activeIndex.value = clampIndex(value);
  },
);

watch(
  () => props.list.length,
  () => {
    activeIndex.value = clampIndex(activeIndex.value);
  },
);

/** Placeholder height used until the first fit lands. */
const placeholderHeight = computed(() => toLength(props.height, 320) ?? '320rpx');

const rootClass = computed(() => ['sn-fit-swiper', props.customClass]);

const rootStyle = computed(() => {
  const parts = [`height: ${fittedHeight.value || placeholderHeight.value}`];
  const radius = toLength(props.radius);
  if (radius) parts.push(`border-radius: ${radius}`);
  // Only after the first fit — the placeholder → measured jump must not animate.
  if (fitted.value && props.animateHeight) {
    parts.push(`transition: height ${props.heightDuration}ms ease`);
  }
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

const indicatorConfig = computed<SnFitSwiperIndicator>(() => {
  if (props.indicator === false) return {};
  if (props.indicator === true) return {};
  return props.indicator;
});

const showsIndicator = computed(() => {
  if (props.indicator === false) return false;
  if (props.list.length === 0) return false;
  const minShowNum = indicatorConfig.value.minShowNum ?? 2;
  return props.list.length >= minShowNum;
});

const indicatorType = computed<FitSwiperIndicatorType>(() => indicatorConfig.value.type ?? 'dots');

const indicatorClass = computed(() => [
  'sn-fit-swiper__indicator',
  `sn-fit-swiper__indicator--${indicatorType.value}`,
  `sn-fit-swiper__indicator--${props.indicatorPosition}`,
  props.customIndicatorClass,
]);

const indicatorStyle = computed(() => (props.customIndicatorStyle ? props.customIndicatorStyle : undefined));

/** Measure every page's content box (px). Resolves empty when unavailable. */
function queryPageHeights(): Promise<number[]> {
  return new Promise((resolve) => {
    const host = readUniHost();
    if (host?.createSelectorQuery === undefined || instance === null) {
      resolve([]);
      return;
    }
    try {
      host
        .createSelectorQuery()
        .in(instance.proxy)
        .selectAll('.sn-fit-swiper__content')
        .boundingClientRect((rects) => {
          resolve(
            (rects ?? []).map((rect) =>
              typeof rect?.height === 'number' && rect.height > 0 ? rect.height : 0,
            ),
          );
        })
        .exec();
    } catch {
      // A mis-shaped host must degrade to the placeholder, never throw.
      resolve([]);
    }
  });
}

/** Switch the container to the active page's measured height. */
function applyHeight(): void {
  const height = pageHeights.value[activeIndex.value];
  if (height === undefined || height <= 0) return;
  const px = Math.ceil(height);
  fittedHeight.value = `${px}px`;
  if (lastEmittedHeight !== px) {
    lastEmittedHeight = px;
    emit('heightchange', { height: px });
  }
}

/** Re-measure every page and re-apply the active height. */
async function refit(): Promise<void> {
  await nextTick();
  const heights = await queryPageHeights();
  if (heights.length === 0) return;
  pageHeights.value = heights;
  fitted.value = true;
  applyHeight();
}

function onSwiperChange(event: { detail: { current: number; source: string } }): void {
  const current = clampIndex(event.detail.current);
  activeIndex.value = current;
  emit('update:current', current);
  emit('change', { current, source: event.detail.source });
  applyHeight();
}

function onAnimationFinish(event: { detail: { current: number; source: string } }): void {
  emit('animationfinish', { current: event.detail.current, source: event.detail.source });
  // Async content (e.g. widthFix images) may have settled while its page was
  // off screen — one cheap one-shot query keeps the height table honest.
  void refit();
}

function onPageTap(page: SnFitSwiperPage, index: number): void {
  emit('click', { index, page });
}

onMounted(() => {
  void refit();
});

watch(
  () => props.list,
  () => {
    void refit();
  },
);

watch(activeIndex, () => {
  applyHeight();
});

defineExpose({
  /** Re-measure all pages and re-apply the active height (call after async content changes). */
  refit,
});
</script>

<template>
  <view data-snui-component="fit-swiper" :class="rootClass" :style="rootStyle">
    <swiper
      class="sn-fit-swiper__native"
      :autoplay="props.autoplay"
      :current="activeIndex"
      :duration="props.duration"
      :interval="props.interval"
      :circular="props.loop"
      @change="onSwiperChange"
      @animationfinish="onAnimationFinish"
    >
      <swiper-item
        v-for="(page, index) in props.list"
        :key="index"
        class="sn-fit-swiper__item"
        :class="props.customPageClass"
      >
        <view class="sn-fit-swiper__content" @tap="onPageTap(page, index)">
          <slot :page="page" :index="index" :active="index === activeIndex" />
        </view>
      </swiper-item>
    </swiper>

    <view
      v-if="showsIndicator"
      :class="indicatorClass"
      :style="indicatorStyle"
      aria-hidden="true"
    >
      <slot name="indicator" :current="activeIndex" :total="props.list.length">
        <view v-if="indicatorType === 'fraction'" class="sn-fit-swiper__fraction">
          <text class="sn-fit-swiper__fraction-text">{{ activeIndex + 1 }}/{{ props.list.length }}</text>
        </view>

        <view v-else class="sn-fit-swiper__dots">
          <view
            v-for="(_, index) in props.list"
            :key="index"
            class="sn-fit-swiper__dot"
            :class="{
              'sn-fit-swiper__dot--active': index === activeIndex,
              'sn-fit-swiper__dot--bar': indicatorType === 'dots-bar',
            }"
          />
        </view>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-fit-swiper {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  /* Page surface: the tinted plate shows through transparent page content. */
  background-color: var(--sn-mp-color-background-subtle);
  border-radius: var(--sn-mp-radius-lg);
}

.sn-fit-swiper__native {
  width: 100%;
  height: 100%;
}

/* Natural-height content box — this node is what the selector query measures.
 * It must NOT be height: 100%: swiper-item is absolutely positioned at the
 * swiper height, so a stretched box would always measure the container. */
.sn-fit-swiper__content {
  width: 100%;
}

/* ── Indicator ────────────────────────────────────────────────────────── */

.sn-fit-swiper__indicator {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-2);
}

.sn-fit-swiper__indicator--bottom,
.sn-fit-swiper__indicator--bottom-left,
.sn-fit-swiper__indicator--bottom-right {
  bottom: var(--sn-mp-spacing-3);
}
.sn-fit-swiper__indicator--top,
.sn-fit-swiper__indicator--top-left,
.sn-fit-swiper__indicator--top-right {
  top: var(--sn-mp-spacing-3);
}
.sn-fit-swiper__indicator--left,
.sn-fit-swiper__indicator--top-left,
.sn-fit-swiper__indicator--bottom-left {
  left: var(--sn-mp-spacing-3);
}
.sn-fit-swiper__indicator--right,
.sn-fit-swiper__indicator--top-right,
.sn-fit-swiper__indicator--bottom-right {
  right: var(--sn-mp-spacing-3);
}
.sn-fit-swiper__indicator--top,
.sn-fit-swiper__indicator--bottom {
  left: 0;
  right: 0;
  justify-content: center;
}

.sn-fit-swiper__dots {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
}

.sn-fit-swiper__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: var(--sn-mp-radius-full);
  /* Component vars let hosts recolor per-brand without touching the SFC. */
  /* Component vars let hosts recolor per-brand without touching the SFC. */
  background-color: var(--sn-fit-swiper-dot-color, var(--sn-mp-color-text-tertiary));
}

.sn-fit-swiper__dot--active {
  background-color: var(
    --sn-fit-swiper-dot-active-color,
    var(--sn-mp-color-action-primary)
  );
}

.sn-fit-swiper__dot--bar {
  width: 32rpx;
  height: 8rpx;
  border-radius: var(--sn-mp-radius-xs);
}

.sn-fit-swiper__fraction {
  padding: 0 var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-fit-swiper-dot-color, var(--sn-mp-color-text-tertiary));
}

.sn-fit-swiper__fraction-text {
  color: var(--sn-mp-color-background-elevated);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
