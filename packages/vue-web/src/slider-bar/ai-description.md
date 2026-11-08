# SnSliderBar (Web)

Web-end **capsule slider** for `@snui/vue-web`. A bar-shaped control: a
neutral track, a themed fill from the origin edge, a slim thumb and an
optional inline read-out. `variant="column"` turns it into a vertical strip.

Split out of `SnSlider`'s former `variant` prop so each surface owns its
contract: `SnSlider` stays the classic rail (marks / step ticks / inputs),
`SnSliderBar` owns the bar / capsule look used for volume, playback scrub,
price ranges and dimmers.

## When to use

- Media volume / brightness bars (`variant="bar"`).
- Playback position with a time read-out (`format="value"`, `valueSuffix="s"`).
- Price / budget intervals (`range`).
- Vertical dimmer / thermostat strips (`variant="column"`, `fade`, `tooltipOnly`).

Use `SnSlider` instead when you need marks, step ticks or number inputs.

## Props

| Prop           | Type                                  | Default      | Notes                                                           |
| -------------- | ------------------------------------- | ------------ | --------------------------------------------------------------- |
| modelValue     | `number \| [number, number]`          | `undefined`  | Bound via `v-model`. `[low, high]` when `range`.                |
| defaultValue   | `number \| [number, number]`          | `undefined`  | Uncontrolled initial value.                                     |
| min            | `number`                              | `0`          | Lower bound.                                                    |
| max            | `number`                              | `100`        | Upper bound.                                                    |
| step           | `number`                              | `1`          | Snap grid; applies to pointer and keyboard.                     |
| range          | `boolean`                             | `false`      | Dual handles; they never cross.                                 |
| disabled       | `boolean`                             | `false`      | No interaction; handles leave the tab order.                    |
| readonly       | `boolean`                             | `false`      | Visible but not editable.                                       |
| reverse        | `boolean`                             | `false`      | Inverts the axis (RTL / bottom-up).                             |
| variant        | `'bar' \| 'column'`                   | `'bar'`      | Horizontal capsule vs vertical strip.                           |
| showValue      | `boolean`                             | `false`      | Render the inline read-out inside the bar.                      |
| iconPlacement  | `'leading' \| 'inside' \| 'trailing'` | `'leading'`  | Where the `#icon` slot renders; `inside` paints it on the fill. |
| label          | `string`                              | `undefined`  | Caption text painted inside the bar at the leading edge.        |
| suffix         | `string`                              | `undefined`  | Caption text painted inside the bar at the trailing edge.       |
| format         | `'percent' \| 'value'`                | `'percent'`  | Read-out source: filled share vs raw value.                     |
| valueSuffix    | `string`                              | `'%'`        | Suffix appended to the default read-out.                        |
| formatValue    | `(value, percent) => string`          | `undefined`  | Fully custom read-out; wins over `format`.                      |
| tooltip        | `boolean`                             | `true`       | Drag / hover bubble.                                            |
| formatTooltip  | `(value: number) => string \| number` | `undefined`  | Bubble formatter.                                               |
| placement      | `string`                              | `'top'`      | Bubble placement class (`__tooltip--{placement}`).              |
| fillBackground | `string`                              | `undefined`  | Fill background — solid / gradient / `transparent`.             |
| barBackground  | `string`                              | `undefined`  | Track background — solid / gradient / `transparent`.            |
| thickness      | `number \| string`                    | `40`         | Bar thickness (horizontal height, column width). Number → px.   |
| radius         | `string`                              | radius token | Bar corner radius (any CSS length).                             |
| fade           | `boolean`                             | `true`       | Column: fade the un-filled part upwards.                        |
| tooltipOnly    | `boolean`                             | `false`      | Column: read the value from the bubble.                         |
| ariaLabel      | `string`                              | `undefined`  | Accessible name.                                                |
| customClass    | `string`                              | `''`         | Class on the root wrapper.                                      |
| customStyle    | `string \| Record<string, string>`    | `''`         | Inline style on the root wrapper.                               |

## Slots

| Slot    | Props                                        | Notes                                                                                                           |
| ------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| icon    | —                                            | Leading glyph. **Opt-in**: nothing renders by default (a built-in glyph read as a stray close / power control). |
| value   | `{ value, percent, min, max, index, range }` | Custom read-out content.                                                                                        |
| tooltip | `{ value }`                                  | Custom bubble content.                                                                                          |

## Events

| Event             | Payload                      | Notes                                   |
| ----------------- | ---------------------------- | --------------------------------------- |
| update:modelValue | `number \| [number, number]` | Every change, including during drag.    |
| change            | `number \| [number, number]` | Committed (drag end / keyboard commit). |

## Styling contract

- Fill: solid `--sn-bar-fill` → `--sn-web-color-action-primary`. A
  translucent theme color over the neutral track desaturates into grey-blue,
  so the un-filled remainder is the neutral part, not a faded theme color.
- Shape: `--sn-bar-radius` → `--sn-web-radius-lg`. Corners follow the radius
  scale rather than a hard pill; pass `radius="4px"` / `9999px` to taste.
- Track base: `--sn-bar-bg` → `--sn-web-color-text-primary`, mixed to 8% so
  it works on light and dark surfaces without a second token.
- Geometry is measured in px (`ResizeObserver` + `getBoundingClientRect`) —
  the fill / thumb never rely on percentage resolution inside an auto-sized
  box. A `ResizeObserver`-less environment falls back to the percentage form.
- The bar axis is **flush at both ends**: a 0% thumb sits on the leading edge
  and 100% on the trailing one (no reserved gutter). Only a 2px tail keeps the
  rounded fill edge whole.
- `label` / `suffix` / an `iconPlacement="inside"` glyph are painted above the
  fill inside the track (z-index) and are `aria-hidden`; the value is
  announced through `aria-valuetext`.

Variables: `--sn-bar-thickness`, `--sn-bar-radius`, `--sn-bar-padding`,
`--sn-bar-bg`, `--sn-bar-fill`, `--sn-bar-thumb`,
`--sn-slider-bar-handle-width`, `--sn-slider-bar-handle-height`,
`--sn-slider-bar-column-width`, `--sn-web-slider-bar-column-bg`.

## Accessibility

- One `role="slider"` per handle with `aria-valuemin`
  / `aria-valuemax` / `aria-valuenow` / `aria-valuetext`.
- `aria-orientation="vertical"` in the column variant.
- `aria-disabled` on the root and each handle when disabled;
  handles leave the tab order.
- Keyboard: Arrow(↑↓←→), Home, End, PageUp / PageDown (10 × step).
- The read-out is `aria-hidden`; its value is announced through
  `aria-valuetext` (which also carries the share in `percent` mode).
- Lifecycle: `ResizeObserver` and document listeners are released on unmount.

## Out of scope

Marks / step ticks / number inputs (use `SnSlider`), and the uni-app end
(`sn-slider` in `@snui/uni`).
