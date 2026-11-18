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
 * The row drags from where it actually sits: the content offset at
 * `touchstart` is captured as the drag base, so touching an open row does not
 * snap it shut and the finger position maps 1:1 onto the row position. On
 * release the settle decision is:
 *
 *   1. an open row dragged back towards rest (same side, past the minimum
 *      travel) closes first — without this rule a row carrying both slots
 *      flipped sides on any opposite drag;
 *   2. past the open threshold (30% of the side's distance, min 24px) — or
 *      dragged across the centre onto the other side — settles that side;
 *   3. a flick (≥0.5 px/ms) settles the side it points at even below the
 *      threshold;
 *   4. everything else springs back closed.
 *
 * Small drags therefore spring back instead of fully opening — the row only
 * commits past the threshold, which is what keeps the mid-drag reveal states
 * (button peeking from under the card) stable.
 *
 * ## Why the component paints no background
 *
 * The mechanic is background-free: the sliding content and the action areas
 * are whatever the consumer puts in the slots. This is what enables the
 * floating-card form — content paints a rounded card, the revealed area shows
 * the page canvas between the card and the pill buttons. Classic full-bleed
 * rows keep working by painting the surface on the slot content itself.
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
 * ## Why the action areas carry a hidden transform when the row is closed
 *
 * The closed row used to rely on the content layer (opaque background +
 * `z-index`) painting over the action areas. That premise does not hold on
 * uni-app x App: native rounding / stacking leaves a 1–2px sliver of the
 * action area leaking at the row edges with the row fully closed (device
 * report). While nothing is exposed — no drag, no settle animation, no open
 * side — the areas are therefore translated fully outside the root's
 * `overflow: hidden` clip, which makes the closed state deterministic and
 * independent of paint order on every end. The offset is a percentage of the
 * area's own width so a failed / fallback measurement can never leave part of
 * it inside the row.
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
 *   - The settle uses a travel threshold + flick instead of committing on
 *     every horizontal travel: small drags spring back closed.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One settle timer runs the open / closed transition and one generation token
 * drops a stale leg. Both are cleared in `onBeforeUnmount`. The timer length
 * must stay in sync with the CSS transition on
 * `.sn-swipe-action__content--animating` (both derive from
 * `DEFAULT_DURATION`).
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

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import { registerOutsideClosable, unregisterOutsideClosable } from '../../utils/outside-close';
import { resolveUniHost } from '../../utils/uni-host';

defineOptions({ name: 'SnSwipeAction' });

const instanceId = getCurrentInstance()?.uid ?? 0;
// Outside-close queue: a page-root `@tap="closeOutside"` closes this too.
onMounted(() =>
  registerOutsideClosable(instanceId, () => {
    void close();
  }),
);
onBeforeUnmount(() => unregisterOutsideClosable(instanceId));

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

/** Row open / close animation length in ms (settle timer + CSS transition). */
const DEFAULT_DURATION = 300;

/** Drag past this fraction of the side's open distance settles that side. */
const OPEN_THRESHOLD_RATIO = 0.3;

/** Minimum travel (px) that can settle a side open or an open row closed. */
const SETTLE_MIN_TRAVEL = 24;

/** A flick at or above this speed (px/ms) settles the side it points at. */
const FLICK_VELOCITY = 0.5;

/** Floor (ms) for the gesture duration when computing flick speed. */
const FLICK_DURATION_FLOOR = 40;

/** Minimum travel (px) a flick still settles. */
const FLICK_MIN_TRAVEL = 8;

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
/** Timestamp of the gesture start — feeds the flick-speed estimate. */
let startAt = 0;
/** Last seen touch x — the flick speed runs from the origin to this. */
let lastX = 0;
/** The gesture was recognised as horizontal and is being tracked. */
let tracking = false;
/** The gesture was rejected as a vertical scroll. */
let rejected = false;
/** Content offset (px) at gesture start: the open side's distance, 0 closed. */
let baseOffset = 0;

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
  const queryFactory = resolveUniHost<{
    createSelectorQuery?: () => {
      in?: (component: unknown) => unknown;
      select?: (selector: string) => {
        boundingClientRect?: (cb: (rect: { width?: number } | null) => void) => {
          exec?: (cb?: () => void) => void;
        };
      };
      exec?: (cb?: () => void) => void;
    };
  }>()?.createSelectorQuery;
  if (typeof queryFactory !== 'function') return;
  try {
    const query = queryFactory();
    // Scope to this component instance: without `.in()` a mini-program page
    // resolves the selector against the PAGE, so every row in a list measures
    // the first row's action width.
    const scoped = (query.in?.(getCurrentInstance()?.proxy) as typeof query | undefined) ?? query;
    const selection = scoped.select?.(`.sn-swipe-action__actions--${side}`);
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

/** Content offset for a status — the settle target the transition lands on. */
function openOffsetFor(value: SwipeActionStatus): number {
  if (value === 'left') return openDistance.value.left;
  if (value === 'right') return -openDistance.value.right;
  return 0;
}

/** Clamp a dragged offset to the sides that actually have an action area. */
function clampOffset(value: number): number {
  const min = hasRight.value ? -openDistance.value.right : 0;
  const max = hasLeft.value ? openDistance.value.left : 0;
  return Math.min(Math.max(value, min), max);
}

/** Travel (px) past which the `side` area settles open. */
function openThreshold(side: SwipeActionPosition): number {
  return Math.max(SETTLE_MIN_TRAVEL, openDistance.value[side] * OPEN_THRESHOLD_RATIO);
}

/**
 * Decide the settle target from where the drag ended and how fast it moved.
 *
 * Order matters: the back-drag rule (1) must run before the threshold rules
 * (2), otherwise an open row dragged back towards rest but not yet past the
 * threshold reads as "still open" and never closes. The same-side check keeps
 * a drag that crossed the centre eligible for the flip in (2).
 */
function decideSettle(final: number, velocity: number): SwipeActionStatus {
  // (1) An open row dragged back towards rest closes — an opposite drag is
  // closing intent first, a side flip only once it crosses the centre.
  if (status.value !== 'close' && final * baseOffset > 0) {
    if (Math.abs(baseOffset) - Math.abs(final) >= SETTLE_MIN_TRAVEL) return 'close';
  }
  // (2) Past the open threshold, or flipped across the centre to the other side.
  if (hasLeft.value && final >= openThreshold('left')) return 'left';
  if (hasRight.value && final <= -openThreshold('right')) return 'right';
  // (3) A flick settles the side it points at even below the threshold.
  if (velocity >= FLICK_VELOCITY && hasLeft.value && final >= FLICK_MIN_TRAVEL) return 'left';
  if (velocity <= -FLICK_VELOCITY && hasRight.value && final <= -FLICK_MIN_TRAVEL) return 'right';
  // (4) Everything else springs back closed.
  return 'close';
}

function onTouchStart(event: Event): void {
  if (props.disabled) return;
  if (!hasLeft.value && !hasRight.value) return;
  const point = touchPoint(event);
  startX = point.x;
  startY = point.y;
  lastX = point.x;
  startAt = Date.now();
  tracking = false;
  rejected = false;
  // Drag from where the row actually sits. Starting from 0 made every touch
  // on an open row snap the content shut before the first move arrived.
  baseOffset = openOffsetFor(status.value);
  dragOffset.value = baseOffset;
  isDragging.value = true;
  if (hasLeft.value) measureSide('left');
  if (hasRight.value) measureSide('right');
}

function onTouchMove(event: Event): void {
  if (!isDragging.value || props.disabled) return;
  const point = touchPoint(event);
  const dx = point.x - startX;
  const dy = point.y - startY;
  lastX = point.x;
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
  dragOffset.value = clampOffset(baseOffset + dx);
}

function onTouchEnd(): void {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (!tracking) return;
  const final = dragOffset.value;
  const duration = Math.max(Date.now() - startAt, FLICK_DURATION_FLOOR);
  const velocity = (lastX - startX) / duration;
  void settle(decideSettle(final, velocity), 'swipe');
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

/** Content offset in px. The measured open distance and the touch deltas are
 * both px, so the value is applied as-is — the previous `* 2rpx` conversion
 * assumed a 375px viewport and over-slid the row on wider screens (content
 * clipped while the action area was already fully visible). */
const contentStyle = computed(() => `transform: translateX(${offset.value}px)`);

/**
 * The action areas must sit inside the row while a gesture tracks, a settle
 * transition runs, or a side is open — otherwise (the closed rest state) they
 * are translated out of the root clip. See the header note for why the closed
 * state may not rely on the content layer covering them.
 */
const isActionsExposed = computed(
  () => isDragging.value || isAnimating.value || isOpen.value,
);

/** Left area parked outside the left edge; `undefined` restores its CSS spot. */
const leftActionsStyle = computed(() =>
  isActionsExposed.value ? undefined : 'transform: translateX(-100%)',
);

/** Right area parked outside the right edge; `undefined` restores its CSS spot. */
const rightActionsStyle = computed(() =>
  isActionsExposed.value ? undefined : 'transform: translateX(100%)',
);
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
      :style="leftActionsStyle"
    >
      <slot name="left" />
    </view>

    <view
      class="sn-swipe-action__content"
      :class="{ 'sn-swipe-action__content--animating': isAnimating }"
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
      :style="rightActionsStyle"
    >
      <slot name="right" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

/* Background-free by design: surfaces belong to the slot content (see the
 * header note) — a root background would paint behind the gaps between the
 * consumer's card and its pill actions. */

.sn-swipe-action {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
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
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* The transition only runs while settling — during a drag the row must follow
 * the finger 1:1. Spring-feel deceleration curve; the duration is duplicated
 * by the settle timer via DEFAULT_DURATION. Kept as a single-class rule (the
 * uni-app x transform only keeps class selectors). */
.sn-swipe-action__content--animating {
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.sn-swipe-action--disabled .sn-swipe-action__content {
  color: var(--sn-mp-color-text-disabled);
}

/* Doodle skin — hand-drawn separator. */
.snui-skin-doodle .sn-swipe-action {
  border-bottom: 4rpx solid var(--sn-mp-color-text-primary);
}
</style>
