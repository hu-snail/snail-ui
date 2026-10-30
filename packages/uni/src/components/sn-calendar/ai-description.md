# sn-calendar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Calendar sheet: `sn-popup` chrome + optional shortcut chips + the `sn-calendar-view` grid + a confirm footer. Owns the draft value and writes `v-model` on confirm.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Calendar sheet: `sn-popup` chrome + optional shortcut chips + the `sn-calendar-view` grid + a confirm footer. Owns the draft value and writes `v-model` on confirm.

## Reference Library

Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
the user-facing docs): reference library `wd-calendar`, the prop surface below
mirrors it 1:1 except the documented omissions. New props added here MUST also
be added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-calendar v-model="date" v-model:visible="open" title="选择日期" />
```

```ts
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
```

## Props

| Name                                            | Type                                                       | Default                   | Description                                                                                              |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `modelValue`                                    | `number \| number[] \| null`                               | `null`                    | Selected value.                                                                                          |
| `visible`                                       | `boolean`                                                  | `false`                   | Sheet visibility.                                                                                        |
| `type`                                          | `CalendarType`                                             | `'date'`                  | Selection mode.                                                                                          |
| `minDate` / `maxDate`                           | `number`                                                   | `undefined`               | Bounds.                                                                                                  |
| `firstDayOfWeek`                                | `number`                                                   | `0`                       | First weekday.                                                                                           |
| `formatter`                                     | `CalendarFormatter`                                        | `undefined`               | Cell formatter hook.                                                                                     |
| `maxRange` / `rangePrompt`                      | `number` / `string`                                        | `0` / `''`                | Range limit + message.                                                                                   |
| `allowSameDay`                                  | `boolean`                                                  | `false`                   | Allow a zero-length range.                                                                               |
| `defaultTime`                                   | `string \| string[]`                                       | `'00:00:00'`              | Clock time applied to date values.                                                                       |
| `title`                                         | `string`                                                   | `'选择日期'`              | Sheet title.                                                                                             |
| `closeOnClickModal`                             | `boolean`                                                  | `true`                    | Mask tap closes.                                                                                         |
| `zIndex`                                        | `number`                                                   | `15`                      | Stacking level.                                                                                          |
| `showConfirm` / `confirmText`                   | `boolean` / `string`                                       | `true` / `'确定'`         | Confirm button.                                                                                          |
| `shortcuts`                                     | `Array<{ text, value?, days? }>`                           | `[]`                      | Preset chips.                                                                                            |
| `safeAreaInsetBottom`                           | `boolean`                                                  | `true`                    | Safe-area padding.                                                                                       |
| `beforeConfirm`                                 | `(value) => boolean \| Promise<boolean>`                   | `undefined`               | Veto hook.                                                                                               |
| `customViewClass`                               | `string`                                                   | `''`                      | Panel body class.                                                                                        |
| `immediateChange`                               | `boolean`                                                  | `false`                   | Emit on every tap.                                                                                       |
| `panelHeight` / `showPanelTitle` / `switchMode` | `number` / `boolean` / `'none' \| 'month' \| 'year-month'` | `316` / `true` / `'none'` | Panel wiring.                                                                                            |
| `showLunar`                                     | `boolean`                                                  | `false`                   | Lunar caption under each day cell; the month name on 初一, `formatter` overrides. Additive (AUI-OPT-11). |
| `duration`                                      | `number`                                                   | `200`                     | Sheet animation duration.                                                                                |
| `customClass` / `customStyle`                   | `string`                                                   | `''`                      | Root forwarding.                                                                                         |

## Events

| Name                | Payload                  | When                                             |
| ------------------- | ------------------------ | ------------------------------------------------ |
| `update:modelValue` | `(value: CalendarValue)` | Confirmed (or every tap with `immediateChange`). |
| `update:visible`    | `(value: boolean)`       | Sheet shown / hidden.                            |
| `confirm`           | `{ value }`              | Confirm pressed and accepted.                    |
| `change`            | `{ value }`              | Selection changed.                               |
| `cancel` / `open`   | —                        | Sheet lifecycle.                                 |

## Slots

| Name            | Scope | Description                                                                                                   |
| --------------- | ----- | ------------------------------------------------------------------------------------------------------------- |
| `header`        | —     | Replaces the default title row at the top of the sheet (a cell summary row fits here). Additive (AUI-OPT-11). |
| `confirm-left`  | —     | Content left of the cancel / confirm actions.                                                                 |
| `confirm-right` | —     | Content right of the cancel / confirm actions.                                                                |

## Not Implemented (declared, inert)

`week` / `weekrange` types. The props `timeFilter`, `hideSecond`, `innerDisplayFormat`, `ellipsis`, `showTypeSwitch`, `rootPortal` are **declared** for wd-calendar parity but inert here (no time roller, no portal host on MP). `onShortcutsClick` is **invoked** after a shortcut chip writes its value. `shortcuts` is implemented (chips that write a preset value).

## Tokens Consumed (end: mp)

| Token                                       | Purpose                |
| ------------------------------------------- | ---------------------- |
| `--sn-mp-color-background-elevated`         | Sheet surface          |
| `--sn-mp-color-background-soft`             | Shortcut chip          |
| `--sn-mp-color-action-primary`              | Confirm button         |
| `--sn-mp-color-text-on-primary`             | Confirm label          |
| `--sn-mp-color-text-primary` / `-secondary` | Title / chip text      |
| `--sn-mp-color-border-subtle`               | Header + footer rules  |
| `--sn-mp-font-size-md` / `-sm`              | Title / chip type size |
| `--sn-mp-font-weight-semibold`              | Title + confirm weight |
| `--sn-mp-spacing-1` … `--sn-mp-spacing-4`   | Chip / action spacing  |
| `--sn-mp-radius-md` / `-full`               | Corners                |

## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- Shortcut chips are `role="button"` with `aria-label`.
- The `header` slot content owns the sheet's readable title when used — keep a
  text label inside it (the default branch renders `title` as plain text).
- `confirm-left` / `confirm-right` slots sit in the footer for host content;
  host actions inside them need their own `role` / `aria-label`.

## Versioning

`@snui/uni@0.5.0` — initial release. Additive since: `showLunar` caption, the
`header` slot (AUI-OPT-11).
