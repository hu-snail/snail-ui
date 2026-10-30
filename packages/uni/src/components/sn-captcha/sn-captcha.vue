<script setup lang="ts">
/**
 * sn-captcha (uni-end) — jigsaw slider captcha (拼图验证).
 *
 * Reference library: lime-ui `l-captcha`
 *   (https://limeuix.qcoon.cn/components/captcha)
 * Per AGENTS.md §112 the prop surface here is a documented **subset with
 * divergences**, not a 1:1 mirror:
 *
 *   - v-model controls visibility (lime's `v-model` is the same semantic).
 *   - `src` / `width` / `height` / `tips` / `zIndex` / `tolerance` keep the
 *     lime names & defaults where they exist.
 *   - NO canvas: lime slices the puzzle hole out of the image with a canvas;
 *     miniprogram canvas quirks (layering, Same-origin taint on H5) make that
 *     the least portable path. Here the hole is a translucent dashed socket
 *     and the piece shows the *source slice* at the target position (CSS
 *     translate of a full-bleed `<image>` inside an overflow-hidden box), so
 *     alignment still reads as a seamless fit — on H5 and MP alike.
 *   - `refresh` is built in (lime exposes it via a slot button); the piece
 *     drags horizontally only, like lime.
 *
 * Interaction: touch handlers on the piece (same pattern as sn-slide-verify,
 * directly unit-testable) plus a **desktop H5 mouse drag** bound only while the
 * popup is open (`bindHorizontalDragMouse`, additive — AUI-OPT-12, AGENTS.md
 * §112.3a). A desktop browser does not turn mouse drags into touch events, so
 * touch-only input left the piece dead in the docs preview. Release inside
 * `tolerance` design px of the target → success (emit + auto close), otherwise
 * fail (emit + shake + snap back).
 *
 * ## Measurement (the "不能真正滑动" fix)
 *
 * `maxOffset` is the travel range, so a zero stage width freezes the piece at
 * x = 0 — the piece could not be dragged anywhere. Two host realities made the
 * old `getBoundingClientRect()` measurement silently return nothing:
 *
 *   - **uni H5 wraps `<view>` in a component**, so a template ref resolves to
 *     the component instance whose node lives on `$el`; measuring the instance
 *     proxy misses (same unwrap as `sn-picker-view`).
 *   - **Mini-programs have no DOM at all**; the layout must be queried through
 *     `uni.createSelectorQuery()`.
 *
 * `init()` covers both paths (DOM first, query as the cross-end fallback) and
 * falls back to the `width` prop as the travel base when a host cannot measure
 * at all (AGENTS.md §85).
 *
 * ## Coordinate scale (the "对不齐" fix)
 *
 * `offset` / `target.x` are **design px** (`1 design px = 2rpx`), while a
 * pointer delta arrives in **CSS px**. `pxPerDesign()` (shared with
 * `sn-slide-verify`) converts deltas and measured boxes into design px with
 * uni's own `rpx` rule — effective viewport capped at 960px, base 375px — so
 * the piece tracks the pointer 1:1 at any viewport instead of overshooting or
 * lagging.
 *
 * Timers (AGENTS.md §41): one success timer (auto close) and one fail shake
 * timer; both cleared in `onBeforeUnmount`. The mouse helper owns its own
 * document listeners and is disposed on close / unmount — nothing leaks.
 *
 * Usage:
 *   <sn-captcha v-model="show" src="https://…/bg.jpg" @success="onPass" />
 *
 * Not responsible for: 行为式验证（滑块 sn-slide-verify）、图形验证码输入框
 * （host 业务）、服务端校验（host 必须）。
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { RefreshCw as RefreshIcon, X as XIcon } from '../sn-icon/sn-icon-set';
import { bindHorizontalDragMouse, pxPerDesign, resolveNodeEl } from './sn-captcha-mouse';

defineOptions({ name: 'SnCaptcha' });

const props = withDefaults(
  defineProps<{
    /** Whether the captcha popup is shown (v-model). */
    modelValue?: boolean;
    /** Background image URL (network / package path, not base64). */
    src?: string;
    /** Stage width in design px; the box fills its container up to this. */
    width?: number;
    /** Stage height in design px. */
    height?: number;
    /** Hint text under the stage while dragging. */
    tips?: string;
    /** Success text overlay. */
    successText?: string;
    /** Snap tolerance around the target X (px design units). */
    tolerance?: number;
    /** Stacking level of the popup. */
    zIndex?: number;
    /** Close the popup when the scrim is tapped. */
    closeOnClickModal?: boolean;
    /** Show the re-roll button (top-right of the stage). */
    refreshable?: boolean;
    /**
     * Render embedded in the host layout instead of as a fixed popup —
     * no scrim, no close button, no auto close (additive, AUI-OPT-12,
     * AGENTS.md §112.3a). `v-model` is ignored; the host controls mounting.
     */
    inline?: boolean;
    /** Extra class on the root node. */
    customClass?: string;
    /** Extra inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: false,
    src: '',
    width: 300,
    height: 200,
    tips: '',
    successText: '',
    tolerance: 10,
    zIndex: 100,
    closeOnClickModal: true,
    refreshable: true,
    inline: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
  (e: 'fail'): void;
  (e: 'refresh'): void;
  (e: 'close'): void;
}>();

/* ── Geometry (px design units; 1px = 2rpx) ────────────────────────────── */

/** Puzzle piece edge, px design units. */
const PIECE = 44;
/** Piece travel range as a fraction of the inner width. */
const X_MIN = 0.45;
const X_MAX = 0.85;
/** Piece row range as a fraction of the inner height. */
const Y_MIN = 0.2;
const Y_MAX = 0.6;

/** Stage box width in design px; 0 while unmeasured (falls back to `width`). */
const stageWidth = ref(0);
const stageRef = ref<unknown>(null);
/** Piece node, for the desktop-mouse binding (H5 only). */
const pieceRef = ref<unknown>(null);
/** Component instance — mini-program selector queries need it for `in()`. */
const instance = getCurrentInstance();

/** Target hole position (top-left corner, px design units). */
const target = ref({ x: 0, y: 0 });
/** Piece offset from the left edge (px design units). */
const offset = ref(0);

/** Overlay lifecycle gates: mounted (client) + popup visibility. */
const isMounted = ref(false);
const state = ref<'idle' | 'success'>('idle');
const shaking = ref(false);

/** On screen: an inline instance ignores `v-model` (the host mounts it). */
const isVisible = computed(() => isMounted.value && (props.inline || props.modelValue));

/**
 * Design-px travel base: the measured stage, else the `width` prop.
 *
 * The `width` prop is the stage's design `max-width`, so it is a faithful
 * travel range on every end — a host that cannot report its layout (AGENTS.md
 * §85) still gets a draggable piece instead of a frozen one at x = 0.
 */
const travelBase = computed(() => (stageWidth.value > 0 ? stageWidth.value : props.width));
const maxOffset = computed(() => Math.max(travelBase.value - PIECE, 0));

/* ── Measurement: H5 DOM first, mini-program selector query as fallback ── */

/** The slice of `uni.createSelectorQuery()` used here. */
interface SelectorQueryLike {
  in?(component: unknown): SelectorQueryLike;
  select?(selector: string): SelectorQueryLike;
  boundingClientRect?(callback: (rect: { width?: number } | null) => void): SelectorQueryLike;
  exec?(): void;
}

/** Adopt a measured CSS-px width, converted into design px. */
function applyStageWidth(cssWidth: number): void {
  if (cssWidth > 0) stageWidth.value = cssWidth / pxPerDesign();
}

/**
 * Measure the stage width through `uni.createSelectorQuery()`.
 *
 * The cross-end layout API — the only measurement available where there is no
 * DOM (mini-programs / App). Silent no-op when the host has neither the query
 * nor the selector on screen; the `width` prop stays the travel base.
 */
function queryStageWidth(): void {
  const host = globalThis as { uni?: { createSelectorQuery?: () => SelectorQueryLike } };
  const createSelectorQuery = host.uni?.createSelectorQuery;
  if (typeof createSelectorQuery !== 'function' || instance === null) return;
  try {
    createSelectorQuery()
      .in?.(instance.proxy)
      .select?.('.sn-captcha__stage')
      .boundingClientRect?.((rect) => {
        const width = typeof rect?.width === 'number' ? rect.width : 0;
        applyStageWidth(width);
      })
      .exec?.();
  } catch {
    // A host that rejects the query keeps the `width` prop as the travel base.
  }
}

/**
 * Measure the stage box in design px.
 *
 * uni H5 renders `<view>` as a component, so the template ref is the component
 * instance and the node lives on `$el` (`resolveNodeEl`); mini-programs have no
 * DOM and answer through the selector query instead. Both paths are guarded —
 * a failure just leaves the `width` prop in place.
 */
function init(): void {
  const el = resolveNodeEl(stageRef.value) as { getBoundingClientRect?: () => { width: number } } | null;
  if (el !== null && typeof el.getBoundingClientRect === 'function') {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      applyStageWidth(rect.width);
      return;
    }
  }
  queryStageWidth();
}

/** Re-roll the hole position; keeps the piece travel inside the stage. */
function refresh(): void {
  const w = travelBase.value;
  const xMin = X_MIN * Math.max(w - PIECE, 0);
  const xMax = X_MAX * Math.max(w - PIECE, 0);
  const h = props.height;
  target.value = {
    x: xMin + Math.random() * Math.max(xMax - xMin, 0),
    y: Y_MIN * h + Math.random() * ((Y_MAX - Y_MIN) * h),
  };
  offset.value = 0;
  state.value = 'idle';
  shaking.value = false;
  emit('refresh');
}

/* ── Timers (§41) ──────────────────────────────────────────────────────── */

let successTimer: ReturnType<typeof setTimeout> | null = null;
let failTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers(): void {
  if (successTimer !== null) clearTimeout(successTimer);
  if (failTimer !== null) clearTimeout(failTimer);
  successTimer = null;
  failTimer = null;
}

/* ── Desktop H5 mouse (additive — AUI-OPT-12, AGENTS.md §112.3a) ───────── */

let disposeMouse: (() => void) | null = null;

function bindMouse(): void {
  if (disposeMouse) return;
  const el = resolveNodeEl(pieceRef.value);
  if (el instanceof HTMLElement) {
    disposeMouse = bindHorizontalDragMouse(el, {
      begin: beginDrag,
      move: moveDrag,
      end: endDrag,
      isLocked: () => state.value === 'success',
      isTouchActive: () => touchActive,
    });
  }
}

/**
 * Retry until the piece node exists.
 *
 * The piece lives inside the measured stage, so on the very first inline
 * mount the watcher's single `nextTick()` can run before the node is in the
 * tree — the bind silently no-ops and never retries, which left desktop H5
 * without mouse dragging (touch still worked). Bounce through a couple of
 * animation frames: `bindMouse` is idempotent once it succeeds.
 */
let bindRetry: ReturnType<typeof setTimeout> | null = null;

function bindMouseWhenReady(attempt = 0): void {
  if (disposeMouse) return;
  bindMouse();
  if (disposeMouse !== null || attempt >= 8) return;
  if (bindRetry !== null) clearTimeout(bindRetry);
  bindRetry = setTimeout(() => {
    bindRetry = null;
    bindMouseWhenReady(attempt + 1);
  }, 50);
}

function unbindMouse(): void {
  disposeMouse?.();
  disposeMouse = null;
}

/**
 * Arm / disarm the mouse path whenever the piece could be on screen.
 *
 * `flush: 'post'` runs after the DOM patch, and folding in `isMounted` covers
 * the mount-already-open case (inline instances, or `v-model` set true from the
 * start): the first pass runs during setup with `isMounted === false`, then
 * re-runs once `onMounted` flips it, so the piece node exists by the time
 * `bindMouse` resolves it.
 */
watch(
  isVisible,
  async (visible) => {
    if (visible) {
      await nextTick();
      bindMouseWhenReady();
    } else {
      unbindMouse();
    }
  },
  { immediate: true, flush: 'post' },
);

/* ── Open / close ──────────────────────────────────────────────────────── */

function requestClose(): void {
  if (!props.modelValue) return;
  emit('update:modelValue', false);
  emit('close');
}

function onModalTap(): void {
  if (props.closeOnClickModal) requestClose();
}

/**
 * Open flow: re-measure, then re-roll, once the overlay is on screen.
 *
 * Keyed on `isVisible`, which folds in mount state, `v-model` and `inline`, so
 * an inline instance rolls its target as soon as it is mounted and a popup
 * rolls on every open. No DOM guard here: mini-programs have no `window`, and
 * the open flow must run there too (the helpers are host-safe individually).
 */
watch(
  isVisible,
  async (visible) => {
    if (!visible) {
      clearTimers();
      return;
    }
    clearTimers();
    state.value = 'idle';
    shaking.value = false;
    offset.value = 0;
    await nextTick();
    init();
    refresh();
  },
  { immediate: true },
);

onMounted(() => {
  // Flipping `isMounted` re-runs the `isVisible` watcher, which measures.
  isMounted.value = true;
});

onBeforeUnmount(() => {
  clearTimers();
  if (bindRetry !== null) {
    clearTimeout(bindRetry);
    bindRetry = null;
  }
  unbindMouse();
});

/* ── Drag (touch on the piece + desktop H5 mouse) ─────────────────────── */

/** Touch position in CSS px, or 0 when the event carries none. */
function touchX(event: Event): number {
  const detail = event as unknown as {
    touches?: Array<{ clientX?: number; pageX?: number }>;
    changedTouches?: Array<{ clientX?: number; pageX?: number }>;
    detail?: { x?: number };
  };
  const list = detail.touches ?? detail.changedTouches;
  const point = list && list.length > 0 ? list[0] : undefined;
  if (point && typeof point.clientX === 'number') return point.clientX;
  if (point && typeof point.pageX === 'number') return point.pageX;
  if (detail.detail && typeof detail.detail.x === 'number') return detail.detail.x;
  return 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Pointer tweening is shared by the touch and mouse paths. */
let dragStartX = 0;
let dragStartOffset = 0;
/** True while a real touch gesture is live (mouse input defers to it). */
let touchActive = false;

function beginDrag(clientX: number): void {
  dragStartX = clientX;
  dragStartOffset = offset.value;
}

function moveDrag(clientX: number): void {
  // Pointer delta is CSS px; the piece travels in design px.
  const delta = (clientX - dragStartX) / pxPerDesign();
  offset.value = clamp(dragStartOffset + delta, 0, maxOffset.value);
}

function endDrag(): void {
  if (state.value === 'success') return;
  if (Math.abs(offset.value - target.value.x) <= props.tolerance) {
    state.value = 'success';
    offset.value = target.value.x;
    emit('success');
    // Popup: keep the passed state visible, then close. Inline: stay put —
    // there is no overlay to dismiss and the host decides what happens next.
    if (props.inline) return;
    successTimer = setTimeout(() => {
      successTimer = null;
      requestClose();
    }, 600);
  } else {
    emit('fail');
    shaking.value = true;
    failTimer = setTimeout(() => {
      failTimer = null;
      shaking.value = false;
      offset.value = 0;
    }, 320);
  }
}

function onPieceTouchStart(event: Event): void {
  if (state.value === 'success') return;
  touchActive = true;
  beginDrag(touchX(event));
}

function onPieceTouchMove(event: Event): void {
  if (state.value === 'success' || !touchActive) return;
  moveDrag(touchX(event));
}

function onPieceTouchEnd(): void {
  if (!touchActive) return;
  touchActive = false;
  endDrag();
}

function onPieceTouchCancel(): void {
  if (!touchActive) return;
  touchActive = false;
  endDrag();
}

/* ── Styles ────────────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-captcha',
  { 'sn-captcha--inline': props.inline },
  props.customClass,
]);
const rootStyle = computed(() => {
  const z = props.inline ? '' : `z-index: ${props.zIndex};`;
  return `${z}${props.customStyle || ''}`;
});

const stageStyle = computed(
  () => `height: ${props.height * 2}rpx;max-width: ${props.width * 2}rpx;`,
);

const holeStyle = computed(
  () =>
    `left: ${target.value.x * 2}rpx;top: ${target.value.y * 2}rpx;width: ${PIECE * 2}rpx;height: ${PIECE * 2}rpx;`,
);

const pieceClass = computed(() => [
  'sn-captcha__piece',
  {
    'sn-captcha__piece--shaking': shaking.value,
    'sn-captcha__piece--success': state.value === 'success',
  },
]);

const pieceStyle = computed(
  () =>
    `transform: translateX(${offset.value * 2}rpx);top: ${target.value.y * 2}rpx;width: ${PIECE * 2}rpx;height: ${PIECE * 2}rpx;`,
);

/** The piece shows the source slice under the *target* position, so at
 *  pieceX === target.x the slice visually completes the stage image. */
const pieceImgStyle = computed(() => {
  const w = travelBase.value;
  return `width: ${w * 2}rpx;height: ${props.height * 2}rpx;transform: translate(${-target.value.x * 2}rpx, ${-target.value.y * 2}rpx);`;
});

const hintText = computed(() => {
  if (state.value === 'success') return props.successText || '验证通过';
  return props.tips || '拖动拼图，对齐缺口';
});

defineExpose({
  init,
  refresh,
  /** Snap the piece back and clear the verdict. */
  reset: () => {
    offset.value = 0;
    state.value = 'idle';
    shaking.value = false;
  },
  /** Exposed for tests / host inspection. */
  target,
  offset,
  state,
});
</script>

<template>
  <view
    v-if="isVisible"
    data-snui-component="captcha"
    :class="rootClass"
    :style="rootStyle"
    :role="props.inline ? 'group' : 'dialog'"
    :aria-modal="props.inline ? undefined : 'true'"
    :aria-label="hintText"
  >
    <view v-if="!props.inline" class="sn-captcha__modal" aria-hidden="true" @tap="onModalTap" />

    <view class="sn-captcha__panel">
      <view ref="stageRef" class="sn-captcha__stage" :style="stageStyle">
        <image class="sn-captcha__bg" :src="src" mode="aspectFill" />

        <!-- 缺口（虚线描边的半透明槽位） -->
        <view class="sn-captcha__hole" :style="holeStyle" aria-hidden="true" />

        <!-- 拼图块：横向拖动，内容为目标位置的源图切片 -->
        <view
          ref="pieceRef"
          :class="pieceClass"
          :style="pieceStyle"
          role="button"
          :aria-label="hintText"
          @touchstart="onPieceTouchStart"
          @touchmove.stop.prevent="onPieceTouchMove"
          @touchend="onPieceTouchEnd"
          @touchcancel="onPieceTouchCancel"
        >
          <view class="sn-captcha__piece-clip">
            <image class="sn-captcha__piece-img" :src="src" mode="aspectFill" :style="pieceImgStyle" />
          </view>
          <view class="sn-captcha__piece-ring" aria-hidden="true" />
        </view>

        <!-- 提示 / 成功文案 -->
        <view class="sn-captcha__hint" :class="{ 'sn-captcha__hint--success': state === 'success' }">
          <text>{{ hintText }}</text>
        </view>

        <!-- 刷新（重新掷缺口） -->
        <view
          v-if="props.refreshable && state !== 'success'"
          class="sn-captcha__refresh"
          role="button"
          aria-label="refresh"
          @tap="refresh"
        >
          <SnIcon :icon="RefreshIcon" :size="30" />
        </view>

        <!-- 关闭（内嵌模式没有可关闭的弹层） -->
        <view
          v-if="!props.inline"
          class="sn-captcha__close"
          role="button"
          aria-label="close"
          @tap="requestClose"
        >
          <SnIcon :icon="XIcon" :size="26" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-captcha {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-captcha__modal {
  position: absolute;
  inset: 0;
  background-color: var(--sn-mp-color-background-overlay);
}

/* Inline mode (additive, AUI-OPT-12): embedded in the host layout instead of a
 * fixed overlay — the panel drops its elevation and fills the container. */
.sn-captcha--inline {
  position: relative;
  inset: auto;
  display: block;
}

.sn-captcha--inline .sn-captcha__panel {
  width: 100%;
  max-width: none;
  box-shadow: none;
  padding: 0;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-captcha__panel {
  position: relative;
  width: 88%;
  max-width: 640rpx;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-lg);
  padding: 20rpx;
  box-sizing: border-box;
  animation: sn-captcha-in 200ms ease-out;
}

@keyframes sn-captcha-in {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.sn-captcha__stage {
  position: relative;
  width: 100%;
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
  background-color: var(--sn-mp-color-background-soft);
}

.sn-captcha__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* 缺口：半透明槽位 + 虚线亮边 */
.sn-captcha__hole {
  position: absolute;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-sm);
  background-color: rgb(0 0 0 / 0.28);
  border: 3rpx dashed rgb(255 255 255 / 0.85);
  box-shadow: inset 0 0 16rpx rgb(0 0 0 / 0.35);
}

/* 拼图块 */
.sn-captcha__piece {
  position: absolute;
  left: 0;
  box-sizing: border-box;
}

.sn-captcha__piece-clip {
  position: absolute;
  inset: 0;
  border-radius: var(--sn-mp-radius-sm);
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgb(0 0 0 / 0.35);
}

.sn-captcha__piece-img {
  display: block;
  /* 尺寸与位移由 pieceImgStyle 内联（跟随舞台尺寸与目标位置） */
}

/* 块边缘高亮环：白色描边让切片在任何底图上可辨 */
.sn-captcha__piece-ring {
  position: absolute;
  inset: 0;
  border-radius: var(--sn-mp-radius-sm);
  border: 3rpx solid rgb(255 255 255 / 0.92);
  pointer-events: none;
}

.sn-captcha__piece--success .sn-captcha__piece-ring {
  border-color: var(--sn-mp-color-feedback-success);
}

@keyframes sn-captcha-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-12rpx);
  }
  75% {
    transform: translateX(12rpx);
  }
}

.sn-captcha__piece--shaking {
  animation: sn-captcha-shake 300ms ease-in-out;
}

/* 提示条 */
.sn-captcha__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12rpx 0;
  text-align: center;
  font-size: var(--sn-mp-font-size-xs);
  color: rgb(255 255 255 / 0.92);
  background: linear-gradient(to top, rgb(0 0 0 / 0.45), transparent);
  pointer-events: none;
}

.sn-captcha__hint--success {
  color: var(--sn-mp-color-feedback-success);
  font-weight: 600;
}

/* 右上角操作钮：刷新 / 关闭（白圈样式，同 sn-curtain） */
.sn-captcha__refresh,
.sn-captcha__close {
  position: absolute;
  top: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-full);
  border: 3rpx solid rgb(255 255 255 / 0.92);
  background-color: rgb(0 0 0 / 0.25);
  color: #ffffff;
}

.sn-captcha__refresh {
  right: 76rpx;
}

.sn-captcha__close {
  right: 12rpx;
}

/* Doodle skin — hand-drawn panel + piece outline. */
.snui-skin-doodle .sn-captcha__panel {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
