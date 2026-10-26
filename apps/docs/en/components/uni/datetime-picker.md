# DatetimePicker · uni-app

`sn-datetime-picker` is the date / time sheet of `@snui/uni`: `sn-popup` supplies the scrim / animation, this component owns the toolbar and the draft value, and `sn-datetime-picker-view` is the core. easycom auto-registration (`components/sn-datetime-picker/sn-datetime-picker.vue` → `<sn-datetime-picker>`); geometry in `rpx`. By default rolling only updates the draft and `v-model` is written on confirm.

## Basic usage

Sheet picker: rolling only updates the draft and `v-model` is written on confirm.

<Demo name="datetime-picker-mp-basic" description="Sheet picker: rolling only updates the draft and `v-model` is written on confirm." />

## Time type & confirm guard (`type="time"` / `beforeConfirm`)

`type="time"` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open.

<Demo name="datetime-picker-mp-time-confirm" description="`type=time` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open." />
## Roller geometry & column values (`itemHeight` / `visibleItemCount` / h-m-s bounds / `formatter` / `filter`)

`itemHeight` (px design value) and `visibleItemCount` set the row height and how many rows are visible; `minHour` / `maxHour` / `minMinute` / `maxMinute` / `minSecond` / `maxSecond` bound each column and `useSecond` adds the seconds column. `formatter` rewrites column labels, `filter` drops candidate values. `valueKey` / `labelKey` are wot-ui parity placeholders (the component generates the columns; there is no data source).

<Demo name="datetime-picker-mp-columns-bounds" description="itemHeight / visibleItemCount; minHour / maxHour / minMinute / maxMinute; useSecond + minSecond / maxSecond; formatter / filter; valueKey / labelKey." />

## Sheet chrome & write-back timing (`cancelButtonText` / `immediateChange` / `zIndex` / `rootPortal` / `custom*`)

`immediateChange` writes `v-model` on every roll; by default it is written on confirm only. `closeOnClickModal` controls whether tapping the scrim closes the sheet, `safeAreaInsetBottom` keeps the safe area, `zIndex` sets the stacking level and `rootPortal` is a wot-ui parity placeholder (miniprograms have no portal host, so it is declared but inert). `customClass` / `customStyle` land on the sheet; `customViewClass` lands on the roller body.

<Demo name="datetime-picker-mp-sheet" description="immediateChange; cancelButtonText; closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle / customViewClass; displayFormatTabLabel." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | Timestamp, or `HH:mm[:ss]` for `time` |
| `visible` | `boolean` | `false` | Sheet visibility |
| `type` | `DateTimeType` | `'datetime'` | Column set |
| `title` | `string` | `''` | Sheet title |
| `cancelButtonText` / `confirmButtonText` | `string` | `'取消'` / `'确认'` | Toolbar labels |
| `closeOnClickModal` / `safeAreaInsetBottom` | `boolean` | `true` | Sheet behaviour |
| `itemHeight` / `visibleItemCount` | `number` | `44` / `6` | Row geometry |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` | Parity only |
| `minDate` / `maxDate` | `number` | `undefined` | Bounds |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number` | `0` / `23` / `0` / `59` | `time`-type bounds |
| `useSecond` / `minSecond` / `maxSecond` | `boolean` / `number` / `number` | `false` / `0` / `59` | Seconds column |
| `formatter` / `filter` | function | `undefined` | Column hooks |
| `beforeConfirm` | `(value) => boolean \| Promise<boolean>` | `undefined` | Veto hook |
| `zIndex` | `number` | `15` | Stacking level |
| `immediateChange` | `boolean` | `false` | Write `v-model` on every roll |
| `customClass` / `customStyle` / `customViewClass` | `string` | `''` | Root / sheet / roller classes |
| `rootPortal` | `boolean` | `false` | Render outside the page flow — **declared, not implemented** (no portal host on MP; forwarded to `sn-popup`) |
| `displayFormatTabLabel` | `((tab) => string) \| undefined` | `undefined` | Range tab label formatter — **declared, not implemented** (single-value mode only) |

> **Not implemented**: `root-portal`, `display-format-tab-label`, and the range-mode `toggle` event (this build ships single-value mode only).

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Confirmed (or every roll with `immediateChange`) | `(value)` |
| `update:visible` | Sheet shown / hidden | `(value: boolean)` |
| `confirm` | Confirm pressed and accepted | `{ value }` |
| `change` | Selection changed | `{ value }` |
| `cancel` / `open` | Sheet lifecycle | — |

## Slots

This component exposes no slots.

## Theme tokens

| Token | Purpose |
| --- | --- |
| ``--sn-mp-color-background-elevated`` | Sheet surface |
| ``--sn-mp-color-border-subtle`` | Toolbar rule |
| ``--sn-mp-color-text-primary` / `-secondary`` | Title / cancel label |
| ``--sn-mp-color-action-primary`` | Confirm label |
| ``--sn-mp-font-size-md`` | Toolbar text |
| ``--sn-mp-spacing-2` / `-3` / `-4`` | Toolbar padding |

## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- The roller body carries the value in `aria-label` plus the hidden live region.

## Desktop H5 input

Beyond touch, the H5 build accepts desktop input on the sheet roller: hold the left mouse button and drag up or down to scroll, or turn the mouse wheel — one committed row per notch (both ends clamp to `minDate` / `maxDate` and the time bounds). The wheel gesture drives the roller instead of scrolling the page; clicking a row selects it directly. Mini-program targets stay touch-only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:

