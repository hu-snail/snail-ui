# CalendarView · uni-app

`sn-calendar-view` is the calendar body of `@snui/uni`: a month grid per month between `minDate` / `maxDate`, with single / range / multiple selection, a cell formatter and month switching. easycom auto-registration (`components/sn-calendar-view/sn-calendar-view.vue` → `<sn-calendar-view>`); geometry in `rpx`. The grid is a 7-column `<view>` flex layout inside a `<scroll-view>`; no `ResizeObserver`, no timer, no global listener.

## Basic usage

Flat month grid: minDate / maxDate bound the month range; tapping a day writes its timestamp back.

<Demo name="calendar-view-mp-basic" description="Flat month grid: minDate / maxDate bound the month range; tapping a day writes its timestamp back." />

## Range & month switching (`type` / `maxRange` / `switchMode`)

`type="daterange"` selects a span; `maxRange` caps it and shows the prompt; `switchMode="month"` switches to one month with prev / next controls.

<Demo name="calendar-view-mp-range-switch" description="`type=daterange` selects a span; `maxRange` caps it and shows the prompt; `switchMode=month` switches to one month with prev / next controls." />

## Week start, cell formatter & panel title (`firstDayOfWeek` / `formatter` / `showPanelTitle`)

`first-day-of-week=1` starts the week on Monday; `formatter` may rewrite text / topInfo / bottomInfo / disabled per cell; `show-panel-title=false` drops the month caption.

<Demo name="calendar-view-mp-formatter-week" description="`firstDayOfWeek=1` starts the week on Monday; `formatter` captions weekends; `showPanelTitle=false` drops the month caption." />

## Same-day ranges, default time & custom styles (`allowSameDay` / `defaultTime` / `immediateChange`)

`allow-same-day` lets both range ends be the same day; `default-time` sets the clock time on the written-back timestamp; `immediate-change` fires on tap; `custom-class` / `custom-style` land on the root. `timeFilter` / `timeItemHeight` / `timeVisibleItemCount` / `hideSecond` exist for parity only (this build renders no time roller).

<Demo name="calendar-view-mp-same-day-time" description="`allowSameDay` lets both range ends be the same day; `defaultTime` sets the clock time written back; `immediateChange` fires on tap; `customClass` / `customStyle` land on the root." />

## Props

| Prop                          | Type                                                                                           | Default      | Description                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| `modelValue`                  | `number \| number[] \| null`                                                                   | `null`       | Selected timestamp(s)                                                        |
| `type`                        | `'date' \| 'dates' \| 'datetime' \| 'month' \| 'daterange' \| 'datetimerange' \| 'monthrange'` | `'date'`     | Selection mode                                                               |
| `minDate` / `maxDate`         | `number`                                                                                       | `undefined`  | Bounds (defaults to ±6 months)                                               |
| `firstDayOfWeek`              | `number`                                                                                       | `0`          | First weekday (0 = Sunday)                                                   |
| `formatter`                   | `CalendarFormatter`                                                                            | `undefined`  | Cell formatter hook                                                          |
| `maxRange`                    | `number`                                                                                       | `0`          | Max range span in days (`0` = unconstrained)                                 |
| `rangePrompt`                 | `string`                                                                                       | `''`         | Message shown when `maxRange` is exceeded                                    |
| `allowSameDay`                | `boolean`                                                                                      | `false`      | Allow a zero-length range                                                    |
| `showPanelTitle`              | `boolean`                                                                                      | `true`       | Render the per-month title                                                   |
| `defaultTime`                 | `string \| string[]`                                                                           | `'00:00:00'` | Clock time applied to date values                                            |
| `panelHeight`                 | `number`                                                                                       | `316`        | Scrollable panel height (px design units)                                    |
| `immediateChange`             | `boolean`                                                                                      | `false`      | Emit on every tap                                                            |
| `switchMode`                  | `'none' \| 'month' \| 'year-month'`                                                            | `'none'`     | Month-switch mode                                                            |
| `showLunar`                   | `boolean`                                                                                      | `false`      | Lunar captions — **AUI-added**: lunar day name under each cell, month name on 初一; formatter can override |
| `customClass` / `customStyle` | `string`                                                                                       | `''`         | Root class / inline style                                                    |
| `timeFilter`                  | `CalendarTimeFilter`                                                                           | `undefined`  | Time-column filter — **declared, not implemented** (no in-panel time roller) |
| `timeItemHeight`              | `number`                                                                                       | `44`         | Time row height — **declared, not implemented**                              |
| `timeVisibleItemCount`        | `number`                                                                                       | `6`          | Visible time rows — **declared, not implemented**                            |
| `hideSecond`                  | `boolean`                                                                                      | `false`      | Hide the seconds column — **declared, not implemented**                      |

> **Not implemented**: `week` / `weekrange` types (no reliable ISO-week helper on every target), plus `timeFilter` / `timeItemHeight` / `timeVisibleItemCount` / `hideSecond` — the in-panel time roller is not implemented; `datetime` / `datetimerange` exist and apply `defaultTime`.

## Events

| Event                   | Description                                  | Payload                  |
| ----------------------- | -------------------------------------------- | ------------------------ |
| `update:modelValue`     | Selection changed                            | `(value: CalendarValue)` |
| `change`                | Selection changed (same tick)                | `{ value }`              |
| `pickstart` / `pickend` | Reserved for the (unimplemented) time roller | —                        |

## Exposed API

| Member        | Signature                 | Description                            |
| ------------- | ------------------------- | -------------------------------------- |
| `shiftMonth`  | `(delta: number) => void` | Move the active month                  |
| `shiftYear`   | `(delta: number) => void` | Move the active year (year-month mode) |
| `jumpToToday` | `() => void`              | Jump to the month containing today     |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                                     | Purpose                               |
| ------------------------------------------------------------------------- | ------------------------------------- |
| `--sn-mp-color-background-elevated`                                       | Panel surface                         |
| ``--sn-mp-color-action-primary` / `-soft``                                | Selected / range-middle day           |
| `--sn-mp-color-text-on-primary`                                           | Selected day text                     |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled`` | Day / title / weekday / disabled text |
| ``--sn-mp-color-border-default` / `-subtle``                              | Today ring / control rule             |
| `--sn-mp-color-feedback-warning`                                          | Range prompt                          |
| `--sn-mp-radius-md`                                                       | Day + control corners                 |

## Accessibility

- Root is `role="group"`; weekday headers are `aria-hidden`.
- Each in-month day is `role="button"` with `aria-label` / `aria-selected` / `aria-disabled`, and `tabindex="-1"` when blocked.
- Month controls are `role="button"` with `aria-label` ("previous" / "next" / "next year").

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
