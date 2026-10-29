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
 * directly unit-testable), release inside `tolerance` px of the target →
 * success (emit + auto close), otherwise fail (emit + shake + snap back).
 *
 * Timers (AGENTS.md §41): one success timer (auto close) and one fail shake
 * timer; both cleared in `onBeforeUnmount`. No global listeners.
 *
 * Usage:
 *   <sn-captcha v-model="show" src="https://…/bg.jpg" @success="onPass" />
 *
 * Not responsible for: 行为式验证（滑块 sn-slide-verify）、图形验证码输入框
 * （host 业务）、服务端校验（host 必须）。
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { RefreshCw as RefreshIcon, X as XIcon } from '../sn-icon/sn-icon-set';

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

/** Stage box, measured on mount / open / `init()`. */
const stageWidth = ref(0);
const stageRef = ref<{ getBoundingClientRect?: () => DOMRect } | null>(null);

/** Target hole position (top-left corner, px design units). */
const target = ref({ x: 0, y: 0 });
/** Piece offset from the left edge (px design units). */
const offset = ref(0);

/** Overlay lifecycle gates: mounted (client) + popup visibility. */
const isMounted = ref(false);
const state = ref<'idle' | 'success'>('idle');
const shaking = ref(false);

const maxOffset = computed(() => Math.max(stageWidth.value - PIECE, 0));

function init(): void {
  const el = stageRef.value;
  if (!el || typeof el.getBoundingClientRect !== 'function') return;
  const rect = el.getBoundingClientRect();
  if (rect.width > 0) stageWidth.value = rect.width;
}

/** Re-roll the hole position; keeps the piece travel inside the stage. */
function refresh(): void {
  const w = stageWidth.value || props.width;
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

/* ── Open / close ──────────────────────────────────────────────────────── */

function requestClose(): void {
  if (!props.modelValue) return;
  emit('update:modelValue', false);
  emit('close');
}

function onModalTap(): void {
  if (props.closeOnClickModal) requestClose();
}

watch(
  () => props.modelValue,
  async (open) => {
    if (typeof window === 'undefined') return;
    if (open) {
      clearTimers();
      state.value = 'idle';
      shaking.value = false;
      offset.value = 0;
      await nextTick();
      init();
      refresh();
    } else {
      clearTimers();
    }
  },
  { immediate: true },
);

onMounted(() => {
  isMounted.value = true;
  init();
});

onBeforeUnmount(() => {
  clearTimers();
});

/* ── Drag (same touch extraction pattern as sn-slide-verify) ───────────── */

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

let dragStartX = 0;
let dragStartOffset = 0;

function onPieceTouchStart(event: Event): void {
  if (state.value === 'success') return;
  dragStartX = touchX(event);
  dragStartOffset = offset.value;
}

function onPieceTouchMove(event: Event): void {
  if (state.value === 'success') return;
  offset.value = clamp(dragStartOffset + (touchX(event) - dragStartX), 0, maxOffset.value);
}

function onPieceTouchEnd(): void {
  if (state.value === 'success') return;
  if (Math.abs(offset.value - target.value.x) <= props.tolerance) {
    state.value = 'success';
    offset.value = target.value.x;
    emit('success');
    // 验证通过后短暂停留再关闭，让成功态可见。
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

function onPieceTouchCancel(): void {
  onPieceTouchEnd();
}

/* ── Styles ────────────────────────────────────────────────────────────── */

const rootClass = computed(() => ['sn-captcha', props.customClass]);
const rootStyle = computed(() => `z-index: ${props.zIndex};${props.customStyle || ''}`);

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
  const w = stageWidth.value || props.width;
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
    v-if="isMounted && modelValue"
    data-snui-component="captcha"
    :class="rootClass"
    :style="rootStyle"
    role="dialog"
    aria-modal="true"
    :aria-label="hintText"
  >
    <view class="sn-captcha__modal" aria-hidden="true" @tap="onModalTap" />

    <view class="sn-captcha__panel">
      <view ref="stageRef" class="sn-captcha__stage" :style="stageStyle">
        <image class="sn-captcha__bg" :src="src" mode="aspectFill" />

        <!-- 缺口（虚线描边的半透明槽位） -->
        <view class="sn-captcha__hole" :style="holeStyle" aria-hidden="true" />

        <!-- 拼图块：横向拖动，内容为目标位置的源图切片 -->
        <view
          :class="pieceClass"
          :style="pieceStyle"
          role="button"
          :aria-label="hintText"
          @touchstart="onPieceTouchStart"
          @touchmove="onPieceTouchMove"
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

        <!-- 关闭 -->
        <view class="sn-captcha__close" role="button" aria-label="close" @tap="requestClose">
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
