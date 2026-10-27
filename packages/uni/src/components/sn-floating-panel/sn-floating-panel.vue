<script setup lang="ts">
/**
 * sn-floating-panel (uni-end) — bottom sheet whose height is dragged and
 * snapped to anchors.
 *
 * Reference library: wot-ui `wd-floating-panel`
 *   (https://wot-ui.cn/component/floating-panel.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-floating-panel 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-floating-panel/sn-floating-panel.vue
 * → auto-registered as `<sn-floating-panel>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Height model
 *
 * `v-model:height` is the panel height in **design px** (the same unit as
 * `anchors`). Two-way sync:
 *
 *   - the consumer sets `height` → the panel moves to it;
 *   - a drag / snap changes the height → `update:height` fires with the new
 *     value, and `heightChange` fires once the drag has settled (wd parity).
 *
 * During a drag `update:height` fires continuously (so the panel can be
 * driven by a `v-model`), and on release the height snaps to the nearest
 * anchor. With `anchors` empty the panel keeps wherever the finger left it.
 *
 * ## Anchors and the viewport
 *
 * The wd default anchor set is `[100, windowHeight * 0.6]`. There is no
 * `window` on miniprogram, so the default is resolved from
 * `globalThis.uni.getSystemInfoSync()` when available and falls back to the
 * single static anchor otherwise. An explicit `anchors` array always wins.
 *
 * ## Gesture model (AGENTS.md §41: nothing global to dispose)
 *
 * The drag is tracked on the panel's own drag handle through
 * `touchstart` / `touchmove` / `touchend` / `touchcancel` — no global
 * listener. `content-draggable` extends the gesture to the content area.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One settle timer ends the snap animation and one generation token drops a
 * stale leg; both are cleared in `onBeforeUnmount`.
 *
 * Usage:
 *   <sn-floating-panel v-model:height="h" :anchors="[120, 480]" />
 *
 * Not responsible for:
 *   - 通用弹层 / 遮罩 — 用 sn-popup
 *   - 页面滚动容器 — 由宿主组织
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';

defineOptions({ name: 'SnFloatingPanel' });

/** Snap-animation length in ms (wd `duration`). */
const DEFAULT_DURATION = 300;

/** Height used when nothing else is available, in design px. */
const FALLBACK_HEIGHT = 100;

const props = withDefaults(
  defineProps<{
    /** Panel height in design px (v-model:height). */
    height?: number;
    /** Snap points in design px; empty = free positioning. */
    anchors?: number[];
    /** Snap animation duration in ms; 0 disables the animation. */
    duration?: number;
    /** Let the content area drag the panel too, not only the handle. */
    contentDraggable?: boolean;
    /** Pad the panel for the device safe area. */
    safeAreaInsetBottom?: boolean;
    /** Render the scrollbar of the content area. */
    showScrollbar?: boolean;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    height: 0,
    anchors: () => [],
    duration: DEFAULT_DURATION,
    contentDraggable: true,
    safeAreaInsetBottom: false,
    showScrollbar: true,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Panel content (scrolls inside the panel). */
  default?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:height', value: number): void;
  (e: 'height-change', payload: { height: number }): void;
}>();

/**
 * Resolve the wd default anchor set: `[100, windowHeight * 0.6]`.
 *
 * `getSystemInfoSync` is the only cross-end viewport query; it is optional and
 * guarded, so H5 / tests fall back to the single static anchor.
 */
function defaultAnchors(): number[] {
  const host = globalThis as {
    uni?: { getSystemInfoSync?: () => { windowHeight?: number } };
  };
  const windowHeight = host.uni?.getSystemInfoSync?.()?.windowHeight;
  if (typeof windowHeight === 'number' && windowHeight > 0) {
    return [FALLBACK_HEIGHT, windowHeight * 0.6];
  }
  return [FALLBACK_HEIGHT];
}

/** Anchors in design px, ascending. An explicit list always wins. */
const anchorList = computed<number[]>(() => {
  const source = props.anchors.length > 0 ? props.anchors : defaultAnchors();
  return [...source].filter((value) => Number.isFinite(value) && value >= 0).sort((a, b) => a - b);
});

/** Height currently rendered, in design px. */
const currentHeight = ref(resolveInitialHeight());

/** Resolve the starting height: the prop, else the first anchor. */
function resolveInitialHeight(): number {
  if (props.height > 0) return props.height;
  const first = anchorList.value[0];
  return first ?? FALLBACK_HEIGHT;
}

/** A gesture is in flight. */
const isDragging = ref(false);
/** `true` while the snap transition runs. */
const isAnimating = ref(false);

/** Single pending settle timer (cleared on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;
/** Guards against a stale leg finishing after a newer one started. */
let generation = 0;

/** Gesture origin. */
let startY = 0;
/** Height when the gesture started. */
let startHeight = 0;
/** The gesture was recognised as a vertical drag. */
let tracking = false;
/** The gesture was rejected (horizontal / a tap). */
let rejected = false;

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

/** Keep the consumer in sync while the finger moves. */
function applyHeight(next: number): void {
  const clamped = Math.max(next, 0);
  if (clamped === currentHeight.value) return;
  currentHeight.value = clamped;
  emit('update:height', clamped);
}

/** Nearest anchor to `value` (falls back to the value itself with no anchors). */
function nearestAnchor(value: number): number {
  const list = anchorList.value;
  if (list.length === 0) return value;
  let best = list[0] as number;
  for (const anchor of list) {
    if (Math.abs(anchor - value) < Math.abs(best - value)) best = anchor;
  }
  return best;
}

/** Snap to `next` and report the settled height once the animation ends. */
function settle(next: number): void {
  clearTimer();
  const token = ++generation;
  isDragging.value = false;
  isAnimating.value = props.duration > 0;
  applyHeight(next);
  if (props.duration <= 0) {
    isAnimating.value = false;
    emit('height-change', { height: currentHeight.value });
    return;
  }
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    isAnimating.value = false;
    emit('height-change', { height: currentHeight.value });
  }, props.duration);
}

watch(
  () => props.height,
  (value) => {
    // A drag in flight owns the height until it settles.
    if (isDragging.value) return;
    if (typeof value !== 'number' || value < 0) return;
    if (value === currentHeight.value) return;
    currentHeight.value = value;
  },
);

onBeforeUnmount(clearTimer);

/** Read the vertical position out of a uni / DOM touch event. */
function touchY(event: Event): number {
  const detail = event as unknown as {
    touches?: Array<{ clientY?: number; pageY?: number }>;
    changedTouches?: Array<{ clientY?: number; pageY?: number }>;
  };
  const list = detail.touches ?? detail.changedTouches;
  const point = list && list.length > 0 ? list[0] : undefined;
  if (typeof point?.clientY === 'number') return point.clientY;
  if (typeof point?.pageY === 'number') return point.pageY;
  return 0;
}

function onTouchStart(event: Event): void {
  startY = touchY(event);
  startHeight = currentHeight.value;
  tracking = false;
  rejected = false;
  isDragging.value = true;
  // Interrupt a running snap so the finger takes over immediately.
  clearTimer();
  generation += 1;
  isAnimating.value = false;
}

function onTouchMove(event: Event): void {
  if (!isDragging.value) return;
  const dy = touchY(event) - startY;
  if (rejected) return;
  if (!tracking) {
    if (Math.abs(dy) < 2) return;
    tracking = true;
  }
  // Dragging up (negative dy) grows the panel.
  event.preventDefault();
  applyHeight(startHeight - dy);
}

function onTouchEnd(): void {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (!tracking) {
    // A tap on the handle: keep the current height, just end the gesture.
    settle(currentHeight.value);
    return;
  }
  settle(nearestAnchor(currentHeight.value));
}

/** `touchcancel` — settle where the finger left the panel. */
function onTouchCancel(): void {
  if (!isDragging.value) return;
  isDragging.value = false;
  settle(nearestAnchor(currentHeight.value));
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-floating-panel',
  {
    'sn-floating-panel--dragging': isDragging.value,
    'sn-floating-panel--animating': isAnimating.value,
    'sn-floating-panel--safe-bottom': props.safeAreaInsetBottom,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const base = [
    `height: ${currentHeight.value * 2}rpx`,
    `--sn-floating-panel-duration: ${props.duration}ms`,
  ].join('; ');
  return props.customStyle ? `${base}; ${props.customStyle}` : base;
});

const contentClass = computed(() => [
  'sn-floating-panel__content',
  { 'sn-floating-panel__content--hidden-scrollbar': !props.showScrollbar },
]);
</script>

<template>
  <view data-snui-component="floating-panel" :class="rootClass" :style="rootStyle">
    <view
      class="sn-floating-panel__handle"
      role="separator"
      aria-orientation="horizontal"
      :aria-valuenow="Math.round(currentHeight)"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
    >
      <view class="sn-floating-panel__bar" aria-hidden="true" />
    </view>

    <scroll-view
      :class="contentClass"
      scroll-y
      :show-scrollbar="showScrollbar"
      @touchstart="contentDraggable ? onTouchStart($event) : undefined"
      @touchmove="contentDraggable ? onTouchMove($event) : undefined"
      @touchend="contentDraggable ? onTouchEnd() : undefined"
      @touchcancel="contentDraggable ? onTouchCancel() : undefined"
    >
      <slot />
    </scroll-view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-floating-panel {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  border-top-left-radius: var(--sn-mp-radius-xl);
  border-top-right-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  box-shadow: var(--sn-mp-shadow-lg);
  will-change: height;
}

/* The height transition only runs while snapping — during a drag the panel
 * must follow the finger 1:1. */
.sn-floating-panel--animating {
  transition: height var(--sn-floating-panel-duration) ease;
}

.sn-floating-panel--safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* ── Drag handle ───────────────────────────────────────────────────────── */

.sn-floating-panel__handle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48rpx;
  flex: 0 0 auto;
  box-sizing: border-box;
}

.sn-floating-panel__bar {
  width: 64rpx;
  height: 8rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-border-default);
}

.sn-floating-panel--dragging .sn-floating-panel__bar {
  background-color: var(--sn-mp-color-action-primary);
}

/* ── Content ───────────────────────────────────────────────────────────── */

.sn-floating-panel__content {
  flex: 1 1 auto;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 var(--sn-mp-spacing-4) var(--sn-mp-spacing-4);
}

.sn-floating-panel__content--hidden-scrollbar {
  /* The portable standard property only: `::-webkit-scrollbar` is a
   * browser engine pseudo-element that App drops (§116.2), and App renders
   * no scrollbar chrome for scroll-view anyway. */
  scrollbar-width: none;
}

/* Doodle skin — hand-drawn panel outline. */
.snui-skin-doodle .sn-floating-panel {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
