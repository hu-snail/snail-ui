<script setup lang="ts">
/**
 * sn-image-preview (uni-end) — full-screen image viewer layer (WeChat-grade).
 *
 * Reference library: wot-ui `wd-image-preview`
 *   (https://wot-ui.cn/component/image-preview.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-image-preview 1:1.
 * The gesture layer (pinch zoom, double-tap zoom, drag-to-page with rubber
 * band, drag-down dismiss) is AUI-additive — registered in AGENTS.md §112.3a.
 * Anything new added here MUST also be added to the reference list there.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-image-preview/sn-image-preview.vue
 * → auto-registered as `<sn-image-preview>` in any .vue that uses it.
 *
 * ## Why a hand-rolled track instead of `<swiper>`
 *
 * WeChat's viewer arbitrates one finger between three intents — page
 * horizontally, pan a zoomed image, drag down to dismiss — and two fingers
 * pinch-zoom *while* paging is suppressed. A native `<swiper>` cannot be
 * locked mid-gesture, so the track is a plain flex row moved with
 * `transform: translateX` + transition. All decisions come from the pure
 * helpers in `sn-image-preview-gestures.ts`; this file is the state machine.
 *
 * ## WeChat behaviours mirrored
 *
 *   - Opaque black curtain that fades as the image is dragged down, revealing
 *     the page behind; release past ~25% (or a flick) flies the viewer out.
 *   - Pinch zoom 1–4× anchored at the finger midpoint; release past the range
 *     snaps back. Double-tap toggles 1× / 2.5× anchored at the tap point.
 *   - Paging resets zoom; a zoomed image pans inside its bounds with rubber
 *     banding; horizontal flicks page, vertical drags dismiss.
 *   - Counter is plain white text, top-centre; the close glyph is a thin
 *     white cross without a pill background.
 *
 * ## Opening it
 *
 * wd-image-preview exposes `open` / `close` / `setActive` instead of a
 * `v-model`, and the spec's prop list has no `modelValue` — so this component
 * keeps that imperative surface exactly:
 *
 *   const preview = ref()
 *   preview.value.open({ images: [...], startPosition: 0 })
 *   preview.value.setActive(2)
 *   preview.value.close()
 *
 * `selector` is honoured in "hit-zone" form: `open()` asks
 * `uni.createSelectorQuery` for the boxes of every element matching the
 * selector and lays transparent tap zones over them, so tapping a thumbnail on
 * the page opens the viewer at that index. The query is guarded — on hosts
 * without it (unit tests, SSR) no zone is created and `open()` still works.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * The gesture state owns two timers (single-tap delay, post-close reset) —
 * both cleared on unmount and on every close. No listeners outlive the layer.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Usage:
 *   <sn-image-preview ref="preview" :images="list" show-index />
 *   <sn-image-preview selector=".sn-demo__thumb" :images="list" />
 *
 * Not responsible for:
 *   - 单图展示（加载 / 失败态）— 用 sn-img
 *   - 视频预览 — 用 sn-video-preview
 */

import { computed, getCurrentInstance, markRaw, onBeforeUnmount, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { X as XIcon } from '../sn-icon/sn-icon-set';
import SnPopup from '../sn-popup/sn-popup.vue';
import {
  clampZoom,
  dismissOpacity,
  isTapTravel,
  lockAxis,
  panLimit,
  pinchScale,
  rubberBand,
  shouldDismiss,
  shouldPage,
  touchDistance,
  touchMidpoint,
} from './sn-image-preview-gestures';
import type { PreviewAxis } from './sn-image-preview-gestures';

defineOptions({ name: 'SnImagePreview' });

/** Close-button anchor. Mirrors `wd-image-preview` close-icon-position. */
type ImagePreviewClosePosition = 'top-left' | 'top-right';

/** Zoom bounds (mirrors WeChat: pinch up to 4×, double-tap to 2.5×). */
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_DOUBLE_TAP = 2.5;

/** Tap envelope (px) and double-tap window (ms) — WeChat-feel defaults. */
const TAP_TRAVEL_LIMIT = 10;
const TAP_AXIS_LOCK = 10;
const DOUBLE_TAP_WINDOW = 300;
/** Single-tap close waits this long to disambiguate from a double-tap. */
const SINGLE_TAP_DELAY = 300;
/** Page / snap-back animation duration — mirrors the popup fade. */
const ANIMATION_MS = 240;

/** Options accepted by `open()` (mirrors the wd options object). */
export interface SnImagePreviewOptions {
  /** Image URLs; overrides the `images` prop for this session. */
  images?: string[];
  /** Index shown first; overrides `startPosition`. */
  startPosition?: number;
}

/** One hit zone derived from `selector` mode (viewport coordinates). */
interface PreviewHitZone {
  left: number;
  top: number;
  width: number;
  height: number;
}

const props = withDefaults(
  defineProps<{
    /** CSS selector whose matched elements open the viewer (see header). */
    selector?: string;
    /** Image URL list. */
    images?: string[];
    /** Index shown when opened. */
    startPosition?: number;
    /** Show the `current / total` counter. */
    showIndex?: boolean;
    /** Loop from the last image to the first. */
    loop?: boolean;
    /** Render the close button. */
    closeable?: boolean;
    /** Close glyph: a sn-icon registry name; unknown names fall back to the built-in X. */
    closeIcon?: string;
    /** Close-button anchor. */
    closeIconPosition?: ImagePreviewClosePosition;
    /** Tapping the image or the scrim closes the viewer. */
    closeOnClick?: boolean;
    /** Long-press shows the miniprogram QR menu on the image. */
    showMenuByLongpress?: boolean;
    /** Stacking level of the layer. */
    zIndex?: number;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    selector: '',
    images: () => [],
    startPosition: 0,
    showIndex: true,
    loop: true,
    closeable: true,
    closeIcon: 'close',
    closeIconPosition: 'top-right',
    closeOnClick: true,
    showMenuByLongpress: true,
    zIndex: 1000,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'change', payload: { index: number }): void;
  (e: 'long-press', payload: { image: string }): void;
}>();

const instance = getCurrentInstance();

/** Layer visibility — owned here; the popup is driven one-way. */
const visible = ref(false);

/** Images for the current session (`open(options)` may override the prop). */
const sessionImages = ref<string[]>([...props.images]);

/** Current index inside the track. */
const current = ref(0);

/** `selector` hit zones, resolved on open. */
const hitZones = ref<PreviewHitZone[]>([]);

/* ── Guarded uni access ─────────────────────────────────────────────────── */

/** Query chain as returned by `uni.createSelectorQuery()` (subset used here). */
interface SelectorQueryLike {
  in?: (component: unknown) => SelectorQueryLike;
  selectAll?: (selector: string) => {
    boundingClientRect?: (callback: (rects: Array<Partial<PreviewHitZone>> | null) => void) => {
      exec?: () => void;
    };
  };
}

interface SystemInfoLike {
  windowWidth?: number;
  windowHeight?: number;
}

interface UniHost {
  createSelectorQuery?: () => SelectorQueryLike;
  getSystemInfoSync?: () => SystemInfoLike;
}

function getUni(): UniHost | null {
  const host = globalThis as { uni?: UniHost };
  return host.uni ?? null;
}

/** Viewport in px — touch math needs real pixels; tests fall back to 375×667. */
const viewport = ref<{ width: number; height: number }>({ width: 375, height: 667 });

function measureViewport(): void {
  const info = getUni()?.getSystemInfoSync?.();
  viewport.value = {
    width: typeof info?.windowWidth === 'number' && info.windowWidth > 0 ? info.windowWidth : 375,
    height:
      typeof info?.windowHeight === 'number' && info.windowHeight > 0 ? info.windowHeight : 667,
  };
}

/**
 * Resolve the boxes of every element matching `selector` into hit zones.
 *
 * No-op when `selector` is empty or the host has no layout query — the viewer
 * is still fully usable through `open()` / `setActive()`.
 */
function measureHitZones(): void {
  hitZones.value = [];
  if (props.selector === '') return;
  const createSelectorQuery = getUni()?.createSelectorQuery;
  if (typeof createSelectorQuery !== 'function') return;
  try {
    const query = createSelectorQuery();
    if (query === null || query === undefined) return;
    const scoped = typeof query.in === 'function' ? query.in(instance) : query;
    const selection = scoped.selectAll?.(props.selector);
    if (selection?.boundingClientRect === undefined) return;
    selection
      .boundingClientRect((rects) => {
        if (!Array.isArray(rects)) return;
        hitZones.value = rects.map((rect) => ({
          left: rect.left ?? 0,
          top: rect.top ?? 0,
          width: rect.width ?? 0,
          height: rect.height ?? 0,
        }));
      })
      .exec?.();
  } catch {
    // A selector that matches nothing throws on some renderers — stay empty.
    hitZones.value = [];
  }
}

/* ── Gesture state (one interaction at a time) ─────────────────────────── */

/** Horizontal drag offset while paging (px; 0 at rest). */
const dragX = ref(0);
/** Downward drag while dismissing (px; 0 at rest). */
const dismissDy = ref(0);
/** Zoom of the current image (1 = fit). */
const scale = ref(1);
/** Pan of the zoomed image (px). */
const panX = ref(0);
const panY = ref(0);
/** True while a snap / page animation should run (no transition while dragging). */
const animating = ref(false);
/** True while two fingers are down (no transform transition while pinching). */
const pinching = ref(false);

/** Locked axis for the current single-finger gesture. */
let axis: PreviewAxis = null;
let startClientX = 0;
let startClientY = 0;
let startTimestamp = 0;
/** Latest move sample — velocity = (this - previous) / dt. */
let lastMoveX = 0;
let lastMoveY = 0;
let lastMoveTimestamp = 0;
/** Pan baseline when a zoomed pan begins. */
let panStartX = 0;
let panStartY = 0;
/** Pinch baseline (fingers-down distance and scale at that moment). */
let pinchBaseDistance = 0;
let pinchBaseScale = 1;
/** Where the touch began, for tap detection. */
let tapStartX = 0;
let tapStartY = 0;
/** Previous tap (double-tap detection window). */
let lastTapTimestamp = 0;
let lastTapX = 0;
let lastTapY = 0;
/** Pending single-tap close (cancelled by a second tap). */
let tapTimer: ReturnType<typeof setTimeout> | null = null;
/** Post-close gesture reset (waits out the popup leave animation). */
let resetTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers(): void {
  if (tapTimer !== null) {
    clearTimeout(tapTimer);
    tapTimer = null;
  }
  if (resetTimer !== null) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }
}

/** Reset every transient gesture value (zoom, pans, drags, axis). */
function resetGestureState(): void {
  dragX.value = 0;
  dismissDy.value = 0;
  scale.value = 1;
  panX.value = 0;
  panY.value = 0;
  animating.value = false;
  pinching.value = false;
  axis = null;
}

function pageDelta(delta: number): number {
  // Non-loop edges get rubber-band resistance; everything else moves 1:1.
  const atStart = current.value === 0 && delta > 0;
  const atEnd = current.value === sessionImages.value.length - 1 && delta < 0;
  if (!props.loop && (atStart || atEnd)) return rubberBand(delta, 0, 0.15);
  return delta;
}

function handleTouchStart(event: TouchEvent): void {
  if (!visible.value || sessionImages.value.length === 0) return;
  const touches = Array.from(event.touches ?? []);
  if (touches.length === 0) return;
  clearTimers();
  animating.value = false;

  if (touches.length >= 2) {
    // Second finger down: switch to pinch (keep the current zoom as base).
    pinching.value = true;
    axis = null;
    dragX.value = 0;
    dismissDy.value = 0;
    pinchBaseDistance = touchDistance(touches);
    pinchBaseScale = scale.value;
    // Anchor the zoom at the finger midpoint (WeChat grows from where you pinch).
    const midpoint = touchMidpoint(touches);
    if (midpoint !== null) zoomOrigin.value = `${midpoint.x}px ${midpoint.y}px`;
    return;
  }

  const touch = touches[0];
  if (touch === undefined) return;
  startClientX = touch.clientX;
  startClientY = touch.clientY;
  tapStartX = touch.clientX;
  tapStartY = touch.clientY;
  startTimestamp = Date.now();
  lastMoveX = touch.clientX;
  lastMoveY = touch.clientY;
  lastMoveTimestamp = startTimestamp;
  panStartX = panX.value;
  panStartY = panY.value;
  axis = null;
}

function handleTouchMove(event: TouchEvent): void {
  if (!visible.value || sessionImages.value.length === 0) return;
  // Keep the page behind from scrolling while the layer is open (mirrors
  // sn-popup's scroll lock; the pipeline makes this an optional call).
  event.preventDefault();
  const touches = Array.from(event.touches ?? []);
  if (touches.length === 0) return;

  if (touches.length >= 2) {
    const distance = touchDistance(touches);
    scale.value = clampZoom(
      pinchBaseScale * pinchScale(pinchBaseDistance, distance),
      ZOOM_MIN,
      ZOOM_MAX,
    );
    if (scale.value <= ZOOM_MIN) {
      panX.value = 0;
      panY.value = 0;
    }
    return;
  }

  const touch = touches[0];
  if (touch === undefined) return;
  const dx = touch.clientX - startClientX;
  const dy = touch.clientY - startClientY;
  lastMoveX = touch.clientX;
  lastMoveY = touch.clientY;
  lastMoveTimestamp = Date.now();

  if (axis === null) axis = lockAxis(dx, dy, TAP_AXIS_LOCK);

  if (scale.value > ZOOM_MIN) {
    // Zoomed: one finger pans the image inside (or past, with resistance) its bounds.
    const limitX = panLimit(viewport.value.width, scale.value);
    const limitY = panLimit(viewport.value.height, scale.value);
    panX.value = rubberBand(panStartX + dx, limitX, 0.15);
    panY.value = rubberBand(panStartY + dy, limitY, 0.15);
    return;
  }

  if (axis === 'x') {
    dismissDy.value = 0;
    dragX.value = pageDelta(dx);
    return;
  }
  if (axis === 'y') {
    // Only a downward drag dismisses; upward drags stay put until release.
    dragX.value = 0;
    dismissDy.value = dy > 0 ? dy : 0;
  }
}

function handleTouchEnd(event: TouchEvent): void {
  if (!visible.value || sessionImages.value.length === 0) return;
  const touches = Array.from(event.touches ?? []);

  // One finger lifted from a pinch → continue panning with the remaining one.
  if (touches.length >= 2) return;
  if (touches.length === 1) {
    const touch = touches[0];
    if (touch !== undefined) {
      pinching.value = false;
      startClientX = touch.clientX;
      startClientY = touch.clientY;
      panStartX = panX.value;
      panStartY = panY.value;
      axis = scale.value > ZOOM_MIN ? 'x' : null;
      return;
    }
  }

  const duration = Date.now() - startTimestamp;
  const dt = Math.max(1, lastMoveTimestamp - startTimestamp);
  const velocityX = (lastMoveX - startClientX) / dt;
  const velocityY = (lastMoveY - startClientY) / dt;
  const dx = lastMoveX - startClientX;
  const dy = lastMoveY - startClientY;
  pinching.value = false;

  // Tap handling (no axis locked, travel within the envelope).
  if (axis === null && isTapTravel(dx, dy, TAP_TRAVEL_LIMIT) && duration < 400) {
    const now = Date.now();
    const isDoubleTap =
      now - lastTapTimestamp < DOUBLE_TAP_WINDOW &&
      Math.abs(tapStartX - lastTapX) < 40 &&
      Math.abs(tapStartY - lastTapY) < 40;
    lastTapTimestamp = now;
    lastTapX = tapStartX;
    lastTapY = tapStartY;
    if (isDoubleTap) {
      if (tapTimer !== null) {
        clearTimeout(tapTimer);
        tapTimer = null;
      }
      toggleZoomAt(tapStartX, tapStartY);
      return;
    }
    if (props.closeOnClick && scale.value <= ZOOM_MIN) {
      tapTimer = setTimeout(() => {
        tapTimer = null;
        close();
      }, SINGLE_TAP_DELAY);
      return;
    }
  }

  animating.value = true;

  if (scale.value > ZOOM_MIN) {
    // Snap the pan back into bounds (rubber band release).
    const limitX = panLimit(viewport.value.width, scale.value);
    const limitY = panLimit(viewport.value.height, scale.value);
    panX.value = Math.min(limitX, Math.max(-limitX, panX.value));
    panY.value = Math.min(limitY, Math.max(-limitY, panY.value));
    return;
  }

  if (axis === 'x') {
    const direction = shouldPage(dx, velocityX, viewport.value.width) ? (dx < 0 ? 1 : -1) : 0;
    if (direction !== 0) {
      const next = props.loop
        ? (current.value + direction + sessionImages.value.length) % sessionImages.value.length
        : Math.min(sessionImages.value.length - 1, Math.max(0, current.value + direction));
      if (next !== current.value) {
        current.value = next;
        emit('change', { index: next });
      }
    }
    dragX.value = 0;
    return;
  }

  if (axis === 'y') {
    if (shouldDismiss(dismissDy.value, velocityY, viewport.value.height)) {
      close();
      return;
    }
    dismissDy.value = 0;
  }
}

/** Double-tap zoom toggle, anchored at the tapped point (WeChat behaviour). */
function toggleZoomAt(x: number, y: number): void {
  if (scale.value > ZOOM_MIN) {
    scale.value = 1;
    panX.value = 0;
    panY.value = 0;
    return;
  }
  scale.value = ZOOM_DOUBLE_TAP;
  // Anchor: with transform-origin at the tap point the image grows towards it.
  zoomOrigin.value = `${x}px ${y}px`;
  animating.value = true;
}

/** Reset transient state once the leave animation has finished. */
watch(visible, (value) => {
  if (value) return;
  if (resetTimer !== null) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    resetTimer = null;
    resetGestureState();
  }, ANIMATION_MS);
});

onBeforeUnmount(() => {
  // §41: timers are the only resources this component owns.
  clearTimers();
  hitZones.value = [];
  sessionImages.value = [];
});

/* ── Public API ─────────────────────────────────────────────────────────── */

function clampIndex(index: number): number {
  const count = sessionImages.value.length;
  if (count === 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(index)));
}

/** Open the layer (mirrors `wd-image-preview` `open`). */
function open(options: SnImagePreviewOptions = {}): void {
  sessionImages.value = [...(options.images ?? props.images)];
  current.value = clampIndex(options.startPosition ?? props.startPosition);
  resetGestureState();
  measureViewport();
  visible.value = true;
  measureHitZones();
  emit('open');
}

/** Close the layer (mirrors `wd-image-preview` `close`). */
function close(): void {
  if (!visible.value) return;
  visible.value = false;
  emit('close');
}

/** Jump to an index (mirrors `wd-image-preview` `setActive`). */
function setActive(index: number): void {
  const next = clampIndex(index);
  if (next === current.value) return;
  current.value = next;
  emit('change', { index: next });
}

defineExpose({ open, close, setActive });

/* ── Presentation ──────────────────────────────────────────────────────── */

const total = computed(() => sessionImages.value.length);

/** `n / total` counter, empty while the list is empty. */
const counterText = computed(() =>
  total.value === 0 ? '' : `${current.value + 1} / ${total.value}`,
);

/** Close glyph resolved through the sn-icon registry, falling back to X. */
const closeGlyph = computed<IconData>(() => {
  const resolved = props.closeIcon ? resolveIconByName(props.closeIcon) : undefined;
  return resolved ? markRaw(resolved) : XIcon;
});

const closeButtonClass = computed(() => [
  'sn-image-preview__close',
  `sn-image-preview__close--${props.closeIconPosition}`,
]);

const rootClass = computed(() => ['sn-image-preview', props.customClass]);

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined));

/** Zoom / transform origin of the current image ('center' until anchored). */
const zoomOrigin = ref('center center');

/**
 * Track transform: paged position plus the live horizontal drag. Transition
 * only while animating (snap / page) — drags must track the finger 1:1.
 */
const trackStyle = computed(() => {
  const base = -(current.value * viewport.value.width) + dragX.value;
  const parts = [`transform: translate3d(${base}px, 0, 0)`];
  if (animating.value) parts.push(`transition: transform ${ANIMATION_MS}ms ease-out`);
  return parts.join('; ');
});

/**
 * Cell width in px — the track math (translate, pan limits, page thresholds)
 * works in real pixels, so the cells must match `viewport.width` exactly
 * instead of relying on a CSS `100vw` that could drift from it.
 */
const cellSizeStyle = computed(() => `width: ${viewport.value.width}px`);

/**
 * Per-cell style: the current image carries zoom / pan / dismiss transforms.
 * Non-current cells stay at rest so a page flip always starts clean.
 */
function cellStyle(index: number): string {
  if (index !== current.value) return '';
  const parts: string[] = [`transform-origin: ${zoomOrigin.value}`];
  if (scale.value > ZOOM_MIN) {
    parts.push(`transform: translate3d(${panX.value}px, ${panY.value}px, 0) scale(${scale.value})`);
  } else if (dismissDy.value > 0) {
    parts.push(`transform: translate3d(0, ${dismissDy.value}px, 0)`);
  }
  parts.push(
    animating.value || pinching.value
      ? 'transition: none'
      : `transition: transform ${ANIMATION_MS}ms ease-out`,
  );
  return parts.join('; ');
}

/**
 * Curtain fade while dragging down (WeChat: the black backdrop becomes
 * transparent, revealing the page behind).
 */
const curtainStyle = computed(() => {
  if (dismissDy.value <= 0) return '';
  return `opacity: ${dismissOpacity(dismissDy.value, viewport.value.height).toFixed(3)}`;
});

/** Non-undefined views of the props forwarded into child components. */
const zIndexValue = computed(() => props.zIndex);
const showMenuValue = computed(() => props.showMenuByLongpress);
/** Popup panel override: full-bleed, transparent, unpadded. */
const PANEL_STYLE = [
  'width: 100%',
  'height: 100%',
  'max-width: 100%',
  'max-height: 100%',
  'padding: 0',
  'background-color: transparent',
].join('; ');

function onCloseTap(event: Event): void {
  event.stopPropagation();
  close();
}

function onLongPress(): void {
  const image = sessionImages.value[current.value] ?? '';
  if (image === '') return;
  emit('long-press', { image });
}

/** Tapping a hit zone opens the viewer at that zone's index. */
function onHitZoneTap(index: number): void {
  open({ startPosition: index });
}

/** Keep the popup and this component's visibility in one direction. */
function onPopupModelUpdate(value: boolean): void {
  if (value) open();
  else close();
}

function onPopupModalTap(): void {
  if (props.closeOnClick) close();
}
</script>

<template>
  <view v-if="hitZones.length > 0 && !visible" class="sn-image-preview__zones" aria-hidden="true">
    <view
      v-for="(zone, index) in hitZones"
      :key="index"
      class="sn-image-preview__zone"
      :style="`left: ${zone.left}px; top: ${zone.top}px; width: ${zone.width}px; height: ${zone.height}px`"
      @tap="onHitZoneTap(index)"
    />
  </view>

  <SnPopup
    :model-value="visible"
    position="center"
    :z-index="zIndexValue"
    :duration="200"
    :custom-style="PANEL_STYLE"
    @update:model-value="onPopupModelUpdate"
    @click-modal="onPopupModalTap"
  >
    <view
      :class="rootClass"
      :style="rootStyle"
      role="dialog"
      aria-modal="true"
      aria-label="image preview"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
      @longpress="onLongPress"
    >
      <view class="sn-image-preview__curtain" :style="curtainStyle" aria-hidden="true" />

      <view class="sn-image-preview__track" :style="trackStyle">
        <view
          v-for="(image, index) in sessionImages"
          :key="`${index}-${image}`"
          class="sn-image-preview__cell"
          :style="cellSizeStyle"
        >
          <image
            class="sn-image-preview__image"
            :src="image"
            mode="aspectFit"
            :style="cellStyle(index)"
            :show-menu-by-longpress="showMenuValue"
          />
        </view>
        <view v-if="total === 0" class="sn-image-preview__empty">
          <slot />
        </view>
      </view>

      <view v-if="showIndex && counterText" class="sn-image-preview__index" aria-live="polite">
        <slot name="indicator" :current="current" :total="total">
          <text class="sn-image-preview__index-text">{{ counterText }}</text>
        </slot>
      </view>

      <view
        v-if="closeable"
        :class="closeButtonClass"
        role="button"
        aria-label="close"
        @tap="onCloseTap"
      >
        <SnIcon :icon="closeGlyph" :size="30" :stroke-width="1.5" />
      </view>

      <view v-if="$slots.default" class="sn-image-preview__footer">
        <slot :current="current" />
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-image-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Opaque WeChat-style curtain — fades out while dragging down to dismiss. */
.sn-image-preview__curtain {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-solid);
}

/* ── Paged track ───────────────────────────────────────────────────────── */

.sn-image-preview__track {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
  will-change: transform;
}

.sn-image-preview__cell {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
}

.sn-image-preview__image {
  width: 100%;
  height: 100%;
  will-change: transform;
}

/* ── Counter (WeChat: plain white text, top-centre, no pill) ───────────── */

.sn-image-preview__index {
  position: absolute;
  top: var(--sn-mp-spacing-8);
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.sn-image-preview__index-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-normal);
  line-height: var(--sn-mp-font-line-height-normal);
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

/* ── Close button (thin white cross, generous hit area) ────────────────── */

.sn-image-preview__close {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-full);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-image-preview__close--top-right {
  top: var(--sn-mp-spacing-4);
  right: var(--sn-mp-spacing-4);
}

.sn-image-preview__close--top-left {
  top: var(--sn-mp-spacing-4);
  left: var(--sn-mp-spacing-4);
}

/* ── Footer slot ───────────────────────────────────────────────────────── */

.sn-image-preview__footer {
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-4);
}

/* ── Selector hit zones ────────────────────────────────────────────────── */

.sn-image-preview__zones {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  /* Transparent passthrough layer — taps on unmatched areas reach the page. */
  pointer-events: none;
}

.sn-image-preview__zone {
  position: absolute;
  pointer-events: auto;
  background-color: transparent;
}
</style>
