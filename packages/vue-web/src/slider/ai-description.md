# SnSlider (Web)

Web-end slider component for `@snui/vue-web`. Surface mirrors naive-ui
`n-slider` 1:1. Self-drawn track + handle(s) (no native `input[type=range]`)
so marks, range dual-handles, vertical orientation and the tooltip share one
geometry pipeline.

## When to use

Single-value selection on a bounded numeric range (volume, percentage,
thresholds), or a bounded `[start, end]` interval with `range`. Supports
keyboard and screen readers per the WAI-ARIA slider pattern.

## Props

| Prop          | Type                                                      | Default     | Notes                                                       |
| ------------- | --------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| modelValue    | `number \| [number, number]`                              | `undefined` | Bound via `v-model`. `[low, high]` when `range`.            |
| defaultValue  | `number \| [number, number]`                              | `undefined` | Uncontrolled initial value.                                 |
| min           | `number`                                                  | `0`         | Lower bound.                                                |
| max           | `number`                                                  | `100`       | Upper bound.                                                |
| step          | `number`                                                  | `1`         | Snap grid; applies to pointer and keyboard.                 |
| range         | `boolean`                                                 | `false`     | Dual-handle mode. Handles never cross.                      |
| disabled      | `boolean`                                                 | `false`     | No interaction; handle removed from tab order.              |
| readonly      | `boolean`                                                 | `false`     | Visible but not editable.                                   |
| vertical      | `boolean`                                                 | `false`     | Vertical orientation (`aria-orientation` follows).          |
| reverse       | `boolean`                                                 | `false`     | Inverts the axis (RTL / bottom-up).                         |
| tooltip       | `boolean`                                                 | `true`      | Show the value bubble on hover / drag / focus.              |
| formatTooltip | `(value: number) => string \| number`                     | `undefined` | Formats the tooltip content.                                |
| marks         | `Record<number, string>`                                  | `undefined` | Tick marks keyed by value; dots are clickable.              |
| placement     | `'top' \| 'bottom' \| …-start/-end' \| 'left' \| 'right'` | `'top'`     | Tooltip position class (`sn-slider__tooltip--{placement}`). |
| showSteps         | `boolean`                                                 | `false`     | Tick at every step between min / max (interior ticks, capped at 100). |
| showInput         | `boolean`                                                 | `false`     | Number input(s) beside the rail; two inputs + separator in range. |
| trackBackground   | `string`                                                  | `undefined` | Fill-track background — solid / gradient / `transparent`. |
| railBackground    | `string`                                                  | `undefined` | Rail background — solid / gradient / `transparent`. |
| railWidth         | `number \| string`                                        | `undefined` | Rail thickness (horizontal: height, vertical: width). Number → px. |
| tooltipBackground | `string`                                                  | `undefined` | Tooltip bubble background (default: shared dark tooltip token). |
| tooltipTextColor  | `string`                                                  | `undefined` | Tooltip text color. |
| ariaLabel     | `string`                                                  | —           | Accessible name (single-handle mode).                       |
| customClass   | `string`                                                  | `''`        | Class on the root wrapper.                                  |
| customStyle   | `string \| Record<string, string>`                        | `''`        | Inline style on the root wrapper.                           |
Notes:

- `showInput` commits only on blur / Enter: the typed value is clamped to
  `min` / `max` (and to the sibling handle in range mode) but **not** snapped
  to the step grid — pointer / keyboard-on-handle keep snapping.
- `trackBackground` / `railBackground` / `tooltipBackground` accept any CSS
  background value (solid, `linear-gradient(...)`, `transparent`) and win over
  the disabled stylesheet colors by design.
- Per-instance tooltip colors override the tokens via inline
  `--sn-web-slider-tooltip-bg` / `--sn-web-slider-tooltip-text`.
- Marks labels hang off the rail center by `rail thickness / 2 + gap`, and the
  root reserves padding for them (bottom when horizontal, right when vertical).

## Events

| Event               | Payload                               | When                                      |
| ------------------- | ------------------------------------- | ----------------------------------------- |
| `update:modelValue` | `(value: number \| [number, number])` | Every value change (v-model sync).        |
| `change`            | `(value: number \| [number, number])` | Commit: drag end / keyboard / mark click / input commit. |

## Slots

| Slot      | Props               | Notes                                     |
| --------- | ------------------- | ----------------------------------------- |
| `tooltip` | `{ value: number }` | Custom tooltip content for active handle. |

## Keyboard

On a focused handle: `ArrowLeft`/`ArrowRight` (±step, reversed in vertical),
`ArrowUp`/`ArrowDown`, `Home`/`End` (bounds), `PageUp`/`PageDown` (±10 steps).
In range mode only the focused handle moves.

## Accessibility

- `role="slider"` per handle with `aria-valuemin` / `aria-valuemax` /
  `aria-valuenow` / `aria-valuetext` / `aria-orientation` / `aria-disabled`.
- Range handles clamp each other's min/max so each slider is individually
  meaningful; `aria-label` distinguishes Start / End handles.

## Tokens

`--sn-web-slider-rail-width` (extra alias for `--sn-web-slider-rail-height`,
drives rail thickness in both orientations), `--sn-web-slider-rail-bg`,
`--sn-web-slider-track-bg`, `--sn-web-slider-handle-size`,
`--sn-web-slider-handle-border-color`, `--sn-web-slider-handle-bg`,
`--sn-web-slider-tick-size`, `--sn-web-slider-tick-bg`,
`--sn-web-slider-tick-shadow`, `--sn-web-slider-mark-*`,
`--sn-web-slider-input-width`, `--sn-web-slider-input-radius`,
`--sn-web-slider-tooltip-bg`, `--sn-web-slider-tooltip-text`,
`--sn-web-slider-tooltip-*` — all fall back to global `--sn-web-color-*`
design tokens.
