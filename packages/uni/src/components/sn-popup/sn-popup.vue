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
  clearTimer();
  const token = ++generation;
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
  if (props.hideWhenClose) isMounted.value = false;
  emit('after-leave');
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) void enter();
    else leave();
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
  `sn-popup--anim-${animationName.value}`,
  {
    'sn-popup--round': props.round,
    'sn-popup--safe-bottom': props.safeAreaInsetBottom,
    'sn-popup--leaving': phase.value === 'leave',
    'sn-popup--hidden': phase.value === 'none' && !props.modelValue && isMounted.value,
  },
  props.customClass,
]);

const rootStyle = computed(() =>
  [`z-index: ${props.zIndex}`, `--sn-popup-duration: ${durationMs.value}ms`].join('; '),
);

/** `custom-style` styles the panel itself (mirrors wd-popup `custom-style`). */
const panelStyle = computed(() => (props.customStyle ? props.customStyle : undefined));

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
  animation-duration: var(--sn-popup-duration);
  animation-timing-function: ease;
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
