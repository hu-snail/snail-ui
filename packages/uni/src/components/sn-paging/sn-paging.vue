<script setup lang="ts">
/**
 * sn-paging (uni-end) — pull-to-refresh + load-more list container.
 *
 * Reference library: z-paging (https://z-paging.zxlee.cn) — registered as a
 * user-directed exception in AGENTS.md §112.4a (the wot-ui spec ships no
 * paging container; its `wd-loading` / `wd-loadmore` remain the references
 * for the embedded indicators). The prop surface is a curated z-paging
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
 * `@scrolltolower`. On uni hosts JS only reacts to *state transitions*
 * (`@refresherpulling` flips idle → pulling → ready → secondFloor): the pull
 * physics is the platform's and there is no per-move setData, which is the
 * z-paging rule for keeping low-end MP devices smooth.
 *
 * The one exception is the plain-browser host (the docs preview): there the
 * `scroll-view` is an inert custom element with no uni runtime behind it, so
 * `sn-paging-simulate.ts` installs the full gesture — z-paging incremental
 * damping (×0.75 in-zone, ×0.35 past the threshold, per-event delta cap),
 * a hard pull clamp (rubber band + bounded travel) and rAF-coalesced whole-
 * px reports. The distance is rendered with `transform` only (never height),
 * so dragging never triggers layout; release springs back through a CSS
 * transition. Real uni targets never wire it up.
 *
 * ## Second floor (二楼)
 *
 * Pulling past `secondFloorThreshold` (z-paging `refresherF2Threshold`)
 * arms the "release to enter" state; releasing there intercepts the refresh
 * and slides the `#secondFloor` overlay in from the top — z-paging's
 * `zp-f2-content` mechanics (`translateY(-100%) → 0` with a tracked timer so
 * the first frame paints before the transition). The overlay expands
 * full-screen (`secondFloorFullscreen`, `position: fixed`) or stays inside
 * the component box, and it can be dragged back: swiping up when the floor
 * content cannot scroll any further pulls the floor with the finger
 * (damped, integer-px), releasing past 80px closes it, otherwise it springs
 * back. `openSecondFloor()` / `closeSecondFloor()` drive the same overlay
 * programmatically; `secondFloorChange` reports both.
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

import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  type ComponentPublicInstance,
} from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import SnLoading from '../sn-loading/sn-loading.vue';
import type { LoadingType } from '../sn-loading/sn-loading-types';
import { Check, ChevronDown } from '../sn-icon/sn-icon-set';
import { MAX_PULL_RATIO, createBrowserPagingGesture } from './sn-paging-simulate';

defineOptions({ name: 'SnPaging' });

/**
 * True when rendering without a uni runtime (plain browser / docs preview):
 * the scroll-view is an inert host element there, so the native refresher and
 * `@scrolltolower` do not exist and the touch fallback takes over.
 */
const isBrowserHost =
  typeof document !== 'undefined' && typeof (globalThis as { uni?: unknown }).uni === 'undefined';

/**
 * uni-h5 host (real uni runtime on a browser platform): the scroll-view IS
 * the uni-h5 implementation with its native refresher — whose pull tracks
 * the raw finger distance with no damping and no clamp. This is the only
 * host where the native-refresher takeover (see `paintNativePull`) applies;
 * MP / App own their refresher natively, plain-browser hosts use the
 * simulate fallback.
 */
const isUniH5Host = !isBrowserHost && typeof document !== 'undefined';

/** Share of each gesture delta kept while below the arming threshold. */
const PULL_RATE = 0.75;
/** Cap for one event's finger jump — a sudden yank must not teleport the pull. */
const DELTA_CAP_PX = 100;

/** Visible refresher strip while refreshing, in px (100rpx at 750→375). */
const REFRESHER_HEIGHT_PX = 50;
/** Park delay before the second-floor overlay starts its slide-in. */
const SECOND_FLOOR_SHOW_DELAY_MS = 100;
/** Drag-back distance that dismisses the second floor, in px. */
const FLOOR_CLOSE_THRESHOLD_PX = 80;
/**
 * Hysteresis gap below the refresh threshold: pulling events that report
 * less than this de-arm the second floor. uni-h5 fires a synthetic
 * `refresherpulling` with `dy === refresherThreshold` right before
 * `refresherrefresh` on release — the gap keeps that echo from cancelling
 * the armed second floor.
 */
const SECOND_FLOOR_DEARM_GAP_PX = 1;

/** Visual phase of the custom refresher slot. */
type RefresherPhase = 'idle' | 'pulling' | 'ready' | 'secondFloor' | 'refreshing' | 'complete';
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
    /** Background of the pull area (native `refresher-background` on MP). */
    refresherBackground?: string;
    /** Refresher text color; the spinner follows when unset. */
    refresherTextColor?: string;
    /** Refresher icon / spinner color. */
    refresherIconColor?: string;
    /** Refresher loading-spinner shape (`sn-loading` `type`). */
    refresherLoadingType?: LoadingType;
    /**
     * Hard pull clamp in px (z-paging `movingDistance`, additive).
     * `0` = `refresherThreshold × 3` (legacy behaviour).
     */
    refresherMaxDistance?: number;
    /**
     * Base share removed from each gesture delta once the pull passes the
     * arming threshold, 0..1 (additive). The band stiffens progressively to
     * full stop at the clamp; a higher value feels firmer, a lower one more
     * elastic. 0.65 keeps the legacy constant-damping feel as the floor.
     */
    refresherOutRate?: number;
    /* ── second floor (z-paging refresherF2 subset) ──────────────────── */

    /** Enable pull-down-to-enter second floor. */
    secondFloorEnabled?: boolean;
    /** Release distance that enters the second floor, in px. */
    secondFloorThreshold?: number;
    /** Slide-in/out duration of the second-floor overlay, in ms. */
    secondFloorDuration?: number;
    /** Expand the overlay to the viewport (fixed) instead of the component box. */
    secondFloorFullscreen?: boolean;
    /** Refresher text while the pull is inside the second-floor zone. */
    refresherSecondFloorText?: string;
    /** Background of the second-floor overlay. */
    secondFloorBackground?: string;
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
    /** Load-more text color; the footer spinner follows it when set. */
    loadMoreTextColor?: string;
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
    refresherBackground: '',
    refresherTextColor: '',
    refresherIconColor: '',
    refresherLoadingType: 'circular',
    refresherMaxDistance: 0,
    refresherOutRate: 0.65,
    secondFloorEnabled: false,
    secondFloorThreshold: 100,
    secondFloorDuration: 200,
    secondFloorFullscreen: true,
    refresherSecondFloorText: '松开进入二楼',
    secondFloorBackground: '',
    loadMoreEnabled: true,
    lowerThreshold: 50,
    loadMoreDefaultText: '点击加载更多',
    loadMoreLoadingText: '正在加载中...',
    loadMoreNoMoreText: '没有更多了',
    loadMoreFailText: '加载失败，点击重试',
    loadMoreTextColor: '',
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
  /** Second-floor overlay opened ('go') or closed ('close'). */
  (e: 'secondFloorChange', phase: 'go' | 'close'): void;
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
  /** Replaces the built-in load-more footer; receives `{ phase }`. */
  footer?(slotProps: { phase: LoadMorePhase }): unknown;
  /** Second-floor overlay content; rendered over its own scroll area. */
  secondFloor?(): unknown;
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
/** Second-floor overlay is mounted (may still be parked off-screen). */
const secondFloorVisible = ref(false);
/** Second-floor overlay is slid in (drives the translateY transition). */
const secondFloorOpen = ref(false);
/** Live drag-back offset in px (0 = parked at translateY(0)). */
const f2DragOffset = ref(0);
/** scroll-view host element; an inert element on browser hosts. */
const scrollEl = ref<HTMLElement | ComponentPublicInstance | null>(null);
/** Second-floor scroll area host element, for the browser-host measurement. */
const f2ScrollEl = ref<HTMLElement | ComponentPublicInstance | null>(null);
let completeHoldTimer: ReturnType<typeof setTimeout> | null = null;
let secondFloorTimer: ReturnType<typeof setTimeout> | null = null;
let disposeGesture: (() => void) | null = null;
/* Floor drag-back session (module-scope to keep touchmove re-renders to the
 * single f2DragOffset ref; none of these drive the template directly). */
let f2ScrollTop = 0;
let f2MaxScroll = 0;
let f2Scrollable = false;
let f2FloorHeight = 0;
let f2TouchStartY = 0;
let f2DragEngaged = false;
/**
 * Second-floor arming latch. The visual `refresherPhase` is recomputed from
 * every pulling event, but platforms emit pulling events around the release
 * itself (uni-h5 synthesizes one with `dy === refresherThreshold` before
 * `refresherrefresh`; WeChat keeps reporting during the settle-back), which
 * would clobber the phase before the release can be intercepted. The latch
 * records "the pull crossed into the second-floor zone" and only de-arms
 * when a pull reports clearly below the refresh threshold again.
 */
let secondFloorArmed = false;

/** Whether scroll-to-bottom loads the next page. */
const isLoadMoreEnabled = computed(() => props.loadMoreEnabled);

/**
 * Browser-only reveal-box height: fixed tall box the pull translates in.
 * `refresherMaxDistance` (0 = legacy `threshold × 3`) sets the hard clamp;
 * always at least the visible hold strip + a small margin so the strip can
 * fully reveal.
 */
const maxPullPx = computed(() =>
  Math.max(
    props.refresherMaxDistance > 0
      ? props.refresherMaxDistance
      : props.refresherThreshold * MAX_PULL_RATIO,
    REFRESHER_HEIGHT_PX + 10,
  ),
);

const refresherText = computed(() => {
  switch (refresherPhase.value) {
    case 'ready':
      return props.refresherPullingText;
    case 'secondFloor':
      return props.refresherSecondFloorText;
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

/** Phases where the pull distance is live (browser drag). */
const isDraggingPhase = computed(
  () =>
    refresherPhase.value === 'pulling' ||
    refresherPhase.value === 'ready' ||
    refresherPhase.value === 'secondFloor',
);

const isHoldPhase = computed(
  () => refresherPhase.value === 'refreshing' || refresherPhase.value === 'complete',
);

const DRAG_TRANSITION = 'none';
/** Spring-back curve for release-below-threshold and post-refresh collapse. */
const SETTLE_TRANSITION = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
/** Short ease used when the release arms the refresh (pull → hold strip). */
const ARM_TRANSITION = 'transform 0.2s ease-out';

/**
 * Inline geometry for the refresher reveal box on browser hosts: a fixed
 * `maxPull`-tall box parked above the content (`margin-top`), translated
 * down by the damped pull — transform only, no layout. Its content sits in
 * the bottom `REFRESHER_HEIGHT_PX` strip so the visible hold strip centers
 * icon + text. On uni hosts this stays `undefined` and the scroll-view owns
 * the refresher geometry.
 */
const refresherStyle = computed(() => {
  if (!isBrowserHost) return undefined;
  const max = maxPullPx.value;
  const visible = isDraggingPhase.value
    ? pullDistance.value
    : isHoldPhase.value
      ? REFRESHER_HEIGHT_PX
      : 0;
  const transition = isDraggingPhase.value
    ? DRAG_TRANSITION
    : isHoldPhase.value
      ? ARM_TRANSITION
      : SETTLE_TRANSITION;
  const parts = [
    `height: ${max}px`,
    `margin-top: -${max}px`,
    `padding-bottom: ${Math.max(max - REFRESHER_HEIGHT_PX, 0)}px`,
    `transform: translateY(${Math.round(visible - max)}px)`,
    `transition: ${transition}`,
  ];
  if (props.refresherBackground) parts.push(`background: ${props.refresherBackground}`);
  return parts.join('; ');
});

/**
 * Inline offset for the scroll content on browser hosts: the list rides the
 * same damped pull (native-overscroll look) and holds the refresh strip.
 */
const bodyStyle = computed(() => {
  if (!isBrowserHost) return undefined;
  const offset = isDraggingPhase.value
    ? pullDistance.value
    : isHoldPhase.value
      ? REFRESHER_HEIGHT_PX
      : 0;
  const transition = isDraggingPhase.value
    ? DRAG_TRANSITION
    : isHoldPhase.value
      ? ARM_TRANSITION
      : SETTLE_TRANSITION;
  return `transform: translateY(${Math.round(offset)}px); transition: ${transition}`;
});

/** Icon / spinner color for the whole refresher content (inheritable). */
const refresherContentStyle = computed(() =>
  props.refresherIconColor ? `color: ${props.refresherIconColor}` : undefined,
);

const refresherTextStyle = computed(() =>
  props.refresherTextColor ? `color: ${props.refresherTextColor}` : undefined,
);

/**
 * Arrow rotation: continuous with the damped pull on the browser host, a
 * phase flip (with the shared 0.2s transform transition) on uni hosts —
 * per-move setData there is what makes low-end MP devices janky.
 */
const refresherIconStyle = computed(() => {
  let deg: number;
  if (isBrowserHost && isDraggingPhase.value) {
    deg = Math.min(pullDistance.value / Math.max(props.refresherThreshold, 1), 1) * 180;
  } else {
    deg = refresherPhase.value === 'ready' || refresherPhase.value === 'secondFloor' ? 180 : 0;
  }
  return `transform: rotate(${Math.round(deg)}deg)`;
});

const footerTextStyle = computed(() =>
  props.loadMoreTextColor ? `color: ${props.loadMoreTextColor}` : undefined,
);

/** Second-floor overlay: parked above, slides in once mounted. While the
 * drag-back gesture holds the floor, the offset wins over the phase. */
const secondFloorStyle = computed(() => {
  const dragging = f2DragOffset.value > 0;
  const transform = dragging
    ? `translateY(-${f2DragOffset.value}px)`
    : `translateY(${secondFloorOpen.value ? '0%' : '-100%'})`;
  const transition = dragging
    ? 'none'
    : `transform ${props.secondFloorDuration}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
  const parts = [`transform: ${transform}`, `transition: ${transition}`];
  if (props.secondFloorBackground) parts.push(`background: ${props.secondFloorBackground}`);
  return parts.join('; ');
});

function clearCompleteHold(): void {
  if (completeHoldTimer !== null) {
    clearTimeout(completeHoldTimer);
    completeHoldTimer = null;
  }
}

function clearSecondFloorTimer(): void {
  if (secondFloorTimer !== null) {
    clearTimeout(secondFloorTimer);
    secondFloorTimer = null;
  }
}

/** Reset to the first page and query. `animate` locks the native refresher. */
function startRefresh(animate: boolean): void {
  if (isLoading.value) return;
  clearCompleteHold();
  secondFloorArmed = false;
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

/** Update the second-floor arming latch from a pull report. */
function updateSecondFloorArm(pull: number): void {
  if (!props.secondFloorEnabled) {
    secondFloorArmed = false;
    return;
  }
  if (pull >= props.secondFloorThreshold) secondFloorArmed = true;
  else if (pull < props.refresherThreshold - SECOND_FLOOR_DEARM_GAP_PX) secondFloorArmed = false;
}

function onRefresherPulling(event: { detail?: { dy?: number } }): void {
  if (refresherTriggered.value || isLoading.value) return;
  const rawDy = Math.max(0, event.detail?.dy ?? 0);
  /* uni-h5 takeover: the native refresher tracks the RAW finger distance
   * (no damping, no clamp — its `refresherHeight = y - startY` line). We
   * keep the native pull for the first strip-height of travel (platform
   * look) and run the damped rubber band on top: the reported pull drives
   * the phase machine exactly as before, and `paintNativePull` rewrites the
   * native strip height to the damped value so the band visibly stiffens.
   * MP keeps its fully native refresher (platform-owned feel). */
  const dy = dampNativePull(rawDy);
  updateSecondFloorArm(dy);
  refresherPhase.value =
    props.secondFloorEnabled && (secondFloorArmed || dy >= props.secondFloorThreshold)
      ? 'secondFloor'
      : dy >= props.refresherThreshold
        ? 'ready'
        : 'pulling';
}

/* ── uni-h5 native-refresher takeover (damped rubber band) ─────────────── */

/**
 * Per-pull incremental damp state. `lastRaw` tracks the raw finger distance
 * of the previous pulling event so each event only damps its own delta
 * (z-paging incremental damping), `dis` is the damped pull reported to the
 * phase machine, and `nativeTouched` records whether the native strip is
 * currently overridden so release/refresh can hand it back.
 */
let nativePullLastRaw = 0;
let nativePullDis = 0;
let nativePullActive = false;

/** Effective hard clamp in px for the current props. */
function maxPullOf(): number {
  const explicit = props.refresherMaxDistance;
  if (explicit > 0) return explicit;
  return props.refresherThreshold * MAX_PULL_RATIO;
}

/**
 * Damp one raw pulling report and repaint the native strip. Returns the
 * damped distance for the phase machine. Below the visible hold strip the
 * native pull runs untouched (the platform's first 50px look); past it the
 * incremental rubber band takes over: each delta keeps `1 - outRate`, where
 * `outRate` grows from `refresherOutRate` toward 1 as the pull approaches
 * the clamp, so the band chases the finger, resists, then locks up.
 */
function dampNativePull(rawDy: number): number {
  if (!isUniH5Host) {
    /* MP / App and the test/browser hosts: the pulling `dy` comes from the
     * native refresher contract, where the platform gesture has already
     * applied its own damping. Pass it straight through — the takeover
     * below is uni-h5-only (that is the one host whose native refresher
     * tracks the raw finger distance with no damping and no clamp). */
    return rawDy;
  }
  const hold = REFRESHER_HEIGHT_PX;
  if (rawDy <= hold) {
    /* First strip-height: native territory. Reset the band state so a
     * re-pull after release starts the damping from the strip again. */
    nativePullLastRaw = rawDy;
    nativePullDis = rawDy;
    nativePullActive = false;
    return rawDy;
  }
  if (!nativePullActive) {
    /* Entering the band zone: the previous raw distance is the strip. */
    nativePullActive = true;
    nativePullLastRaw = hold;
    nativePullDis = hold;
  }
  const maxPull = Math.max(maxPullOf(), hold);
  nativePullDis = dampRaw(rawDy);
  /* Never advertise a pull past the clamp (keeps thresholds honest). */
  nativePullDis = Math.min(nativePullDis, maxPull);
  paintNativePull(Math.round(nativePullDis), maxPull);
  return nativePullDis;
}

/**
 * Incremental damping for the uni-h5 takeover. In-zone deltas keep
 * PULL_RATE; past the threshold the kept share shrinks linearly toward zero
 * as the pull approaches the clamp (progressive rubber band). The session
 * state (last raw distance + damped distance) lives in the module lets above.
 */
function dampRaw(rawDy: number): number {
  const threshold = props.refresherThreshold;
  const maxPull = Math.max(maxPullOf(), threshold);
  let delta = rawDy - nativePullLastRaw;
  if (delta < 0) delta = 0;
  if (delta > DELTA_CAP_PX) delta = DELTA_CAP_PX;
  let next: number;
  if (nativePullDis < threshold) {
    next = nativePullDis + delta * PULL_RATE;
  } else {
    const progress = (nativePullDis - threshold) / Math.max(maxPull - threshold, 1);
    const outRate = Math.min(1, Math.max(props.refresherOutRate, progress));
    next = nativePullDis + delta * (1 - outRate);
  }
  nativePullLastRaw = rawDy;
  return Math.round(Math.min(Math.max(next, 0), maxPull));
}

/**
 * Scroll-view host element for the native-refresher repaint. On uni-h5 the
 * template ref is the component instance — the strip lives under its root
 * element; on plain-browser hosts the ref is the element itself.
 */
function nativeScrollRoot(): HTMLElement | null {
  const target = scrollEl.value;
  if (target === null) return null;
  if (target instanceof HTMLElement) return target;
  const el = (target as { $el?: unknown }).$el;
  return el instanceof HTMLElement ? el : null;
}

/**
 * Rewrite the native refresher strip height on uni-h5. The strip node is
 * looked up defensively (`uni-scroll-view-refresher` is a uni-h5 internal
 * class); a miss silently skips the repaint and the native raw-distance
 * behaviour returns — the takeover is a pure visual enhancement.
 */
function paintNativePull(pull: number, maxPull: number): void {
  const root = nativeScrollRoot();
  if (root === null) return;
  const strip = root.querySelector<HTMLElement>('.uni-scroll-view-refresher');
  if (!strip) return;
  /* The clamp rides `max-height`, NOT `height`: uni-h5's render pass
   * rewrites the strip `height` to the raw finger distance on every pulling
   * event (its `refresherHeight` state), and a Vue patchStyle
   * `setProperty` on the same property replaces an inline `!important`
   * declaration. `max-height` is a different property — uni-h5 never
   * writes it, so our clamp survives every patch, and the effective strip
   * height (what the content below is laid out against) is exactly the
   * damped pull. `resetNativePull` removes it when the gesture settles. */
  strip.style.setProperty('max-height', `${Math.round(pull)}px`, 'important');
  strip.style.setProperty('overflow', 'hidden', 'important');
  void maxPull;
}

function onRefresherRefresh(): void {
  if (!props.refresherEnabled) return;
  /* The echo of our own programmatic lock (uni-h5 re-emits `refresherrefresh`
   * when `refresher-triggered` flips true) — never a user release. */
  if (refresherTriggered.value) return;
  /* Released inside the second-floor zone: intercept the refresh, collapse
   * the native pull and open the overlay instead — no query is emitted. */
  if (props.secondFloorEnabled && (refresherPhase.value === 'secondFloor' || secondFloorArmed)) {
    secondFloorArmed = false;
    /* Adopt the native hold, then drop it a tick later: uni-h5 only resets
     * its held pull on a true→false transition of `refresher-triggered`. */
    refresherTriggered.value = true;
    refresherPhase.value = 'idle';
    openSecondFloor();
    void nextTick(() => {
      refresherTriggered.value = false;
    });
    return;
  }
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
  secondFloorArmed = false;
  resetNativePull();
  if (!refresherTriggered.value) refresherPhase.value = 'idle';
}

/**
 * Hand the native refresher strip back: clear the takeover's inline
 * height/transform overrides so uni-h5's own state machine repaints the
 * strip (hold at threshold while refreshing, 0 on restore), and reset the
 * incremental band session. A no-op when the takeover never painted.
 */
function resetNativePull(): void {
  nativePullLastRaw = 0;
  nativePullDis = 0;
  nativePullActive = false;
  if (!isUniH5Host) return;
  const root = nativeScrollRoot();
  if (root === null) return;
  const strip = root.querySelector<HTMLElement>('.uni-scroll-view-refresher');
  if (strip) {
    strip.style.removeProperty('max-height');
    strip.style.removeProperty('overflow');
  }
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

/** Browser fallback pull update: drive the phase; styles read the distance. */
function onSimulatedPull(distance: number): void {
  if (isLoading.value) return;
  pullDistance.value = distance;
  updateSecondFloorArm(distance);
  refresherPhase.value =
    distance <= 0
      ? 'idle'
      : props.secondFloorEnabled && (secondFloorArmed || distance >= props.secondFloorThreshold)
        ? 'secondFloor'
        : distance >= props.refresherThreshold
          ? 'ready'
          : 'pulling';
}

/** Browser fallback release inside the second-floor zone. */
function onSimulatedSecondFloorArm(): void {
  secondFloorArmed = false;
  pullDistance.value = 0;
  refresherPhase.value = 'idle';
  openSecondFloor();
}

/**
 * Slide the second-floor overlay in (z-paging `goF2`). The overlay mounts
 * parked at `translateY(-100%)`; the tracked delay lets that first frame
 * paint before the transition retargets to `0` (§41/§42: the timer is
 * cleared on unmount and on every open/close). The same tick measures the
 * floor scroll geometry for the drag-back gesture.
 */
function openSecondFloor(): void {
  const wasClosing = secondFloorTimer !== null;
  clearSecondFloorTimer();
  if (secondFloorVisible.value && secondFloorOpen.value) {
    if (wasClosing) emit('secondFloorChange', 'go');
    return;
  }
  f2DragOffset.value = 0;
  f2DragEngaged = false;
  if (!secondFloorVisible.value) {
    secondFloorOpen.value = false;
    secondFloorVisible.value = true;
  }
  emit('secondFloorChange', 'go');
  secondFloorTimer = setTimeout(() => {
    secondFloorTimer = null;
    secondFloorOpen.value = true;
    measureFloorScroll();
  }, SECOND_FLOOR_SHOW_DELAY_MS);
}

/** Slide the second-floor overlay out (z-paging `closeF2`). */
function closeSecondFloor(): void {
  if (!secondFloorVisible.value) return;
  clearSecondFloorTimer();
  emit('secondFloorChange', 'close');
  f2DragEngaged = false;
  if (!secondFloorOpen.value) {
    /* Cancelled before the slide-in started — unmount outright. */
    secondFloorVisible.value = false;
    return;
  }
  secondFloorOpen.value = false;
  secondFloorTimer = setTimeout(() => {
    secondFloorTimer = null;
    secondFloorVisible.value = false;
  }, props.secondFloorDuration + 50);
}

/* ── second-floor drag-back (swipe up dismisses the floor) ────────────── */

/** The slice of `uni.createSelectorQuery()` the floor measurement needs. */
interface FloorSelectorQuery {
  in?(target: unknown): FloorSelectorQuery;
  select(selector: string): FloorSelectorQuery;
  fields(
    options: { size: boolean; scrollOffset: boolean },
    callback: (res: unknown) => void,
  ): FloorSelectorQuery;
  exec(): void;
}

interface FloorMeasuredNode {
  height?: number;
  scrollHeight?: number;
}

/** Narrowed `uni` global for the floor measurement (uni-x safe, §116.2). */
interface FloorUniHost {
  createSelectorQuery?: (() => FloorSelectorQuery) | undefined;
}

/**
 * Measure the floor scroll geometry once per open: floor height caps the
 * drag travel; scrollHeight vs clientHeight decides whether swiping up
 * scrolls the content first or dismisses the floor right away.
 */
function measureFloorScroll(): void {
  if (isBrowserHost) {
    const el = f2ScrollEl.value;
    if (!(el instanceof HTMLElement)) return;
    f2FloorHeight = el.clientHeight;
    f2Scrollable = el.scrollHeight > el.clientHeight + 1;
    f2MaxScroll = Math.max(el.scrollHeight - el.clientHeight, 0);
    return;
  }
  const query = (globalThis as { uni?: FloorUniHost }).uni?.createSelectorQuery?.();
  const instance = getCurrentInstance()?.proxy;
  if (!query || !instance) return;
  const scoped = query.in ? query.in(instance) : query;
  scoped
    .select('.sn-paging__f2-scroll')
    .fields({ size: true, scrollOffset: true }, (res: unknown) => {
      const node = Array.isArray(res)
        ? (res[0] as FloorMeasuredNode | null)
        : (res as FloorMeasuredNode | null);
      if (!node) return;
      f2FloorHeight = node.height ?? 0;
      const scrollHeight = node.scrollHeight ?? 0;
      f2Scrollable = f2FloorHeight > 0 && scrollHeight > f2FloorHeight + 1;
      f2MaxScroll = Math.max(scrollHeight - f2FloorHeight, 0);
    })
    .exec();
}

/** Floor `@scroll`: keeps the at-bottom detection in sync with lazy content. */
function onFloorScroll(event: unknown): void {
  const detail = (event as { detail?: { scrollTop?: number; scrollHeight?: number } }).detail;
  const target = (event as { target?: { scrollTop?: number; scrollHeight?: number } }).target;
  f2ScrollTop = detail?.scrollTop ?? target?.scrollTop ?? 0;
  const scrollHeight = detail?.scrollHeight ?? target?.scrollHeight ?? 0;
  if (f2FloorHeight > 0 && scrollHeight > 0) {
    f2Scrollable = scrollHeight > f2FloorHeight + 1;
    f2MaxScroll = Math.max(scrollHeight - f2FloorHeight, 0);
  }
}

/** Swiping up may dismiss only when the content cannot scroll further. */
function canDismissFloor(): boolean {
  return f2FloorHeight > 0 && (!f2Scrollable || f2ScrollTop >= f2MaxScroll - 1);
}

function onFloorTouchStart(event: { touches?: Array<{ clientY?: number }> }): void {
  const touch = event.touches?.[0];
  if (touch?.clientY === undefined) return;
  f2TouchStartY = touch.clientY;
  f2DragEngaged = false;
}

function onFloorTouchMove(event: {
  touches?: Array<{ clientY?: number }>;
  cancelable?: boolean;
  preventDefault?: () => void;
}): void {
  if (!secondFloorOpen.value) return;
  const touch = event.touches?.[0];
  if (touch?.clientY === undefined) return;
  const dyUp = f2TouchStartY - touch.clientY;
  if (dyUp <= 0) {
    /* Finger went back below the start point — stand down. */
    if (f2DragEngaged) {
      f2DragEngaged = false;
      f2DragOffset.value = 0;
    }
    return;
  }
  if (!f2DragEngaged) {
    if (!canDismissFloor()) return;
    f2DragEngaged = true;
  }
  /* 0.9 damped follow, clamped to one full floor height. */
  f2DragOffset.value = Math.min(Math.round(dyUp * 0.9), f2FloorHeight);
  if (f2DragOffset.value > 0 && event.cancelable) event.preventDefault?.();
}

function onFloorTouchEnd(): void {
  if (!f2DragEngaged) return;
  f2DragEngaged = false;
  const offset = f2DragOffset.value;
  f2DragOffset.value = 0;
  if (offset >= FLOOR_CLOSE_THRESHOLD_PX) closeSecondFloor();
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
    refresherMaxDistance: () => props.refresherMaxDistance,
    refresherOutRate: () => props.refresherOutRate,
    isSecondFloorEnabled: () => props.secondFloorEnabled,
    secondFloorThreshold: () => props.secondFloorThreshold,
    lowerThreshold: () => props.lowerThreshold,
    isBusy: () => isLoading.value,
    onPull: onSimulatedPull,
    onRefreshArm: onRefresherRefresh,
    onSecondFloorArm: onSimulatedSecondFloorArm,
    onReachBottom: onScrollToLower,
  });
});

onBeforeUnmount(() => {
  clearCompleteHold();
  clearSecondFloorTimer();
  disposeGesture?.();
  disposeGesture = null;
});

defineExpose({
  refresh,
  reload,
  complete,
  completeByTotal,
  completeByNoMore,
  openSecondFloor,
  closeSecondFloor,
});
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
      :refresher-background="refresherBackground || undefined"
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
       * browser hosts the inline transform stands in for the native geometry:
       * a fixed tall reveal box parked above the content, translated down by
       * the damped pull. -->
      <view
        slot="refresher"
        class="sn-paging__refresher"
        :style="[refresherStyle, refresherContentStyle]"
        aria-hidden="true"
      >
        <slot name="refresher">
          <SnLoading
            v-if="refresherPhase === 'refreshing'"
            :type="refresherLoadingType ?? 'circular'"
            size="18px"
            text=""
            inherit-color
          />
          <SnIcon
            v-else-if="refresherPhase === 'complete'"
            class="sn-paging__refresher-icon"
            :icon="Check"
            :size="18"
          />
          <SnIcon
            v-else
            class="sn-paging__refresher-icon"
            :style="refresherIconStyle"
            :icon="ChevronDown"
            :size="18"
          />
          <text class="sn-paging__refresher-text" :style="refresherTextStyle">
            {{ refresherText }}
          </text>
        </slot>
      </view>

      <!-- Content rides the pull on browser hosts (transform only); static on
       * uni hosts where the native overscroll moves the whole content. -->
      <view class="sn-paging__body" :style="bodyStyle">
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
          <slot name="footer" :phase="loadMorePhase">
            <view v-if="isLoading" class="sn-paging__footer-spinner">
              <SnLoading :size="28" text="" :color="loadMoreTextColor ?? ''" />
            </view>
            <text
              class="sn-paging__footer-text"
              :class="{ 'sn-paging__footer-text--fail': isFooterFail }"
              :style="footerTextStyle"
            >
              {{ footerText }}
            </text>
          </slot>
        </view>
      </view>
    </scroll-view>

    <!-- Second floor: an overlay that slides in from the top (z-paging
     * `zp-f2-content` mechanics) — full-screen (fixed) by default or boxed
     * inside the component root. Swipe-up drags it back: release past the
     * threshold dismisses, otherwise it springs back. -->
    <view
      v-if="secondFloorVisible"
      class="sn-paging__f2"
      :class="{ 'sn-paging__f2--fullscreen': secondFloorFullscreen }"
      :style="secondFloorStyle"
      @touchmove.stop
    >
      <scroll-view
        ref="f2ScrollEl"
        scroll-y
        class="sn-paging__f2-scroll"
        @scroll="onFloorScroll"
        @touchstart="onFloorTouchStart"
        @touchmove="onFloorTouchMove"
        @touchend="onFloorTouchEnd"
        @touchcancel="onFloorTouchEnd"
      >
        <slot name="secondFloor" />
      </scroll-view>
    </view>

    <view class="sn-paging__fixed sn-paging__fixed--bottom">
      <slot name="bottom" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-paging {
  position: relative;
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
  color: var(--sn-mp-color-text-secondary);
}

.sn-paging__refresher-icon {
  transition: transform 0.2s ease;
}

.sn-paging__refresher-text {
  color: inherit;
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-paging__body {
  width: 100%;
}

.sn-paging__f2 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--sn-paging-f2-z-index, 500);
  overflow: hidden;
}

/* Fullscreen mode lifts the floor to the viewport (MP fixed = viewport). */
.sn-paging__f2--fullscreen {
  position: fixed;
}

.sn-paging__f2-scroll {
  width: 100%;
  height: 100%;
  /* Plain-CSS hosts (docs preview) need the rule; uni hosts manage their own
   * scroll layer and ignore it. */
  overflow-y: auto;
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
