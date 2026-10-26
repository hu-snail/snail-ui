# sn-sn-calendar-view — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Scrollable month-grid calendar body: one grid per month between `minDate` / `maxDate`, single / range / multiple selection, a cell formatter and month-switch navigation..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Scrollable month-grid calendar body: one grid per month between `minDate` / `maxDate`, single / range / multiple selection, a cell formatter and month-switch navigation.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-calendar-view`
(https://wot-ui.cn/component/calendar-view.html). New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-calendar-view v-model="date" type="date" :min-date="min" :max-date="max" />
```

```ts
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';
import type { CalendarFormatter, CalendarType } from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view-types';
```

## Props

| Name                          | Type                                                                                           | Default      | Description                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| `modelValue`                  | `number \| number[] \| null`                                                                   | `null`       | Selected timestamp(s).                                        |
| `type`                        | `'date' \| 'dates' \| 'datetime' \| 'month' \| 'daterange' \| 'datetimerange' \| 'monthrange'` | `'date'`     | Selection mode.                                               |
| `minDate` / `maxDate`         | `number`                                                                                       | `undefined`  | Bounds (defaults to ±6 months).                               |
| `firstDayOfWeek`              | `number`                                                                                       | `0`          | First weekday (0 = Sunday).                                   |
| `formatter`                   | `CalendarFormatter`                                                                            | `undefined`  | Cell formatter hook.                                          |
| `maxRange`                    | `number`                                                                                       | `0`          | Max range span in days (`0` = unconstrained).                 |
| `rangePrompt`                 | `string`                                                                                       | `''`         | Message shown when `maxRange` is exceeded.                    |
| `allowSameDay`                | `boolean`                                                                                      | `false`      | Allow a zero-length range.                                    |
| `showPanelTitle`              | `boolean`                                                                                      | `true`       | Render the per-month title.                                   |
| `defaultTime`                 | `string \| string[]`                                                                           | `'00:00:00'` | Clock time applied to date values.                            |
| `panelHeight`                 | `number`                                                                                       | `316`        | Scrollable panel height (px design units).                    |
| `immediateChange`             | `boolean`                                                                                      | `false`      | Emit on every tap.                                            |
| `switchMode`                  | `'none' \| 'month' \| 'year-month'`                                                            | `'none'`     | Month-switch mode.                                            |
| `customClass` / `customStyle` | `string`                                                                                       | `''`         | Root forwarding.                                              |
| `timeFilter`                  | `CalendarTimeFilter \| undefined`                                                              | `undefined`  | **Declared, not implemented** — no time roller in this build. |
| `timeItemHeight`              | `number`                                                                                       | `44`         | **Declared, not implemented** — no time roller in this build. |
| `timeVisibleItemCount`        | `number`                                                                                       | `6`          | **Declared, not implemented** — no time roller in this build. |
| `hideSecond`                  | `boolean`                                                                                      | `false`      | **Declared, not implemented** — no time roller in this build. |

## Events

| Name                    | Payload                  | When                                          |
| ----------------------- | ------------------------ | --------------------------------------------- |
| `update:modelValue`     | `(value: CalendarValue)` | Selection changed.                            |
| `change`                | `{ value }`              | Selection changed (same tick).                |
| `pickstart` / `pickend` | —                        | Reserved for the (unimplemented) time roller. |

## Exposed API

| Member        | Signature                 | Description                             |
| ------------- | ------------------------- | --------------------------------------- |
| `shiftMonth`  | `(delta: number) => void` | Move the active month.                  |
| `shiftYear`   | `(delta: number) => void` | Move the active year (year-month mode). |
| `jumpToToday` | `() => void`              | Jump to the month containing today.     |

## Not Implemented

`week` / `weekrange` types (no reliable ISO-week helper on every uni target), plus `timeFilter` / `timeItemHeight` / `timeVisibleItemCount` / `hideSecond` — the datetime _time roller_ is not implemented; `datetime` / `datetimerange` exist and apply `defaultTime`.

## Tokens Consumed (end: mp)

| Token                                                                   | Purpose                               |
| ----------------------------------------------------------------------- | ------------------------------------- |
| `--sn-mp-color-background-elevated`                                     | Panel surface                         |
| `--sn-mp-color-action-primary` / `-soft`                                | Selected / range-middle day           |
| `--sn-mp-color-text-on-primary`                                         | Selected day text                     |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled` | Day / title / weekday / disabled text |
| `--sn-mp-color-border-default` / `-subtle`                              | Today ring / control rule             |
| `--sn-mp-color-feedback-warning`                                        | Range prompt                          |
| `--sn-mp-radius-md`                                                     | Day + control corners                 |

## Accessibility

- Root is `role="group"`; weekday headers are `aria-hidden`.
- Each in-month day is `role="button"` with `aria-label`, `aria-selected`, `aria-disabled` and `tabindex="-1"` when blocked.
- Month controls are `role="button"` with `aria-label` ("previous" / "next" / "next year").

## Versioning

`@snui/uni@0.5.0` — initial release.
