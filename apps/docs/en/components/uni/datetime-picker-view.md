# DatetimePickerView · uni-app

`sn-datetime-picker-view` is the date / time roller body of `@snui/uni`: it derives the year / month / date / hour / minute / second columns from `type` and the min / max bounds, and writes a timestamp (or an `HH:mm[:ss]` string for `type="time"`). easycom auto-registration (`components/sn-datetime-picker-view/sn-datetime-picker-view.vue` → `<sn-datetime-picker-view>`); geometry in `rpx`. Column derivation is pure (`sn-datetime-picker-view-utils`), so the roller stays a dumb renderer.

## Basic usage

Roller body: `type` sets the column set and minDate / maxDate bound the range.

<Demo name="datetime-picker-view-mp-basic" description="Roller body: `type` sets the column set and minDate / maxDate bound the range." />

## Time type & formatting (`type="time"` / `formatter` / `filter`)

`type="time"` renders hour / minute only and writes an `HH:mm` string; `formatter` rewrites labels and `filter` trims the values.

<Demo name="datetime-picker-view-mp-time-format" description="`type=time` renders hour / minute only and writes an `HH:mm` string; `formatter` rewrites labels and `filter` trims the values." />
## Roller geometry & column rewriting (`itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `columnFormatter`)

`itemHeight` (px design value) and `visibleItemCount` set the row height and how many rows are visible; `valueKey` / `labelKey` are wot-ui parity placeholders (the columns are generated); `columnFormatter` receives the whole candidate list for a column and may reorder it.

<Demo name="datetime-picker-view-mp-columns" description="itemHeight / visibleItemCount; valueKey / labelKey; columnFormatter reverses the year column." />

## Time column bounds & seconds (`minMinute` / `maxMinute` / `useSecond` / `minSecond` / `maxSecond`)

`minMinute` / `maxMinute` bound the minute column; `useSecond` adds the seconds column and `minSecond` / `maxSecond` bound its range.

<Demo name="datetime-picker-view-mp-time-bounds" description="minMinute / maxMinute; useSecond + minSecond / maxSecond." />

## Range linkage & write-back timing (`boundaryMinDate` / `boundaryMaxDate` / `immediateChange` / `custom*`)

`immediateChange` emits `change` while dragging (a settle always emits one). `boundaryMinDate` / `boundaryMaxDate` are the wd-datetime-picker-view "range linkage" props; this build's roller does no linkage clamping, so they are **declared but not rendered**. `customClass` / `customStyle` land on the root node.

<Demo name="datetime-picker-view-mp-range-boundary" description="boundaryMinDate / boundaryMaxDate (declared but not rendered); immediateChange; customClass / customStyle." />

## Props

| Prop                                              | Type                                                       | Default                 | Description                           |
| ------------------------------------------------- | ---------------------------------------------------------- | ----------------------- | ------------------------------------- |
| `modelValue`                                      | `string \| number`                                         | `undefined`             | Timestamp, or `HH:mm[:ss]` for `time` |
| `type`                                            | `'datetime' \| 'date' \| 'year-month' \| 'time' \| 'year'` | `'datetime'`            | Column set                            |
| `itemHeight` / `visibleItemCount`                 | `number`                                                   | `44` / `6`              | Row geometry                          |
| `valueKey` / `labelKey`                           | `string`                                                   | `'value'` / `'label'`   | Parity only (columns are generated)   |
| `formatter`                                       | `(type, value) => string`                                  | `undefined`             | Custom label formatter                |
| `filter`                                          | `(type, values) => number[]`                               | `undefined`             | Filter column values                  |
| `columnFormatter`                                 | `(type, values) => number[]`                               | `undefined`             | Rewrite a whole column                |
| `minDate` / `maxDate`                             | `number`                                                   | `undefined`             | Bounds (±10 years by default)         |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number`                                                   | `0` / `23` / `0` / `59` | `time`-type bounds                    |
| `useSecond` / `minSecond` / `maxSecond`           | `boolean` / `number` / `number`                            | `false` / `0` / `59`    | Seconds column                        |
| `immediateChange`                                 | `boolean`                                                  | `false`                 | Emit while dragging                   |
| `boundaryMinDate` / `boundaryMaxDate`             | `number`                                                   | `undefined`             | Range-mode linkage helpers            |
| `customClass` / `customStyle`                     | `string`                                                   | `''`                    | Root class / inline style             |

## Events

| Event                   | Description                   | Payload                     |
| ----------------------- | ----------------------------- | --------------------------- |
| `update:modelValue`     | Selection changed             | `(value: string \| number)` |
| `change`                | Selection changed (same tick) | `{ value, columns }`        |
| `pickstart` / `pickend` | Drag lifecycle                | —                           |

## Exposed API

| Member               | Signature                       | Description                              |
| -------------------- | ------------------------------- | ---------------------------------------- |
| `getSelectedOptions` | `() => Array<{ value, label }>` | One entry per column                     |
| `correctValue`       | `(value) => string \| number`   | Normalize a value into the declared type |
| `getOriginColumns`   | `() => RollerColumn[]`          | The derived columns                      |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                         | Purpose                         |
| --------------------------------------------- | ------------------------------- |
| `--sn-mp-color-background-elevated`           | Roller surface                  |
| ``--sn-mp-color-text-primary` / `-secondary`` | Active / idle row text          |
| `--sn-mp-color-border-subtle`                 | Selection indicator             |
| `--sn-mp-font-size-md`                        | Row text size                   |
| `--sn-mp-font-weight-semibold`                | Active row weight               |
| ``--sn-mp-spacing-2` / `-3``                  | Indicator inset / panel padding |

## Accessibility

- Root is `role="group"` with `aria-label` carrying the formatted value.
- Each row is `role="button"` with `aria-selected`.
- A visually hidden `aria-live="polite"` text echoes the current value.

## Desktop H5 input

Beyond touch, the H5 build accepts desktop input on the roller: hold the left mouse button and drag up or down to scroll, or turn the mouse wheel — one committed row per notch (both ends clamp to `minDate` / `maxDate` and the time bounds). The wheel gesture drives the roller instead of scrolling the page; clicking a row selects it directly. Mini-program targets stay touch-only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
