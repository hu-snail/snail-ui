<script setup lang="ts">
/**
 * sn-slider-bar — capsule / bar slider (uni end).
 *
 * Mirrors the web `SnSliderBar`: a capsule track with a themed fill, a slim
 * thumb, an optional inline read-out, an aurora theme (gradient + drifting
 * stars) and a column variant. Same behaviour as `sn-slider` (drag / tap,
 * step snapping, non-crossing dual knobs).
 *
 * uni notes: the track box is measured through the element ref on H5 / App and
 * through `createSelectorQuery` on mini-programs; the fill / knob maths use
 * rpx-friendly percentages and the measured px. The gesture itself lives in
 * `sn-slider-bar-drag.ts` (shared with the uni-app x artifact): one rect read
 * per gesture, frame-coalesced moves, a knob-anchored delta so the thumb
 * follows the finger 1:1, and a desktop mouse path for H5.
 */

import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { toRpxSize } from '../../utils/sn-size';
import { createSliderBarDrag, nextTrackDomId } from './sn-slider-bar-drag';
import type { SliderBarRect } from './sn-slider-bar-drag';
import type {
  SliderValue,
  SliderLevel,
  SliderBarVariant,
  SliderBarTheme,
  SliderBarFormat,
  SliderBarSize,
  SliderBarKnobShape,
  SliderBarKnobAlign,
} from './sn-slider-bar-types';

defineOptions({ name: 'SnSliderBar' });

const props = withDefaults(
  defineProps<{
    /** Current value — `number`, or `[start, end]` in `range` mode. */
    modelValue?: SliderValue;
    /** Lower bound. */
    min?: number;
    /** Upper bound. */
    max?: number;
    /** Snap granularity. */
    step?: number;
    /** Two-knob mode. */
    range?: boolean;
    /** Disables dragging. */
    disabled?: boolean;
    /** Visible but not editable. */
    readonly?: boolean;
    /** Invert the axis. */
    reverse?: boolean;
    /** `bar` horizontal capsule / `column` vertical strip. */
    variant?: SliderBarVariant;
    /** Visual theme. */
    theme?: SliderBarTheme;
    /** Show the read-out beside (bar) or above (column) the track. */
    showValue?: boolean;
    /** Read-out source. */
    format?: SliderBarFormat;
    /** Suffix appended to the default read-out. */
    valueSuffix?: string;
    /** Full custom read-out text. */
    formatValue?: (value: number, percent: number) => string;
    /** Discrete levels; the read-out shows the nearest level label. */
    levels?: SliderLevel[];
    /** Draw a tick per level. */
    showLevels?: boolean;
    /** Size tier. */
    size?: SliderBarSize;
    /** Explicit control height (rpx number or CSS length). */
    barHeight?: string | number;
    /** Alias of `barHeight`. */
    height?: string | number;
    /** Track thickness (rpx number or CSS length). */
    thickness?: string | number;
    /** Corner radius (CSS length). */
    radius?: string;
    /** Caption text painted inside the track at the leading edge. */
    label?: string;
    /** Caption text painted inside the track at the trailing edge. */
    suffix?: string;
    /** Custom fill background (ignored by the aurora theme). */
    fillBackground?: string;
    /** Custom track background — any CSS background (solid / gradient). */
    barBackground?: string;
    /**
     * Knob silhouette: `round` (default, slightly long disc), `circle` (true
     * 1:1 disc), `square` (rounded square), `pill` (tall capsule). Additive
     * style contract, mirroring the modern bar-slider look; geometry stays
     * rpx-friendly.
     */
    knobShape?: SliderBarKnobShape;
    /**
     * Explicit knob diameter — a number is rpx, `12px` is honoured. Empty uses
     * the silhouette ratio (so `circle` is one track-thickness across).
     */
    knobSize?: string | number;
    /** Knob fill colour — empty uses the theme thumb (white). */
    knobColor?: string;
    /** Knob outline colour — empty uses the theme action colour. */
    knobBorderColor?: string;
    /** Knob outline width as a CSS length — empty uses the 4rpx default. */
    knobBorderWidth?: string;
    /**
     * Knob corner radius as a CSS length / percentage — empty uses the shape
     * default (`round` 32%, `square` 26%, `pill` fully rounded). Set `50%` to
     * turn a square knob into a disc.
     */
    knobRadius?: string;
    /**
     * Glyph painted inside the knob — any sn-icon name (registry → built-in
     * catalogue → async provider). Empty leaves the plain chip; the `knob`
     * slot overrides it when supplied.
     */
    knobIcon?: string;
    /** Glyph colour — empty follows the knob's ring colour. */
    knobIconColor?: string;
    /** Glyph size — a number is rpx, `12px` is honoured, empty = 56 % of the knob. */
    knobIconSize?: string | number;
    /**
     * Where the thumb sits at the ends of the travel.
     *
     * `auto` (default): `overlap` on the bar, `inset` on the column strip — a
     * thumb hanging off the top of a vertical meter reads as a bug, not a
     * design. `overlap`: the thumb *centre* travels the full 0…100 %, so at
     * either end it straddles the capsule's cap and visibly overlaps the track
     * (the classic mobile slider look). `inset`: the whole thumb box stays
     * inside the track, flush with the caps. Additive.
     */
    knobAlign?: SliderBarKnobAlign;
    /** Aurora gradient. */
    gradient?: string;
    /** Aurora star-field density (0 = off). */
    sparkles?: number;
    /** Disable the aurora drift / twinkle animation. */
    animated?: boolean;
    /** In-track text / glyph colour while the bar has a value. */
    innerColor?: string;
    /** In-track text / glyph colour at value 0. */
    innerColorEmpty?: string;
    /** Column: fade the empty part upwards. */
    fade?: boolean;
    /** Column: read the value from the popover only. */
    tooltipOnly?: boolean;
    /** Accessible name. */
    ariaLabel?: string;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    range: false,
    disabled: false,
    readonly: false,
    reverse: false,
    variant: 'bar',
    theme: 'default',
    showValue: false,
    format: 'percent',
    valueSuffix: '%',
    showLevels: true,
    size: 'medium',
    label: '',
    suffix: '',
    fillBackground: '',
    barBackground: '',
    knobShape: 'round',
    knobSize: '',
    knobColor: '',
    knobBorderColor: '',
    knobBorderWidth: '',
    knobRadius: '',
    knobIcon: '',
    knobIconColor: '',
    knobIconSize: '',
    knobAlign: 'auto',
    gradient: '',
    sparkles: 14,
    animated: true,
    innerColor: '',
    innerColorEmpty: '',
    fade: true,
    tooltipOnly: false,
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: SliderValue): void;
  (e: 'change', value: SliderValue): void;
}>();

/* ── size scale ─────────────────────────────────────────────────────────── */

/**
 * Cross-axis thickness (track height for `bar`, track width for `column`).
 * Reference capsule sliders sit at ≈ 6 % of the track length — the old
 * 56 / 80 / 104 read ~2× too chunky, so the tiers are halved to match.
 */
const SIZE_THICKNESS: Record<string, number> = { small: 28, medium: 40, large: 56 };

const thicknessRpx = computed(() => {
  if (props.thickness !== undefined) {
    return typeof props.thickness === 'number'
      ? props.thickness
      : parseFloat(String(props.thickness));
  }
  return SIZE_THICKNESS[props.size ?? 'medium'] ?? 40;
});

const isColumn = computed(() => props.variant === 'column');

/**
 * Knob silhouette modifiers (additive). Only the box changes — travel
 * geometry (left/bottom + translate) is shared, so pointer mapping and the
 * range / column maths are untouched. Values are rpx so the knob scales with
 * the screen exactly like the track.
 *
 * Sizing is orientation-aware: a `pill` is a vertical capsule on a horizontal
 * bar (the "Mood" reference) but a horizontal-leaning capsule on a column
 * (the three-up reference), where it must read wider than the thin strip.
 */
const knobShapeClass = computed(() => `sn-slider-bar__knob--${props.knobShape}`);
const isKnobPill = computed(() => props.knobShape === 'pill');
const isKnobCircle = computed(() => props.knobShape === 'circle');

/** `knobSize` in rpx — numbers are rpx, `12px` is honoured, other units are not. */
const knobSizeRpx = computed<number | null>(() => {
  const raw = props.knobSize;
  if (raw === '' || raw === undefined || raw === null) return null;
  if (typeof raw === 'number') return raw > 0 ? raw : null;
  const text = String(raw).trim();
  const value = Number.parseFloat(text);
  if (!(value > 0)) return null;
  return text.endsWith('px') ? value * 2 : value; // 1px ≈ 2rpx at the 375 base
});

const knobMetrics = computed<{ w: number; h: number }>(() => {
  const t = thicknessRpx.value;
  // Reference geometry (measured on the source screenshots, all ratios of the
  // track thickness t):
  //   · default knob ≈ 1.30 t along the travel axis × 1.00 t across it
  //   · circle       ≈  1.00 t diameter (inscribed, so nothing is clipped)
  //   · square knob  ≈  1.00 t × 1.00 t
  //   · pill knob    ≈  0.55 t wide × 0.82 t tall — a narrow capsule *inside*
  //                    the track, as in the "Mood" reference.
  const explicit = knobSizeRpx.value;
  if (explicit !== null) {
    // An explicit size wins over the silhouette ratio; the shape still decides
    // the aspect (circle stays 1:1, pill keeps its narrow waist).
    if (isKnobCircle.value || props.knobShape === 'square') return { w: explicit, h: explicit };
    if (isKnobPill.value) {
      const across = Math.round(explicit * 0.67);
      return isColumn.value ? { w: explicit, h: across } : { w: across, h: explicit };
    }
    return isColumn.value ? { w: t, h: explicit } : { w: explicit, h: t };
  }
  const along = Math.round(t * 1.3);
  if (isKnobCircle.value) return { w: t, h: t };
  if (isKnobPill.value) {
    const across = Math.round(t * 0.55);
    const tall = Math.round(t * 0.82);
    return isColumn.value ? { w: tall, h: across } : { w: across, h: tall };
  }
  if (props.knobShape === 'square') return { w: t, h: t };
  return isColumn.value ? { w: t, h: along } : { w: along, h: t };
});
const knobWidthRpx = computed(() => knobMetrics.value.w);
const knobHeightRpx = computed(() => knobMetrics.value.h);
/** Half a knob measured along the travel axis (bar → width, column → height). */
const halfAlongRpx = computed(() =>
  Math.round((isColumn.value ? knobHeightRpx.value : knobWidthRpx.value) / 2),
);

/**
 * Half-knob travel inset, in rpx.
 *
 * `overlap` (default) returns 0: the thumb *centre* runs the full 0…100 % of
 * the track, so a thumb at an end straddles the capsule's cap — it visibly
 * overlaps the track instead of being tucked inside it (which read as a chip
 * stuck onto the bar's end). `inset` keeps the whole thumb box inside the
 * track, flush with both caps.
 */
const travelsInset = computed(
  () => props.knobAlign === 'inset' || (props.knobAlign === 'auto' && isColumn.value),
);
const travelInsetRpx = computed(() => (travelsInset.value ? halfAlongRpx.value : 0));

const isAurora = computed(() => props.theme === 'aurora');
const isInteractive = computed(() => !props.disabled && !props.readonly);

/**
 * Colour presets (additive). Each one only repaints — the geometry, gesture and
 * accessibility contracts are identical, so a theme swap never changes
 * behaviour. `default` emits nothing and keeps the design-token colours.
 */
interface SliderBarThemePreset {
  /** Track background (translucent tint of the accent). */
  track: string;
  /** Fill / gradient. */
  fill: string;
  /** Knob ring — a solid colour, because a gradient is invalid in `border-color`. */
  ring: string;
}

const THEME_PRESETS: Record<string, SliderBarThemePreset> = {
  ocean: {
    track: 'rgba(14,165,233,0.16)',
    fill: 'linear-gradient(90deg,#06b6d4,#2563eb)',
    ring: '#0ea5e9',
  },
  sunset: {
    track: 'rgba(251,146,60,0.18)',
    fill: 'linear-gradient(90deg,#fb923c,#f43f5e)',
    ring: '#fb7185',
  },
  grape: {
    track: 'rgba(139,92,246,0.18)',
    fill: 'linear-gradient(90deg,#8b5cf6,#d946ef)',
    ring: '#8b5cf6',
  },
  mono: {
    // Slate, not ink: a near-black fill vanishes on a dark surface, and the
    // presets must survive both light and dark pages without extra props.
    track: 'rgba(100,116,139,0.22)',
    fill: '#64748b',
    ring: '#64748b',
  },
};

const themePreset = computed<SliderBarThemePreset | null>(() => THEME_PRESETS[props.theme] ?? null);

/* ── knob glyph ─────────────────────────────────────────────────────────── */

/**
 * Glyph size inside the knob.
 *
 * Defaults to 56 % of the knob's short side — big enough to read at the
 * `medium` tier (≈ 22rpx) while never touching the 4rpx ring, and it scales
 * with `knobSize` / `size` for free. A literal `12px` is honoured as-is.
 */
const knobIconSizeResolved = computed<string>(() => {
  const raw = props.knobIconSize;
  if (raw !== '' && raw !== undefined && raw !== null) return toRpxSize(raw);
  const short = Math.min(knobWidthRpx.value, knobHeightRpx.value);
  return `${Math.max(12, Math.round(short * 0.56))}rpx`;
});

/**
 * Glyph colour — an explicit `knobIconColor` wins, then the theme ring, then
 * the per-instance `knobBorderColor`. `undefined` keeps sn-icon's
 * `currentColor`, which the stylesheet points at the ring (so a themed bar gets
 * a themed glyph without resolving CSS vars in JS — mini-programs bake the
 * colour from `computedStyle`, and `currentColor` would not resolve there).
 */
const knobIconColorResolved = computed<string | undefined>(
  () => props.knobIconColor || themePreset.value?.ring || props.knobBorderColor || undefined,
);

/* ── value normalisation ────────────────────────────────────────────────── */

const span = computed(() => props.max - props.min);

function clamp(v: number): number {
  return Math.min(props.max, Math.max(props.min, v));
}

function snap(v: number): number {
  const stepped = props.min + Math.round((v - props.min) / props.step) * props.step;
  return clamp(Number(stepped.toFixed(10)));
}

const localValue = ref<SliderValue>(
  props.modelValue ?? (props.range ? [props.min, props.max] : props.min),
);

/** Normalise any accepted shape into the two ends the geometry needs. */
function normalisePair(raw: SliderValue | number[] | null | undefined): [number, number] {
  if (props.range) {
    if (Array.isArray(raw)) return [clamp(Number(raw[0])), clamp(Number(raw[1]))];
    return [props.min, clamp(Number(raw))];
  }
  const single = clamp(Array.isArray(raw) ? Number(raw[0]) : Number(raw));
  return [single, single];
}

const pair = computed<[number, number]>(() => normalisePair(props.modelValue ?? localValue.value));

/**
 * Value the *geometry* renders — the committed value, or the live drag value
 * while a gesture owns the control.
 *
 * This is the second half of the smoothness fix: a controlled `v-model` only
 * lands on `props.modelValue` after the parent re-renders, so rendering
 * straight from props makes the thumb lag one render behind the finger (and
 * stutter whenever the parent is busy). The drag value is local, commits
 * inside the same frame, and is dropped as soon as the parent catches up.
 */
const dragValue = ref<SliderValue | null>(null);

const displayPair = computed<[number, number]>(() =>
  dragValue.value === null ? pair.value : normalisePair(dragValue.value),
);

const modelIsArray = computed(() => props.range || Array.isArray(props.modelValue));

function buildValue(low: number, high: number): SliderValue {
  return modelIsArray.value ? [low, high] : low;
}

/* ── geometry (percent of the axis) ─────────────────────────────────────── */

function percentOf(value: number): number {
  const p = span.value === 0 ? 0 : ((value - props.min) / span.value) * 100;
  return props.reverse ? 100 - p : p;
}

const fillPercent = computed(() => {
  const low = percentOf(displayPair.value[0]);
  const high = percentOf(displayPair.value[1]);
  return props.range ? Math.abs(high - low) : Math.abs(high);
});

/** A bar with no value: the in-track text switches to the "empty" colour. */
const isEmpty = computed(() => fillPercent.value <= 0);

/** Percent string, rounded so `100 - 55` never writes `44.99999999999999%`. */
function pct(value: number): string {
  return `${Math.round(value * 1000) / 1000}%`;
}

/**
 * Fill band, in % of the *travel* (the inset axis the knobs move along).
 *
 * The travel is the track minus half a knob at each end, so a single-value
 * fill has to be grown by that half at the leading edge to reach the capsule
 * cap — hence the `calc(half + p%)` below.
 */
const fillBand = computed(() => {
  const low = percentOf(displayPair.value[0]);
  const high = percentOf(displayPair.value[1]);
  const start = props.range ? Math.min(low, high) : 0;
  const size = props.range ? Math.abs(high - low) : Math.abs(high);
  return { start, size };
});

const fillStyle = computed(() => {
  const { start, size } = fillBand.value;
  const preset = themePreset.value;
  const background = props.fillBackground
    ? props.fillBackground
    : isAurora.value
      ? props.gradient || 'linear-gradient(90deg,#5b7cfa,#8b5cf6)'
      : (preset?.fill ?? '');
  const bg = background ? `background:${background};` : '';

  // Edges instead of a width: the band runs on the *raw* track, so 0 % is the
  // capsule's own cap and 100 % its far cap — the same percentages the value
  // uses end up exactly under the thumb centre in `overlap` mode, and stay
  // inside the thumb's own footprint in `inset` mode. A width would need a
  // calc(), which the uni-app x flattener cannot split reliably.
  let geometry: string;
  if (isColumn.value) {
    geometry = props.range
      ? `bottom:${pct(start)};top:${pct(100 - start - size)};`
      : `bottom:0;top:${pct(100 - size)};`;
  } else {
    geometry = props.range
      ? `left:${pct(start)};right:${pct(100 - start - size)};`
      : `left:0;right:${pct(100 - size)};`;
  }
  return `${geometry}${bg}${size <= 0 ? 'opacity:0;' : ''}`;
});

/**
 * Half-knob margin offset for a position given in percent (0…100).
 *
 * In `inset` mode the travel axis is the track inset by half a knob at both
 * ends:   centre(p) = half + p·(W − 2·half)  →  p·W + half·(1 − 2p)
 * `left: p%` already contributes `p·W`, so the remainder is this margin. It is
 * a margin rather than a container inset on purpose: uni-app x clips `view`
 * overflow by default, so an inset layer would clip the half-knob it protects.
 *
 * In `overlap` mode the inset is zero, so the thumb centre simply lands on
 * `p·W` and nothing needs a margin.
 */
function shiftFor(p: number): number {
  return Math.round(travelInsetRpx.value * (1 - (2 * p) / 100) * 10) / 10;
}

const knobStyle = computed(() => {
  const low = percentOf(displayPair.value[0]);
  const high = percentOf(displayPair.value[1]);
  const positions = props.range ? [low, high] : [high];
  // An explicit radius must land on the knob itself (inline) — the shape
  // modifier class declares the same var, and a rule on the element wins over
  // an inherited inline value on the root.
  const radiusVar = props.knobRadius ? `--sn-bar-knob-radius:${props.knobRadius};` : '';
  return positions.map((p) => {
    const anchor = isColumn.value ? `bottom:${pct(p)};left:50%;` : `left:${pct(p)};top:50%;`;
    // The shift rides a var rather than a literal `margin-left: N rpx`: rpx is
    // not a browser unit, so a literal would be dropped by any host that parses
    // the style string before uni-app rewrites it (happy-dom in unit tests, a
    // plain DOM). Vars are kept verbatim everywhere.
    return `${anchor}--sn-bar-knob-shift:${shiftFor(p)}rpx;${radiusVar}`;
  });
});

/** Ticks for `showLevels`. */
const levelTicks = computed(() => {
  if (!props.showLevels || !props.levels?.length) return [];
  // Ticks sit on the same travel axis as the thumbs — otherwise a tick at 0 or
  // 100 % parks on the capsule's edge while the thumb centre is half a knob in.
  return props.levels.map((l) => {
    const p = percentOf(l.value);
    const style = isColumn.value
      ? `bottom:${pct(p)};--sn-bar-knob-shift:${shiftFor(p)}rpx;`
      : `left:${pct(p)};--sn-bar-knob-shift:${shiftFor(p)}rpx;`;
    return { ...l, pct: p, style };
  });
});

/** Nearest level for the current value. */
const activeLevel = computed<SliderLevel | null>(() => {
  const levels = props.levels;
  if (!levels || levels.length === 0) return null;
  const value = displayPair.value[1];
  let best = levels[0] as SliderLevel;
  let bestDist = Math.abs(best.value - value);
  for (const level of levels) {
    const dist = Math.abs(level.value - value);
    if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && level.value > best.value)) {
      best = level;
      bestDist = dist;
    }
  }
  return best;
});

/* ── caption ────────────────────────────────────────────────────────────── */

const captionText = computed(() => {
  const value = displayPair.value[1];
  if (activeLevel.value) return activeLevel.value.label;
  if (props.formatValue) return props.formatValue(value, fillPercent.value);
  return props.format === 'value'
    ? `${value}${props.valueSuffix}`
    : `${Math.round(fillPercent.value)}${props.valueSuffix}`;
});

const captionVisible = computed(() => props.showValue || props.tooltipOnly);

/* ── pointer interaction ────────────────────────────────────────────────── */

/**
 * Track box in client coordinates — the drag core needs the origin, not just
 * the length: touch events carry *client* coordinates, so a slider that does
 * not start at x = 0 would otherwise map the finger to the wrong value.
 *
 * Read on mount, on `variant` change and once per gesture (see
 * sn-slider-bar-drag.ts) — never per `touchmove`.
 */
const trackRect = ref<SliderBarRect | null>(null);
const trackRef = ref<unknown>(null);

/**
 * Stable DOM id for the track.
 *
 * Element refs are host-dependent — uni H5 resolves `<view>` to a component
 * instance (`$el`), uni-app x H5 to a `UniElement`, mini-programs to nothing
 * measurable — so every measurement path first asks the document for this id.
 * It is also what the desktop mouse path uses to claim its own presses.
 */
const trackDomId = nextTrackDomId();

type RectLike = { left: number; top: number; width: number; height: number };
/** The query API types every field as optional. */
type QueryRect = { left?: number; top?: number; width?: number; height?: number } | null;
type Measurable = { getBoundingClientRect?: () => RectLike };

/** `document` without naming the global (uni-app x compiles without DOM libs). */
type DocLike = { getElementById?: (id: string) => unknown };

function documentOf(): DocLike | null {
  const doc = (globalThis as { document?: DocLike }).document;
  return doc && typeof doc.getElementById === 'function' ? doc : null;
}

/** `uni.getElementById` exists on uni-app x only — typed here as optional. */
type UniWithElement = { getElementById?: (id: string) => unknown };

/** This component's own track node, or whatever the ref resolves to. */
function trackNode(): unknown {
  const byId = documentOf()?.getElementById?.(trackDomId);
  if (byId) return byId;
  // uni-app x (App / MP) resolves ids through the runtime, not the document.
  const viaUni = (uni as unknown as UniWithElement).getElementById?.(trackDomId);
  if (viaUni) return viaUni;
  return (trackRef.value as { $el?: unknown } | null)?.$el ?? trackRef.value;
}

/** A node that can measure itself and be searched — DOM *and* `UniElement`. */
type NodeLike = {
  getBoundingClientRect?: () => RectLike;
  querySelector?: (selector: string) => NodeLike | null;
};

/** rpx → px on hosts without element geometry (mini-program / App). */
function rpxToPx(rpx: number): number {
  const upx = (uni as unknown as { upx2px?: (value: number) => number }).upx2px;
  if (typeof upx === 'function') return upx(rpx);
  const info = (
    uni as unknown as { getWindowInfo?: () => { windowWidth?: number } }
  ).getWindowInfo?.();
  const width = info && info.windowWidth ? info.windowWidth : 375;
  return (rpx * width) / 750;
}

/** Measured thumb length along the travel axis, in px (`null` when unmeasurable). */
function knobAxisPx(): number | null {
  const node = trackNode() as NodeLike | null;
  const knob =
    node && typeof node.querySelector === 'function'
      ? node.querySelector('.sn-slider-bar__knob')
      : null;
  const measure =
    knob && typeof knob.getBoundingClientRect === 'function' ? knob.getBoundingClientRect : null;
  if (!measure) return null;
  const box = measure.call(knob);
  const size = isColumn.value ? box.height : box.width;
  return size > 0 ? size : null;
}

/**
 * The track box narrowed to the thumb's *centre* travel.
 *
 * A thumb is not a point: its centre runs from half a knob to `length − half`,
 * which is exactly how the CSS travel band insets itself. Pointer mapping has
 * to use the same axis, otherwise the last few percent of the range become
 * unreachable and a press near an end reads one knob-width too far.
 */
function valueAxisOf(box: SliderBarRect): SliderBarRect {
  const along = knobAxisPx() ?? rpxToPx(isColumn.value ? knobHeightRpx.value : knobWidthRpx.value);
  const half = along / 2;
  if (isColumn.value) {
    const height = Math.max(box.height - half * 2, 1);
    return { left: box.left, top: box.top + half, width: box.width, height };
  }
  const width = Math.max(box.width - half * 2, 1);
  return { left: box.left + half, top: box.top, width, height: box.height };
}

/** Read the box synchronously; `false` means "this host needs the query API". */
function readTrackRect(): boolean {
  const node = trackNode() as Measurable | null;
  const measure =
    node && typeof node.getBoundingClientRect === 'function' ? node.getBoundingClientRect : null;
  if (!measure) return false;
  const box = measure.call(node);
  // A hidden track (v-show, unmounted tab) measures 0 — treat it as unknown.
  if (!box || !(box.width > 0)) return false;
  trackRect.value = { left: box.left, top: box.top, width: box.width, height: box.height };
  return true;
}

/**
 * Measure the track, calling `done` once a box is available.
 *
 * Mini-program hosts expose no synchronous element geometry, so the fallback
 * runs `createSelectorQuery` — asynchronous, and the reason a gesture that
 * begins in the same tick has to *wait* for it instead of being dropped.
 *
 * The instance is captured once during setup on purpose: `getCurrentInstance()`
 * returns `null` inside an event handler, so resolving it per call turned the
 * query into a page-scoped one on mini-programs.
 *
 * `in()` is what lets WeChat look *inside* a custom component, but not every
 * runtime implements it — an empty answer falls back to an unscoped query
 * once (the track id is unique, so the page-wide lookup still lands on us).
 */
const vm = getCurrentInstance();

/** True while the query is scoped to this component (WeChat custom components). */
let queryScoped = true;

/** Run one selector query; `onBox` gets the box (or `null` when unseen). */
function runQuery(scoped: boolean, onBox: (box: QueryRect) => void): void {
  const query = uni.createSelectorQuery();
  const target = scoped && vm && vm.proxy ? query.in(vm.proxy) : query;
  target.select(`#${trackDomId}`).boundingClientRect(onBox).exec();
}

function measureTrack(done?: (rect: SliderBarRect) => void): void {
  if (readTrackRect()) {
    if (done && trackRect.value) done(trackRect.value);
    return;
  }
  const scoped = queryScoped;
  const handle = (box: QueryRect): void => {
    if (box && (box.width ?? 0) > 0) {
      trackRect.value = {
        left: box.left ?? 0,
        top: box.top ?? 0,
        width: box.width ?? 0,
        height: box.height ?? 0,
      };
      if (done) done(trackRect.value);
      return;
    }
    // `in()` found nothing (or this host ignores it) — one page-wide retry.
    if (scoped) {
      queryScoped = false;
      measureTrack(done);
    }
  };
  try {
    runQuery(scoped, handle);
  } catch {
    // `in()` is unsupported here — retry flat, the id is unique anyway.
    if (!scoped) return;
    queryScoped = false;
    try {
      runQuery(false, handle);
    } catch {
      // No query API on this host at all; the next gesture tries again.
    }
  }
}

/** Index whose knob is currently held — drives the pressed-state class. */
const draggingIndex = ref<number | null>(null);

/** Apply a dragged ratio (0..1 along the value axis) to the value pair. */
function applyRatio(index: number, ratio: number): void {
  const raw = snap(props.min + ratio * span.value);
  const [low, high] = displayPair.value;
  let next: SliderValue;
  if (props.range) {
    if (index === 0) {
      const start = Math.min(raw, high);
      if (start === low) return;
      next = buildValue(start, high);
    } else {
      const end = Math.max(raw, low);
      if (end === high) return;
      next = buildValue(low, end);
    }
  } else {
    if (raw === high) return;
    next = buildValue(raw, raw);
  }
  // Local first, parent second: the thumb must not wait for the re-render.
  dragValue.value = next;
  localValue.value = next;
  emit('update:modelValue', next);
}

/** Release: fold the drag value back into the controlled one. */
function settleDrag(): void {
  draggingIndex.value = null;
  const settled = dragValue.value;
  if (settled !== null) emit('change', settled);
  // Hold the drag value until the parent has re-rendered with the committed
  // props — clearing it now would snap the thumb back for one frame.
  nextTick(() => {
    dragValue.value = null;
  });
}

const drag = createSliderBarDrag({
  isDisabled: () => !isInteractive.value,
  isVertical: () => isColumn.value,
  knobPercentOf: (index) => percentOf(displayPair.value[props.range ? index : 1] ?? props.min),
  nearest: (ratio) => {
    if (!props.range) return 0;
    const raw = snap(props.min + ratio * span.value);
    const [low, high] = displayPair.value;
    return Math.abs(raw - low) <= Math.abs(raw - high) ? 0 : 1;
  },
  // Desktop mouse: one fresh read per press (the box can move with the page).
  trackRect: () => {
    if (!readTrackRect() && !trackRect.value) measureTrack();
    return trackRect.value;
  },
  trackNode: () => trackNode(),
  valueRect: (box) => valueAxisOf(box),
  onGrab: (index) => {
    draggingIndex.value = index;
  },
  onMove: (index, ratio) => applyRatio(index, ratio),
  onSettle: () => settleDrag(),
});

let disposeMouse: (() => void) | null = null;

onMounted(() => {
  measureTrack();
  // The mouse path hit-tests its own box, so no element ref is required —
  // `bindMouse` no-ops on hosts without a `document`.
  disposeMouse = drag.bindMouse(trackNode());
});

onBeforeUnmount(() => {
  disposeMouse?.();
  disposeMouse = null;
});

watch(
  () => [props.variant, props.size, props.range] as const,
  () => {
    setTimeout(() => measureTrack(), 0);
  },
);

/* Track + knob handlers. Every one of them delegates to the shared core, so
   touch and mouse travel the exact same path. */

/**
 * Token for the gesture whose start is still waiting on the async measurement.
 * `touchmove` arriving in the meantime is remembered, not dropped, and a
 * `touchend` invalidates the pending start so it cannot resurrect a dead drag.
 */
let gestureToken = 0;
let pendingMove: unknown = null;

function beginGesture(event: unknown, index: number | null): void {
  const token = ++gestureToken;
  pendingMove = null;
  const start = (rect: SliderBarRect): void => {
    if (token !== gestureToken) return;
    if (index === null) drag.startFromTrack(event, rect);
    else drag.startFromKnob(event, index, rect);
    const queued = pendingMove;
    pendingMove = null;
    // The finger kept moving while we waited — apply its latest position.
    if (queued !== null) drag.move(queued);
  };
  if (readTrackRect() && trackRect.value) {
    start(trackRect.value);
    return;
  }
  const cached = trackRect.value;
  if (cached) {
    // A slightly stale box still tracks the pointer better than no drag at
    // all; refresh in the background for the next gesture.
    start(cached);
    measureTrack();
    return;
  }
  // Cold start on a host without synchronous geometry (mini-program / App):
  // wait for the query instead of silently swallowing the press.
  measureTrack(start);
}

function onTrackTouchStart(event: unknown): void {
  beginGesture(event, null);
}

function onKnobTouchStart(index: number, event: unknown): void {
  beginGesture(event, index);
}

function onTouchMove(event: unknown): void {
  pendingMove = event;
  drag.move(event);
}

function onTouchEnd(event: unknown): void {
  gestureToken += 1;
  pendingMove = null;
  drag.end(event);
}

function onTouchCancel(): void {
  gestureToken += 1;
  pendingMove = null;
  drag.cancel();
}

/* ── misc ───────────────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-slider-bar',
  `sn-slider-bar--${props.variant}`,
  {
    'sn-slider-bar--aurora': isAurora.value,
    'sn-slider-bar--animated': isAurora.value && props.animated,
    'sn-slider-bar--empty': isEmpty.value,
    'sn-slider-bar--filled': !isEmpty.value,
    'sn-slider-bar--disabled': props.disabled,
    'sn-slider-bar--readonly': props.readonly,
    'sn-slider-bar--column': isColumn.value,
    'sn-slider-bar--fade': props.fade,
    'sn-slider-bar--dragging': draggingIndex.value !== null,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  // How far an oversized thumb sticks out of the track *across* the travel
  // axis (`knob-size` bigger than the thickness). The thumb layer grows by
  // that much on both sides so a clipping host still cannot cut it — the layer
  // stays symmetrical, so `top: 50%` / `left: 50%` still hit the track centre.
  const bleed = Math.max(
    0,
    Math.ceil(
      ((isColumn.value ? knobWidthRpx.value : knobHeightRpx.value) - thicknessRpx.value) / 2,
    ),
  );
  const parts = [
    `--sn-bar-thickness:${thicknessRpx.value}rpx`,
    `--sn-bar-knob-w:${knobWidthRpx.value}rpx`,
    `--sn-bar-knob-h:${knobHeightRpx.value}rpx`,
    `--sn-bar-knob-bleed-neg:-${bleed}rpx`,
  ];
  // Theme presets come before the explicit props, so a per-instance colour
  // always beats the preset.
  const preset = themePreset.value;
  if (preset) {
    parts.push(`--sn-bar-track:${preset.track}`);
    parts.push(`--sn-bar-fill:${preset.fill}`);
    parts.push(`--sn-bar-knob-border-color:${preset.ring}`);
  }
  if (props.radius) parts.push(`--sn-bar-radius:${props.radius}`);
  // barHeight wins; the `height` alias falls back only when it carries a value
  // (an empty-string default must not shadow barHeight).
  const explicitHeight =
    props.barHeight !== undefined && props.barHeight !== '' ? props.barHeight : props.height;
  if (explicitHeight !== undefined && explicitHeight !== null && explicitHeight !== '') {
    const h = typeof explicitHeight === 'number' ? `${explicitHeight}rpx` : String(explicitHeight);
    parts.push(`--sn-bar-height:${h}`);
    parts.push(`height:${h}`);
  }
  if (props.innerColor) parts.push(`--sn-bar-inner-color:${props.innerColor}`);
  if (props.innerColorEmpty) parts.push(`--sn-bar-inner-color-empty:${props.innerColorEmpty}`);
  if (props.knobColor) parts.push(`--sn-bar-knob-color:${props.knobColor}`);
  if (props.knobBorderColor) parts.push(`--sn-bar-knob-border-color:${props.knobBorderColor}`);
  if (props.knobBorderWidth) parts.push(`--sn-bar-knob-border-width:${props.knobBorderWidth}`);
  if (props.barBackground) parts.push(`--sn-bar-track-bg:${props.barBackground}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join(';');
});

/** Custom track background applied inline so gradients pass through untouched. */
const trackStyle = computed(() =>
  props.barBackground ? `background:${props.barBackground};` : '',
);

const ariaNow = (index: number): number => displayPair.value[props.range ? index : 1] ?? props.min;

const knobLabels = computed(() =>
  props.range
    ? [`${props.ariaLabel || 'Start'} ${ariaNow(0)}`, `${props.ariaLabel || 'End'} ${ariaNow(1)}`]
    : [`${props.ariaLabel || 'Value'} ${ariaNow(0)}`],
);
</script>

<template>
  <view :class="rootClass" :style="rootStyle" :aria-label="ariaLabel">
    <view class="sn-slider-bar__body">
      <!-- Opt-in head glyph. -->
      <view v-if="!isColumn && $slots.start" class="sn-slider-bar__edge" aria-hidden="true">
        <slot name="start" />
      </view>

      <view
        :id="trackDomId"
        ref="trackRef"
        class="sn-slider-bar__track"
        :style="trackStyle"
        @touchstart="onTrackTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
      >
        <!--
          Fill band: the raw track. 0 %…100 % of *this* box is the capsule's
          own travel, so the fill starts on the near cap (no inset, no
          reach-back) and its moving edge lands under the thumb.
        -->
        <view class="sn-slider-bar__travel sn-slider-bar__travel--fill" aria-hidden="true">
          <view class="sn-slider-bar__fill" :style="fillStyle">
            <!-- Aurora star field: static dots, animated by CSS. -->
            <view
              v-for="(dot, i) in isAurora && animated ? (sparkles ?? 14) : 0"
              :key="'star-' + i"
              class="sn-slider-bar__star"
              :style="`left:${(i * 37) % 100}%;top:${18 + ((i * 29) % 60)}%;`"
            />
          </view>
        </view>

        <!-- Level ticks. -->
        <view
          v-for="tick in levelTicks"
          :key="'lvl-' + tick.value"
          class="sn-slider-bar__level-mark"
          :class="[
            { 'sn-slider-bar__level-mark--on': activeLevel?.value === tick.value },
            { 'sn-slider-bar__level-mark--column': isColumn },
          ]"
          :style="tick.style"
          aria-hidden="true"
        />

        <!-- In-track label / glyph / suffix. -->
        <text v-if="label" class="sn-slider-bar__label" aria-hidden="true">{{ label }}</text>
        <view v-if="!isColumn && $slots.icon" class="sn-slider-bar__glyph" aria-hidden="true">
          <slot name="icon" />
        </view>
        <text v-if="suffix" class="sn-slider-bar__suffix" aria-hidden="true">{{ suffix }}</text>

        <!--
          Thumbs ride the *raw* track — one layer, no inset. In `inset` mode the
          half-knob offset is folded into each knob's margin (see `knobStyle`);
          in `overlap` mode there is no offset at all and a thumb at 0 / 100 %
          straddles the cap, so this layer declares `overflow: visible` (the
          fill layer already relies on it: its rounded cap reaches back over the
          band inset).
        -->
        <view class="sn-slider-bar__travel sn-slider-bar__travel--knobs">
          <view
            v-for="(style, index) in knobStyle"
            :key="'knob-' + index"
            :class="[
              'sn-slider-bar__knob',
              knobShapeClass,
              {
                'sn-slider-bar__knob--active': draggingIndex === index,
                'sn-slider-bar__knob--column': isColumn,
              },
            ]"
            :style="style"
            role="slider"
            :aria-label="knobLabels[index]"
            :aria-valuenow="ariaNow(index)"
            :aria-valuemin="range && index === 1 ? displayPair[0] : min"
            :aria-valuemax="range && index === 0 ? displayPair[1] : max"
            @touchstart.stop="onKnobTouchStart(index, $event)"
            @touchmove.stop.prevent="onTouchMove"
            @touchend.stop="onTouchEnd"
            @touchcancel.stop="onTouchCancel"
          >
            <!--
              Glyph inside the thumb: `knob-icon` (any sn-icon name) or the
              `knob` slot for something custom. Both are decoration — the
              thumb keeps its own slider role / aria value.
            -->
            <SnIcon
              v-if="knobIcon"
              class="sn-slider-bar__knob-icon"
              :icon="knobIcon"
              :size="knobIconSizeResolved"
              :color="knobIconColorResolved"
            />
            <slot v-else name="knob" :index="index" :value="ariaNow(index)" />
          </view>
        </view>
      </view>

      <view v-if="!isColumn && $slots.end" class="sn-slider-bar__edge sn-slider-bar__edge--end">
        <slot name="end" />
      </view>

      <text
        v-if="captionVisible && (!isColumn || showValue)"
        class="sn-slider-bar__value"
        aria-hidden="true"
      >
        <slot
          name="value"
          :value="displayPair[1]"
          :percent="Math.round(fillPercent)"
          :level="activeLevel?.label ?? ''"
        >
          {{ captionText }}
        </slot>
      </text>
    </view>
  </view>
</template>

<style scoped>
/* =====================================================================
   sn-slider-bar — capsule slider (uni end, rpx units).

   One capsule surface: the track is the bar. The fill is themed (solid, or an
   aurora gradient with drifting stars) and the knob matches the track height.
   Text / glyph colours switch between the filled and empty states.
   ===================================================================== */

.sn-slider-bar {
  --sn-bar-thickness: 40rpx;
  --sn-bar-height: auto;
  --sn-bar-radius: 9999rpx;
  --sn-bar-pad: 0rpx;
  --sn-bar-fill: var(--sn-mp-color-action-primary);
  --sn-bar-track: rgba(0, 0, 0, 0.08);
  --sn-bar-thumb: #ffffff;
  /* Reference look: white knob ringed in the theme action colour. All four
     are CSS vars so the default can be overridden per instance (additive). */
  --sn-bar-knob-color: var(--sn-bar-thumb);
  --sn-bar-knob-border-color: var(--sn-bar-fill);
  --sn-bar-knob-border-width: 4rpx;
  --sn-bar-knob-radius: 32%;
  /* Half a knob — the inline style from the component always overrides these;
     the 0 fallback keeps the travel band full-width if it ever does not. */
  /* Per-value half-knob margin — declared inline on every knob / tick. */
  --sn-bar-knob-shift: 0rpx;
  /* Cross-axis growth for an oversized thumb (knob-size > thickness). */
  --sn-bar-knob-bleed-neg: 0rpx;

  display: flex;
  width: 100%;
  height: var(--sn-bar-height, auto);
  box-sizing: border-box;
  font-family: inherit;
}

.sn-slider-bar__body {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.sn-slider-bar__edge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44rpx;
}

.sn-slider-bar__edge--end {
  margin-left: 12rpx;
}

.sn-slider-bar__track {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: var(--sn-bar-thickness);
  border-radius: var(--sn-bar-radius);
  background: var(--sn-bar-track);
  overflow: visible;
  /* A press on the track belongs to the slider — without this the browser
     claims the gesture for scrolling and the thumb never follows. */
  touch-action: none;
}

/* Vertical strip: the whole widget stacks, the track grows downwards and its
   *width* — not its height — is the thickness. Body/track are switched to a
   column axis so `flex: 1` grows along the bar instead of across it. */
.sn-slider-bar--column {
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.sn-slider-bar--column .sn-slider-bar__body {
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: auto;
  min-width: 0;
  min-height: 0;
}

.sn-slider-bar--column .sn-slider-bar__track {
  flex: 1 1 0;
  align-self: center;
  width: var(--sn-bar-thickness);
  height: auto;
  min-height: 96rpx;
}

/*
 * Two full-bleed layers over the track:
 * - `.sn-slider-bar__travel` (thumbs): the raw track, no inset. Each knob folds
 *   the half-knob travel inset into its own margin (`knobStyle`), so no child
 *   ever needs to overflow — uni-app x clips `view` overflow by default, and an
 *   inset layer clips exactly the half-knob it was built to protect (the thumb
 *   showed up as a half-disc "C" at both ends, with a flat fill edge).
 * - `.sn-slider-bar__travel--fill` (fill): inset by half a knob, so 0 %…100 %
 *   is already "knob centre" and the fill always stops under the thumb. The
 *   single-value fill grows back over the left inset, hence `overflow: visible`
 *   (harmless elsewhere: nothing but that overhang ever leaves the box).
 */
.sn-slider-bar__travel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: visible;
  /* Pure scaffolding: let presses through to the track, or a grown layer would
     start dragging from a tap that never touched the bar. */
  pointer-events: none;
}

/* Thumbs may be taller than the track (`knob-size`), so the layer bleeds
   across the travel axis by exactly the overhang — symmetrical, so the
   `top: 50%` / `left: 50%` anchors still land on the track centre.
   `left`/`right` are declared here as well (even though they are 0) because
   the column branch below overrides them: the uni-app x CSS flattener rewrites
   every variant-overridden property into `prop: var(--snx-…)` and only emits a
   fallback when the base rule declares that property. A missing fallback is
   invalid at computed-value time → `left: auto` → a zero-width layer → every
   `left: p%` inside resolves to 0 and the thumb stops following the finger. */
.sn-slider-bar__travel--knobs {
  top: var(--sn-bar-knob-bleed-neg, 0rpx);
  bottom: var(--sn-bar-knob-bleed-neg, 0rpx);
  left: 0;
  right: 0;
}

.sn-slider-bar--column .sn-slider-bar__travel--knobs {
  top: 0;
  bottom: 0;
  left: var(--sn-bar-knob-bleed-neg, 0rpx);
  right: var(--sn-bar-knob-bleed-neg, 0rpx);
}

/* The fill rides the raw track — the same 0 %…100 % the value uses, so the band
   starts on the capsule's cap and its moving edge lands under the thumb. No
   inset and no column branch: one geometry for both orientations. */
.sn-slider-bar__travel--fill {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

/* Fill: themed band inside the capsule. */
.sn-slider-bar__fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: var(--sn-bar-radius);
  background: var(--sn-bar-fill);
  overflow: hidden;
}
.sn-slider-bar--column .sn-slider-bar__fill {
  top: auto;
  left: 0;
  width: 100%;
  /* The fill is positioned by top + bottom (the inline style) in the column, so
     its height must stay auto. The bar branch pins `height: 100%`, and with a
     percentage height also set the `bottom` edge is simply ignored — the fill
     then always spanned a full band from its `top`, which left the strip's
     bottom cap unpainted (grey sliver) once the value approached max. */
  height: auto;
}

.sn-slider-bar--aurora .sn-slider-bar__fill {
  background-size: 220% 100%;
  box-shadow: 0 0 24rpx rgba(124, 108, 246, 0.35);
}

.sn-slider-bar--animated .sn-slider-bar__fill {
  animation: sn-bar-drift 9s ease-in-out infinite alternate;
}

@keyframes sn-bar-drift {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

.sn-slider-bar__star {
  position: absolute;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #ffffff;
  opacity: 0.5;
}

.sn-slider-bar--animated .sn-slider-bar__star {
  animation: sn-bar-twinkle 3.2s ease-in-out infinite;
}

@keyframes sn-bar-twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.7);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.15);
  }
}

/* Knob: a disc the height of the track, ringed in the theme colour. Shape
   modifiers only change the box — travel geometry (left/bottom + translate)
   is shared, so range / column / pointer maths stay identical. */
.sn-slider-bar__knob {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-bar-knob-w, var(--sn-bar-thickness));
  height: var(--sn-bar-knob-h, var(--sn-bar-thickness));
  border-radius: var(--sn-bar-knob-radius);
  background: var(--sn-bar-knob-color);
  /* Longhands (not the shorthand): uni-app x's CSS flattener injects var()
     fallbacks per longhand; a shorthand with var() cannot be split. */
  border-style: solid;
  border-color: var(--sn-bar-knob-border-color);
  border-width: var(--sn-bar-knob-border-width);
  box-sizing: border-box;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.18);
  /* Half a knob of travel inset, computed per value (`knobStyle`). A margin
     keeps the box inside its layer — nothing needs to overflow. */
  margin-left: var(--sn-bar-knob-shift, 0rpx);
  /* Declared (0) because the column branch overrides it: the uni-app x CSS
     flattener only emits a var() fallback for properties the base rule
     declares, and a fallback-less var() computes to the property initial. See
     the note on `.sn-slider-bar__travel--knobs`. */
  margin-bottom: 0;
  transform: translate(-50%, -50%);
  z-index: 2;
  touch-action: none;
  /* The layer above is pointer-transparent; the thumb itself is not. */
  pointer-events: auto;
}

/* While a gesture owns the bar the aurora drift would keep repainting the fill
   underneath the thumb — park it until the drag ends. */
.sn-slider-bar--dragging .sn-slider-bar__fill {
  animation-play-state: paused;
}

.sn-slider-bar--dragging .sn-slider-bar__star {
  animation-play-state: paused;
}

/* Default reference knob: a soft rounded rectangle, longer along the travel
   axis than across it (1.3 : 1), ringed in the theme colour. */
.sn-slider-bar__knob--round {
  --sn-bar-knob-radius: 32%;
}

/* True disc — equal box, half-side radius. */
.sn-slider-bar__knob--circle {
  --sn-bar-knob-radius: 50%;
}

/* Rounded square — the orange "Volume" reference. Corner radius scales with
   the box so small / large tiers keep the same silhouette. */
.sn-slider-bar__knob--square {
  --sn-bar-knob-radius: 26%;
}

/* Stadium — the "Mood" reference: a full-round capsule standing proud of the
   track. Width and height come from the component (rpx), so the aspect
   survives rpx scaling. */
.sn-slider-bar__knob--pill {
  --sn-bar-knob-radius: 9999rpx;
}

/* Column thumbs ride the same contract through a *modifier class*, not a
   descendant selector. `.sn-slider-bar--column .knob` would be flattened into
   `--snx-…-knob-margin-bottom: var(--sn-bar-knob-shift)` **on the root**, and a
   custom property is substituted where it is *declared* — the root has no
   `--sn-bar-knob-shift` (each thumb carries its own), so the whole margin
   resolved to its 0rpx fallback and every vertical thumb sat half a knob too
   low (at value 100 it hung outside the track). A second class on the thumb
   keeps the property on the element that owns the variable. */
.sn-slider-bar__knob--column {
  margin-left: 0;
  margin-bottom: var(--sn-bar-knob-shift, 0rpx);
  transform: translate(-50%, 50%);
}

.sn-slider-bar__knob--active {
  transform: translate(-50%, -50%) scale(1.06);
}

.sn-slider-bar__knob--column.sn-slider-bar__knob--active {
  transform: translate(-50%, 50%) scale(1.06);
}

/* Glyph inside the thumb (`knob-icon` / `knob` slot). The thumb is already a
   centred flex box, so this only pins the colour and keeps the glyph out of
   the gesture: a press must reach the thumb, never the icon inside it. */
.sn-slider-bar__knob-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  /* Default glyph colour = the thumb's ring, so a themed bar gets a themed
     glyph without resolving any CSS var in JS. */
  color: var(--sn-bar-knob-border-color);
  pointer-events: none;
}

.sn-slider-bar--disabled .sn-slider-bar__knob,
.sn-slider-bar--readonly .sn-slider-bar__knob {
  background: var(--sn-mp-color-action-disabled, rgba(0, 0, 0, 0.25));
}

/* Level ticks. */
.sn-slider-bar__level-mark {
  position: absolute;
  top: 50%;
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  margin-left: var(--sn-bar-knob-shift, 0rpx);
  margin-bottom: 0;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.3);
  z-index: 3;
  left: 0;
}

/* Same reason as `.sn-slider-bar__knob--column`: the tick's shift must resolve
   on the tick itself. */
.sn-slider-bar__level-mark--column {
  top: auto;
  left: 50%;
  margin-left: 0;
  margin-bottom: var(--sn-bar-knob-shift, 0rpx);
  transform: translate(-50%, 50%);
}

.sn-slider-bar__level-mark--on {
  background: #ffffff;
}

/* In-track text / glyph — two colour states. */
.sn-slider-bar__label,
.sn-slider-bar__suffix,
.sn-slider-bar__glyph {
  position: relative;
  z-index: 4;
  flex: none;
  color: var(--sn-bar-inner-color-empty, var(--sn-mp-color-text-secondary, #888));
  transition: color 0.18s ease;
}

/* Filled state rides a class (uni-app x App has no :not pseudo, §116.2).
   The old aurora variant duplicated these declarations verbatim and is gone. */
.sn-slider-bar--filled .sn-slider-bar__label,
.sn-slider-bar--filled .sn-slider-bar__suffix,
.sn-slider-bar--filled .sn-slider-bar__glyph {
  color: var(--sn-bar-inner-color, #ffffff);
}

.sn-slider-bar__label {
  padding-left: 24rpx;
  font-size: 24rpx;
  line-height: 1;
  white-space: nowrap;
}

.sn-slider-bar__glyph {
  margin-left: 16rpx;
}

.sn-slider-bar__suffix {
  margin-left: auto;
  padding-right: 24rpx;
  font-size: 24rpx;
  line-height: 1;
  white-space: nowrap;
}

/* Read-out beside / above the bar. */
.sn-slider-bar__value {
  flex: none;
  margin: 0 24rpx 0 20rpx;
  font-size: 24rpx;
  white-space: nowrap;
}

.sn-slider-bar--column .sn-slider-bar__value {
  order: -1;
  align-self: center;
  margin: 12rpx 0 20rpx;
  font-size: 28rpx;
}
</style>
