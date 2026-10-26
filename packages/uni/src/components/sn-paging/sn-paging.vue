<script setup lang="ts">
/**
 * sn-paging (uni-end) — pull-to-refresh + load-more list container.
 *
 * Reference library: z-paging (https://z-paging.zxlee.cn) — registered as a
 * user-directed exception in AGENTS.md §112.4a (the wot-ui spec ships no
 * paging container; its `wd-loading` / `wd-loadmore` remain the references
 * for the embedded indicators). The prop surface below is a curated z-paging
 * subset; wot-ui / naive-ui exclusive props must not leak in.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-paging/sn-paging.vue
 * → auto-registered as `<sn-paging>` in any .vue that uses it.
 *
 * ## Why the pull gesture is native (high performance, small footprint)
 *
 * The refresher is `scroll-view`'s own (`refresher-enabled` +
 * `refresher-triggered` + the `refresher` slot) and load-more is the native
 * `@scrolltolower`. No touch listeners, no JS-driven pull simulation, no
 * layout reads — the gesture runs on the platform's scroll layer and JS only
 * reacts to state transitions. That is what keeps the component light: the
 * pull physics is the host's, not ours.
 *
 * The one exception is the plain-browser host (the docs preview): there the
 * `scroll-view` is an inert custom element with no uni runtime behind it, so
 * `sn-paging-simulate.ts` installs a minimal touch/scroll fallback — drag
 * below the top pulls, a geometry check near the bottom loads. Real uni
 * targets never wire it up.
 *
 * ## Data flow (one-way out via v-model)
 *
 *   mounted(auto) / pull / scrolltolower → emit('query', pageNo, pageSize)
 *   host fetches → vm.complete(list) / completeByTotal / completeByNoMore
 *   → sn-paging emits `update:modelValue` with the aggregated array
 *
 * The host renders rows in the default slot over its own bound list; sn-paging
 * never renders items itself, so long lists stay cheap (§80).
 *
 * ## no-more inference
 *
 * Unless `completeByTotal` / `completeByNoMore` says otherwise, a page
 * shorter than `pageSize` ends the sequence — same contract as z-paging.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 请求本身 — 宿主在 @query 里发请求并 complete
 *   - 虚拟列表 / use-page-scroll 模式 — 登记为后续任务
 */

import { computed, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import SnLoading from '../sn-loading/sn-loading.vue';
import { ChevronDown } from '../sn-icon/sn-icon-set';
import { createBrowserPagingGesture } from './sn-paging-simulate';

defineOptions({ name: 'SnPaging' });

/**
 * True when rendering without a uni runtime (plain browser / docs preview):
 * the scroll-view is an inert host element there, so the native refresher and
 * `@scrolltolower` do not exist and the touch fallback takes over.
 */
const isBrowserHost =
  typeof document !== 'undefined' && typeof (globalThis as { uni?: unknown }).uni === 'undefined';

/** Expanded refresher height in px (100rpx at the 750→375 docs mapping). */
const REFRESHER_HEIGHT_PX = 50;

/** Visual phase of the custom refresher slot. */
type RefresherPhase = 'idle' | 'pulling' | 'ready' | 'refreshing' | 'complete';
/** Visual phase of the load-more footer. */
type LoadMorePhase = 'default' | 'loading' | 'noMore' | 'fail';
/** Which kind of query is in flight. */
type QueryPhase = 'refresh' | 'loadMore';

const props = withDefaults(
  defineProps<{
    /** v-model — aggregated list; the host renders it in the default slot. */
    modelValue?: unknown[];
    /** Fire the first query automatically after mount. */
    auto?: boolean;
    /** First page number emitted by `query`. */
    defaultPageNo?: number;
    /** Page size emitted by `query`; a shorter page ends the sequence. */
    defaultPageSize?: number;
    /* ── refresher (z-paging subset) ─────────────────────────────────── */

    /** Enable the native pull-to-refresh gesture. */
    refresherEnabled?: boolean;
    /** Pull distance that arms the refresh, in px (scroll-view contract). */
    refresherThreshold?: number;
    /** Text while pulling below the threshold. */
    refresherDefaultText?: string;
    /** Text once the pull passed the threshold. */
    refresherPullingText?: string;
    /** Text while the refresh query is in flight. */
    refresherRefreshingText?: string;
    /** Text shown during the success hold after `complete`. */
    refresherCompleteText?: string;
    /** How long the success text holds, in ms; 0 skips the hold. */
    refresherCompleteDuration?: number;
    /* ── load-more (z-paging subset) ─────────────────────────────────── */

    /** Enable loading the next page on scroll-to-bottom. */
    loadMoreEnabled?: boolean;
    /** Distance from the bottom that fires load-more, in px. */
    lowerThreshold?: number;
    /** Footer text when idle; tapping it loads the next page. */
    loadMoreDefaultText?: string;
    /** Footer text while a page is loading. */
    loadMoreLoadingText?: string;
    /** Footer text once every page is loaded. */
    loadMoreNoMoreText?: string;
    /** Footer text after a failure; tapping it retries. */
    loadMoreFailText?: string;
    /* ── empty / root ────────────────────────────────────────────────── */

    /** Text of the built-in empty view. */
    emptyText?: string;
    /** Pad the container bottom for the device safe area (iPhone X+). */
    safeAreaInsetBottom?: boolean;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: () => [],
    auto: true,
    defaultPageNo: 1,
    defaultPageSize: 10,
    refresherEnabled: true,
    refresherThreshold: 45,
    refresherDefaultText: '继续下拉刷新',
    refresherPullingText: '松开立即刷新',
    refresherRefreshingText: '正在刷新...',
    refresherCompleteText: '刷新成功',
    refresherCompleteDuration: 500,
    loadMoreEnabled: true,
    lowerThreshold: 50,
    loadMoreDefaultText: '点击加载更多',
    loadMoreLoadingText: '正在加载中...',
    loadMoreNoMoreText: '没有更多了',
    loadMoreFailText: '加载失败，点击重试',
    emptyText: '暂无数据',
    safeAreaInsetBottom: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** Fired for every query; the host must answer via `complete*`. */
  (e: 'query', pageNo: number, pageSize: number): void;
  /** v-model update — the aggregated list. */
  (e: 'update:modelValue', list: unknown[]): void;
  /** scroll-view `@scroll` passthrough (e.g. feeding sn-backtop). */
  (e: 'scroll', event: unknown): void;
}>();

defineSlots<{
  /** List rows; render the bound v-model array here. */
  default?(): unknown;
  /** Fixed above the scroll area; does not scroll with the list. */
  top?(): unknown;
  /** Fixed below the scroll area; does not scroll with the list. */
  bottom?(): unknown;
  /** Replaces the built-in empty view. */
  empty?(): unknown;
  /** Replaces the built-in refresher content (icon + text). */
  refresher?(): unknown;
}>();

const pageNo = ref(props.defaultPageNo);
/** True while an emitted query has not been answered via `complete*`. */
const isLoading = ref(false);
/** Kind of the in-flight query — decides how `complete*` aggregates. */
const phase = ref<QueryPhase>('refresh');
/** Kind of the query that failed last — routes the footer retry. */
const failedPhase = ref<QueryPhase>('refresh');
const noMore = ref(false);
/** A `complete*` succeeded at least once — gates the empty view. */
const hasLoaded = ref(false);
const refresherTriggered = ref(false);
const refresherPhase = ref<RefresherPhase>('idle');
const loadMorePhase = ref<LoadMorePhase>('default');
/** Live pull distance in px — only driven by the browser fallback. */
const pullDistance = ref(0);
/** scroll-view host element; an inert element on browser hosts. */
const scrollEl = ref<HTMLElement | ComponentPublicInstance | null>(null);
let completeHoldTimer: ReturnType<typeof setTimeout> | null = null;
let disposeGesture: (() => void) | null = null;

/** Whether scroll-to-bottom loads the next page. */
const isLoadMoreEnabled = computed(() => props.loadMoreEnabled);

const isRefresherReady = computed(
  () =>
    refresherPhase.value === 'ready' ||
    refresherPhase.value === 'refreshing' ||
    refresherPhase.value === 'complete',
);

const refresherText = computed(() => {
  switch (refresherPhase.value) {
    case 'ready':
      return props.refresherPullingText;
    case 'refreshing':
      return props.refresherRefreshingText;
    case 'complete':
      return props.refresherCompleteText;
    default:
      return props.refresherDefaultText;
  }
});

const isEmpty = computed(
  () =>
    props.modelValue.length === 0 &&
    !isLoading.value &&
    hasLoaded.value &&
    loadMorePhase.value !== 'fail',
);

const isFooterFail = computed(() => !isLoading.value && loadMorePhase.value === 'fail');

const showFooter = computed(() => {
  if (isLoading.value) return true;
  if (props.modelValue.length === 0) return loadMorePhase.value === 'fail';
  if (!isLoadMoreEnabled.value) return false;
  return true;
});

const footerText = computed(() => {
  if (isLoading.value) return props.loadMoreLoadingText;
  if (noMore.value) return props.loadMoreNoMoreText;
  if (loadMorePhase.value === 'fail') return props.loadMoreFailText;
  return props.loadMoreDefaultText;
});

const rootClass = computed(() => [
  'sn-paging',
  { 'sn-paging--safe-bottom': props.safeAreaInsetBottom },
  props.customClass,
]);

/**
 * Inline height for the refresher area on browser hosts, where the native
 * refresher cannot drive it. On uni hosts this stays `undefined` and the
 * scroll-view owns the refresher geometry.
 */
const refresherStyle = computed(() => {
  if (!isBrowserHost) return undefined;
  if (refresherPhase.value === 'refreshing' || refresherPhase.value === 'complete') {
    return `height: ${REFRESHER_HEIGHT_PX}px`;
  }
  const dragging = refresherPhase.value === 'pulling' || refresherPhase.value === 'ready';
  const height = dragging ? pullDistance.value : 0;
  const transition = dragging ? 'none' : 'height 0.2s ease';
  return `height: ${Math.round(height)}px; transition: ${transition}`;
});

function clearCompleteHold(): void {
  if (completeHoldTimer !== null) {
    clearTimeout(completeHoldTimer);
    completeHoldTimer = null;
  }
}

/** Reset to the first page and query. `animate` locks the native refresher. */
function startRefresh(animate: boolean): void {
  if (isLoading.value) return;
  clearCompleteHold();
  pageNo.value = props.defaultPageNo;
  noMore.value = false;
  phase.value = 'refresh';
  isLoading.value = true;
  loadMorePhase.value = 'loading';
  refresherPhase.value = 'refreshing';
  if (animate && props.refresherEnabled) refresherTriggered.value = true;
  emit('query', props.defaultPageNo, props.defaultPageSize);
}

/** Query the next page (scrolltolower / footer tap). */
function startLoadMore(): void {
  if (isLoading.value || noMore.value || !isLoadMoreEnabled.value || !hasLoaded.value) {
    return;
  }
  phase.value = 'loadMore';
  pageNo.value += 1;
  isLoading.value = true;
  loadMorePhase.value = 'loading';
  emit('query', pageNo.value, props.defaultPageSize);
}

/** Re-emit the page that just failed without incrementing again. */
function retryLoadMore(): void {
  if (isLoading.value) return;
  phase.value = 'loadMore';
  isLoading.value = true;
  loadMorePhase.value = 'loading';
  emit('query', pageNo.value, props.defaultPageSize);
}

function applyResult(data: unknown[], success: boolean, noMoreExplicit?: boolean): void {
  if (!isLoading.value) return;
  isLoading.value = false;
  if (!success) {
    failedPhase.value = phase.value;
    if (phase.value === 'loadMore' || props.modelValue.length === 0) {
      loadMorePhase.value = 'fail';
    } else {
      loadMorePhase.value = 'default';
    }
    collapseRefresher();
    return;
  }
  const base = phase.value === 'refresh' ? [] : props.modelValue;
  emit('update:modelValue', base.concat(data));
  noMore.value = noMoreExplicit ?? data.length < props.defaultPageSize;
  hasLoaded.value = true;
  loadMorePhase.value = noMore.value ? 'noMore' : 'default';
  endRefreshAnimation();
}

/** Collapse the refresher immediately (a failure never holds the success text). */
function collapseRefresher(): void {
  clearCompleteHold();
  refresherTriggered.value = false;
  refresherPhase.value = 'idle';
}

/**
 * Collapse the refresher; a successful refresh first holds the success text
 * for `refresherCompleteDuration` ms (§41: the hold timer is tracked and
 * cleared on unmount / next refresh).
 */
function endRefreshAnimation(): void {
  if (
    phase.value !== 'refresh' ||
    !refresherTriggered.value ||
    props.refresherCompleteDuration <= 0
  ) {
    collapseRefresher();
    return;
  }
  refresherPhase.value = 'complete';
  completeHoldTimer = setTimeout(() => {
    completeHoldTimer = null;
    refresherTriggered.value = false;
    refresherPhase.value = 'idle';
  }, props.refresherCompleteDuration);
}

function onRefresherPulling(event: { detail?: { dy?: number } }): void {
  if (refresherTriggered.value || isLoading.value) return;
  const dy = Math.max(0, event.detail?.dy ?? 0);
  refresherPhase.value = dy >= props.refresherThreshold ? 'ready' : 'pulling';
}

function onRefresherRefresh(): void {
  if (!props.refresherEnabled) return;
  if (isLoading.value) {
    /* A query is already in flight — collapse the gesture, never stack. */
    refresherTriggered.value = false;
    return;
  }
  startRefresh(false);
  /* The gesture already owns the pull animation; locking `triggered` keeps
   * the slot mounted in its loading state until `complete*` collapses it. */
  refresherTriggered.value = true;
}

function onRefresherSettled(): void {
  if (!refresherTriggered.value) refresherPhase.value = 'idle';
}

function onScrollToLower(): void {
  startLoadMore();
}

function onFooterTap(): void {
  if (isLoading.value) return;
  if (loadMorePhase.value === 'fail') {
    if (failedPhase.value === 'refresh') startRefresh(false);
    else retryLoadMore();
    return;
  }
  if (!noMore.value) startLoadMore();
}

function onScroll(event: unknown): void {
  emit('scroll', event);
}

/** Browser fallback pull update: drive the phase + inline height together. */
function onSimulatedPull(distance: number): void {
  if (isLoading.value) return;
  pullDistance.value = distance;
  refresherPhase.value =
    distance <= 0 ? 'idle' : distance >= props.refresherThreshold ? 'ready' : 'pulling';
}

/** Trigger a refresh with the refresher animation (z-paging `refresh`). */
function refresh(): void {
  startRefresh(true);
}

/** Trigger a refresh without the refresher animation (z-paging `reload`). */
function reload(): void {
  startRefresh(false);
}

/** Report a finished query; a non-array `data` (or `success=false`) fails it. */
function complete(data: unknown[] | false | null | undefined, success = true): void {
  const ok = success && Array.isArray(data);
  applyResult(ok ? (data as unknown[]) : [], ok);
}

/** Report with an explicit total; the sequence ends once the list reaches it. */
function completeByTotal(data: unknown[], total: number): void {
  const base = phase.value === 'refresh' ? 0 : props.modelValue.length;
  applyResult(data, true, base + data.length >= total);
}

/** Report with an explicit no-more flag. */
function completeByNoMore(data: unknown[], isNoMore: boolean): void {
  applyResult(data, true, isNoMore);
}

onMounted(() => {
  if (props.auto) startRefresh(false);
  if (!isBrowserHost) return;
  const el = scrollEl.value;
  if (!(el instanceof HTMLElement)) return;
  disposeGesture = createBrowserPagingGesture(el, {
    isRefresherEnabled: () => props.refresherEnabled,
    refresherThreshold: () => props.refresherThreshold,
    lowerThreshold: () => props.lowerThreshold,
    isBusy: () => isLoading.value,
    onPull: onSimulatedPull,
    onRefreshArm: onRefresherRefresh,
    onReachBottom: onScrollToLower,
  });
});

onBeforeUnmount(() => {
  clearCompleteHold();
  disposeGesture?.();
  disposeGesture = null;
});

defineExpose({ refresh, reload, complete, completeByTotal, completeByNoMore });
</script>

<template>
  <view
    class="sn-paging"
    :class="rootClass"
    :style="customStyle || undefined"
    data-snui-component="paging"
  >
    <!-- Unconditional fixed wrappers: with no slot content they collapse to
     * zero height, and `$slots` lookups stay out of the template (§116). -->
    <view class="sn-paging__fixed sn-paging__fixed--top">
      <slot name="top" />
    </view>

    <scroll-view
      ref="scrollEl"
      class="sn-paging__scroll"
      scroll-y
      :refresher-enabled="refresherEnabled"
      refresher-default-style="none"
      :refresher-threshold="refresherThreshold"
      :refresher-triggered="refresherTriggered"
      :lower-threshold="lowerThreshold"
      @refresherpulling="onRefresherPulling"
      @refresherrefresh="onRefresherRefresh"
      @refresherrestore="onRefresherSettled"
      @refresherabort="onRefresherSettled"
      @scrolltolower="onScrollToLower"
      @scroll="onScroll"
    >
      <!-- `slot="refresher"` (not `#refresher`): the attribute form is what the
       * uni compilers map onto the native refresher slot on MP / App, and plain
       * attribute content survives SSR compilation of custom elements. On
       * browser hosts the inline height stands in for the native geometry. -->
      <view
        slot="refresher"
        class="sn-paging__refresher"
        :style="refresherStyle"
        aria-hidden="true"
      >
        <slot name="refresher">
          <SnIcon
            class="sn-paging__refresher-icon"
            :class="{ 'sn-paging__refresher-icon--ready': isRefresherReady }"
            :icon="ChevronDown"
            :size="32"
          />
          <text class="sn-paging__refresher-text">{{ refresherText }}</text>
        </slot>
      </view>

      <slot />

      <view v-if="isEmpty" class="sn-paging__empty">
        <slot name="empty">
          <text class="sn-paging__empty-text">{{ emptyText }}</text>
        </slot>
      </view>

      <view
        v-if="showFooter"
        class="sn-paging__footer"
        role="status"
        aria-live="polite"
        :aria-busy="isLoading"
        @click="onFooterTap"
      >
        <view v-if="isLoading" class="sn-paging__footer-spinner">
          <SnLoading :size="28" text="" />
        </view>
        <text
          class="sn-paging__footer-text"
          :class="{ 'sn-paging__footer-text--fail': isFooterFail }"
        >
          {{ footerText }}
        </text>
      </view>
    </scroll-view>

    <view class="sn-paging__fixed sn-paging__fixed--bottom">
      <slot name="bottom" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-paging {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

/* Device safe area (iPhone X+); `constant()` covers legacy WeChat webview. */
.sn-paging--safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* #top / #bottom fixed areas — collapsed to zero height when empty. */
.sn-paging__fixed {
  flex-shrink: 0;
  width: 100%;
}

.sn-paging__scroll {
  flex: 1;
  width: 100%;
  min-height: 0;
  /* Plain-CSS hosts (docs preview) need the rule; uni hosts manage their own
   * scroll layer and ignore it. */
  overflow-y: auto;
}

.sn-paging__refresher {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: var(--sn-mp-spacing-2);
  width: 100%;
  height: 100rpx;
  overflow: hidden;
}

.sn-paging__refresher-icon {
  color: var(--sn-mp-color-text-secondary);
  transition: transform 0.2s ease;
}

.sn-paging__refresher-icon--ready {
  transform: rotate(180deg);
}

.sn-paging__refresher-text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-paging__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-10) var(--sn-mp-spacing-4);
}

.sn-paging__empty-text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-paging__footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-2);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-4);
}

.sn-paging__footer-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-paging__footer-text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-paging__footer-text--fail {
  color: var(--sn-mp-color-feedback-danger);
}
</style>
