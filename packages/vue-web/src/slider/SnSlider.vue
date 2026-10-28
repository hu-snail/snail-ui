<script setup lang="ts">
/**
 * SnSlider — web-end slider component (naive-ui n-slider parity).
 *
 * Self-drawn track + handle(s) rather than a native input[type=range]
 * so that marks, range dual-handles, vertical and tooltip all share
 * one geometry pipeline. Keyboard + ARIA follow the WAI slider pattern.
 *
 * Extras beyond n-slider: `showSteps` step ticks, `showInput` value
 * inputs (single + range), custom track / rail / tooltip backgrounds
 * (solid, gradient or transparent) and a configurable rail thickness.
 *
 * Per AGENTS.md §30/31: contract surfaces declared via defineProps /
 * defineEmits / defineSlots; all colors flow through --sn-web-* tokens.
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';

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
    /** Render a tick at every step between min and max. */
    showSteps?: boolean;
    /** Render number input(s) beside the rail (two + separator in range). */
    showInput?: boolean;
    /** Fill-track background — any CSS background (solid / gradient / transparent). */
    trackBackground?: string;
    /** Rail background — any CSS background (solid / gradient / transparent). */
    railBackground?: string;
    /** Rail thickness in px (horizontal: height; vertical: width). */
    railWidth?: number | string;
    /** Rail diffuse glow — any CSS box-shadow value (blurred translucent halo). */
    railShadow?: string;
    /** Tooltip bubble background — any CSS background value. */
    tooltipBackground?: string;
    /** Tooltip text color. */
    tooltipTextColor?: string;
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
    showSteps: false,
    showInput: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. Fired on every value change. */
  (e: 'update:modelValue', value: SliderValue): void;
  /** Committed change (drag end / keyboard commit / mark click / input commit). */
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

const trackStyle = computed<Record<string, string>>(() => {
  const low = pair.value[0];
  const high = pair.value[1];
  const from = Math.min(percentOf(low), percentOf(high));
  const size = Math.abs(percentOf(high) - percentOf(low));
  const style: Record<string, string> =
    props.vertical
      ? { bottom: `${from}%`, height: `${size}%` }
      : { left: `${from}%`, width: `${size}%` };
  // Custom background wins over the disabled stylesheet color on purpose:
  // authors opting into a gradient get exactly what they declared.
  if (props.trackBackground) style.background = props.trackBackground;
  return style;
});

/** Inline rail overrides — gradient / transparent fill and the diffuse glow. */
const railElStyle = computed<Record<string, string> | undefined>(() => {
  const style: Record<string, string> = {};
  if (props.railBackground) style.background = props.railBackground;
  if (props.railShadow) style.boxShadow = props.railShadow;
  return Object.keys(style).length > 0 ? style : undefined;
});

const handlePositions = computed<number[]>(() =>
  props.range ? [percentOf(pair.value[0]), percentOf(pair.value[1])] : [percentOf(pair.value[1])],
);

/** Anchor an absolutely-positioned element at a percent on the axis. */
function axisStyle(pct: number): Record<string, string> {
  return props.vertical ? { bottom: `${pct}%` } : { left: `${pct}%` };
}

const marksList = computed(() =>
  Object.entries(props.marks ?? {}).map(([key, label]) => ({
    value: Number(key),
    label,
    pct: percentOf(Number(key)),
  })),
);

// ---- step ticks (showSteps) ----------------------------------------------

/** Hard cap — a dense grid (tiny step) must not explode the DOM. */
const MAX_STEP_TICKS = 100;

const stepTicks = computed<number[]>(() => {
  if (!props.showSteps || props.step <= 0 || span.value <= 0) return [];
  const intervals = Math.floor(span.value / props.step + 1e-9);
  // Interior ticks only (min / max are self-evident); guard absurd densities.
  if (intervals < 2 || intervals > MAX_STEP_TICKS) return [];
  const ticks: number[] = [];
  for (let i = 1; i < intervals; i += 1) {
    ticks.push(percentOf(props.min + i * props.step));
  }
  return ticks;
});

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

// ---- showInput -------------------------------------------------------------

const lowInputRef = ref<HTMLInputElement | null>(null);
const highInputRef = ref<HTMLInputElement | null>(null);
const lowDraft = ref('');
const highDraft = ref('');

/** Push current values into the drafts unless that input is being edited. */
function syncDrafts(): void {
  const active = typeof document === 'undefined' ? null : document.activeElement;
  if (active !== lowInputRef.value) lowDraft.value = String(pair.value[0]);
  if (active !== highInputRef.value) highDraft.value = String(pair.value[1]);
}

watch(() => [pair.value[0], pair.value[1]], syncDrafts, { immediate: true });

function inputValueOf(e: Event): string {
  return e.target instanceof HTMLInputElement ? e.target.value : '';
}

function parseDraft(draft: string): number | null {
  const trimmed = draft.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function onLowInput(e: Event): void {
  lowDraft.value = inputValueOf(e);
  const raw = parseDraft(lowDraft.value);
  if (raw === null) return;
  const clamped = clamp(raw);
  if (props.range) {
    emitValue(Math.min(clamped, pair.value[1]), pair.value[1], false);
  } else {
    emitValue(clamped, pair.value[1], false);
  }
}

function onHighInput(e: Event): void {
  highDraft.value = inputValueOf(e);
  const raw = parseDraft(highDraft.value);
  if (raw === null) return;
  emitValue(pair.value[0], Math.max(clamp(raw), pair.value[0]), false);
}

/** Commit on blur / Enter: clamp to bounds; no-op when unchanged. */
function commitLow(): void {
  const raw = parseDraft(lowDraft.value);
  if (raw === null) {
    syncDrafts();
    return;
  }
  const next = clamp(raw);
  if (props.range) {
    const low = Math.min(next, pair.value[1]);
    if (low !== pair.value[0]) emitValue(low, pair.value[1], true);
    else syncDrafts();
    return;
  }
  if (next !== pair.value[0]) emitValue(next, next, true);
  else syncDrafts();
}

function commitHigh(): void {
  const raw = parseDraft(highDraft.value);
  if (raw === null) {
    syncDrafts();
    return;
  }
  const next = Math.max(clamp(raw), pair.value[0]);
  if (next !== pair.value[1]) emitValue(pair.value[0], next, true);
  else syncDrafts();
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

/** Per-instance tooltip color overrides (prop → CSS var → token). */
const tooltipStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {};
  if (props.tooltipBackground) style['--sn-web-slider-tooltip-bg'] = props.tooltipBackground;
  if (props.tooltipTextColor) style['--sn-web-slider-tooltip-text'] = props.tooltipTextColor;
  return style;
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
    'sn-slider--marks': marksList.value.length > 0,
    'sn-slider--show-input': props.showInput,
  },
  props.customClass,
]);

const wrapperStyle = computed<string>(() => {
  const parts: string[] = [];
  if (props.railWidth !== undefined) {
    const width = typeof props.railWidth === 'number' ? `${props.railWidth}px` : props.railWidth;
    parts.push(`--sn-web-slider-rail-width:${width}`);
  }
  if (typeof props.customStyle === 'string') {
    if (props.customStyle) parts.push(props.customStyle);
  } else {
    for (const [key, value] of Object.entries(props.customStyle ?? {})) {
      parts.push(`${key}:${value}`);
    }
  }
  return parts.join(';');
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
    <div class="sn-slider__body">
      <div ref="trackRef" class="sn-slider__rail" :style="railElStyle" @mousedown="onTrackMousedown">
        <div class="sn-slider__track" :style="trackStyle" />
        <i
          v-for="(pct, tickIndex) in stepTicks"
          :key="`tick-${tickIndex}`"
          class="sn-slider__tick"
          :style="axisStyle(pct)"
          aria-hidden="true"
        />
        <div
          v-for="mark in marksList"
          :key="mark.value"
          class="sn-slider__mark"
          :style="axisStyle(mark.pct)"
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
            :style="axisStyle(pct)"
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
              :style="tooltipStyle"
              role="tooltip"
            >
              <slot name="tooltip" :value="ariaNow(index)">{{ tooltipText }}</slot>
            </div>
          </div>
        </template>
      </div>
      <template v-if="showInput">
        <input
          ref="lowInputRef"
          class="sn-slider__input"
          type="number"
          :value="lowDraft"
          :min="min"
          :max="max"
          :step="step"
          :disabled="!isInteractive"
          :aria-label="range ? 'Start value' : ariaLabel || 'Current value'"
          @input="onLowInput"
          @change="commitLow"
          @keydown.enter.prevent="commitLow"
        />
        <span v-if="range" class="sn-slider__input-separator" aria-hidden="true">–</span>
        <input
          v-if="range"
          ref="highInputRef"
          class="sn-slider__input"
          type="number"
          :value="highDraft"
          :min="min"
          :max="max"
          :step="step"
          :disabled="!isInteractive"
          aria-label="End value"
          @input="onHighInput"
          @change="commitHigh"
          @keydown.enter.prevent="commitHigh"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.sn-slider {
  display: inline-flex;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  color: var(--sn-web-color-text-primary);
  font-family: inherit;
}

/* Root padding keeps edge handles (min / max) from sticking out of the box;
   marks reserve extra room below so labels never hit following content. */
.sn-slider--marks {
  padding-bottom: 26px;
}

.sn-slider__body {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
  min-height: 0;
}

.sn-slider__rail {
  position: relative;
  width: 100%;
  height: var(--sn-web-slider-rail-width, var(--sn-web-slider-rail-height, 6px));
  margin: 6px 0;
  /* Optional hairline so a transparent rail still reads as a rail. */
  border: var(--sn-web-slider-rail-border, none);
  border-radius: var(--sn-web-slider-radius, 3px);
  /* `background` (not `background-color`) so both tokens and props accept
     gradients and translucent "diffuse" fills — a flat color var would
     silently drop `linear-gradient(...)`. */
  background: var(
    --sn-web-slider-rail-bg,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.09))
  );
  box-shadow: var(--sn-web-slider-rail-shadow, none);
  cursor: pointer;
  align-self: center;
  box-sizing: border-box;
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
  /* `background` so a gradient or fading (transparent-diffuse) fill works
     through the token as well as through `trackBackground`. */
  background: var(--sn-web-slider-track-bg, var(--sn-web-color-action-primary));
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

/* Step ticks (showSteps): decorative dots centered on the rail. */
.sn-slider__tick {
  position: absolute;
  top: 50%;
  width: var(--sn-web-slider-tick-size, 6px);
  height: var(--sn-web-slider-tick-size, 6px);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--sn-web-slider-tick-bg, var(--sn-web-color-background-surface, #fff));
  box-shadow: var(--sn-web-slider-tick-shadow, 0 0 0 1px rgba(0, 0, 0, 0.06));
  pointer-events: none;
}

.sn-slider--vertical .sn-slider__tick {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.sn-slider--vertical {
  display: inline-flex;
  width: auto;
  height: 100%;
}

.sn-slider--vertical.sn-slider--marks {
  padding-bottom: 8px;
  padding-right: 48px;
}

.sn-slider--vertical .sn-slider__body {
  flex-direction: column;
  height: 100%;
}

.sn-slider--vertical .sn-slider__rail {
  width: var(--sn-web-slider-rail-width, var(--sn-web-slider-rail-height, 6px));
  height: auto;
  flex: 1 1 auto;
  min-height: 24px;
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

/* Bubble colors: prop override (--sn-web-slider-tooltip-*) → shared tooltip
   token → dark fallback, matching SnTooltip so the value is always readable. */
.sn-slider__tooltip {
  position: absolute;
  bottom: calc(100% + var(--sn-web-slider-tooltip-gap, 6px));
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 8px;
  border-radius: var(--sn-web-slider-tooltip-radius, 4px);
  background-color: var(
    --sn-web-slider-tooltip-bg,
    var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95))
  );
  color: var(--sn-web-slider-tooltip-text, var(--sn-web-color-text-on-primary, #fff));
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

.sn-slider--vertical .sn-slider__tooltip--left,
.sn-slider--vertical .sn-slider__tooltip--left-start,
.sn-slider--vertical .sn-slider__tooltip--left-end {
  left: auto;
  right: calc(100% + var(--sn-web-slider-tooltip-gap, 6px));
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

/* Labels hang off the rail center by half the rail thickness + gap, so they
   clear both the rail and the 16px handle for any rail thickness. */
.sn-slider__mark-label {
  position: absolute;
  top: calc(
    var(--sn-web-slider-rail-width, var(--sn-web-slider-rail-height, 6px)) / 2 +
      var(--sn-web-slider-mark-gap, 8px)
  );
  left: 50%;
  transform: translateX(-50%);
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}

.sn-slider--vertical .sn-slider__mark-label {
  top: 0;
  left: calc(
    var(--sn-web-slider-rail-width, var(--sn-web-slider-rail-height, 6px)) / 2 +
      var(--sn-web-slider-mark-gap, 8px)
  );
  transform: translateY(-50%);
}

/* showInput: plain number inputs pinned beside the rail (two + separator
   in range mode, stacked below the rail in vertical mode). */
.sn-slider__input {
  flex: none;
  width: var(--sn-web-slider-input-width, 72px);
  height: 28px;
  margin-left: 12px;
  padding: 0 8px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-slider-input-radius, 4px);
  background-color: var(--sn-web-color-background-surface, #fff);
  color: inherit;
  font-family: inherit;
  font-size: 13px;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  appearance: textfield;
  -moz-appearance: textfield;
}

.sn-slider__input::-webkit-outer-spin-button,
.sn-slider__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.sn-slider__input:focus-visible {
  border-color: var(--sn-web-color-action-primary);
}

.sn-slider__input:disabled {
  cursor: not-allowed;
  border-color: var(--sn-web-color-border-default);
  background-color: var(--sn-web-color-background-subtle, rgba(0, 0, 0, 0.04));
  color: var(--sn-web-color-text-disabled);
}

.sn-slider__input-separator {
  flex: none;
  margin: 0 8px 0 12px;
  color: var(--sn-web-color-text-secondary);
}

.sn-slider--vertical .sn-slider__input {
  margin-left: 0;
  margin-top: 8px;
}

.sn-slider--vertical .sn-slider__input-separator {
  display: none;
}
</style>
