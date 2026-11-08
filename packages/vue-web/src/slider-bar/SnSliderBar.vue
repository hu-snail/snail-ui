<script setup lang="ts">
/**
 * SnSliderBar — capsule (bar) slider for the web end.
 *
 * Split out of `SnSlider`'s capsule variants so a bar-style control (volume,
 * brightness, progress scrub, dimmer column) is a first-class component with
 * its own contract instead of a `variant` branch on the plain rail.
 *
 * Behaviour is the WAI-ARIA slider pattern, identical to SnSlider:
 * click / drag / keyboard (arrows, Home / End, PageUp / PageDown), step
 * snapping, non-crossing dual handles, `reverse` and a disabled / read-only
 * mode. What differs is the surface: a neutral bar whose filled part is
 * painted in the theme color, an optional inline read-out and — with
 * `variant="column"` — a vertical strip.
 *
 * Per AGENTS.md §30/31: contract surfaces declared via defineProps /
 * defineEmits / defineSlots; all colors flow through --sn-web-* tokens.
 * The track length is measured in px (not resolved from CSS percentages):
 * a bar track is an auto-sized box, so the fill / thumb maths need a real
 * length; a ResizeObserver keeps it fresh.
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';

defineOptions({ name: 'SnSliderBar' });

type SliderValue = number | [number, number];
type BarVariant = 'bar' | 'column' | 'aurora';
/** Caption style — `percent` reads the share of the axis, `value` the raw value. */
type BarFormat = 'percent' | 'value';

export interface SnSliderBarLabel {
  value: number;
  /** Active level label ('' when no `levels` are configured). */
  level: string;
  /** Index of the active level (-1 without levels). */
  levelIndex: number;
  percent: number;
  min: number;
  max: number;
  /** Index of the handle the caption describes (end handle in range mode). */
  index: number;
  range: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Bound value. `[number, number]` when `range`. */
    modelValue?: SliderValue;
    /** Uncontrolled initial value. */
    defaultValue?: SliderValue;
    /** Lower bound. */
    min?: number;
    /** Upper bound. */
    max?: number;
    /** Step increment (pointer + keyboard). */
    step?: number;
    /** Dual-handle mode; handles never cross. */
    range?: boolean;
    /** Disable interaction. */
    disabled?: boolean;
    /** Value visible but not editable. */
    readonly?: boolean;
    /** Invert the axis (RTL / bottom-up). */
    reverse?: boolean;
    /** `bar` horizontal capsule, `column` vertical strip. */
    variant?: BarVariant;
    /**
     * Visual theme. `aurora` paints the fill with a gradient, overlays a
     * drifting star field and swaps in a large round thumb (hero / media
     * scrubber look). `bar` / `column` keep the neutral flat surface.
     */
    theme?: 'default' | 'aurora';
    /** Aurora fill gradient — any CSS `background` value. */
    gradient?: string;
    /** Aurora star-field density (0 = off). */
    sparkles?: number;
    /** Disable the aurora drift / twinkle animation. */
    animated?: boolean;
    /** Show the inline read-out inside the bar. */
    showValue?: boolean;
    /**
     * Where the `#icon` slot renders: `leading` (before the track, outside
     * the fill) or `inside` (painted onto the fill so it rides the value).
     */
    iconPlacement?: 'leading' | 'inside' | 'trailing';
    /** Caption text painted INSIDE the bar at the leading edge. */
    label?: string;
    /** Caption text painted INSIDE the bar at the trailing edge. */
    suffix?: string;
    /**
     * Colour of the in-track text / glyph while the bar HAS a value. `aurora`
     * defaults to white; the gradient is painted behind it.
     */
    innerColor?: string;
    /** Colour of the in-track text / glyph at value 0 (the "empty" hint). */
    innerColorEmpty?: string;
    /** Leading glyph painted inside the head of the track. */
    leadingIcon?: string;
    /** Trailing glyph painted inside the tail of the track. */
    trailingIcon?: string;
    /**
     * Discrete levels — when set, the bar reads the active level instead of a
     * percentage and (with `showLevels`) marks the steps on the track.
     */
    levels?: Array<{ value: number; label: string; icon?: string }>;
    /** Draw a tick per level on the track. */
    showLevels?: boolean;
    /** Minimum levels before a value may switch to the next level (hysteresis). */
    levelThreshold?: number;
    /** Caption source: `percent` (default) or the raw value. */
    format?: BarFormat;
    /** Fully custom caption text (wins over `format`). */
    formatValue?: (value: number, percent: number) => string;
    /** Suffix appended to the default caption (`%` by default). */
    valueSuffix?: string;
    /** Show the drag bubble. */
    tooltip?: boolean;
    /** Format the tooltip content. */
    formatTooltip?: (value: number) => string | number;
    /** Bubble placement, 12 positions (horizontal) or left / right (column). */
    placement?: string;
    /** Fill background — any CSS background (solid / gradient / transparent). */
    fillBackground?: string;
    /** Bar background — any CSS background (solid / gradient / transparent). */
    barBackground?: string;
    /** Bar thickness in px (horizontal: height, column: width). */
    thickness?: number | string;
    /**
     * Size tier — a shortcut for the thickness / radius scale, mirroring the
     * button sizes: small 28 / medium 40 / large 52 (px).
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Explicit height — any CSS length. Horizontal bars use it as the whole
     * control height (track + caption row); the column variant uses it as the
     * strip height.
     */
    height?: string | number;
    /** Bar corner radius — any CSS length (defaults to the radius token). */
    radius?: string;
    /** Column variant: fade the unfilled part away from the fill edge. */
    fade?: boolean;
    /** Column variant: hide the caption and read the value from the tooltip. */
    tooltipOnly?: boolean;
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
    reverse: false,
    variant: 'bar',
    theme: 'default',
    animated: true,
    showValue: false,
    iconPlacement: 'inside',
    showLevels: true,
    size: 'medium',
    levelThreshold: 0.5,
    format: 'percent',
    valueSuffix: '%',
    tooltip: true,
    placement: 'top',
    fade: true,
    tooltipOnly: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. Fired on every value change. */
  (e: 'update:modelValue', value: SliderValue): void;
  /** Committed change (drag end / keyboard commit / input commit). */
  (e: 'change', value: SliderValue): void;
}>();

defineSlots<{
  /** Custom tooltip content. Receives the handle value. */
  tooltip?(props: { value: number }): unknown;
  /** Leading glyph inside the bar (opt-in — nothing renders by default). */
  icon?(): unknown;
  /** Custom head glyph next to the track (overrides `leadingIcon`). */
  start?(): unknown;
  /** Custom tail glyph next to the track. */
  end?(): unknown;
  /** Inline read-out content; defaults to the formatted caption. */
  value?(props: SnSliderBarLabel): unknown;
}>();

const isInteractive = computed(() => !props.disabled && !props.readonly);
const span = computed(() => props.max - props.min);
const isColumn = computed(() => props.variant === 'column');
/** Aurora theme — gradient fill + drifting stars + round thumb. */
const isAurora = computed(() => props.theme === 'aurora');
const sparkleCount = computed(() => {
  if (!isAurora.value || !props.animated) return 0;
  const n = props.sparkles ?? 14;
  return Math.max(0, Math.min(40, Math.round(n)));
});
/** Deterministic pseudo-random star layout (stable across renders). */
const sparkleDots = computed(() =>
  Array.from({ length: sparkleCount.value }, (_, i) => {
    const seed = (i + 1) * 2654435761;
    const x = ((seed >>> 8) % 1000) / 10;
    const y = 18 + (((seed >>> 3) % 700) / 10);
    const size = 1 + (((seed >>> 5) % 3) as number);
    const delay = ((seed >>> 7) % 40) / 10;
    return { x, y, size: size * 1.5, delay };
  }),
);

/** Aurora gradient default — violet → periwinkle, left to right. */
const auroraGradient = computed(
  () =>
    props.gradient ??
    'linear-gradient(90deg, #5b7cfa 0%, #7b6cf6 45%, #8b5cf6 100%)',
);
const captionVisible = computed(() => props.showValue || props.tooltipOnly);
/** Inline label / suffix text painted inside the bar track. */
const hasInnerLabel = computed(() => Boolean(props.label));
const hasInnerSuffix = computed(() => Boolean(props.suffix));
/** The glyph rendered inside the fill (rides the value). */
const iconInside = computed(() => props.iconPlacement === 'inside');

/** A bar with no value: the in-track text switches to the "empty" colour. */
const isEmpty = computed(() => fillPercent.value <= 0);

/**
 * In-track text / glyph colour, as CSS vars on the root:
 *  - has value → `--sn-bar-inner-color` (white on the aurora gradient),
 *  - empty     → `--sn-bar-inner-color-empty` (the muted hint).
 * Both are overridable per instance via `innerColor` / `innerColorEmpty`.
 */
const innerColorVars = computed<Record<string, string>>(() => {
  const vars: Record<string, string> = {};
  if (props.innerColor) vars['--sn-bar-inner-color'] = props.innerColor;
  if (props.innerColorEmpty) vars['--sn-bar-inner-color-empty'] = props.innerColorEmpty;
  return vars;
});
/** Glyphs pinned inside the track head / tail. */
const innerLeadingIcon = computed(() => (iconInside.value ? (props.leadingIcon ?? '') : ''));
const innerTrailingIcon = computed(() => (iconInside.value ? (props.trailingIcon ?? '') : ''));

/** Active level, chosen by the nearest configured step. */
const activeLevel = computed(() => {
  const levels = props.levels;
  if (!levels || levels.length === 0) return null;
  const value = pair.value[1];
  const first = levels[0];
  if (!first) return null;
  let best = first;
  let bestDist = Math.abs(first.value - value);
  for (const level of levels) {
    const dist = Math.abs(level.value - value);
    // The hysteresis threshold breaks ties in favour of the higher level.
    if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && level.value > best.value)) {
      best = level;
      bestDist = dist;
    }
  }
  return best;
});

/** Ticks drawn on the track for `showLevels`. */
const levelMarks = computed(() => {
  if (!props.showLevels || !props.levels?.length) return [];
  return props.levels.map((level) => ({ ...level, pct: percentOf(level.value) }));
});

/** Caption text when levels are configured (falls back to the normal read-out). */
const levelText = computed(() => (activeLevel.value ? activeLevel.value.label : ''));

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
    if (Array.isArray(raw)) return [clamp(Number(raw[0])), clamp(Number(raw[1]))];
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

/** Painted fill endpoints as axis percents (single handle → origin → value). */
const fillRange = computed<[number, number]>(() => {
  const low = percentOf(pair.value[0]);
  const high = percentOf(pair.value[1]);
  // Single handle: the fill runs from the axis origin (min) to the handle.
  return props.range ? [low, high] : [percentOf(props.min), high];
});

/** Share of the axis that is filled, 0–100. */
const fillPercent = computed(() => {
  const [lowPct, highPct] = fillRange.value;
  return Math.abs(highPct - lowPct);
});

/** Measured track length in px. */
const trackSize = ref(0);
let resizeObserver: ResizeObserver | null = null;

function measureTrack(): void {
  const el = trackRef.value;
  if (!el) return;
  // Absolutely positioned children resolve `left` / `bottom` against the
  // PADDING box, so the axis length is the padding box (`offsetWidth` /
  // `offsetHeight`) — never the content box, which drops the top padding a
  // column reserves for its caption and lets a full fill overshoot.
  trackSize.value = isColumn.value ? el.offsetHeight : el.offsetWidth;
}

function observeTrack(): void {
  if (typeof ResizeObserver === 'undefined') return;
  const el = trackRef.value;
  if (!el) return;
  resizeObserver ??= new ResizeObserver(() => {
    measureTrack();
  });
  resizeObserver.disconnect();
  resizeObserver.observe(el);
  measureTrack();
}

onMounted(() => {
  observeTrack();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  document.removeEventListener('mousemove', onDocumentMousemove);
  document.removeEventListener('mouseup', onDocumentMouseup);
});

watch(
  () => props.variant,
  () => {
    void nextTick(measureTrack);
  },
);

/**
 * Geometry contract.
 *
 * The fill / thumb positions are emitted as pure CSS `calc()` lengths against
 * the track's own padding box (`100%`), so they stay glued to the capsule at
 * any width — no measured px that can go stale when a label changes the
 * track. JS only needs the percentage plus a measured length for pointer
 * mapping (drag has to convert clientX/Y into a ratio).
 */

/** Caption row reserved at the top of a column track, in px. */
const COLUMN_CAPTION_ROW = 34;

/**
 * Half the thumb size along its travel axis: the aurora disc is as tall as the
 * bar, so its radius is half the thickness; the slim bar thumb needs only a
 * small tolerance. Emitted as `--sn-bar-thumb-pad` and consumed by the fill /
 * thumb expressions in the stylesheet.
 */
const thumbPadPx = computed(() => {
  if (isAurora.value) return Math.max((parseFloat(String(props.thickness ?? 40)) || 40) / 2, 0);
  return 1.5;
});

const barGeometry = computed(() => {
  const [lowPct, highPct] = fillRange.value;
  return { sizePct: Math.abs(highPct - lowPct) };
});

/**
 * Fill length on the same axis as the thumb. The fill starts at the capsule
 * edge (0) and ends at the thumb centre, so at 0% it is empty and at 100% it
 * reaches the trailing edge — the disc then sits flush inside the capsule.
 *
 *   length = pad + (100% − 2·pad) × pct
 */
/**
 * Fill geometry.
 *
 * - Single handle: from the capsule origin to the thumb (a progress bar).
 * - `range`: between the two thumbs only — the themed band marks the picked
 *   interval, with the neutral track showing on both sides.
 *
 * The length is emitted as a pure CSS `calc()` against the track's padding
 * box, so it stays glued to the capsule at any width.
 */
/**
 * Fill geometry — expressed with CSS variables so the browser does the maths:
 *
 *   --sn-bar-band-start : offset of the band start (range) or 0 (single)
 *   --sn-bar-band-size  : band length ratio (0–1)
 *
 * The stylesheet turns them into
 *   left: calc(pad + axis * start); width: calc(axis * size)
 * which keeps the band glued to the capsule at any width and avoids building
 * a `calc()` string in JS (percentage × number is only valid inside CSS).
 */
const fillStyle = computed<Record<string, string>>(() => {
  const [lowPct, highPct] = fillRange.value;
  const startRatio = props.range ? Math.min(lowPct, highPct) / 100 : 0;
  const sizeRatio = props.range
    ? Math.abs(highPct - lowPct) / 100
    : Math.abs(highPct) / 100;
  const style: Record<string, string> = {
    '--sn-bar-band-start': String(startRatio),
    '--sn-bar-band-size': sizeRatio <= 0 ? '0' : String(sizeRatio),
  };
  if (isAurora.value) style.background = auroraGradient.value;
  else if (props.fillBackground) style.background = props.fillBackground;
  if (sizeRatio <= 0) style.opacity = '0';
  return style;
});

const barStyle = computed<Record<string, string> | undefined>(() => {
  const style: Record<string, string> = {};
  if (props.barBackground) style.background = props.barBackground;
  return Object.keys(style).length > 0 ? style : undefined;
});

const handlePositions = computed<number[]>(() =>
  props.range ? [percentOf(pair.value[0]), percentOf(pair.value[1])] : [percentOf(pair.value[1])],
);

/** Thumb placement — one CSS var the stylesheet turns into the travel maths. */
/**
 * Thumb placement, as a pure-CSS length:
 *
 *   offset = pad + (100% − 2·pad) × pct
 *
 * `100%` resolves against the track's padding box at paint time, so the thumb
 * and the fill stay glued to the capsule at any width — no JS measurement to
 * go stale when a label changes the track length. `--sn-bar-thumb-pad` is half
 * the thumb size (the aurora disc) or a slim tolerance for the bar thumb.
 */
function handleStyle(pct: number): Record<string, string> {
  const p = props.reverse ? 100 - pct : pct;
  // Unitless ratio on purpose: `calc()` rejects percentage × percentage, so the
  // stylesheet multiplies `(100% − 2·pad)` by this plain number.
  return { '--sn-bar-position': String(p / 100) };
}

// ---- pointer interaction -------------------------------------------------

const trackRef = ref<HTMLDivElement | null>(null);
/** Index into `pair` of the handle being dragged (0 or 1). */
const draggingIndex = ref<number | null>(null);
/** Hovered handle index (drives the tooltip). */
const hoverIndex = ref<number | null>(null);

function activeIndex(): number | null {
  return hoverIndex.value ?? draggingIndex.value;
}

/**
 * Pointer to value along the thumb travel (inset .. length - inset), i.e. the
 * exact axis the fill and the thumb use. Mapping the raw box instead let a
 * column drag stick near the ends and drift against the painted fill.
 */
function pointerToValue(e: MouseEvent): number {
  const el = trackRef.value;
  if (!el) return pair.value[1];
  const rect = el.getBoundingClientRect();
  const length = isColumn.value ? rect.height : rect.width;
  if (length <= 0) return pair.value[1];
  const row = isColumn.value ? COLUMN_CAPTION_ROW : 0;
  const offset = isColumn.value ? rect.bottom - e.clientY : e.clientX - rect.left;
  // Same axis as the fill / thumb: padded by the thumb radius on both ends
  // (the column also reserves its caption row at the top).
  const pad = thumbPadPx.value;
  const travel = Math.max(length - row - pad * 2, 1);
  let ratio = (offset - pad) / travel;
  ratio = Math.min(1, Math.max(0, ratio));
  if (props.reverse) ratio = 1 - ratio;
  return snap(props.min + ratio * span.value);
}

/** Hover / focus drives the tooltip + active visuals — never on disabled/readonly. */
function setHoverIndex(index: number | null): void {
  if (index !== null && !isInteractive.value) return;
  hoverIndex.value = index;
}

function onTrackMousedown(e: MouseEvent): void {
  if (!isInteractive.value) return;
  e.preventDefault();
  const raw = pointerToValue(e);
  const [low, high] = pair.value;
  let index = 1;
  if (props.range) {
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
    emit('change', buildValue(pair.value[0], pair.value[1]));
  }
  document.removeEventListener('mousemove', onDocumentMousemove);
  document.removeEventListener('mouseup', onDocumentMouseup);
}

// ---- keyboard ------------------------------------------------------------

/** How far one PageUp/PageDown press moves (10 × step). */
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

// ---- tooltip / caption ---------------------------------------------------

const tooltipVisible = computed(() => props.tooltip && isInteractive.value && activeIndex() !== null);

const tooltipText = computed<string>(() => {
  const raw = pair.value[props.range ? (activeIndex() ?? 1) : 1] ?? props.min;
  const formatted = props.formatTooltip ? props.formatTooltip(raw) : raw;
  return String(formatted);
});

/** Default caption: the axis share, or the raw value with the suffix. */
const captionText = computed(() => {
  const value = pair.value[1];
  if (activeLevel.value) return activeLevel.value.label;
  if (props.formatValue) return props.formatValue(value, fillPercent.value);
  return props.format === 'value'
    ? `${value}${props.valueSuffix}`
    : `${Math.round(fillPercent.value)}${props.valueSuffix}`;
});

const valueSlotProps = computed<SnSliderBarLabel>(() => ({
  value: pair.value[1],
  level: activeLevel.value?.label ?? '',
  levelIndex: activeLevel.value ? (props.levels ?? []).indexOf(activeLevel.value) : -1,
  percent: Math.round(fillPercent.value),
  min: props.min,
  max: props.max,
  index: props.range ? 1 : 0,
  range: props.range,
}));

// ---- misc ----------------------------------------------------------------

const classList = computed(() => [
  'sn-slider-bar',
  `sn-slider-bar--${props.variant}`,
  {
    'sn-slider-bar--disabled': props.disabled,
    'sn-slider-bar--readonly': props.readonly,
    'sn-slider-bar--reverse': props.reverse,
    'sn-slider-bar--range': props.range,
    'sn-slider-bar--dragging': draggingIndex.value !== null,
    'sn-slider-bar--show-value': captionVisible.value,
    'sn-slider-bar--fade': props.fade,
    'sn-slider-bar--aurora': isAurora.value,
    'sn-slider-bar--empty': isEmpty.value,
    'sn-slider-bar--animated': isAurora.value && props.animated,
  },
  props.customClass,
]);

/** Size tier → px, matching the button scale. */
const SIZE_THICKNESS = { small: 28, medium: 40, large: 52 } as const;

const wrapperStyle = computed<string>(() => {
  const parts: string[] = [];
  const resolved =
    props.thickness !== undefined ? props.thickness : SIZE_THICKNESS[props.size ?? 'medium'];
  if (resolved !== undefined) {
    const size = typeof resolved === 'number' ? `${resolved}px` : resolved;
    parts.push(`--sn-bar-thickness:${size}`);
  }
  if (props.radius !== undefined) parts.push(`--sn-bar-radius:${props.radius}`);
  parts.push(`--sn-bar-thumb-pad:${thumbPadPx.value}px`);
  if (props.height !== undefined) {
    const h = typeof props.height === 'number' ? `${props.height}px` : props.height;
    parts.push(`--sn-bar-height:${h}`);
    // Applied directly too: a wrapper height must win over the intrinsic one.
    parts.push(`height:${h}`);
  }
  for (const [k, v] of Object.entries(innerColorVars.value)) parts.push(`${k}:${v}`);
  if (typeof props.customStyle === 'string') {
    if (props.customStyle) parts.push(props.customStyle);
  } else {
    for (const [key, value] of Object.entries(props.customStyle ?? {})) parts.push(`${key}:${value}`);
  }
  return parts.join(';');
});

/** aria-valuenow for a handle (range handles get their own). */
const ariaNow = (index: number): number => pair.value[props.range ? index : 1] ?? props.min;

/** aria-valuetext: the formatted value, plus the share when the caption shows it. */
const ariaText = (index: number): string => {
  const raw = ariaNow(index);
  const text = props.formatTooltip ? String(props.formatTooltip(raw)) : String(raw);
  if (props.tooltipOnly) return text;
  return props.format === 'percent' ? `${text}, ${Math.round(fillPercent.value)}%` : text;
};
</script>

<template>
  <div
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="'slider-bar'"
    role="group"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <div class="sn-slider-bar__body">
      <!-- Opt-in glyph outside the track (leading / trailing). -->
      <div
        v-if="!isColumn && $slots.icon && !iconInside"
        class="sn-slider-bar__lead"
        :class="{ 'sn-slider-bar__lead--trailing': iconPlacement === 'trailing' }"
        aria-hidden="true"
      >
        <slot name="icon" />
      </div>
      <!-- Head / tail glyphs: slot first, then the icon name. -->
      <div
        v-if="!isColumn && !iconInside && ($slots.start || leadingIcon)"
        class="sn-slider-bar__edge"
        aria-hidden="true"
      >
        <slot name="start">
          <SnIcon v-if="leadingIcon" :name="leadingIcon" :size="16" />
        </slot>
      </div>
      <div ref="trackRef" class="sn-slider-bar__track" :style="barStyle" @mousedown="onTrackMousedown">
        <!-- Level ticks (showLevels): one per configured level. -->
        <i
          v-for="mark in levelMarks"
          :key="'lvl-' + mark.value"
          class="sn-slider-bar__level-mark"
          :class="{ 'sn-slider-bar__level-mark--on': activeLevel && activeLevel.value === mark.value }"
          :style="{ left: mark.pct + '%' }"
          aria-hidden="true"
        />
        <!-- Glyph pinned inside the track head (rides no value). -->
        <span v-if="!isColumn && innerLeadingIcon" class="sn-slider-bar__glyph" aria-hidden="true">
          <SnIcon :name="innerLeadingIcon" :size="15" />
        </span>
        <div class="sn-slider-bar__fill" :style="fillStyle" aria-hidden="true">
          <!-- Aurora star field: deterministic dots that twinkle inside the fill -->
          <span
            v-for="(dot, i) in sparkleDots"
            :key="'star-' + i"
            class="sn-slider-bar__star"
            :style="{
              left: dot.x + '%',
              top: dot.y + '%',
              width: dot.size + 'px',
              height: dot.size + 'px',
              animationDelay: dot.delay + 's',
            }"
          />
        </div>
        <span v-if="!isColumn && innerTrailingIcon" class="sn-slider-bar__glyph sn-slider-bar__glyph--tail" aria-hidden="true">
          <SnIcon :name="innerTrailingIcon" :size="15" />
        </span>
        <!-- Caption text painted INSIDE the bar: leading label + trailing
             suffix, plus the glyph when iconPlacement="inside". -->
        <span v-if="hasInnerLabel" class="sn-slider-bar__label" aria-hidden="true">{{
          label
        }}</span>
        <span
          v-if="!isColumn && $slots.icon && iconInside"
          class="sn-slider-bar__glyph"
          :class="{ 'sn-slider-bar__glyph--after-label': hasInnerLabel }"
          aria-hidden="true"
        >
          <slot name="icon" />
        </span>
        <span v-if="hasInnerSuffix" class="sn-slider-bar__suffix" aria-hidden="true">{{
          suffix
        }}</span>
        <div
          v-for="(pct, index) in handlePositions"
          :key="`handle-${index}`"
          :class="[
            'sn-slider-bar__handle',
            { 'sn-slider-bar__handle--active': activeIndex() === index },
          ]"
          :style="handleStyle(pct)"
          role="slider"
          :tabindex="isInteractive ? 0 : -1"
          :aria-label="range ? (index === 0 ? 'Start value' : 'End value') : ariaLabel"
          :aria-valuemin="range && index === 1 ? pair[0] : min"
          :aria-valuemax="range && index === 0 ? pair[1] : max"
          :aria-valuenow="ariaNow(index)"
          :aria-valuetext="ariaText(index)"
          :aria-disabled="disabled ? 'true' : undefined"
          :aria-orientation="isColumn ? 'vertical' : 'horizontal'"
          @mousedown="onHandleMousedown($event, index)"
          @mouseenter="setHoverIndex(index)"
          @mouseleave="setHoverIndex(null)"
          @focus="setHoverIndex(index)"
          @blur="setHoverIndex(null)"
          @keydown="onHandleKeydown($event, index)"
        >
          <div
            v-if="tooltipVisible && activeIndex() === index"
            :class="['sn-slider-bar__tooltip', `sn-slider-bar__tooltip--${placement}`]"
            role="tooltip"
          >
            <slot name="tooltip" :value="ariaNow(index)">{{ tooltipText }}</slot>
          </div>
        </div>
        <!-- Column read-out sits inside the track so the bar runs edge to
             edge; the horizontal one stays as a trailing read-out. -->
        <span
          v-if="captionVisible && isColumn"
          class="sn-slider-bar__value sn-slider-bar__value--inside"
          aria-hidden="true"
        >
          <slot name="value" v-bind="valueSlotProps">{{ captionText }}</slot>
        </span>
      </div>
      <div v-if="!isColumn && $slots.end" class="sn-slider-bar__edge sn-slider-bar__edge--end" aria-hidden="true">
        <slot name="end" />
      </div>
      <span v-if="captionVisible && !isColumn" class="sn-slider-bar__value" aria-hidden="true">
        <slot name="value" v-bind="valueSlotProps">{{ captionText }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* =====================================================================
   SnSliderBar — capsule slider.

   The bar is the control surface: a neutral capsule, a themed fill from the
   origin edge, a slim thumb riding the inset track and an inline read-out
   at the far edge (on top in the column variant).

   Fill is a solid themed color on purpose — a translucent wash over the
   neutral bar desaturates into grey-blue, so the un-filled remainder is the
   neutral part. Shape follows the radius scale, not a hard pill.
   ===================================================================== */

.sn-slider-bar {
  --sn-bar-thickness: 40px;
  --sn-bar-radius: var(--sn-web-radius-lg, 8px);
  --sn-bar-padding: 4px;
  --sn-bar-bg: var(--sn-web-color-text-primary);
  --sn-bar-fill: var(--sn-web-color-action-primary);
  --sn-bar-thumb: var(--sn-web-color-text-on-primary, #fff);

  display: inline-flex;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  color: var(--sn-web-color-text-primary);
  font-family: inherit;
}

.sn-slider-bar__body {
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  min-width: 0;
}

.sn-slider-bar__lead {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--sn-bar-thickness);
  height: var(--sn-bar-thickness);
  margin: 0 6px 0 0;
  border-radius: var(--sn-bar-radius);
  background: color-mix(in srgb, var(--sn-bar-bg) 10%, transparent);
  color: var(--sn-web-color-text-secondary);
}

/* Trailing glyph mirrors the leading one (gap on the other side). */
.sn-slider-bar__lead--trailing {
  order: 2;
  margin: 0 0 0 6px;
}

/* The track is flush: no padding box, so the bar has no phantom inset at
   its head / tail. The fill and the thumb carry the 10px travel inset. */
.sn-slider-bar__track {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
  height: var(--sn-bar-thickness);
  padding: 0;
  border-radius: var(--sn-bar-radius);
  background: color-mix(in srgb, var(--sn-bar-bg) 8%, transparent);
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
}

.sn-slider-bar--disabled .sn-slider-bar__track,
.sn-slider-bar--readonly .sn-slider-bar__track {
  cursor: not-allowed;
}

/* Filled part: themed, square on the trailing edge so it butts the thumb. */
/* The band geometry is driven by two ratios from the component:
   `--sn-bar-band-start` (range offset) and `--sn-bar-band-size` (length). */
.sn-slider-bar__fill {
  position: absolute;
  top: 0;
  height: 100%;
  left: calc(
    var(--sn-bar-thumb-pad, 0px) * min(1, var(--sn-bar-band-start, 0)) +
      (100% - var(--sn-bar-thumb-pad, 0px) * 2) * var(--sn-bar-band-start, 0)
  );
  width: calc(
    var(--sn-bar-thumb-pad, 0px) * min(1, var(--sn-bar-band-size, 0)) +
      (100% - var(--sn-bar-thumb-pad, 0px) * 2) * var(--sn-bar-band-size, 0)
  );
  border-radius: var(--sn-bar-radius) 0 0 var(--sn-bar-radius);
  background: var(--sn-bar-fill);
  box-sizing: border-box;
  pointer-events: none;
  transition:
    width 0.12s ease,
    height 0.12s ease,
    left 0.12s ease,
    bottom 0.12s ease;
}

/* Range mode: the band has a non-zero start, so round BOTH ends of the fill
   (it floats between the two discs instead of touching the capsule edge). */
.sn-slider-bar--range .sn-slider-bar__fill {
  border-radius: var(--sn-bar-radius);
}

.sn-slider-bar--reverse .sn-slider-bar__fill {
  left: auto;
  right: calc(
    var(--sn-bar-thumb-pad, 0px) * min(1, var(--sn-bar-band-start, 0)) +
      (100% - var(--sn-bar-thumb-pad, 0px) * 2) * var(--sn-bar-band-start, 0)
  );
}

.sn-slider-bar--reverse .sn-slider-bar__fill {
  border-radius: 0 var(--sn-bar-radius) var(--sn-bar-radius) 0;
}

.sn-slider-bar--dragging .sn-slider-bar__fill {
  transition: none;
}

.sn-slider-bar--disabled .sn-slider-bar__fill {
  opacity: 0.45;
}

/* Text painted inside the bar: a leading label and a trailing suffix, both
   above the fill so they stay legible while the value moves under them. */
.sn-slider-bar__label,
.sn-slider-bar__suffix,
.sn-slider-bar__glyph {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  flex: none;
  pointer-events: none;
}

.sn-slider-bar__label {
  padding-left: 12px;
  color: var(--sn-slider-bar-label-color, var(--sn-web-color-text-secondary));
  font-size: var(--sn-slider-bar-label-size, 12px);
  line-height: 1;
  white-space: nowrap;
}

.sn-slider-bar__glyph {
  margin-left: 10px;
  color: var(--sn-slider-bar-glyph-color, var(--sn-web-color-text-secondary));
}

.sn-slider-bar__glyph--after-label {
  margin-left: 6px;
}

.sn-slider-bar__suffix {
  margin-left: auto;
  padding-right: 12px;
  color: var(--sn-slider-bar-label-color, var(--sn-web-color-text-secondary));
  font-size: var(--sn-slider-bar-label-size, 12px);
  line-height: 1;
  white-space: nowrap;
}

/* Thumb: slim bar riding the inset track. */
.sn-slider-bar__handle {
  position: absolute;
  top: 50%;
  left: calc(
    var(--sn-bar-thumb-pad, 1.5px) +
      (100% - var(--sn-bar-thumb-pad, 1.5px) * 2) * var(--sn-bar-position, 0)
  );
  width: var(--sn-slider-bar-handle-width, 3px);
  /* Clamped so a thin bar still shows a grabbable thumb. */
  height: max(10px, calc(100% - 14px));
  border-radius: 2px;
  background-color: var(--sn-bar-thumb);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
  transform: translate(-50%, -50%);
  outline: none;
  cursor: grab;
  z-index: 1;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.sn-slider-bar__handle--active {
  transform: translate(-50%, -50%) scaleY(1.08);
}

.sn-slider-bar--dragging .sn-slider-bar__handle--active {
  cursor: grabbing;
}

.sn-slider-bar__handle:focus-visible {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 0 0 3px var(--sn-web-focus-ring, color-mix(in srgb, var(--sn-web-color-action-primary) 25%, transparent));
}

.sn-slider-bar--disabled .sn-slider-bar__handle,
.sn-slider-bar--readonly .sn-slider-bar__handle {
  cursor: not-allowed;
  background-color: var(--sn-web-color-action-disabled, rgba(0, 0, 0, 0.25));
}

/* Inline read-out at the far edge. */
.sn-slider-bar__value {
  flex: none;
  align-self: center;
  margin: 0 12px 0 10px;
  color: var(--sn-web-color-text-primary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
}

.sn-slider-bar--disabled .sn-slider-bar__value {
  color: var(--sn-web-color-text-disabled);
}

/* ---- tooltip ---- */
.sn-slider-bar__tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 8px;
  border-radius: var(--sn-web-radius-sm, 4px);
  background-color: var(--sn-web-color-tooltip-background, rgba(20, 20, 28, 0.95));
  color: var(--sn-web-color-text-on-primary, #fff);
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 2;
}

.sn-slider-bar__tooltip--bottom {
  bottom: auto;
  top: calc(100% + 10px);
}

.sn-slider-bar__tooltip--top-start,
.sn-slider-bar__tooltip--bottom-start {
  left: 0;
  transform: none;
}

.sn-slider-bar__tooltip--top-end,
.sn-slider-bar__tooltip--bottom-end {
  left: auto;
  right: 0;
  transform: none;
}

/* =====================================================================
   Column variant — vertical strip.
   ===================================================================== */

.sn-slider-bar--column {
  width: auto;
  height: 100%;
  min-height: 160px;
}

.sn-slider-bar--column .sn-slider-bar__body {
  flex-direction: column;
  align-items: center;
}

/* Column: the track is the whole capsule — the read-out lives inside it so
   the bar runs edge to edge (no gap under the value, no padding tail). */
.sn-slider-bar--column .sn-slider-bar__track {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  width: var(--sn-slider-bar-column-width, 56px);
  height: auto;
  min-height: 48px;
  padding: var(--sn-slider-bar-column-caption-row, 34px) 0 0;
  position: relative;
  border-radius: var(--sn-bar-radius);
  background: var(--sn-slider-bar-column-bg, color-mix(in srgb, var(--sn-bar-bg) 8%, transparent));
}

.sn-slider-bar--column.sn-slider-bar--fade .sn-slider-bar__track {
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--sn-bar-bg) 9%, transparent),
    color-mix(in srgb, var(--sn-bar-bg) 3%, transparent)
  );
}

/* Column: square at the top edge where the disc sits. */
.sn-slider-bar--column .sn-slider-bar__fill {
  top: auto;
  left: 0;
  width: 100%;
  height: calc(
    var(--sn-bar-thumb-pad, 0px) * min(1, var(--sn-bar-band-size, 0)) +
      (100% - var(--sn-slider-bar-column-caption-row, 34px) - var(--sn-bar-thumb-pad, 0px) * 2) *
        var(--sn-bar-band-size, 0)
  );
  bottom: calc(
    (100% - var(--sn-slider-bar-column-caption-row, 34px) - var(--sn-bar-thumb-pad, 0px) * 2) *
      var(--sn-bar-band-start, 0)
  );
  border-radius: var(--sn-bar-radius) var(--sn-bar-radius) 0 0;
}

/* The column axis starts at the bottom edge, so the thumb is anchored from
   the bottom (the measured offset is already a bottom-up distance). */
.sn-slider-bar--column .sn-slider-bar__handle {
  top: auto;
  bottom: calc(
    var(--sn-bar-thumb-pad, 1.5px) +
      (100% - var(--sn-slider-bar-column-caption-row, 34px) - var(--sn-bar-thumb-pad, 1.5px) * 2) *
        var(--sn-bar-position, 0)
  );
  left: 50%;
  width: calc(100% - 10px);
  height: var(--sn-slider-bar-handle-height, 3px);
  border-radius: 2px;
  transform: translate(-50%, 50%);
}

.sn-slider-bar--column .sn-slider-bar__handle--active {
  transform: translate(-50%, 50%) scaleX(1.08);
}

.sn-slider-bar--column .sn-slider-bar__value {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sn-slider-bar-column-caption-row, 34px);
  margin: 0;
  font-size: 14px;
}

.sn-slider-bar--column .sn-slider-bar__tooltip {
  bottom: auto;
  top: 50%;
  left: auto;
  right: calc(100% + 10px);
  transform: translateY(-50%);
}

/* =====================================================================
   Aurora theme — gradient fill, drifting star field, round thumb.

   One surface only: the track IS the capsule (no second frame behind it,
   which read as a doubled background). The thumb matches the track height,
   so the disc sits flush inside the capsule as in the reference.
   ===================================================================== */

.sn-slider-bar--aurora {
  --sn-bar-thickness: 40px;
  --sn-bar-radius: 999px;
  --sn-bar-thumb: #ffffff;
  --sn-slider-bar-handle-width: var(--sn-bar-thickness);
  --sn-slider-bar-handle-height: var(--sn-bar-thickness);
}

.sn-slider-bar--aurora .sn-slider-bar__track {
  border-radius: var(--sn-bar-radius);
  background: color-mix(in srgb, var(--sn-bar-bg) 10%, transparent);
}

/* Square on the trailing edge so the gradient runs UNDER the disc instead of
   curving away from it (a rounded cap left a visible sliver of background
   between the fill and the thumb). */
.sn-slider-bar--aurora .sn-slider-bar__fill {
  border-radius: var(--sn-bar-radius) 0 0 var(--sn-bar-radius);
  overflow: hidden;
  background-size: 220% 100% !important;
  background-position: 0% 50%;
  box-shadow: var(--sn-slider-bar-aurora-glow, 0 0 16px rgba(124, 108, 246, 0.3));
}

.sn-slider-bar--animated .sn-slider-bar__fill {
  animation: sn-bar-aurora-drift 9s ease-in-out infinite alternate;
}

@keyframes sn-bar-aurora-drift {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

/* Twinkling stars inside the fill. */
.sn-slider-bar__star {
  position: absolute;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
  opacity: 0.45;
  pointer-events: none;
}

.sn-slider-bar--animated .sn-slider-bar__star {
  animation: sn-bar-aurora-twinkle 3.2s ease-in-out infinite;
}

@keyframes sn-bar-aurora-twinkle {
  0%,
  100% {
    opacity: 0.18;
    transform: scale(0.7);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.15);
  }
}

/* Round thumb, same height as the track (a flush disc, not an overhang). */
/* The disc matches the track height exactly (see --sn-bar-thickness). */
.sn-slider-bar--aurora .sn-slider-bar__handle {
  width: var(--sn-slider-bar-handle-width, var(--sn-bar-thickness));
  height: var(--sn-slider-bar-handle-height, var(--sn-bar-thickness));
  top: 50%;
  border-radius: 50%;
  background-color: var(--sn-bar-thumb);
  box-shadow: var(--sn-slider-bar-aurora-thumb-shadow, 0 2px 8px rgba(0, 0, 0, 0.28));
  transform: translate(-50%, -50%);
}

.sn-slider-bar--aurora .sn-slider-bar__handle--active {
  transform: translate(-50%, -50%) scale(1.04);
}

.sn-slider-bar--aurora.sn-slider-bar--dragging .sn-slider-bar__handle--active {
  transform: translate(-50%, -50%) scale(1.08);
}

.sn-slider-bar--aurora .sn-slider-bar__handle:focus-visible {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.28),
    0 0 0 3px var(--sn-web-focus-ring, rgba(124, 108, 246, 0.5));
}

/* Text on the gradient stays white. */
.sn-slider-bar--aurora .sn-slider-bar__label,
.sn-slider-bar--aurora .sn-slider-bar__suffix,
.sn-slider-bar--aurora .sn-slider-bar__value {
  color: var(--sn-slider-bar-aurora-text, #ffffff);
}

@media (prefers-reduced-motion: reduce) {
  .sn-slider-bar--animated .sn-slider-bar__fill,
  .sn-slider-bar--animated .sn-slider-bar__star {
    animation: none;
  }
  .sn-slider-bar--animated .sn-slider-bar__star {
    opacity: 0.6;
  }
}

/* ---- head / tail glyphs & level ticks ---------------------------------- */

.sn-slider-bar__edge {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  color: var(--sn-slider-bar-edge-color, var(--sn-web-color-text-secondary));
}

.sn-slider-bar__edge--end {
  margin-left: 6px;
}

.sn-slider-bar__glyph--tail {
  margin-left: auto;
  margin-right: 10px;
}

/* Level ticks: tiny dots on the track, the active one highlighted. */
.sn-slider-bar__level-mark {
  position: absolute;
  top: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: color-mix(in srgb, var(--sn-web-color-text-primary) 35%, transparent);
  z-index: 2;
  pointer-events: none;
}

.sn-slider-bar__level-mark--on {
  background-color: var(--sn-web-color-text-on-primary, #fff);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--sn-bar-fill) 40%, transparent);
}

/* ---- aurora + column --------------------------------------------------- */
/* A column capsule: the read-out sits on top, the disc rides the track and
   the dots follow. The disc no longer forces the track to its own size — the
   column keeps its fixed width and the disc is clamped to it. */

.sn-slider-bar--aurora.sn-slider-bar--column {
  --sn-slider-bar-handle-width: min(var(--sn-bar-thickness), 40px);
  --sn-slider-bar-handle-height: min(var(--sn-bar-thickness), 40px);
}

.sn-slider-bar--aurora.sn-slider-bar--column .sn-slider-bar__track {
  padding-top: var(--sn-slider-bar-column-caption-row, 34px);
  overflow: hidden;
}

.sn-slider-bar--aurora.sn-slider-bar--column .sn-slider-bar__handle {
  /* Anchored from the bottom, like every other column thumb. */
  top: auto;
  left: 50%;
  width: min(calc(var(--sn-slider-bar-column-width, 56px) - 8px), var(--sn-bar-thickness));
  height: min(calc(var(--sn-slider-bar-column-width, 56px) - 8px), var(--sn-bar-thickness));
  transform: translate(-50%, 50%);
}

.sn-slider-bar--aurora.sn-slider-bar--column .sn-slider-bar__handle--active {
  transform: translate(-50%, 50%) scale(1.05);
}

.sn-slider-bar--aurora.sn-slider-bar--column .sn-slider-bar__fill {
  border-radius: var(--sn-bar-radius);
}

/* The column read-out is white on a dark capsule, not on the gradient. */
.sn-slider-bar--aurora.sn-slider-bar--column .sn-slider-bar__value {
  color: var(--sn-slider-bar-aurora-text, var(--sn-web-color-text-primary));
}

/* Icons inside the column track stay centred and never stretch it. */
.sn-slider-bar__glyph {
  flex: none;
}

/* =====================================================================
   In-track text / glyph colours — two states.

   With a value, the text sits on the themed fill and reads in
   `--sn-bar-inner-color` (white on aurora). At 0 the fill is empty, so the
   text would vanish on white — it switches to `--sn-bar-inner-color-empty`.
   The swap is a colour transition, not a repaint, so dragging feels smooth.
   ===================================================================== */

.sn-slider-bar__label,
.sn-slider-bar__suffix,
.sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color-empty, var(--sn-web-color-text-secondary));
  transition: color 0.18s ease;
}

/* Any value → the filled colour (white on aurora). */
.sn-slider-bar:not(.sn-slider-bar--empty) .sn-slider-bar__label,
.sn-slider-bar:not(.sn-slider-bar--empty) .sn-slider-bar__suffix,
.sn-slider-bar:not(.sn-slider-bar--empty) .sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color, var(--sn-web-color-text-primary));
}

/* Aurora: white on the gradient while filled. */
.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__label,
.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__suffix,
.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color, #ffffff);
}

/* Aurora at 0: the capsule is neutral, so the hint stays readable. */
.sn-slider-bar--aurora.sn-slider-bar--empty .sn-slider-bar__label,
.sn-slider-bar--aurora.sn-slider-bar--empty .sn-slider-bar__suffix,
.sn-slider-bar--aurora.sn-slider-bar--empty .sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color-empty, var(--sn-web-color-text-secondary));
}

/* The value caption outside the track follows the same two states. */
.sn-slider-bar--aurora:not(.sn-slider-bar--empty) .sn-slider-bar__value {
  color: var(--sn-bar-inner-color, #ffffff);
}
</style>
