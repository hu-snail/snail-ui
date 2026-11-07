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

/** Visual theme — `aurora` adds the gradient + drifting stars + disc knob. */
export type SliderBarTheme = 'default' | 'aurora';

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