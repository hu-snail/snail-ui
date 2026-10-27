<script setup lang="ts">
/**
 * sn-signature (uni-end) — touch signature pad.
 *
 * Reference library: wot-ui `wd-signature`
 *   (https://wot-ui.cn/component/signature.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-signature 1:1 except
 * for the documented omissions. Anything new added here MUST also be added to
 * the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-signature/sn-signature.vue
 * → auto-registered as `<sn-signature>` in any .vue that uses it.
 *
 * ## Rendering without `<canvas>` (CONTRIBUTING §2.3)
 *
 * The cross-end element allowlist for this package is `view` / `text` /
 * `image` / `scroll-view` / `input`. `<canvas>` is not in it, so the stroke is
 * drawn as a chain of absolutely positioned, rotated `<view>` bars: one bar per
 * consecutive point pair, `width` = the segment length + one line width,
 * `transform: rotate(θ)` about the left edge. The result is a real polyline that
 * renders on every uni target — no canvas, no `document`, no image export.
 *
 * ## Smoothness and the desktop fix (see sn-signature-strokes.ts / -mouse.ts)
 *
 *   - **连贯性**: every bar is extended by one line width and capped round,
 *     so bar N's tail covers the joint at its `to` point — no wedge gaps at
 *     kinks, the chain reads as one continuous rounded stroke.
 *   - **丝滑 / 性能**: moves are distance-sampled (≥2 design px), so the node
 *     count stays flat at high sample rates; the live stroke renders bars
 *     incrementally while drawing and re-renders committed strokes only on
 *     stroke end.
 *   - **desktop**: browsers do not translate mouse drags into touch events,
 *     so the touch-only pad was dead on the desktop H5 demo.
 *     `bindMouseDrawing` (pattern of sn-picker-view-drag, §112.3a) feeds the
 *     same handlers from `mousedown/mousemove/mouseup` on `document`, with
 *     synthetic-event suppression and a full disposer (§41).
 *
 * ## Documented divergences (CONTRIBUTING §9)
 *
 *   - Image export: `file-type`, `quality`, `export-scale` ARE declared so a
 *     wd-signature config type-checks unchanged, but they have no effect here.
 *     `uni.canvasToTempFilePath` needs a `<canvas>`, which is outside the
 *     allowlist above; `confirm` therefore reports the stroke geometry
 *     (`paths` / `isEmpty`) and the host decides how to rasterize it — it
 *     applies these three values when it does.
 *   - Pressure simulation: `pressure`, `max-width`, `min-width`, `min-speed`
 *     are declared for parity but inert — speed-based width needs per-move
 *     velocity sampling that is not reliable across MP renderers.
 *   - `penColor` defaults to `''` (the token color) rather than wot-ui's
 *     literal `#000`, so the pad never hard-codes a color (AGENTS.md §34).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 图片导出 / 上传 — 由宿主用 `paths` 或自行绘制
 *   - 业务字段校验 — 用 sn-form-item
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { barsOf, dotsOf, shouldSample } from './sn-signature-strokes';
import type { SignaturePoint, SignatureSegment } from './sn-signature-strokes';
import { bindMouseDrawing } from './sn-signature-mouse';

defineOptions({ name: 'SnSignature' });

/* Point / segment geometry lives in sn-signature-strokes.ts (single source). */
type SignaturePaths = SignaturePoint[][];

/** Payload of the `confirm` event. */
export interface SignatureResult {
  /** Stroke geometry (px design units, pad-relative). */
  paths: SignaturePaths;
  /** Whether the pad has no stroke at all. */
  isEmpty: boolean;
}

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-signature` 1:1 surface ──────────────────────────────── */

    /** Stroke color (CSS color). Empty = `--sn-mp-color-text-primary`. */
    penColor?: string;
    /** Stroke width in px design units. */
    lineWidth?: number;
    /** Confirm button label. */
    confirmText?: string;
    /** Clear button label. */
    clearText?: string;
    /** Undo button label. */
    revokeText?: string;
    /** Redo button label. */
    restoreText?: string;
    /** Undo button label (`undo-text`; wins over `revokeText` when set). */
    undoText?: string;
    /** Redo button label (`redo-text`; wins over `restoreText` when set). */
    redoText?: string;
    /** Disables drawing and every button. */
    disabled?: boolean;
    /** Pad height. A number is an rpx design value. */
    height?: string | number | undefined;
    /** Pad width. A number is an rpx design value. */
    width?: string | number | undefined;
    /** Pad background color (CSS color). Empty = token default. */
    backgroundColor?: string;
    /** Intercept touchmove so the page behind cannot scroll while drawing. */
    disableScroll?: boolean;
    /** Keep an undo / redo history. */
    enableHistory?: boolean;
    /** Number of strokes undo / redo moves per tap. */
    step?: number;
    /*
     * Export / pressure props — declared for wd-signature parity, inert here
     * (see the header). The host applies the export trio when it rasterizes
     * the geometry reported by `confirm`.
     */
    /** Export image type. */
    fileType?: 'png' | 'jpg';
    /** Export image quality, 0–1. */
    quality?: number;
    /** Export scale factor. */
    exportScale?: number;
    /** Enable pressure simulation. */
    pressure?: boolean;
    /** Max stroke width under pressure (design px). */
    maxWidth?: number;
    /** Min stroke width under pressure (design px). */
    minWidth?: number;
    /** Minimum pointer speed before pressure widening kicks in. */
    minSpeed?: number;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    penColor: '',
    lineWidth: 3,
    confirmText: '确认',
    clearText: '清空',
    revokeText: '撤回',
    restoreText: '恢复',
    undoText: '',
    redoText: '',
    disabled: false,
    height: undefined,
    width: undefined,
    backgroundColor: '',
    disableScroll: true,
    enableHistory: false,
    step: 1,
    fileType: 'png',
    quality: 0.92,
    exportScale: 1,
    pressure: false,
    maxWidth: 4,
    minWidth: 2,
    minSpeed: 1.5,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'start', event: Event): void;
  (e: 'end', event: Event): void;
  (e: 'signing', event: Event): void;
  (e: 'confirm', result: SignatureResult): void;
  (e: 'clear'): void;
}>();

const instance = getCurrentInstance();

/* ── Stroke state ──────────────────────────────────────────────────────── */

/** Committed strokes. */
const strokes = ref<SignaturePaths>([]);
/** The stroke currently being drawn. */
const current = ref<SignaturePoint[]>([]);
/** Strokes removed by undo, kept for redo. */
const undone = ref<SignaturePaths>([]);
/** Whether a finger (or the desktop mouse) is down. */
const drawing = ref(false);
/** Bars of the live stroke, appended incrementally while drawing. */
const liveBars = ref<SignatureSegment[]>([]);
/** Bars of the finished strokes — recomputed only on stroke / undo / clear. */
const committedBars = ref<SignatureSegment[][]>([]);

/** History depth guard — very long sessions must not grow without bound. */
const MAX_STROKES = 200;

function resetHistory(): void {
  undone.value = [];
}

function onClear(): void {
  if (props.disabled) return;
  strokes.value = [];
  current.value = [];
  committedBars.value = [];
  resetHistory();
  emit('clear');
}

/** Undo `step` strokes (wd-signature `revoke`). */
function revoke(): void {
  if (props.disabled || !props.enableHistory) return;
  const count = Math.max(Math.floor(props.step), 1);
  const taken = strokes.value.slice(-count);
  if (taken.length === 0) return;
  undone.value = [...undone.value, ...taken];
  strokes.value = strokes.value.slice(0, strokes.value.length - taken.length);
  committedBars.value = committedBars.value.slice(0, strokes.value.length);
}

/** Redo `step` strokes (wd-signature `restore`). */
function restore(): void {
  if (props.disabled || !props.enableHistory) return;
  const count = Math.max(Math.floor(props.step), 1);
  const taken = undone.value.slice(-count);
  if (taken.length === 0) return;
  undone.value = undone.value.slice(0, undone.value.length - taken.length);
  strokes.value = [...strokes.value, ...taken];
  committedBars.value = [...committedBars.value, ...taken.map((s) => barsOf(s, props.lineWidth))];
}

const canUndo = computed(() => props.enableHistory && strokes.value.length > 0);
const canRedo = computed(() => props.enableHistory && undone.value.length > 0);

const isEmpty = computed(() => strokes.value.length === 0 && current.value.length === 0);

/* ── Touch ─────────────────────────────────────────────────────────────── */

const padRef = ref<{ getBoundingClientRect?: () => { left: number; top: number } } | null>(null);

/**
 * Pad origin in viewport coordinates, cached from a guarded selector query.
 * Mini-programs have no DOM  on template refs, so the
 * stroke offset would drift by the pad position without this (H5 reads the
 * live box synchronously and never needs the cache).
 */
const padOrigin = ref<{ left: number; top: number }>({ left: 0, top: 0 });

interface PadQueryLike {
  in?: (component: unknown) => PadQueryLike;
  select?: (selector: string) => {
    boundingClientRect?: (callback: (rect: { left: number; top: number } | null) => void) => {
      exec?: () => void;
    };
  };
}

/** Refresh the cached pad origin (mini-program path; no-op without a host). */
function measurePadOrigin(): void {
  const host = (globalThis as { uni?: { createSelectorQuery?: () => PadQueryLike } }).uni;
  const createSelectorQuery = host?.createSelectorQuery;
  if (typeof createSelectorQuery !== 'function') return;
  try {
    const query = createSelectorQuery();
    if (query === null || query === undefined) return;
    const scoped = typeof query.in === 'function' ? query.in(instance) : query;
    const selection = scoped.select?.('.sn-signature__pad');
    if (selection?.boundingClientRect === undefined) return;
    selection
      .boundingClientRect((rect) => {
        if (rect === null) return;
        padOrigin.value = { left: rect.left, top: rect.top };
      })
      .exec?.();
  } catch {
    // A host without layout queries keeps the last (or zero) origin.
  }
}

/** Read the pointer position relative to the pad, in px design units. */
function pointOf(event: Event): SignaturePoint | null {
  const detail = event as unknown as {
    touches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>;
    changedTouches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>;
    detail?: { x?: number; y?: number };
  };
  const list = detail.touches ?? detail.changedTouches;
  const raw = list && list.length > 0 ? list[0] : undefined;
  let x = raw && typeof raw.clientX === 'number' ? raw.clientX : undefined;
  let y = raw && typeof raw.clientY === 'number' ? raw.clientY : undefined;
  if (x === undefined && raw && typeof raw.pageX === 'number') x = raw.pageX;
  if (y === undefined && raw && typeof raw.pageY === 'number') y = raw.pageY;
  if (x === undefined && detail.detail && typeof detail.detail.x === 'number') x = detail.detail.x;
  if (y === undefined && detail.detail && typeof detail.detail.y === 'number') y = detail.detail.y;
  if (x === undefined || y === undefined) return null;
  // H5: the live DOM box is exact. MP: fall back to the cached query origin.
  const rect = padRef.value?.getBoundingClientRect?.();
  const left = rect?.left ?? padOrigin.value.left;
  const top = rect?.top ?? padOrigin.value.top;
  return { x: x - left, y: y - top };
}

/** Common pen-down path (touch and desktop mouse). */
function beginStroke(point: SignaturePoint): void {
  measurePadOrigin();
  drawing.value = true;
  current.value = [point];
  liveBars.value = [];
  resetHistory();
}

/**
 * Common pen-move path. Distance sampling keeps the node count flat.
 * Returns false when the move was below the sample threshold (no new point,
 * no bar) — callers must not report a signing event for it.
 */
function extendStroke(point: SignaturePoint): boolean {
  const last = current.value[current.value.length - 1];
  if (!shouldSample(last, point)) return false;
  const from = last;
  current.value = [...current.value, point];
  if (from !== undefined) {
    // Append one bar incrementally — no recompute of the whole stroke.
    const bars = barsOf([from, point], props.lineWidth);
    const bar = bars[bars.length - 1];
    if (bar !== undefined) liveBars.value = [...liveBars.value, bar];
  }
  return true;
}

/** Common pen-up path: commit the stroke and its bars once. */
function endStroke(): void {
  const stroke = current.value;
  current.value = [];
  liveBars.value = [];
  // A single point is a deliberate dot, not noise — commit it so a quick tap
  // still leaves a mark (matches wd-signature's tap behaviour).
  if (stroke.length > 0) {
    const next = [...strokes.value, stroke];
    strokes.value = next.length > MAX_STROKES ? next.slice(next.length - MAX_STROKES) : next;
    committedBars.value = [...committedBars.value, barsOf(stroke, props.lineWidth)];
  }
}

function onTouchStart(event: Event): void {
  if (props.disabled) return;
  const point = pointOf(event);
  if (!point) return;
  beginStroke(point);
  emit('start', event);
}

function onTouchMove(event: Event): void {
  if (props.disabled || !drawing.value) return;
  if (props.disableScroll) event.preventDefault();
  const point = pointOf(event);
  if (!point) return;
  if (!extendStroke(point)) return;
  emit('signing', event);
}

function onTouchEnd(event: Event): void {
  if (!drawing.value) return;
  drawing.value = false;
  endStroke();
  emit('end', event);
}

function onTouchCancel(): void {
  drawing.value = false;
  current.value = [];
  liveBars.value = [];
}

/* ── Confirm ───────────────────────────────────────────────────────────── */

function confirm(): void {
  if (props.disabled) return;
  emit('confirm', { paths: strokes.value.slice(), isEmpty: isEmpty.value });
}

defineExpose({ confirm, clear: onClear, revoke, restore, init: resetHistory });

/* ── Desktop H5 mouse drawing (§112.3a; see sn-signature-mouse.ts) ─────── */

let disposeMouse: (() => void) | null = null;

onMounted(() => {
  measurePadOrigin();
  const pad = padRef.value as HTMLElement | null;
  if (pad === null) return;
  disposeMouse = bindMouseDrawing(pad, {
    begin: (point) => {
      if (props.disabled) return;
      beginStroke(point);
      emit('start', new Event('signstart'));
    },
    extend: (point) => {
      if (props.disabled || !drawing.value) return;
      if (!extendStroke(point)) return;
      emit('signing', new Event('signmove'));
    },
    end: () => {
      if (!drawing.value) return;
      drawing.value = false;
      endStroke();
      emit('end', new Event('signend'));
    },
    isDisabled: () => props.disabled,
    isTouchActive: () => drawing.value,
  });
});

onBeforeUnmount(() => {
  disposeMouse?.();
  disposeMouse = null;
});

/* ── Presentation ──────────────────────────────────────────────────────── */

const RATIO = 2;

const configuredStep = computed(() => Math.max(Math.floor(props.step), 1));

const rootClass = computed(() => [
  'sn-signature',
  {
    'sn-signature--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const vars: string[] = [];
  if (props.penColor) vars.push(`--sn-signature-pen-color: ${props.penColor}`);
  if (props.backgroundColor) vars.push(`--sn-signature-pad-bg: ${props.backgroundColor}`);
  if (props.height !== undefined) {
    vars.push(
      `--sn-signature-height: ${typeof props.height === 'number' ? `${props.height * RATIO}rpx` : props.height}`,
    );
  }
  if (props.width !== undefined) {
    vars.push(
      `--sn-signature-width: ${typeof props.width === 'number' ? `${props.width * RATIO}rpx` : props.width}`,
    );
  }
  vars.push(`--sn-signature-line-width: ${props.lineWidth * RATIO}rpx`);
  const base = vars.join('; ');
  if (!props.customStyle) return base;
  return base ? `${base}; ${props.customStyle}` : props.customStyle;
});

/**
 * Bars for the template: committed strokes come from the cache (rebuilt only
 * on stroke end / undo / redo / clear / lineWidth change), the live stroke
 * appends incrementally — a fast stroke never re-walks the whole path.
 */
const barGroups = computed(() => {
  const groups: SignatureSegment[][] = [...committedBars.value];
  if (liveBars.value.length > 0) groups.push(liveBars.value);
  return groups.filter((bars) => bars.length > 0);
});

/** lineWidth changes re-scale every bar — rebuild the cache once. */
watch(
  () => props.lineWidth,
  () => {
    committedBars.value = strokes.value.map((stroke) => barsOf(stroke, props.lineWidth));
  },
);

function barStyle(bar: SignatureSegment): string {
  return [
    `left: ${bar.left * RATIO}rpx`,
    `top: ${bar.top * RATIO}rpx`,
    `width: ${bar.width * RATIO}rpx`,
    `transform: rotate(${bar.angle}deg)`,
  ].join('; ');
}
/** Single-point taps render as a dot so a quick tap still leaves a mark. */
const dotPoints = computed(() => dotsOf([...strokes.value, current.value]));

function dotStyle(point: SignaturePoint): string {
  return `left: ${point.x * RATIO}rpx; top: ${point.y * RATIO}rpx`;
}

const undoLabel = computed(() => props.undoText || props.revokeText);
const redoLabel = computed(() => props.redoText || props.restoreText);

/** Freeze the history into a plain value so nothing reactive leaks out. */
function historySnapshot(): SignaturePaths {
  return strokes.value.map((stroke) => stroke.map((point) => ({ ...point })));
}

const canUndoLabel = computed(() => `${undoLabel.value} (${strokes.value.length})`);
const canRedoLabel = computed(() => `${redoLabel.value} (${undone.value.length})`);
const stepHint = computed(() => String(configuredStep.value));
const historySnapshotHint = computed(() => String(historySnapshot().length));
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'signature'"
    role="group"
    aria-label="signature pad"
  >
    <view
      ref="padRef"
      class="sn-signature__pad"
      :aria-disabled="props.disabled ? 'true' : undefined"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
    >
      <view
        v-for="(bars, groupIndex) in barGroups"
        :key="'group-' + groupIndex"
        class="sn-signature__stroke"
        aria-hidden="true"
      >
        <view
          v-for="(bar, barIndex) in bars"
          :key="barIndex"
          class="sn-signature__bar"
          :style="barStyle(bar)"
        />
      </view>

      <view
        v-for="(point, index) in dotPoints"
        :key="`dot-${index}`"
        class="sn-signature__dot"
        :style="dotStyle(point)"
        aria-hidden="true"
      />

      <view v-if="props.disabled" class="sn-signature__scrim" aria-hidden="true" />
    </view>

    <view class="sn-signature__footer">
      <view
        class="sn-signature__button"
        role="button"
        :aria-label="props.clearText"
        :aria-disabled="props.disabled ? 'true' : undefined"
        :tabindex="props.disabled ? -1 : 0"
        @tap="onClear"
        >{{ props.clearText }}</view
      >

      <view
        v-if="props.enableHistory"
        :class="['sn-signature__button', { 'sn-signature__button--disabled': !canUndo }]"
        role="button"
        :aria-label="canUndoLabel"
        :aria-disabled="!canUndo ? 'true' : undefined"
        @tap="revoke"
        >{{ undoLabel }}</view
      >

      <view
        v-if="props.enableHistory"
        :class="['sn-signature__button', { 'sn-signature__button--disabled': !canRedo }]"
        role="button"
        :aria-label="canRedoLabel"
        :aria-disabled="!canRedo ? 'true' : undefined"
        @tap="restore"
        >{{ redoLabel }}</view
      >

      <view
        :class="[
          'sn-signature__button',
          'sn-signature__button--primary',
          { 'sn-signature__button--disabled': props.disabled },
        ]"
        role="button"
        :aria-label="props.confirmText"
        @tap="confirm"
        >{{ props.confirmText }}</view
      >
    </view>

    <text class="sn-signature__meta" aria-live="polite"
      >{{ stepHint }} · {{ historySnapshotHint }}</text
    >
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-signature {
  display: block;
  font-family: inherit;
}

.sn-signature__pad {
  position: relative;
  width: var(--sn-signature-width, 100%);
  height: var(--sn-signature-height, 400rpx);
  overflow: hidden;
  box-sizing: border-box;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-signature-pad-bg, var(--sn-mp-color-background-surface));
}

.sn-signature__stroke {
  position: absolute;
  top: 0;
  left: 0;
}

/* One bar per point pair; `transform-origin` pins the rotation to the left
 * edge so consecutive bars chain into a polyline. */
.sn-signature__bar {
  position: absolute;
  height: var(--sn-signature-line-width);
  margin-top: calc(var(--sn-signature-line-width) / -2);
  transform-origin: 0 50%;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-signature-pen-color, var(--sn-mp-color-text-primary));
}

.sn-signature__dot {
  position: absolute;
  width: var(--sn-signature-line-width);
  height: var(--sn-signature-line-width);
  margin-left: calc(var(--sn-signature-line-width) / -2);
  margin-top: calc(var(--sn-signature-line-width) / -2);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-signature-pen-color, var(--sn-mp-color-text-primary));
}

.sn-signature__scrim {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-signature__footer {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin-top: var(--sn-mp-spacing-3);
}

.sn-signature__button {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sn-mp-button-height-medium);
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-signature__button--primary {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-signature__button--disabled {
  opacity: 0.5;
}

/* Assistive-tech echo of the step / stroke counters. */
.sn-signature__meta {
  position: absolute;
  width: 2rpx;
  height: 2rpx;
  overflow: hidden;
  opacity: 0;
}

/* Doodle skin — hand-drawn pad frame. */
.snui-skin-doodle .sn-signature__pad {
  border-width: 4rpx;
  border-color: var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
