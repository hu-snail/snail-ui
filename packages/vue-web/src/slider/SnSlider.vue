<script setup lang="ts">
/**
 * SnSlider — web-end slider component (naive-ui n-slider parity).
 *
 * Self-drawn track + handle(s) rather than a native input[type=range]
 * so that marks, range dual-handles, vertical and tooltip all share
 * one geometry pipeline. Keyboard + ARIA follow the WAI slider pattern.
 *
 * Per AGENTS.md §30/31: contract surfaces declared via defineProps /
 * defineEmits / defineSlots; all colors flow through --sn-web-* tokens.
 */

import { computed, onBeforeUnmount, ref } from 'vue';

defineOptions({ name: 'SnSlider' });

type SliderValue = number | [number, number];
type Marks = Record<number, string>;
type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

const props = withDefaults(
  defineProps<{
    /** Bound value. `[number, number]` when `range`. */
    modelValue?: SliderValue;
    /** Uncontrolled initial value (naive-ui `default-value`). */
    defaultValue?: SliderValue;
    /** Lower bound. */
    min?: number;
    /** Upper bound. */
    max?: number;
    /** Step increment. Snapping applies to pointer + keyboard. */
    step?: number;
    /** Dual-handle mode. Value is a `[start, end]` pair. */
    range?: boolean;
    /** Disable interaction. */
    disabled?: boolean;
    /** Value visible but not editable. */
    readonly?: boolean;
    /** Vertical orientation. */
    vertical?: boolean;
    /** Invert the axis (right-to-left / top-to-bottom). */
    reverse?: boolean;
    /** Show the value tooltip on hover / drag. */
    tooltip?: boolean;
    /** Format the tooltip content. */
    formatTooltip?: (value: number) => string | number;
    /** Tick marks keyed by value. */
    marks?: Marks;
    /** Tooltip position relative to the handle. */
    placement?: Placement;
    /** Accessible name. */
    ariaLabel?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    disabled: false,
    readonly: false,
    vertical: false,
    reverse: false,
    tooltip: true,
    placement: 'top',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. Fired on every value change. */
  (e: 'update:modelValue', value: SliderValue): void;
  /** Committed change (drag end / keyboard commit / mark click). */
  (e: 'change', value: SliderValue): void;
}>();

defineSlots<{
  /** Custom tooltip content. Receives the current handle value. */
  tooltip?(props: { value: number }): unknown;
}>();

const isInteractive = computed(() => !props.disabled && !props.readonly);
const span = computed(() => props.max - props.min);

/** Clamp to [min, max]. */
function clamp(v: number): number {
  return Math.min(props.max, Math.max(props.min, v));
}

/** Snap a raw value to the step grid (relative to min). */
function snap(v: number): number {
  const stepped = props.min + Math.round((v - props.min) / props.step) * props.step;
  // Guard float drift (0.30000000000000004 style) before clamping.
  return clamp(Number(stepped.toFixed(10)));
}

// ---- value normalization -------------------------------------------------

const localValue = ref<SliderValue>(
  props.defaultValue ?? (props.range ? [props.min, props.max] : props.min),
);

/** Effective value as a `[low, high]` pair, always ordered. */
const pair = computed<[number, number]>(() => {
  const raw = props.modelValue ?? localValue.value;
  if (props.range) {
    if (Array.isArray(raw)) {
      return [clamp(Number(raw[0])), clamp(Number(raw[1]))];
    }
    return [props.min, clamp(Number(raw))];
  }
  const single = clamp(Array.isArray(raw) ? Number(raw[0]) : Number(raw));
  return [single, single];
});

const modelIsArray = computed(() => props.range || Array.isArray(props.modelValue));

function buildValue(low: number, high: number): SliderValue {
  return modelIsArray.value ? [low, high] : low;
}

function emitValue(low: number, high: number, commit: boolean): void {
  const next = buildValue(low, high);
  localValue.value = next;
  emit('update:modelValue', next);
  if (commit) emit('change', next);
}

// ---- geometry ------------------------------------------------------------

/** Percent position of a value on the axis, honoring `reverse`. */
function percentOf(value: number): number {
  const p = span.value === 0 ? 0 : ((value - props.min) / span.value) * 100;
  return props.reverse ? 100 - p : p;
}

const trackStyle = computed(() => {
  const low = pair.value[0];
  const high = pair.value[1];
  const from = Math.min(percentOf(low), percentOf(high));
  const size = Math.abs(percentOf(high) - percentOf(low));
  return props.vertical
    ? { bottom: `${from}%`, height: `${size}%` }
    : { left: `${from}%`, width: `${size}%` };
});

const handlePositions = computed<number[]>(() =>
  props.range ? [percentOf(pair.value[0]), percentOf(pair.value[1])] : [percentOf(pair.value[1])],
);

function handleStyle(pct: number): Record<string, string> {
  return props.vertical ? { bottom: `${pct}%` } : { left: `${pct}%` };
}

const marksList = computed(() =>
  Object.entries(props.marks ?? {}).map(([key, label]) => ({
    value: Number(key),
    label,
    pct: percentOf(Number(key)),
  })),
);

const markStyle = (pct: number): Record<string, string> =>
  props.vertical ? { bottom: `${pct}%` } : { left: `${pct}%` };

// ---- pointer interaction -------------------------------------------------

const trackRef = ref<HTMLDivElement | null>(null);
/** Index into `pair` of the handle being dragged (0 or 1). */
const draggingIndex = ref<number | null>(null);
/** Hovered handle index (drives the tooltip). */
const hoverIndex = ref<number | null>(null);

function activeIndex(): number | null {
  return hoverIndex.value ?? draggingIndex.value;
}

/** Hover / focus drives the tooltip + active visuals — never on disabled/readonly. */
function setHoverIndex(index: number | null): void {
  if (index !== null && !isInteractive.value) return;
  hoverIndex.value = index;
}

function pointerToValue(e: MouseEvent): number {
  const el = trackRef.value;
  if (!el) return pair.value[1];
  const rect = el.getBoundingClientRect();
  let ratio: number;
  if (props.vertical) {
    ratio = rect.height === 0 ? 0 : 1 - (e.clientY - rect.top) / rect.height;
  } else {
    ratio = rect.width === 0 ? 0 : (e.clientX - rect.left) / rect.width;
  }
  ratio = Math.min(1, Math.max(0, ratio));
  if (props.reverse) ratio = 1 - ratio;
  return snap(props.min + ratio * span.value);
}

function onTrackMousedown(e: MouseEvent): void {
  if (!isInteractive.value) return;
  e.preventDefault();
  const raw = pointerToValue(e);
  const [low, high] = pair.value;
  let index = 1;
  if (props.range) {
    // Jump to the closer handle; a click on the track between handles
    // selects the nearest one before starting the drag.
    const dLow = Math.abs(raw - low);
    const dHigh = Math.abs(raw - high);
    index = dLow < dHigh ? 0 : raw <= low ? 0 : raw >= high ? 1 : 1;
  }
  startDrag(e, index);
}

function onHandleMousedown(e: MouseEvent, index: number): void {
  if (!isInteractive.value) return;
  e.preventDefault();
  e.stopPropagation();
  startDrag(e, index);
}

function startDrag(e: MouseEvent, index: number): void {
  draggingIndex.value = index;
  applyPointer(e);
  document.addEventListener('mousemove', onDocumentMousemove);
  document.addEventListener('mouseup', onDocumentMouseup);
}

function onDocumentMousemove(e: MouseEvent): void {
  if (draggingIndex.value === null) return;
  applyPointer(e);
}

function applyPointer(e: MouseEvent): void {
  const raw = pointerToValue(e);
  const [low, high] = pair.value;
  if (!props.range) {
    emitValue(raw, raw, false);
    return;
  }
  if (draggingIndex.value === 0) {
    // Handles may not cross — the low handle is clamped by the high one.
    emitValue(Math.min(raw, high), high, false);
  } else {
    emitValue(low, Math.max(raw, low), false);
  }
}

function onDocumentMouseup(): void {
  if (draggingIndex.value !== null) {
    draggingIndex.value = null;
    const [low, high] = pair.value;
    emit('change', buildValue(low, high));
  }
  document.removeEventListener('mousemove', onDocumentMousemove);
  document.removeEventListener('mouseup', onDocumentMouseup);
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDocumentMousemove);
  document.removeEventListener('mouseup', onDocumentMouseup);
});

function onMarkClick(value: number): void {
  if (!isInteractive.value) return;
  const [low, high] = pair.value;
  if (!props.range) {
    emitValue(value, value, true);
    return;
  }
  // Range: push the nearer edge out to the mark.
  if (Math.abs(value - low) <= Math.abs(value - high)) {
    emitValue(Math.min(value, high), high, true);
  } else {
    emitValue(low, Math.max(value, low), true);
  }
}

// ---- keyboard ------------------------------------------------------------

/** How far one PageUp/PageDown press moves (naive-ui uses 10 × step). */
const pageStep = computed(() => props.step * 10);

function onHandleKeydown(e: KeyboardEvent, index: number): void {
  if (!isInteractive.value) return;
  const [low, high] = pair.value;
  const current = props.range ? (index === 0 ? low : high) : high;
  let next: number | null = null;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = current + (props.reverse ? -props.step : props.step);
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      next = current + (props.reverse ? props.step : -props.step);
      break;
    case 'PageUp':
      next = current + (props.reverse ? -pageStep.value : pageStep.value);
      break;
    case 'PageDown':
      next = current + (props.reverse ? pageStep.value : -pageStep.value);
      break;
    case 'Home':
      next = props.reverse ? props.max : props.min;
      break;
    case 'End':
      next = props.reverse ? props.min : props.max;
      break;
    default:
      return;
  }
  e.preventDefault();
  next = snap(next);
  if (!props.range) {
    emitValue(next, next, true);
    return;
  }
  if (index === 0) emitValue(Math.min(next, high), high, true);
  else emitValue(low, Math.max(next, low), true);
}

// ---- tooltip -------------------------------------------------------------

const tooltipVisible = computed(
  () => props.tooltip && isInteractive.value && activeIndex() !== null,
);

const tooltipText = computed<string>(() => {
  const index = activeIndex() ?? 1;
  const raw = pair.value[props.range ? index : 1] ?? props.min;
  const formatted = props.formatTooltip ? props.formatTooltip(raw) : raw;
  return String(formatted);
});

// ---- misc ----------------------------------------------------------------

const classList = computed(() => [
  'sn-slider',
  {
    'sn-slider--disabled': props.disabled,
    'sn-slider--readonly': props.readonly,
    'sn-slider--vertical': props.vertical,
    'sn-slider--reverse': props.reverse,
    'sn-slider--range': props.range,
    'sn-slider--dragging': draggingIndex.value !== null,
  },
  props.customClass,
]);

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

/** aria-valuenow for a single-value handle (range handles get their own). */
const ariaNow = (index: number): number => pair.value[props.range ? index : 1] ?? props.min;

const ariaText = (index: number): string => {
  const raw = ariaNow(index);
  return props.formatTooltip ? String(props.formatTooltip(raw)) : String(raw);
};
</script>

<template>
  <div
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="'slider'"
    role="group"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <div ref="trackRef" class="sn-slider__rail" @mousedown="onTrackMousedown">
      <div class="sn-slider__track" :style="trackStyle" />
      <div
        v-for="mark in marksList"
        :key="mark.value"
        class="sn-slider__mark"
        :style="markStyle(mark.pct)"
      >
        <button
          type="button"
          class="sn-slider__mark-dot"
          :tabindex="-1"
          :aria-label="`${mark.label} ${mark.value}`"
          @mousedown.stop
          @click="onMarkClick(mark.value)"
        />
        <span class="sn-slider__mark-label">{{ mark.label }}</span>
      </div>
      <template v-for="(pct, index) in handlePositions" :key="index">
        <div
          :class="['sn-slider__handle', { 'sn-slider__handle--active': activeIndex() === index }]"
          :style="handleStyle(pct)"
          role="slider"
          :tabindex="isInteractive ? 0 : -1"
          :aria-label="range ? (index === 0 ? 'Start value' : 'End value') : ariaLabel"
          :aria-valuemin="range && index === 1 ? pair[0] : min"
          :aria-valuemax="range && index === 0 ? pair[1] : max"
          :aria-valuenow="ariaNow(index)"
          :aria-valuetext="ariaText(index)"
          :aria-disabled="disabled ? 'true' : undefined"
          :aria-orientation="vertical ? 'vertical' : 'horizontal'"
          @mousedown="onHandleMousedown($event, index)"
          @mouseenter="setHoverIndex(index)"
          @mouseleave="setHoverIndex(null)"
          @focus="setHoverIndex(index)"
          @blur="setHoverIndex(null)"
          @keydown="onHandleKeydown($event, index)"
        >
          <div
            v-if="tooltipVisible && activeIndex() === index"
            :class="['sn-slider__tooltip', `sn-slider__tooltip--${placement}`]"
            role="tooltip"
          >
            <slot name="tooltip" :value="ariaNow(index)">{{ tooltipText }}</slot>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sn-slider {
  display: inline-flex;
  width: 100%;
  padding: 8px 0;
  box-sizing: border-box;
  color: var(--sn-web-color-text-primary);
  font-family: inherit;
}

.sn-slider__rail {
  position: relative;
  width: 100%;
  height: var(--sn-web-slider-rail-height, 6px);
  margin: 6px 0;
  border-radius: var(--sn-web-slider-radius, 3px);
  background-color: var(
    --sn-web-slider-rail-bg,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.09))
  );
  cursor: pointer;
  align-self: center;
}

.sn-slider--disabled .sn-slider__rail,
.sn-slider--readonly .sn-slider__rail {
  cursor: not-allowed;
}

/* The fill track is an absolute child of the relative rail: horizontal
   stretches full height (inline style owns left/width), vertical anchors
   from the inline `bottom`/`height` pair and stretches the rail column. */
.sn-slider__track {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: inherit;
  background-color: var(--sn-web-slider-track-bg, var(--sn-web-color-action-primary));
}

.sn-slider--vertical .sn-slider__track {
  top: auto;
  left: 0;
  width: 100%;
}

.sn-slider--disabled .sn-slider__track {
  background-color: var(
    --sn-web-slider-track-bg-disabled,
    var(--sn-web-color-action-disabled, rgba(0, 0, 0, 0.25))
  );
}

.sn-slider--vertical {
  display: inline-flex;
  width: auto;
  height: 100%;
}

.sn-slider--vertical .sn-slider__rail {
  width: var(--sn-web-slider-rail-height, 6px);
  height: 100%;
  margin: 0 6px;
}

.sn-slider__handle {
  position: absolute;
  top: 50%;
  width: var(--sn-web-slider-handle-size, 16px);
  height: var(--sn-web-slider-handle-size, 16px);
  border-radius: 50%;
  border: 2px solid var(--sn-web-slider-handle-border-color, var(--sn-web-color-action-primary));
  background-color: var(--sn-web-slider-handle-bg, var(--sn-web-color-background-surface, #fff));
  box-shadow: var(--sn-web-slider-handle-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
  transform: translate(-50%, -50%);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  cursor: grab;
  outline: none;
  z-index: 1;
}

/* Vertical: anchored by the inline `bottom` percent — center across the rail. */
.sn-slider--vertical .sn-slider__handle {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

/* Hover / focus / drag (class-driven, so disabled/readonly never grow). */
.sn-slider__handle--active {
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: var(--sn-web-slider-handle-shadow-active, 0 2px 6px rgba(0, 0, 0, 0.25));
}

.sn-slider--vertical .sn-slider__handle--active {
  transform: translate(-50%, 50%) scale(1.15);
}

.sn-slider__handle:focus-visible {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}

.sn-slider--disabled .sn-slider__handle,
.sn-slider--readonly .sn-slider__handle {
  cursor: not-allowed;
  border-color: var(
    --sn-web-slider-handle-border-color-disabled,
    var(--sn-web-color-action-disabled, rgba(0, 0, 0, 0.25))
  );
  background-color: var(
    --sn-web-slider-handle-bg-disabled,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.09))
  );
  box-shadow: none;
}

.sn-slider--dragging .sn-slider__handle--active {
  cursor: grabbing;
}

.sn-slider__tooltip {
  position: absolute;
  bottom: calc(100% + var(--sn-web-slider-tooltip-gap, 6px));
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 8px;
  border-radius: var(--sn-web-slider-tooltip-radius, 4px);
  background-color: var(
    --sn-web-tooltip-bg,
    var(--sn-web-color-background-elevated, rgba(0, 0, 0, 0.75))
  );
  color: var(--sn-web-tooltip-text-color, var(--sn-web-color-text-inverse, #fff));
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  box-shadow: var(--sn-web-slider-tooltip-shadow, 0 2px 8px rgba(0, 0, 0, 0.25));
  pointer-events: none;
  z-index: 2;
}

.sn-slider__tooltip--bottom {
  bottom: auto;
  top: calc(100% + var(--sn-web-slider-tooltip-gap, 6px));
}

.sn-slider__tooltip--top-start,
.sn-slider__tooltip--bottom-start {
  left: 0;
  transform: none;
}

.sn-slider__tooltip--top-end,
.sn-slider__tooltip--bottom-end {
  left: auto;
  right: 0;
  transform: none;
}

.sn-slider--vertical .sn-slider__tooltip {
  bottom: auto;
  top: 50%;
  left: calc(100% + var(--sn-web-slider-tooltip-gap, 6px));
  transform: translateY(-50%);
}

/* Zero-size origin box: the dot + label position themselves from its
   origin, so centering the box centers the whole mark on the rail. */
.sn-slider__mark {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sn-slider--vertical .sn-slider__mark {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.sn-slider__mark-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--sn-web-slider-mark-size, 6px);
  height: var(--sn-web-slider-mark-size, 6px);
  padding: 0;
  border: none;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--sn-web-slider-mark-bg, var(--sn-web-color-background-surface, #fff));
  cursor: pointer;
}

.sn-slider__mark-label {
  position: absolute;
  top: calc(100% + var(--sn-web-slider-mark-gap, 4px));
  left: 50%;
  transform: translateX(-50%);
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}

.sn-slider--vertical .sn-slider__mark-label {
  top: auto;
  left: calc(100% + var(--sn-web-slider-mark-gap, 4px));
  transform: translateY(-50%);
}
</style>
