/**
 * sn-slider-bar — shared types (uni end).
 *
 * Lives beside the SFC because `<script setup>` cannot export values.
 * Mirrors the web `SnSliderBar` contract; lengths are rpx strings / numbers.
 */

/** Single knob value or a `[start, end]` pair in `range` mode. */
export type SliderValue = number | number[];

/** `bar` horizontal capsule, `column` vertical strip. */
export type SliderBarVariant = 'bar' | 'column';

/**
 * Visual theme.
 *
 * `default` and `aurora` are the two original looks; the rest are colour
 * presets (fill + knob ring + track tint) that need no extra props —
 * `theme="ocean"` is enough. `aurora` additionally paints the drifting stars.
 */
export type SliderBarTheme = 'default' | 'aurora' | 'ocean' | 'sunset' | 'grape' | 'mono';

/**
 * Knob silhouette (additive, uni end).
 * - `round`: rounded rectangle, longer along the travel axis (default).
 * - `circle`: a true disc — equal width and height, `50%` radius.
 * - `square`: rounded square matching the track thickness.
 * - `pill`: vertical capsule — narrower than the track, taller than it.
 */
export type SliderBarKnobShape = 'round' | 'circle' | 'square' | 'pill';

/**
 * How the thumb meets the ends of the track (additive, uni end).
 * - `auto` (default): `overlap` for the bar, `inset` for the column strip — a
 *   vertical bar reads as a level meter, and a thumb hanging off its top cap
 *   looks broken rather than deliberate.
 * - `overlap`: the centre travels the full 0…100 %, so a thumb at an end
 *   straddles the capsule's cap and overlaps the track.
 * - `inset`: the whole thumb box stays inside the track, flush with the caps.
 */
export type SliderBarKnobAlign = 'auto' | 'overlap' | 'inset';

/** Caption source. */
export type SliderBarFormat = 'percent' | 'value';

/** Size tier (drives the track thickness, knob size follows it). */
export type SliderBarSize = 'small' | 'medium' | 'large';

/** One discrete level. */
export interface SliderLevel {
  /** Value this level sits at. */
  value: number;
  /** Caption shown when this level is active. */
  label: string;
  /** Optional glyph name. */
  icon?: string;
}

export interface SnSliderBarProps {
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
  /** Alias of `barHeight` (kept for authoring convenience). */
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
  /** Custom track background (any CSS background). */
  barBackground?: string;
  /** Knob silhouette — round / circle / square / pill. */
  knobShape?: SliderBarKnobShape;
  /** Knob diameter in rpx (number) or any CSS length — overrides the shape ratio. */
  knobSize?: string | number;
  /** Knob fill colour (empty = theme default, white). */
  knobColor?: string;
  /** Knob outline colour (empty = theme action colour). */
  knobBorderColor?: string;
  /** Knob outline width as a CSS length (empty = theme default). */
  knobBorderWidth?: string;
  /** Knob corner radius (empty = shape default; `50%` turns square into a disc). */
  knobRadius?: string;
  /**
   * Glyph painted inside the knob (any sn-icon name: registry → built-in
   * catalogue → async provider). Left empty the knob stays a plain chip; the
   * `knob` slot wins over it when present.
   */
  knobIcon?: string;
  /** Glyph colour (empty = the knob's ring colour). */
  knobIconColor?: string;
  /** Glyph size — number is rpx, `12px` honoured (empty = 56 % of the knob). */
  knobIconSize?: string | number;
  /** Thumb vs. track ends: `overlap` (centre on the cap) or `inset` (flush inside). */
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
}
