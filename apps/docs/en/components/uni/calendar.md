# Calendar · uni-app

`sn-calendar` is the calendar sheet of `@snui/uni`: `sn-popup` supplies the scrim and animation, optional shortcut chips and a confirm footer sit around the `sn-calendar-view` body. easycom auto-registration (`components/sn-calendar/sn-calendar.vue` → `<sn-calendar>`); geometry in `rpx`. The component owns the draft value and writes `v-model` on confirm; cancel discards the draft.

## Basic usage

Sheet calendar: rolling only updates the draft and `v-model` is written on confirm; cancel discards the draft.

<Demo name="calendar-mp-basic" description="Sheet calendar: rolling only updates the draft and `v-model` is written on confirm; cancel discards the draft." />

## Shortcuts & range (`shortcuts` / `type` / `beforeConfirm`)

`shortcuts` renders preset chips (`days` is relative to today); `type="daterange"` selects a span; `beforeConfirm` can veto.

<Demo name="calendar-mp-shortcuts-range" description="`shortcuts` renders preset chips (`days` is relative to today); `type=daterange` selects a span; `beforeConfirm` can veto." />
## Grid & range constraints (`firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime`)

`firstDayOfWeek` moves the week start; `formatter` returns a subset of `{ text, topInfo, bottomInfo, disabled }` to rewrite a cell; `maxRange` caps the span (`0` = unconstrained) and `rangePrompt` is shown when it is exceeded; `allowSameDay` allows a zero-length range; `defaultTime` fills the clock part of a date value.

<Demo name="calendar-mp-grid-range" description="firstDayOfWeek; formatter with custom topInfo / bottomInfo / disabled; maxRange + rangePrompt; allowSameDay; defaultTime." />

## Lunar captions (`showLunar`, AUI-added)

`show-lunar` renders a lunar day name under each day cell (初二, 十五…); 初一 shows the month name (正月 / 闰六月). A `formatter` `bottomInfo` wins over the lunar text.

<Demo name="calendar-mp-lunar" description="show-lunar: lunar caption under each cell, month name on 初一; formatter can override." />

## Panel & sheet (`panelHeight` / `switchMode` / `immediateChange` / `showConfirm` / scrim and stacking)

`panelHeight` (px design value) and `showPanelTitle` shape the panel; `switchMode` renders the month / year switcher; `duration` sets the sheet animation; `immediateChange` writes `v-model` as soon as a cell is tapped; `showConfirm=false` leaves only cancel. `closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` / `customClass` / `customStyle` are forwarded to `sn-popup`; `customViewClass` lands on the `sn-calendar-view` body.

<Demo name="calendar-mp-panel-sheet" description="panelHeight / showPanelTitle / switchMode / duration; immediateChange; showConfirm=false; closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle / customViewClass." />

## Shortcut callback & parity props (`onShortcutsClick` / `timeFilter` / `hideSecond` / `innerDisplayFormat` / `ellipsis` / `showTypeSwitch`)

`onShortcutsClick` runs after a shortcut chip writes its value. `timeFilter` / `hideSecond` / `innerDisplayFormat` / `ellipsis` / `showTypeSwitch` are declared for wd-calendar parity; this build has no time roller and no range tabs, so they are **declared but visually inert**.

<Demo name="calendar-mp-hooks-parity" description="onShortcutsClick shortcut callback; beforeConfirm; innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter parity props (unimplemented)." />

## Props

| Prop                                            | Type                                                       | Default                   | Description                       |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------- | --------------------------------- |
| `modelValue`                                    | `number \| number[] \| null`                               | `null`                    | Selected value                    |
| `visible`                                       | `boolean`                                                  | `false`                   | Sheet visibility                  |
| `type`                                          | `CalendarType`                                             | `'date'`                  | Selection mode                    |
| `minDate` / `maxDate`                           | `number`                                                   | `undefined`               | Bounds                            |
| `firstDayOfWeek`                                | `number`                                                   | `0`                       | First weekday                     |
| `formatter`                                     | `CalendarFormatter`                                        | `undefined`               | Cell formatter hook               |
| `maxRange` / `rangePrompt`                      | `number` / `string`                                        | `0` / `''`                | Range limit + message             |
| `allowSameDay`                                  | `boolean`                                                  | `false`                   | Allow a zero-length range         |
| `defaultTime`                                   | `string \| string[]`                                       | `'00:00:00'`              | Clock time applied to date values |
| `title`                                         | `string`                                                   | `'选择日期'`              | Sheet title                       |
| `closeOnClickModal`                             | `boolean`                                                  | `true`                    | Mask tap closes                   |
| `zIndex`                                        | `number`                                                   | `15`                      | Stacking level                    |
| `showConfirm` / `confirmText`                   | `boolean` / `string`                                       | `true` / `'确定'`         | Confirm button + label            |
| `shortcuts`                                     | `Array<{ text, value?, days? }>`                           | `[]`                      | Preset chips                      |
| `safeAreaInsetBottom`                           | `boolean`                                                  | `true`                    | Safe-area padding                 |
| `beforeConfirm`                                 | `(value) => boolean \| Promise<boolean>`                   | `undefined`               | Veto hook                         |
| `customViewClass`                               | `string`                                                   | `''`                      | Panel body class                  |
| `immediateChange`                               | `boolean`                                                  | `false`                   | Emit on every tap                 |
| `panelHeight` / `showPanelTitle` / `switchMode` | `number` / `boolean` / `'none' \| 'month' \| 'year-month'` | `316` / `true` / `'none'` | Panel wiring                      |
| `showLunar`                                     | `boolean`                                                  | `false`                   | Lunar captions — **AUI-added** (month name on 初一; formatter can override) |
| `duration`                                      | `number`                                                   | `200`                     | Sheet animation duration          |
| `customClass` / `customStyle`                   | `string`                                                   | `''`                      | Root class / inline style         |

> **Not implemented**: `week` / `weekrange` types, `innerDisplayFormat`, `ellipsis`, `showTypeSwitch`, `rootPortal`. `shortcuts` and `onShortcutsClick` ARE implemented (a chip writes a preset value, then the hook fires).

## Events

| Event               | Description                                     | Payload                  |
| ------------------- | ----------------------------------------------- | ------------------------ |
| `update:modelValue` | Confirmed (or every tap with `immediateChange`) | `(value: CalendarValue)` |
| `update:visible`    | Sheet shown / hidden                            | `(value: boolean)`       |
| `confirm`           | Confirm pressed and accepted                    | `{ value }`              |
| `change`            | Selection changed                               | `{ value }`              |
| `cancel` / `open`   | Sheet lifecycle                                 | —                        |

## Slots

| Slot            | Description                    |
| --------------- | ------------------------------ |
| `confirm-left`  | Left side of the confirm area  |
| `confirm-right` | Right side of the confirm area |

## Theme tokens

| Token                                         | Purpose               |
| --------------------------------------------- | --------------------- |
| `--sn-mp-color-background-elevated`           | Sheet surface         |
| `--sn-mp-color-background-soft`               | Shortcut chip         |
| `--sn-mp-color-action-primary`                | Confirm button        |
| `--sn-mp-color-text-on-primary`               | Confirm label         |
| ``--sn-mp-color-text-primary` / `-secondary`` | Title / chip text     |
| `--sn-mp-color-border-subtle`                 | Header + footer rules |
| ``--sn-mp-radius-md` / `-full``               | Corners               |

## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- Shortcut chips are `role="button"` with `aria-label`.
- The `confirm-left` / `confirm-right` slots sit in the footer for host content.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
