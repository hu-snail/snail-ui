/**
 * sn-slider — shared types (uni-end).
 *
 * Lives beside the SFC because `<script setup>` cannot export values.
 */

/** Single knob value or a `[start, end]` pair in `range` mode. */
export type SliderValue = number | number[]

/** Visual style. */
export type SliderTheme = 'default' | 'capsule'

/** When the value bubble is shown. */
export type SliderPopoverVisible = 'always' | 'normal' | 'never'

/** One tick mark. */
export interface SliderMark {
  /** Value the mark sits at. */
  value: number
  /** Caption rendered under the track. */
  label: string
}

/** Marks as an array of entries or a `{ value: label }` record. */
export type SliderMarks = SliderMark[] | Record<number, string>
