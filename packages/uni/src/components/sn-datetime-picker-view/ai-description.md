# sn-sn-datetime-picker-view — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Date / time roller body: derives the year / month / date / hour / minute / second columns from `type` and the min / max bounds, and emits a timestamp (or an `HH:mm[:ss]` string for `type: 'time'`)..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Date / time roller body: derives the year / month / date / hour / minute / second columns from `type` and the min / max bounds, and emits a timestamp (or an `HH:mm[:ss]` string for `type: 'time'`).

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-datetime-picker-view`
(https://wot-ui.cn/component/datetime-picker-view.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-datetime-picker-view v-model="stamp" type="date" />
```

```ts
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | Timestamp, or `HH:mm[:ss]` for `time`. |
| `type` | `'datetime' \| 'date' \| 'year-month' \| 'time' \| 'year'` | `'datetime'` | Column set. |
| `itemHeight` / `visibleItemCount` | `number` | `44` / `6` | Row geometry. |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` | Parity only (columns are generated). |
| `formatter` | `(type, value) => string` | `undefined` | Custom label formatter. |
| `filter` | `(type, values) => number[]` | `undefined` | Filter column values. |
| `columnFormatter` | `(type, values) => number[]` | `undefined` | Rewrite a whole column. |
| `minDate` / `maxDate` | `number` | `undefined` | Bounds (±10 years by default). |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number` | `0` / `23` / `0` / `59` | `time`-type bounds. |
| `useSecond` / `minSecond` / `maxSecond` | `boolean` / `number` / `number` | `false` / `0` / `59` | Seconds column. |
| `immediateChange` | `boolean` | `false` | Emit while dragging. |
| `boundaryMinDate` / `boundaryMaxDate` | `number` | `undefined` | Range-mode linkage helpers. |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `(value: string \| number)` | Selection changed. |
| `change` | `{ value, columns }` | Selection changed (same tick). |
| `pickstart` / `pickend` | — | Drag lifecycle. |


## Exposed API

| Member | Signature | Description |
| --- | --- | --- |
| `getSelectedOptions` | `() => Array<{ value, label }>` | One entry per column. |
| `correctValue` | `(value) => string \| number` | Normalize a value into the declared type. |
| `getOriginColumns` | `() => RollerColumn[]` | The derived columns. |


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-background-elevated` | Roller surface |
| `--sn-mp-color-text-primary` / `-secondary` | Active / idle row text |
| `--sn-mp-color-border-subtle` | Selection indicator |
| `--sn-mp-font-size-md` | Row text size |
| `--sn-mp-font-weight-semibold` | Active row weight |
| `--sn-mp-spacing-2` / `-3` | Indicator inset / panel padding |


## Accessibility

- Root is `role="group"` with `aria-label` carrying the formatted value.
- Each row is `role="button"` with `aria-selected`.
- A visually hidden `aria-live="polite"` text echoes the current value.


## Versioning

`@snui/uni@0.5.0` — initial release.
