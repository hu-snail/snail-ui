<script setup lang="ts">
/**
 * sn-img-cropper (uni-end) — image cropper with drag / zoom / rotate.
 *
 * Reference library: wot-ui `wd-img-cropper`
 *   (https://wot-ui.cn/component/img-cropper.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-img-cropper 1:1 except
 * for the documented omissions. Anything new added here MUST also be added to
 * the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-img-cropper/sn-img-cropper.vue
 * → auto-registered as `<sn-img-cropper>` in any .vue that uses it.
 *
 * ## Geometry, not canvas
 *
 * The crop frame, the image transform and the result are all plain numbers: the
 * image is moved by `translate`, scaled by `scale` and rotated by `rotate`
 * inside a fixed frame, and `confirm` reports the resulting transform together
 * with the source rectangle it maps to. Rasterizing would need `<canvas>` plus
 * `uni.canvasToTempFilePath`; the host does that from the reported geometry.
 *
 * ## Documented divergences (CONTRIBUTING §2.2)
 *
 *   - `export-scale` / `quality` / `file-type` are declared so a
 *     wd-img-cropper config type-checks unchanged, but they have no effect
 *     here — they only matter when rasterizing to a file, which this component
 *     does not do. The host applies them when it rasterizes the geometry
 *     reported by `confirm`.
 *   - `img-width` / `img-height` are declared for parity as the *preview* box
 *     size. A number is an rpx design value, a string is used verbatim (only
 *     `%` is meaningful upstream). They size the `<image>` inside the frame;
 *     leaving them empty keeps the current `100%` fit.
 *
 * ## Gestures (CONTRIBUTING §2.5 / AGENTS.md §41)
 *
 * `@touchstart` / `@touchmove` / `@touchend` on the stage: two fingers spread to
 * zoom, one finger drags to pan. No `window.addEventListener`, no timer, no
 * async measurement — `onBeforeUnmount` only drops the gesture state.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Usage:
 *   <sn-img-cropper v-model="visible" img-src="…" aspect-ratio="1:1" @confirm="onConfirm" />
 *
 * Not responsible for:
 *   - 图片上传 — 用 sn-upload
 *   - 裁剪结果的存储 / 上传 — 由宿主处理 `confirm` 的几何
 */

import { computed, markRaw, onBeforeUnmount, ref, watch } from 'vue';
import SnButton from '../sn-button/sn-button.vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import SnPopup from '../sn-popup/sn-popup.vue';

defineOptions({ name: 'SnImgCropper' });

/** Design px → rpx (750 design width, 1px = 2rpx — CONTRIBUTING §2.4). */
const RPX_PER_PX = 2;

/** Lowest zoom factor (the image may be shrunk below the frame). */
const MIN_SCALE = 0.5;

/** Smallest crop frame side in rpx, so the frame never collapses. */
const MIN_FRAME_SIDE = 200;

/** Long side of the crop frame in rpx. */
const LONG_FRAME_SIDE = 500;

/** Rotation step per tap of the rotate control, in degrees. */
const ROTATE_STEP = 90;

/**
 * Rotate glyph — a circular arrow on the same 24×24 grid as the icon set.
 *
 * Declared inline (like `sn-empty`'s built-in glyph) because `sn-icon-set.ts`
 * is a shared module this component must not extend.
 */
const ROTATE_GLYPH: IconData = markRaw({
  viewBox: '0 0 24 24',
  paths: ['M21 12a9 9 0 1 1-3-6.7', 'M21 3v6h-6'],
});

/** A resolved `width:height` ratio pair. */
interface CropRatio {
  width: number;
  height: number;
}

/** Gesture state captured on `touchstart`. */
interface GestureState {
  /** Finger count at gesture start. */
  fingers: number;
  /** Pointer position at gesture start. */
  startX: number;
  startY: number;
  /** Distance between the first two fingers at gesture start. */
  startDistance: number;
  /** Offset / scale at gesture start. */
  startOffsetX: number;
  startOffsetY: number;
  startScale: number;
}

/** Payload of `confirm`. */
export interface SnImgCropperResult {
  /** Applied horizontal offset in rpx. */
  offsetX: number;
  /** Applied vertical offset in rpx. */
  offsetY: number;
  /** Applied scale factor. */
  scale: number;
  /** Applied rotation in degrees. */
  rotate: number;
  /** Source rectangle covered by the frame, in source-image pixels. */
  source: { x: number; y: number; width: number; height: number };
  /** Frame size in rpx. */
  frame: { width: number; height: number };
}

const props = withDefaults(
  defineProps<{
    /** Whether the cropper layer is visible (`v-model`). */
    modelValue?: boolean;
    /** Source image URL. */
    imgSrc?: string;
    /** Preview image width — a number is rpx, a string is used verbatim. */
    imgWidth?: number | string | undefined;
    /** Preview image height — a number is rpx, a string is used verbatim. */
    imgHeight?: number | string | undefined;
    /** Disable rotation entirely. */
    disabledRotate?: boolean;
    /** Maximum zoom factor. */
    maxScale?: number;
    /*
     * Export props — declared for wd-img-cropper parity, inert here (see the
     * header): the host applies them when it rasterizes `confirm`'s geometry.
     */
    /** Export image scale factor. */
    exportScale?: number;
    /** Export image quality, 0–1. */
    quality?: number;
    /** Export image type. */
    fileType?: 'png' | 'jpg';
    /** Cancel button label. */
    cancelButtonText?: string;
    /** Confirm button label. */
    confirmButtonText?: string;
    /** Crop-frame aspect ratio, `"width:height"`. */
    aspectRatio?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: false,
    imgSrc: '',
    disabledRotate: false,
    maxScale: 3,
    cancelButtonText: '取消',
    confirmButtonText: '完成',
    aspectRatio: '1:1',
    imgWidth: undefined,
    imgHeight: undefined,
    exportScale: 1,
    quality: 0.92,
    fileType: 'png',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', result: SnImgCropperResult): void;
  (e: 'cancel'): void;
  (e: 'imgloaded', payload: { src: string }): void;
  (e: 'imgloaderror', payload: { error: unknown }): void;
}>();

/* ── Geometry ──────────────────────────────────────────────────────────── */

/** Parsed aspect ratio; a malformed string falls back to 1:1. */
const ratio = computed<CropRatio>(() => {
  const parts = props.aspectRatio.split(':');
  const width = Number(parts[0]);
  const height = Number(parts[1]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 1, height: 1 };
  }
  return { width, height };
});

/** Crop-frame size in rpx: a 500rpx long side, short side per the ratio. */
const frame = computed<{ width: number; height: number }>(() => {
  const { width, height } = ratio.value;
  if (width >= height) {
    return {
      width: LONG_FRAME_SIDE,
      height: Math.max(MIN_FRAME_SIDE, Math.round((LONG_FRAME_SIDE * height) / width)),
    };
  }
  return {
    width: Math.max(MIN_FRAME_SIDE, Math.round((LONG_FRAME_SIDE * width) / height)),
    height: LONG_FRAME_SIDE,
  };
});

/** Clamped maximum zoom. */
const maxScaleValue = computed(() =>
  Number.isFinite(props.maxScale) && props.maxScale > MIN_SCALE ? props.maxScale : 3,
);

/* ── Transform state ───────────────────────────────────────────────────── */

/** Horizontal offset in rpx. */
const offsetX = ref(0);
/** Vertical offset in rpx. */
const offsetY = ref(0);
/** Zoom factor. */
const scale = ref(1);
/** Rotation in degrees (always a multiple of `ROTATE_STEP`). */
const rotate = ref(0);
/** Gesture in progress; `null` at rest. */
const gesture = ref<GestureState | null>(null);

function clampScale(value: number): number {
  return Math.min(maxScaleValue.value, Math.max(MIN_SCALE, value));
}

/** Reset offset / scale / rotation (mirrors wd-img-cropper `resetImg`). */
function resetImg(): void {
  offsetX.value = 0;
  offsetY.value = 0;
  scale.value = 1;
  rotate.value = 0;
  gesture.value = null;
}

/** Set the rotation, snapped to 90° steps; a no-op when rotation is disabled. */
function setRotate(deg: number): void {
  if (props.disabledRotate) return;
  rotate.value = (((Math.round(deg / ROTATE_STEP) * ROTATE_STEP) % 360) + 360) % 360;
}

/** One tap of the rotate control. */
function rotateByStep(): void {
  setRotate(rotate.value + ROTATE_STEP);
}

/** Reopening the layer always starts from the reset transform. */
watch(
  () => props.modelValue,
  (isVisible) => {
    if (isVisible) resetImg();
  },
);

onBeforeUnmount(() => {
  // §41: the gesture snapshot is the only state this component owns; the popup
  // owns its animation timer and no listener is registered anywhere.
  gesture.value = null;
});

/* ── Gestures ──────────────────────────────────────────────────────────── */

/** Distance between the first two touches. */
function touchDistance(event: TouchEvent): number {
  const touches = Array.from(event.touches ?? []);
  const first = touches[0];
  const second = touches[1];
  if (first === undefined || second === undefined) return 0;
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function onTouchStart(event: TouchEvent): void {
  const touches = Array.from(event.touches ?? []);
  const first = touches[0];
  gesture.value = {
    fingers: touches.length,
    startX: first?.clientX ?? 0,
    startY: first?.clientY ?? 0,
    startDistance: touchDistance(event),
    startOffsetX: offsetX.value,
    startOffsetY: offsetY.value,
    startScale: scale.value,
  };
}

function onTouchMove(event: TouchEvent): void {
  const state = gesture.value;
  if (state === null) return;
  const first = Array.from(event.touches ?? [])[0];
  if (first === undefined) return;

  // Two fingers: spread to zoom. One finger: drag to pan.
  if (state.fingers >= 2) {
    const distance = touchDistance(event);
    if (state.startDistance > 0 && distance > 0) {
      scale.value = clampScale(state.startScale * (distance / state.startDistance));
    }
    return;
  }
  offsetX.value = state.startOffsetX + (first.clientX - state.startX) * RPX_PER_PX;
  offsetY.value = state.startOffsetY + (first.clientY - state.startY) * RPX_PER_PX;
}

function onTouchEnd(): void {
  gesture.value = null;
}

/* ── Actions ───────────────────────────────────────────────────────────── */

/** Source rectangle the frame currently covers, in source-image pixels. */
function sourceRect(): SnImgCropperResult['source'] {
  // The frame covers `frame.width / scale` rpx of the image; convert rpx → px.
  // `Math.round(-0)` is `-0`, which would leak a signed zero into the payload —
  // `|| 0` normalises it back to plain `0`.
  return {
    x: Math.round(-offsetX.value / scale.value / RPX_PER_PX) || 0,
    y: Math.round(-offsetY.value / scale.value / RPX_PER_PX) || 0,
    width: Math.round(frame.value.width / scale.value / RPX_PER_PX),
    height: Math.round(frame.value.height / scale.value / RPX_PER_PX),
  };
}

function onConfirm(): void {
  emit('confirm', {
    offsetX: Math.round(offsetX.value),
    offsetY: Math.round(offsetY.value),
    scale: scale.value,
    rotate: rotate.value,
    source: sourceRect(),
    frame: { ...frame.value },
  });
  emit('update:modelValue', false);
}

function onCancel(): void {
  emit('cancel');
  emit('update:modelValue', false);
}
function onImgLoaded(): void {
  emit('imgloaded', { src: props.imgSrc });
}

function onImgError(event: Event): void {
  emit('imgloaderror', { error: event });
}

function onPopupModelUpdate(value: boolean): void {
  emit('update:modelValue', value);
}

/* ── Presentation ──────────────────────────────────────────────────────── */

/** Popup panel override: full-bleed, unpadded. */
const PANEL_STYLE = [
  'width: 100%',
  'height: 100%',
  'max-width: 100%',
  'max-height: 100%',
  'padding: 0',
].join('; ');

const rootClass = computed(() => [
  'sn-img-cropper',
  { 'sn-img-cropper--rotate-disabled': props.disabledRotate },
  props.customClass,
]);

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined));

/**
 * Non-undefined view of `modelValue` for the popup binding — a bare prop
 * identifier types as `boolean | undefined` under `exactOptionalPropertyTypes`.
 */
const visibleValue = computed(() => props.modelValue);

const frameStyle = computed(
  () => `width: ${frame.value.width}rpx; height: ${frame.value.height}rpx`,
);

/** Resolve a preview length: a bare number is a px design value (→ rpx). */
function toPreviewLength(value: number | string | undefined): string | undefined {
  if (value === undefined || value === '') return undefined;
  return typeof value === 'number' ? `${value * RPX_PER_PX}rpx` : value;
}

/**
 * Transform applied to the image inside the frame, plus the optional
 * `imgWidth` / `imgHeight` preview box (unset keeps the `100%` CSS fit).
 */
const imageStyle = computed(() => {
  const parts = [
    `transform: translate(${offsetX.value}rpx, ${offsetY.value}rpx) scale(${scale.value}) rotate(${rotate.value}deg)`,
  ];
  const width = toPreviewLength(props.imgWidth);
  const height = toPreviewLength(props.imgHeight);
  if (width !== undefined) parts.push(`width: ${width}`);
  if (height !== undefined) parts.push(`height: ${height}`);
  return parts.join('; ');
});

const ariaLabel = computed(() =>
  props.imgSrc === '' ? 'image cropper' : `image cropper: ${props.imgSrc}`,
);
</script>

<template>
  <SnPopup
    :model-value="visibleValue"
    position="center"
    :z-index="100"
    :duration="200"
    :custom-style="PANEL_STYLE"
    @update:model-value="onPopupModelUpdate"
  >
    <view
      :class="rootClass"
      :style="rootStyle"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
    >
      <view
        class="sn-img-cropper__stage"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <view class="sn-img-cropper__frame" :style="frameStyle">
          <image
            v-if="imgSrc"
            class="sn-img-cropper__image"
            :src="imgSrc"
            :style="imageStyle"
            mode="aspectFill"
            @load="onImgLoaded"
            @error="onImgError"
          />

          <view class="sn-img-cropper__grid" aria-hidden="true">
            <view class="sn-img-cropper__grid-line sn-img-cropper__grid-line--v1" />
            <view class="sn-img-cropper__grid-line sn-img-cropper__grid-line--v2" />
            <view class="sn-img-cropper__grid-line sn-img-cropper__grid-line--h1" />
            <view class="sn-img-cropper__grid-line sn-img-cropper__grid-line--h2" />
          </view>

          <view class="sn-img-cropper__corner sn-img-cropper__corner--tl" aria-hidden="true" />
          <view class="sn-img-cropper__corner sn-img-cropper__corner--tr" aria-hidden="true" />
          <view class="sn-img-cropper__corner sn-img-cropper__corner--bl" aria-hidden="true" />
          <view class="sn-img-cropper__corner sn-img-cropper__corner--br" aria-hidden="true" />
        </view>
      </view>

      <view class="sn-img-cropper__toolbar">
        <view
          v-if="!disabledRotate"
          class="sn-img-cropper__tool"
          role="button"
          aria-label="rotate"
          @tap="rotateByStep"
        >
          <SnIcon :icon="ROTATE_GLYPH" :size="28" />
        </view>
        <view class="sn-img-cropper__tool" role="button" aria-label="reset" @tap="resetImg">
          <text class="sn-img-cropper__tool-text">重置</text>
        </view>
      </view>

      <view class="sn-img-cropper__footer">
        <view class="sn-img-cropper__action">
          <SnButton size="small" block @tap="onCancel">{{ cancelButtonText }}</SnButton>
        </view>
        <view class="sn-img-cropper__action">
          <SnButton size="small" block type="primary" @tap="onConfirm">
            {{ confirmButtonText }}
          </SnButton>
        </view>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-img-cropper {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-img-cropper__stage {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── Crop frame ────────────────────────────────────────────────────────── */

.sn-img-cropper__frame {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  /* The frame is the mask — everything outside it is clipped here. */
  border: 4rpx solid var(--sn-mp-color-background-elevated);
  background-color: var(--sn-mp-color-background-sunken);
}

.sn-img-cropper__image {
  width: 100%;
  height: 100%;
  transform-origin: center center;
}

/* ── Grid + corners ────────────────────────────────────────────────────── */

.sn-img-cropper__grid {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.sn-img-cropper__grid-line {
  position: absolute;
  background-color: var(--sn-mp-color-border-subtle);
  opacity: 0.6;
}

.sn-img-cropper__grid-line--v1,
.sn-img-cropper__grid-line--v2 {
  top: 0;
  bottom: 0;
  width: 2rpx;
}

.sn-img-cropper__grid-line--v1 {
  left: 33.33%;
}
.sn-img-cropper__grid-line--v2 {
  left: 66.66%;
}

.sn-img-cropper__grid-line--h1,
.sn-img-cropper__grid-line--h2 {
  right: 0;
  left: 0;
  height: 2rpx;
}

.sn-img-cropper__grid-line--h1 {
  top: 33.33%;
}
.sn-img-cropper__grid-line--h2 {
  top: 66.66%;
}

.sn-img-cropper__corner {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-color: var(--sn-mp-color-action-primary);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}

.sn-img-cropper__corner--tl {
  top: 0;
  left: 0;
  border-top-width: 8rpx;
  border-left-width: 8rpx;
}
.sn-img-cropper__corner--tr {
  top: 0;
  right: 0;
  border-top-width: 8rpx;
  border-right-width: 8rpx;
}
.sn-img-cropper__corner--bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 8rpx;
  border-left-width: 8rpx;
}
.sn-img-cropper__corner--br {
  right: 0;
  bottom: 0;
  border-right-width: 8rpx;
  border-bottom-width: 8rpx;
}

/* ── Toolbar ───────────────────────────────────────────────────────────── */

.sn-img-cropper__toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-8);
  padding: var(--sn-mp-spacing-4) 0;
}

.sn-img-cropper__tool {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 72rpx;
  min-height: 72rpx;
  padding: 0 var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-overlay);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-img-cropper__tool-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* ── Footer ────────────────────────────────────────────────────────────── */

.sn-img-cropper__footer {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-4);
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  padding-bottom: calc(var(--sn-mp-spacing-4) + env(safe-area-inset-bottom));
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-img-cropper__action {
  flex: 1;
  min-width: 0;
}
</style>
