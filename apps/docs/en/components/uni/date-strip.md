# DateStrip · uni-app

`sn-date-strip` is the horizontal date strip of `@snui/uni` (**AUI-added component**; neither wot-ui nor naive-ui ships an equivalent): one scrollable row of day columns, each = weekday (top) + day number (middle) + custom caption (bottom, e.g. a price). Single and range selection; values are local-midnight millisecond timestamps. easycom auto-registration (`components/sn-date-strip/sn-date-strip.vue` → `<sn-date-strip>`).

## Basic usage

Single selection; a tap writes `v-model`.

<Demo name="date-strip-mp-basic" description="sn-date-strip basics: single selection, tap writes v-model." />

## Custom style

`customClass` / `customStyle` restyle the strip background and radius.

<Demo name="date-strip-mp-custom-style" description="custom-class / custom-style restyle the strip." />

## Custom day text

The `formatter` hook rewrites `text` / `topInfo` / `bottomInfo` / `disabled` — the price-calendar case injects `¥60` under the day number.

<Demo name="date-strip-mp-formatter" description="formatter injects price captions (bottomInfo) under the day numbers." />

## Custom date range

`type="range"`: first tap sets the start, second tap completes it; out-of-order taps swap. A pending range is `[start]`; tapping any cell on a completed range restarts it.

<Demo name="date-strip-mp-range" description="type=range: first tap sets the start, second tap completes; out-of-order taps swap." />

## Props

| Prop          | Type                                           | Default     | Description                                                         |
| ------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `modelValue`  | `number \| number[] \| null`                   | `null`      | Timestamp; `range` mode is `[start, end]` (pending: `[start]`)      |
| `type`        | `'single' \| 'range'`                          | `'single'`  | Selection mode                                                      |
| `count`       | `number`                                       | `7`         | Days in the strip; scrolls horizontally when wider than the screen  |
| `startDate`   | `number`                                       | today       | First day of the strip (local midnight)                             |
| `minDate`     | `number`                                       | `undefined` | Disable days before                                                 |
| `maxDate`     | `number`                                       | `undefined` | Disable days after                                                  |
| `showWeek`    | `boolean`                                      | `true`      | Weekday header (follows each column)                                |
| `formatter`   | `(item: DateStripDayItem) => DateStripDayItem` | `undefined` | Cell hook: rewrite `text` / `topInfo` / `bottomInfo` / `disabled`   |
| `disabled`    | `boolean`                                      | `false`     | Disable the whole strip                                             |
| `customClass` / `customStyle` | `string`                       | `''`        | Root class / inline style                                           |

`DateStripDayItem`: `date` (local midnight) / `day` / `week` (0 = Sunday) / `text` / `topInfo` / `bottomInfo` / `disabled`.

## Events

| Event               | Description            | Payload                       |
| ------------------- | ---------------------- | ----------------------------- |
| `update:modelValue` | Written on a legal tap | `(value: number \| number[])` |
| `change`            | Same                   | `{ value }`                   |

## Theming

| Variable                            | Usage                |
| ----------------------------------- | -------------------- |
| `--sn-mp-color-background-elevated` | Strip background     |
| `--sn-mp-color-action-primary`      | Selected block       |
| `--sn-mp-color-action-primary-soft` | Range middle         |
| `--sn-mp-color-feedback-error`      | Weekend color        |
| `--sn-mp-font-size-xs` / `-md`      | Font sizes           |
| `--sn-mp-radius-md`                 | Selected block radius|

## Accessibility

- Each cell is `role="button"` with `aria-label` "N 日", plus `aria-selected` / `aria-disabled`; disabled cells get `tabindex=-1`.
- Root is `role="group"`.

## Dark mode

All colors resolve through `--sn-mp-*` tokens and flip under `.sn-theme-dark` / `page.sn-theme-dark`.

## Out of scope

- Month grid (use `sn-calendar-view`) and sheet calendar (use `sn-calendar`); multi-month paging and lunar captions are future additive enhancements; holidays / solar terms are injected by the host via `formatter`.

See the component `ai-description.md` for the full contract.
