<script setup lang="ts">
/**
 * sn-swipe-action (uni-end) — swipe-to-reveal action row for mobile lists.
 *
 * Reference library: wot-ui `wd-swipe-action`
 *   (https://wot-ui.cn/component/swipe-action.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-swipe-action 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-swipe-action/sn-swipe-action.vue
 * → auto-registered as `<sn-swipe-action>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Gesture model (AGENTS.md §23 / §41: miniprogram has no `document`)
 *
 * The horizontal swipe is tracked on the root node through
 * `touchstart` / `touchmove` / `touchend` / `touchcancel` — no global
 * listener, so nothing has to be unbound. `touchcancel` (a system gesture
 * stealing the touch) settles the row closed, so it can never stick
 * half-open.
 *
 * ## How far the row slides (why there is a measurement)
 *
 * The open distance must equal the action area's real width, and that width is
 * whatever the consumer puts in the slot — there is no design-time number to
 * hard-code. It is therefore measured once per gesture:
 *
 *   1. `uni.createSelectorQuery()` — the cross-end API (H5 / MP / App);
 *   2. the DOM node's `getBoundingClientRect` — docs preview and tests;
 *   3. `FALLBACK_ACTION_WIDTH` — last resort so the row still opens.
 *
 * Every path is guarded: a missing runtime falls through to the next one.
 * Nothing is observed or re-measured in the background, so no resource leaks
 * (§41).
 *
 * ## Documented divergences from wd-swipe-action
 *
 *   - A row with neither the `left` nor the `right` slot cannot be swiped: the
 *     gesture is ignored and the row stays closed.
 *   - `click` fires when the content area is tapped while the row is open (wd
 *     semantics: "tapped and closed"), so the tap closes the row and reports
 *     the event instead of activating the row's own handler.
 *   - `before-close` is also consulted for the swipe-driven close, not only
 *     for the `close()` method.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One settle timer runs the open / closed transition and one generation token
 * drops a stale leg. Both are cleared in `onBeforeUnmount`.
 *
 * Usage:
 *   <sn-swipe-action>
 *     <template #right><view @tap="remove">删除</view></template>
 *     内容
 *   </sn-swipe-action>
 *
 * Not responsible for:
 *   - 纵向滚动 / 下拉刷新 — 由页面或 sn-loadmore 负责
 *   - 列表容器 — 由宿主用 `<view>` 组织
 */

import { computed, onBeforeUnmount, ref, useSlots } from 'vue';

defineOptions({ name: 'SnSwipeAction' });

/** Swipe state. Mirrors `wd-swipe-action` `v-model`. */
type SwipeActionStatus = 'left' | 'close' | 'right';

/** Why a close was requested — forwarded to `before-close`. */
type SwipeActionReason = 'click' | 'swipe' | 'other';

/** Where the row currently sits. */
type SwipeActionPosition = 'left' | 'right';

/**
 * Close guard. Return `true` (or a promise of it) to allow the close;
 * `false` blocks it.
 */
type SwipeActionBeforeClose = (
  reason: SwipeActionReason,
  position: SwipeActionPosition,
) => boolean | Promise<boolean>;

/** Row open / close animation length in ms. */
const DEFAULT_DURATION = 200;

/** Design-px width used when the action area cannot be measured. */
const FALLBACK_ACTION_WIDTH = 88;

const props = withDefaults(
  defineProps<{
    /** Current swipe state (v-model): `left` / `close` / `right`. */
    modelValue?: SwipeActionStatus;
    /** Disable swiping — the row stays closed. */
    disabled?: boolean;
    /** Close guard; `false` (or a promise of it) blocks the close. */
    beforeClose?: SwipeActionBeforeClose;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: 'close',
    disabled: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Row content (the area that slides). */
  default?(): unknown;
  /** Left action area — revealed by swiping right. */
  left?(): unknown;
  /** Right action area — revealed by swiping left. */
  right?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: SwipeActionStatus): void;
  (e: 'click', payload: { reason: SwipeActionReason; position: SwipeActionPosition }): void;
}>();

const slots = useSlots();

/** Current open side (`close` = at rest). */
const status = ref<SwipeActionStatus>(props.modelValue);
/** Live drag distance in design px (negative = leftwards). */
const dragOffset = ref(0);
/** A gesture is in flight. */
const isDragging = ref(false);
/** Measured open distance per side, in design px. */
const openDistance = ref<{ left: number; right: number }>({
  left: FALLBACK_ACTION_WIDTH,
  right: FALLBACK_ACTION_WIDTH,
});

/** Action-area nodes, used by the DOM measurement fallback. */
const leftActionsRef = ref<{ getBoundingClientRect?: () => { width: number } } | null>(null);
const rightActionsRef = ref<{ getBoundingClientRect?: () => { width: number } } | null>(null);

/** Single pending settle timer (cleared on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;
/** Guards against a stale leg finishing after a newer one started. */
let generation = 0;

/** Gesture origin. */
let startX = 0;
let startY = 0;
/** The gesture was recognised as horizontal and is being tracked. */
let tracking = false;
/** The gesture was rejected as a vertical scroll. */
let rejected = false;

/** Which sides have an action area rendered. */
const hasLeft = computed(() => slots.left !== undefined);
const hasRight = computed(() => slots.right !== undefined);

/** `true` while the settle transition runs. */
const isAnimating = ref(false);

/** Whether an action area is exposed. */
const isOpen = computed(() => status.value !== 'close');

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

/**
 * Read the real width of one action area.
 *
 * Tries `uni.createSelectorQuery()` first (works on every uni target), then
 * the DOM node (docs preview / tests), then the fallback constant. Every step
 * is guarded — a failure just means "try the next one".
 */
function measureSide(side: SwipeActionPosition): void {
  const fallbackNode = side === 'left' ? leftActionsRef.value : rightActionsRef.value;
  // (1) DOM node — available in H5 and in the docs preview.
  if (fallbackNode && typeof fallbackNode.getBoundingClientRect === 'function') {
    try {
      const width = fallbackNode.getBoundingClientRect().width;
      if (width > 0) {
        openDistance.value = { ...openDistance.value, [side]: width };
        return;
      }
    } catch {
      // Fall through to the next strategy.
    }
  }
  // (2) uni runtime — the cross-end measurement API.
  const host = globalThis as {
    uni?: {
      createSelectorQuery?: () => {
        in?: (component: unknown) => unknown;
        select?: (selector: string) => {
          boundingClientRect?: (cb: (rect: { width?: number } | null) => void) => {
            exec?: (cb?: () => void) => void;
          };
        };
        exec?: (cb?: () => void) => void;
      };
    };
  };
  const queryFactory = host.uni?.createSelectorQuery;
  if (typeof queryFactory !== 'function') return;
  try {
    const query = queryFactory();
    const selection = query.select?.(`.sn-swipe-action__actions--${side}`);
    const measured = selection?.boundingClientRect?.((rect) => {
      const width = rect?.width;
      if (typeof width === 'number' && width > 0) {
        openDistance.value = { ...openDistance.value, [side]: width };
      }
    });
    // `boundingClientRect` already returns the chainable node on most targets;
    // fall back to the query itself when it does not.
    const chain = measured ?? query;
    chain.exec?.();
  } catch {
    // Measurement is best-effort; the fallback width keeps the row usable.
  }
}

/**
 * Move the row to `next`.
 *
 * `reason` decides what `before-close` receives; an absent guard always
 * allows the move.
 */
async function settle(next: SwipeActionStatus, reason: SwipeActionReason): Promise<boolean> {
  if (next === status.value) return false;
  if (next === 'close' && props.beforeClose) {
    const position: SwipeActionPosition = status.value === 'left' ? 'left' : 'right';
    let allowed = false;
    try {
      allowed = await props.beforeClose(reason, position);
    } catch {
      // A throwing guard is treated as a rejection: keep the row open.
      allowed = false;
    }
    if (!allowed) return false;
  }
  clearTimer();
  const token = ++generation;
  isDragging.value = false;
  dragOffset.value = 0;
  status.value = next;
  emit('update:modelValue', next);
  isAnimating.value = true;
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    isAnimating.value = false;
  }, DEFAULT_DURATION);
  return true;
}

onBeforeUnmount(clearTimer);

/** Close the row imperatively (wd `close` method parity). */
function close(
  reason: SwipeActionReason = 'other',
  position?: SwipeActionPosition,
): Promise<boolean> {
  if (position !== undefined && status.value !== position) return Promise.resolve(false);
  return settle('close', reason);
}

defineExpose({ close });

/** Read the first touch point out of a uni / DOM touch event. */
function touchPoint(event: Event): { x: number; y: number } {
  const detail = event as unknown as {
    touches?: Array<{ clientX?: number; clientY?: number }>;
    changedTouches?: Array<{ clientX?: number; clientY?: number }>;
  };
  const list = detail.touches ?? detail.changedTouches;
  const point = list && list.length > 0 ? list[0] : undefined;
  return {
    x: typeof point?.clientX === 'number' ? point.clientX : 0,
    y: typeof point?.clientY === 'number' ? point.clientY : 0,
  };
}

/** Clamp a drag to the sides that actually have an action area. */
function clampToAvailable(dx: number): number {
  if (dx > 0 && !hasLeft.value) return 0;
  if (dx < 0 && !hasRight.value) return 0;
  const limit = dx > 0 ? openDistance.value.left : openDistance.value.right;
  return Math.min(Math.max(dx, -limit), limit);
}

function onTouchStart(event: Event): void {
  if (props.disabled) return;
  if (!hasLeft.value && !hasRight.value) return;
  const point = touchPoint(event);
  startX = point.x;
  startY = point.y;
  tracking = false;
  rejected = false;
  dragOffset.value = 0;
  isDragging.value = true;
  if (hasLeft.value) measureSide('left');
  if (hasRight.value) measureSide('right');
}

function onTouchMove(event: Event): void {
  if (!isDragging.value || props.disabled) return;
  const point = touchPoint(event);
  const dx = point.x - startX;
  const dy = point.y - startY;
  if (rejected) return;
  if (!tracking) {
    // Decide once: a mostly-vertical gesture belongs to the page scroll.
    if (Math.abs(dy) > Math.abs(dx)) {
      rejected = true;
      isDragging.value = false;
      return;
    }
    if (Math.abs(dx) < 2) return;
    tracking = true;
  }
  // Keep the page from scrolling while the row follows the finger.
  event.preventDefault();
  dragOffset.value = clampToAvailable(dx);
}

function onTouchEnd(): void {
  if (!isDragging.value) return;
  isDragging.value = false;
  const travelled = dragOffset.value;
  dragOffset.value = 0;
  if (!tracking) return;
  if (travelled < 0 && hasRight.value) {
    void settle('right', 'swipe');
    return;
  }
  if (travelled > 0 && hasLeft.value) {
    void settle('left', 'swipe');
    return;
  }
  void settle('close', 'swipe');
}

/** `touchcancel` — a system gesture took the touch; settle closed. */
function onTouchCancel(): void {
  if (!isDragging.value) return;
  isDragging.value = false;
  dragOffset.value = 0;
  void settle('close', 'other');
}

/** Tap on the content area while the row is open — close and report it. */
function onContentTap(): void {
  if (status.value === 'close') return;
  const position: SwipeActionPosition = status.value === 'left' ? 'left' : 'right';
  void settle('close', 'click').then((closed) => {
    if (closed) emit('click', { reason: 'click', position });
  });
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-swipe-action',
  {
    'sn-swipe-action--open': isOpen.value,
    'sn-swipe-action--dragging': isDragging.value,
    'sn-swipe-action--animating': isAnimating.value,
    'sn-swipe-action--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle || undefined);

/** Distance the row sits from rest, in design px. */
const offset = computed(() => {
  if (isDragging.value) return dragOffset.value;
  if (status.value === 'left') return openDistance.value.left;
  if (status.value === 'right') return -openDistance.value.right;
  return 0;
});

/** Content offset (`1 design px = 2rpx`). */
const contentStyle = computed(() => `transform: translateX(${offset.value * 2}rpx)`);
</script>

<template>
  <view
    data-snui-component="swipe-action"
    :class="rootClass"
    :style="rootStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchCancel"
  >
    <view
      v-if="hasLeft"
      ref="leftActionsRef"
      class="sn-swipe-action__actions sn-swipe-action__actions--left"
    >
      <slot name="left" />
    </view>

    <view
      class="sn-swipe-action__content"
      :style="contentStyle"
      role="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @tap="onContentTap"
    >
      <slot />
    </view>

    <view
      v-if="hasRight"
      ref="rightActionsRef"
      class="sn-swipe-action__actions sn-swipe-action__actions--right"
    >
      <slot name="right" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-swipe-action {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  background-color: var(--sn-mp-color-background-elevated);
}

/* ── Action areas ──────────────────────────────────────────────────────── */

.sn-swipe-action__actions {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.sn-swipe-action__actions--left {
  left: 0;
}

.sn-swipe-action__actions--right {
  right: 0;
}

/* ── Content ───────────────────────────────────────────────────────────── */

.sn-swipe-action__content {
  position: relative;
  z-index: 1;
  display: block;
  box-sizing: border-box;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  will-change: transform;
}

/* The transition only runs while settling — during a drag the row must follow
 * the finger 1:1. */
.sn-swipe-action--animating .sn-swipe-action__content {
  transition: transform 200ms ease;
}

.sn-swipe-action--disabled .sn-swipe-action__content {
  color: var(--sn-mp-color-text-disabled);
}

/* Doodle skin — hand-drawn separator. */
.snui-skin-doodle .sn-swipe-action {
  border-bottom: 4rpx solid var(--sn-mp-color-text-primary);
}
</style>
