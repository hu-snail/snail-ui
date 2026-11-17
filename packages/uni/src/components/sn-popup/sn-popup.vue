<script setup lang="ts">
/**
 * sn-popup (uni-end) — positioned popup layer for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-popup`
 *   (https://wot-ui.cn/component/popup.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-popup 1:1
 * (same prop names, defaults, controlled semantics). Anything new added
 * here MUST also be added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-popup/sn-popup.vue
 * → auto-registered as `<sn-popup>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Documented divergences from wd-popup
 *
 *   - `root-portal` is not implemented. uni-app miniprogram has no portal
 *     host, so a popup inside a `position: fixed` ancestor cannot be
 *     reparented to the page root — the host page must not wrap the popup in
 *     a transformed container. Documented as "未实现" on the docs page.
 *   - `transition` accepts the wd-transition animation names, but the
 *     implementation is a single keyframe pair per name played in reverse for
 *     the leave leg (no separate wd-transition component).
 *
 * ## Additive: `draggable` grabber (AGENTS.md §112.3a — wd-popup has no drag
 * handle)
 *
 *   - `draggable` renders a grabber bar at the top center of the panel and
 *     lets a downward drag on it close the sheet. Only `position="bottom"`
 *     gains the handle — the geometry of the other anchors has no natural
 *     "pull down to dismiss" direction, so the prop is inert there.
 *   - While the finger is down the panel follows it through an inline
 *     transform (transition off); on release past the distance/velocity
 *     threshold the sheet closes, otherwise it springs back. The keyframe
 *     animation class is gated to enter/leave legs so it never fights the
 *     inline drag transform (`animation-fill-mode: both` would otherwise pin
 *     the panel at `translateY(0)` and swallow the gesture).
 *
 * ## Background scroll lock (AGENTS.md §41 / uni has no `document`)
 *
 * The scrim intercepts `touchmove` and calls `preventDefault()` while
 * `lockScroll` is on. No global listener is registered, so nothing leaks: the
 * only disposable resource is the animation timer below, cleared in
 * `onBeforeUnmount`.
 *
 * Usage:
 *   <sn-popup v-model="visible" position="bottom" round>内容</sn-popup>
 *
 * Not responsible for:
 *   - 纯遮罩（无面板）— 用 sn-overlay
 *   - 居中的确认框 / 业务对话框 — 用 sn-dialog
 *   - 页面级路由跳转 — 由宿主 AppBridge 决定
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnPopup' });

/** Popup anchor. Mirrors `wd-popup` `position`. */
type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';

/** Animation name. Subset of the `wd-transition` names that wd-popup accepts. */
type PopupTransition =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out';

/** `wd-popup` `duration`: number of ms, `false` = no animation, record = per-leg. */
type PopupDuration = number | boolean | Record<string, number>;

const DEFAULT_DURATION = 300;

const props = withDefaults(
  defineProps<{
    /** Whether the popup is visible (v-model). */
    modelValue?: boolean;
    /** Animation name; empty falls back to the default for `position`. */
    transition?: PopupTransition | '';
    /** Show the close button in the panel's top-right corner. */
    closable?: boolean;
    /**
     * Render the drag handle at the top center of a bottom sheet; pulling it
     * down past the threshold closes the popup. Bottom position only — the
     * other anchors have no natural dismiss direction.
     */
    draggable?: boolean;
    /** Anchor of the panel. */
    position?: PopupPosition;
    /** Tapping the scrim closes the popup (emits `click-modal` either way). */
    closeOnClickModal?: boolean;
    /** Animation duration in ms. `false` = no animation, record = per-leg. */
    duration?: PopupDuration;
    /** Render the scrim. */
    modal?: boolean;
    /** Stacking level of the root node. */
    zIndex?: number;
    /** Remove the node from the tree once the leave animation finished. */
    hideWhenClose?: boolean;
    /** Inline style for the scrim. */
    modalStyle?: string;
    /** Pad the bottom sheet for the device safe area. */
    safeAreaInsetBottom?: boolean;
    /** Defer panel content rendering until the popup is first opened. */
    lazyRender?: boolean;
    /** Intercept touchmove on the scrim so the page behind cannot scroll. */
    lockScroll?: boolean;
    /** Rounded corners, adapted to `position`. */
    round?: boolean;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the panel. */
    customStyle?: string;
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the layer cannot leave the page's document flow.
     */
    rootPortal?: boolean;
  }>(),
  {
    modelValue: false,
    transition: '',
    closable: false,
    draggable: false,
    position: 'center',
    closeOnClickModal: true,
    duration: DEFAULT_DURATION,
    modal: true,
    zIndex: 10,
    hideWhenClose: true,
    modalStyle: '',
    safeAreaInsetBottom: false,
    lazyRender: true,
    lockScroll: true,
    round: false,
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
);

defineSlots<{
  /** Panel content. */
  default?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'click-modal'): void;
  (e: 'before-enter'): void;
  (e: 'enter'): void;
  (e: 'after-enter'): void;
  (e: 'before-leave'): void;
  (e: 'leave'): void;
  (e: 'after-leave'): void;
}>();

/** Resolve the duration for one animation leg. */
function resolveDuration(value: PopupDuration, leg: 'enter' | 'leave'): number {
  if (value === false) return 0;
  if (value === true) return DEFAULT_DURATION;
  if (typeof value === 'number') return value;
  const legValue = value[leg] ?? value.enter ?? value.leave;
  return typeof legValue === 'number' ? legValue : DEFAULT_DURATION;
}

/** Node present in the tree. */
const isMounted = ref(props.modelValue);
/**
 * Panel content has been rendered at least once. `lazyRender` defers the very
 * first render until the popup is shown; already-open on mount counts as
 * shown, so an eager (`lazyRender: false`) popup renders straight away.
 */
const hasRendered = ref(props.modelValue || !props.lazyRender);
/** Animation leg currently playing. `none` = at rest. */
const phase = ref<'none' | 'enter' | 'leave'>('none');
/** Duration of the current leg (exposed to CSS as a custom property). */
const durationMs = ref(resolveDuration(props.duration, 'enter'));

/** Single pending animation timer (cleared on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * Animation generation. `enter()` awaits a tick before emitting `enter`, so a
 * close that lands inside that window would otherwise have its leave timer
 * overwritten by the resumed enter leg — the node would stay mounted forever
 * and `after-leave` would never fire. Every leg bumps the token and drops its
 * result when a newer leg has started.
 */
let generation = 0;

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

/* ── Draggable grabber (additive, `position="bottom"` only) ─────────────── */

/** Distance (px) past which a release closes the sheet. */
const DRAG_CLOSE_DISTANCE = 80;
/** Release velocity (px/ms) above which a drag closes even under the distance. */
const DRAG_FLING_VELOCITY = 0.6;

/** Drag gesture leg. `closing` owns the leave leg until `finishLeave`. */
const dragState = ref<'idle' | 'dragging' | 'settling' | 'closing'>('idle');
/** Current drag offset in px — applied to the panel as an inline transform. */
const dragY = ref(0);
/** The running leave leg was started by a drag release (skip the keyframes). */
let leaveFromDrag = false;
/**
 * Set while the close emitted from a drag release is still in flight — the
 * controlled `v-model` sync arrives through the watcher one flush later and
 * must not start a second leave leg on top of it. Cleared after the flush.
 */
let dragClosePending = false;
/** Gesture origin Y (px). */
let dragStartY = 0;
/** Drag offset when the gesture started (resume an interrupted settle). */
let dragStartOffset = 0;
/** Previous move sample (px, ms) — the fling velocity comes from the last segment. */
let dragPrevY = 0;
let dragPrevTs = 0;
/** Velocity (px/ms) of the latest move segment. */
let dragVelocity = 0;

function resetDrag(): void {
  dragState.value = 'idle';
  dragY.value = 0;
  leaveFromDrag = false;
}

/** Read the vertical point out of a uni / DOM touch event (§floating-panel). */
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

function onGrabberTouchStart(event: Event): void {
  // Only a resting sheet may be grabbed — an enter/leave leg owns the panel.
  if (phase.value !== 'none' || !props.modelValue) return;
  clearTimer();
  generation += 1; // a settle in flight is abandoned; the finger takes over
  dragStartY = touchY(event);
  dragStartOffset = dragY.value;
  dragPrevY = dragStartY;
  dragPrevTs = Date.now();
  dragVelocity = 0;
  dragState.value = 'dragging';
}

function onGrabberTouchMove(event: Event): void {
  if (dragState.value !== 'dragging') return;
  // Keep the gesture from scrolling the page behind the sheet.
  event.preventDefault();
  event.stopPropagation();
  const y = touchY(event);
  const now = Date.now();
  dragVelocity = Math.abs(y - dragPrevY) / Math.max(now - dragPrevTs, 1);
  dragPrevY = y;
  dragPrevTs = now;
  const dy = y - dragStartY + dragStartOffset;
  // Only downward drags move the sheet; an upward pull is resisted at rest.
  dragY.value = Math.max(dy, 0);
}

function onGrabberTouchEnd(): void {
  if (dragState.value !== 'dragging') return;
  const distance = dragY.value;
  if (distance >= DRAG_CLOSE_DISTANCE || dragVelocity >= DRAG_FLING_VELOCITY) beginDragClose();
  else settleBack();
}

/** Release under the threshold: transition the panel back to rest. */
function settleBack(): void {
  clearTimer();
  const token = ++generation;
  dragState.value = 'settling';
  dragY.value = 0;
  if (durationMs.value <= 0) {
    dragState.value = 'idle';
    return;
  }
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    dragState.value = 'idle';
  }, durationMs.value);
}

/** Release past the threshold: close from the dragged offset, no jump. */
function beginDragClose(): void {
  clearTimer();
  const token = ++generation;
  leaveFromDrag = true;
  dragState.value = 'closing';
  emit('before-leave');
  durationMs.value = resolveDuration(props.duration, 'leave');
  phase.value = 'leave';
  emit('leave');
  emit('update:modelValue', false);
  emit('close');
  if (durationMs.value <= 0) {
    finishLeave();
    return;
  }
  timer = setTimeout(() => {
    if (token !== generation) return;
    finishLeave();
  }, durationMs.value);
  // The watcher consumes the flag during this flush; drop it afterwards so a
  // later, unrelated close still runs a normal leg.
  void nextTick(() => {
    dragClosePending = false;
  });
}

/** Default animation for a position, mirroring the geometry of the anchor. */
function defaultTransition(): PopupTransition {
  switch (props.position) {
    case 'bottom':
      return 'slide-up';
    case 'top':
      return 'slide-down';
    case 'left':
      return 'slide-right';
    case 'right':
      return 'slide-left';
    default:
      return 'fade';
  }
}

const animationName = computed<PopupTransition>(() => props.transition || defaultTransition());

async function enter(): Promise<void> {
  clearTimer();
  const token = ++generation;
  resetDrag();
  emit('before-enter');
  durationMs.value = resolveDuration(props.duration, 'enter');
  isMounted.value = true;
  hasRendered.value = true;
  phase.value = 'enter';
  await nextTick();
  // A leave started while we were waiting for the tick — abandon this leg.
  if (token !== generation) return;
  emit('enter');
  if (durationMs.value <= 0) {
    phase.value = 'none';
    emit('after-enter');
    return;
  }
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    phase.value = 'none';
    emit('after-enter');
  }, durationMs.value);
}

function leave(): void {
  // Already fully closed (hideWhenClose unmounted the node) — a duplicate
  // close sync must not replay the exit leg.
  if (!isMounted.value && props.hideWhenClose) return;
  clearTimer();
  const token = ++generation;
  resetDrag();
  emit('before-leave');
  durationMs.value = resolveDuration(props.duration, 'leave');
  phase.value = 'leave';
  emit('leave');
  if (durationMs.value <= 0) finishLeave();
  else
    timer = setTimeout(() => {
      if (token !== generation) return;
      finishLeave();
    }, durationMs.value);
}

function finishLeave(): void {
  timer = null;
  phase.value = 'none';
  resetDrag();
  if (props.hideWhenClose) isMounted.value = false;
  emit('after-leave');
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      dragClosePending = false;
      void enter();
      return;
    }
    // A drag-initiated close already runs its own leave leg from the dragged
    // offset — the controlled sync of that same close must not start another.
    if (dragClosePending) {
      dragClosePending = false;
      return;
    }
    if (dragState.value !== 'closing') leave();
  },
);

onMounted(() => {
  // Already-open on first paint: render at rest, no enter events — the popup
  // was never "entered" from the consumer's point of view.
  if (props.modelValue) {
    isMounted.value = true;
    hasRendered.value = true;
  }
});

onBeforeUnmount(clearTimer);

/** Close requests coming from inside the component (close button / scrim). */
function requestClose(): void {
  emit('update:modelValue', false);
  emit('close');
}

function onModalTap(): void {
  emit('click-modal');
  if (props.closeOnClickModal) requestClose();
}

function onCloseTap(event: Event): void {
  // The close button sits inside the panel — stop the tap from reaching the
  // panel's own handlers (there are none today, but the containment keeps
  // the intent explicit for future ones).
  event.stopPropagation();
  requestClose();
}

/**
 * Intercept the gesture while `lockScroll` is on. Mirrors uni-app's
 * `catchtouchmove`: the event neither bubbles to the page nor scrolls it.
 */
function onTouchMove(event: Event): void {
  if (!props.lockScroll) return;
  event.preventDefault();
  event.stopPropagation();
}

const rootClass = computed(() => [
  'sn-popup',
  `sn-popup--${props.position}`,
  // Keyframes only while an enter/leave leg owns the panel. A rest state with
  // no animation lets the inline drag transform work (fill-mode `both` would
  // otherwise pin the panel at the `to` frame and swallow the gesture), and
  // re-adding the class on leave restarts it exactly from the rest position.
  ...(phase.value !== 'none' && !leaveFromDrag
    ? [`sn-popup--anim-${animationName.value}` as const]
    : []),
  {
    'sn-popup--round': props.round,
    'sn-popup--safe-bottom': props.safeAreaInsetBottom,
    'sn-popup--leaving': phase.value === 'leave',
    'sn-popup--dragging': dragState.value === 'dragging',
    'sn-popup--drag-settling': dragState.value === 'settling',
    'sn-popup--drag-closing': dragState.value === 'closing',
    'sn-popup--hidden': phase.value === 'none' && !props.modelValue && isMounted.value,
  },
  props.customClass,
]);

/** Bottom sheets with a grabber show the pull-down handle. */
const showGrabber = computed(() => props.draggable && props.position === 'bottom');

const rootStyle = computed(() =>
  [`z-index: ${props.zIndex}`, `--sn-popup-duration: ${durationMs.value}ms`].join('; '),
);

/** `custom-style` styles the panel itself (mirrors wd-popup `custom-style`). */
const panelStyle = computed(() => {
  const parts = [props.customStyle];
  if (dragState.value === 'dragging' || dragState.value === 'settling') {
    parts.push(`transform: translateY(${dragY.value}px)`);
  } else if (dragState.value === 'closing') {
    parts.push('transform: translateY(100%)');
  }
  return parts.filter(Boolean).join('; ') || undefined;
});

const modalStyle = computed(() => (props.modalStyle ? props.modalStyle : undefined));
</script>

<template>
  <view v-if="isMounted" data-snui-component="popup" :class="rootClass" :style="rootStyle">
    <view
      v-if="modal"
      class="sn-popup__modal"
      :style="modalStyle"
      aria-hidden="true"
      @tap="onModalTap"
      @touchmove="onTouchMove"
    />

    <view class="sn-popup__panel" :style="panelStyle" role="dialog" aria-modal="true">
      <view
        v-if="showGrabber"
        class="sn-popup__grabber"
        @touchstart="onGrabberTouchStart"
        @touchmove="onGrabberTouchMove"
        @touchend="onGrabberTouchEnd"
        @touchcancel="onGrabberTouchEnd"
      >
        <view class="sn-popup__grabber-bar" aria-hidden="true" />
      </view>
      <view
        v-if="closable"
        class="sn-popup__close"
        role="button"
        aria-label="close"
        @tap="onCloseTap"
      >
        <SnIcon :icon="XIcon" :size="32" />
      </view>
      <slot v-if="hasRendered" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* uni-app x App: do not rely on four-edge inset stretching — the official
   * position example's four-direction fixed element carries an explicit
   * width/height, and so does the device-verified sn-tabbar--fixed. For a
   * fixed element the containing block is the visible page on every target,
   * so `width/height: 100%` is the same fullscreen box on web / miniprogram
   * (width+height simply win over the opposing insets) and gives App an
   * explicit size. The insets stay as harmless redundancy. */
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
}

/* ── Anchor layout ─────────────────────────────────────────────────────── */

.sn-popup--center {
  align-items: center;
  justify-content: center;
}
.sn-popup--top {
  align-items: flex-start;
  justify-content: center;
}
.sn-popup--bottom {
  align-items: flex-end;
  justify-content: center;
}
.sn-popup--left {
  align-items: stretch;
  justify-content: flex-start;
}
.sn-popup--right {
  align-items: stretch;
  justify-content: flex-end;
}

/* ── Scrim ─────────────────────────────────────────────────────────────── */

.sn-popup__modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* uni-app x App: explicit size so the scrim fills the fullscreen root
   * without relying on absolute inset stretching (see .sn-popup). */
  width: 100%;
  height: 100%;
  /* Scrim token — dark-mode aware, no light fallback (§112 / CONTRIBUTING §6). */
  background-color: var(--sn-mp-color-background-overlay);
  animation: sn-popup-fade var(--sn-popup-duration) ease both;
}

/* ── Panel ─────────────────────────────────────────────────────────────── */

.sn-popup__panel {
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  /* Elevated surface token: flips to the dark elevated surface in dark mode. */
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-size: 28rpx;
  line-height: var(--sn-mp-font-line-height-normal);
  /* Float the layer off the page (same slot as sn-fab / sn-floating-panel). */
  box-shadow: var(--sn-mp-shadow-lg);
  animation-duration: var(--sn-popup-duration);
  /* Enter leg: decelerate into place — a sheet that rises fast then glides
   * to rest reads natural; a symmetric `ease` reads mechanical. */
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: both;
}

.sn-popup--center .sn-popup__panel {
  width: 640rpx;
  padding: 40rpx;
}

.sn-popup--top .sn-popup__panel,
.sn-popup--bottom .sn-popup__panel {
  width: 100%;
  padding: 40rpx 32rpx;
}

.sn-popup--left .sn-popup__panel,
.sn-popup--right .sn-popup__panel {
  width: 520rpx;
  padding: 40rpx 32rpx;
}

/* ── Round corners, adapted to the anchor (mirrors wd-popup `round`) ───── */

.sn-popup--round.sn-popup--center .sn-popup__panel {
  border-radius: var(--sn-mp-radius-xl);
}
.sn-popup--round.sn-popup--bottom .sn-popup__panel {
  border-top-left-radius: var(--sn-mp-radius-xl);
  border-top-right-radius: var(--sn-mp-radius-xl);
}
.sn-popup--round.sn-popup--top .sn-popup__panel {
  border-bottom-left-radius: var(--sn-mp-radius-xl);
  border-bottom-right-radius: var(--sn-mp-radius-xl);
}
.sn-popup--round.sn-popup--left .sn-popup__panel {
  border-top-right-radius: var(--sn-mp-radius-xl);
  border-bottom-right-radius: var(--sn-mp-radius-xl);
}
.sn-popup--round.sn-popup--right .sn-popup__panel {
  border-top-left-radius: var(--sn-mp-radius-xl);
  border-bottom-left-radius: var(--sn-mp-radius-xl);
}

/* Safe area for bottom sheets — env() is a platform inset, not a color. */
.sn-popup--safe-bottom .sn-popup__panel {
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

/* ── Close button ─────────────────────────────────────────────────────── */

.sn-popup__close {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  color: var(--sn-mp-color-text-secondary);
  z-index: 1;
}

/* ── Drag handle (additive `draggable`, bottom sheets) ─────────────────── */

.sn-popup__grabber {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Full-width hit zone riding the panel's top padding; the bar itself is a
   * narrow centered pill. */
  height: 48rpx;
  margin: -16rpx 0 8rpx;
}

.sn-popup__grabber-bar {
  width: 64rpx;
  height: 8rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-border-default);
}

/* ── Animations ─────────────────────────────────────────────────────────
 * One keyframe pair per name: the enter leg plays it forwards, the leave leg
 * plays the same keyframe in reverse — so enter / leave stay symmetric
 * without duplicating every keyframe.
 */

.sn-popup--anim-fade .sn-popup__panel {
  animation-name: sn-popup-fade;
}
.sn-popup--anim-fade-up .sn-popup__panel {
  animation-name: sn-popup-fade-up;
}
.sn-popup--anim-fade-down .sn-popup__panel {
  animation-name: sn-popup-fade-down;
}
.sn-popup--anim-fade-left .sn-popup__panel {
  animation-name: sn-popup-fade-left;
}
.sn-popup--anim-fade-right .sn-popup__panel {
  animation-name: sn-popup-fade-right;
}
.sn-popup--anim-slide-up .sn-popup__panel {
  animation-name: sn-popup-slide-up;
}
.sn-popup--anim-slide-down .sn-popup__panel {
  animation-name: sn-popup-slide-down;
}
.sn-popup--anim-slide-left .sn-popup__panel {
  animation-name: sn-popup-slide-left;
}
.sn-popup--anim-slide-right .sn-popup__panel {
  animation-name: sn-popup-slide-right;
}
.sn-popup--anim-zoom-in .sn-popup__panel {
  animation-name: sn-popup-zoom-in;
}
.sn-popup--anim-zoom-out .sn-popup__panel {
  animation-name: sn-popup-zoom-out;
}

.sn-popup--leaving .sn-popup__panel,
.sn-popup--leaving .sn-popup__modal {
  animation-direction: reverse;
}

/* Leave leg: accelerate away (the reverse of an ease-out enter starts fast
 * and stalls — an exit should start slow and commit). */
.sn-popup--leaving .sn-popup__panel,
.sn-popup--leaving .sn-popup__modal {
  animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

/* ── Drag gesture legs ───────────────────────────────────────────────────
 * While the finger is down the panel tracks it with no transition; on
 * release the same inline transform is animated by a transition — settle
 * decelerates back to rest, close accelerates off-screen (mirrors the
 * keyframe legs above).
 */

.sn-popup--dragging .sn-popup__panel {
  transition: none;
}

.sn-popup--drag-settling .sn-popup__panel {
  transition: transform var(--sn-popup-duration) cubic-bezier(0.22, 1, 0.36, 1);
}

.sn-popup--drag-closing .sn-popup__panel {
  transition: transform var(--sn-popup-duration) cubic-bezier(0.4, 0, 1, 1);
}

/* At rest: no animation, node parked off-screen for `hideWhenClose=false`. */
.sn-popup--hidden {
  visibility: hidden;
  pointer-events: none;
}
.sn-popup--hidden .sn-popup__panel,
.sn-popup--hidden .sn-popup__modal {
  animation: none;
}

@keyframes sn-popup-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes sn-popup-fade-up {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes sn-popup-fade-down {
  from {
    opacity: 0;
    transform: translateY(-24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes sn-popup-fade-left {
  from {
    opacity: 0;
    transform: translateX(24rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes sn-popup-fade-right {
  from {
    opacity: 0;
    transform: translateX(-24rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes sn-popup-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes sn-popup-slide-down {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes sn-popup-slide-left {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes sn-popup-slide-right {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes sn-popup-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes sn-popup-zoom-out {
  from {
    opacity: 0;
    transform: scale(1.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
