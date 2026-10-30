# DatetimePicker · uni-app

`sn-datetime-picker` is the date / time sheet of `@snui/uni`: `sn-popup` supplies the scrim / animation, this component owns the toolbar and the draft value, and `sn-datetime-picker-view` is the core. easycom auto-registration (`components/sn-datetime-picker/sn-datetime-picker.vue` → `<sn-datetime-picker>`); geometry in `rpx`. By default rolling only updates the draft and `v-model` is written on confirm.

## Basic usage

Sheet picker: rolling only updates the draft and `v-model` is written on confirm.

<Demo name="datetime-picker-mp-basic" description="Sheet picker: rolling only updates the draft and `v-model` is written on confirm." />

## Cell card layout (`sn-cell`'s `card`)

The entry rows are `sn-cell` rows: with `sn-cell-group card` every row becomes its own rounded card (the group goes transparent and rows are spaced by a token gap), and a single cell can use its own `card` to stand alone outside any group. The row only opens the sheet — the sheet geometry and the card layout do not affect each other.

<Demo name="datetime-picker-mp-card" description="sn-cell-group card / sn-cell card: one card per entry row, token gap between them." />

## Sheet header (cancel left / title centre / confirm right)

The header always has three slots: cancel flush left, a centred title (may be omitted) and confirm flush right. With the title omitted the centre slot still owns the free space, so confirm is never pushed inwards. Both actions are text-only buttons that render no icons; press feedback rides `hover-class`, so touch and App targets behave the same. `cancelButtonText` / `confirmButtonText` swap the wording only — the layout stays put.

<Demo name="datetime-picker-mp-header" description="With / without a title and with custom labels: confirm stays flush right, both actions are text-only." />

## Lunar roller (`lunar`, AUI-added)

With `lunar` the year / month / date columns switch to lunar labels: stem-branch years (甲辰年…), months 正月…腊月 including leap months (闰X月; 冬月 = 11th, 腊月 = 12th), and days 初一…三十. `v-model` stays a solar millisecond timestamp (built-in 1900–2100 conversion table). `type="datetime"` + `lunar` keeps the clock rollers; `type="time"` ignores it; `minDate` / `maxDate` only constrain the year column in lunar mode.

<Demo name="datetime-picker-mp-lunar" description="lunar: stem-branch year / months with leap month / days 初一…三十; v-model stays a solar timestamp; datetime + lunar keeps the clock." />

## Time type & confirm guard (`type="time"` / `beforeConfirm`)

`type="time"` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open.

<Demo name="datetime-picker-mp-time-confirm" description="`type=time` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open." />

## Roller geometry & column values (`itemHeight` / `visibleItemCount` / h-m-s bounds / `formatter` / `filter`)

`itemHeight` (px design value) and `visibleItemCount` set the row height and how many rows are visible; `minHour` / `maxHour` / `minMinute` / `maxMinute` / `minSecond` / `maxSecond` bound each column and `useSecond` adds the seconds column. `formatter` rewrites column labels, `filter` drops candidate values. `valueKey` / `labelKey` are field-name placeholders (the columns are derived from `type`; there is no data source).

<Demo name="datetime-picker-mp-columns-bounds" description="itemHeight / visibleItemCount; minHour / maxHour / minMinute / maxMinute; useSecond + minSecond / maxSecond; formatter / filter; valueKey / labelKey." />

## Sheet chrome & write-back timing (`cancelButtonText` / `immediateChange` / `zIndex` / `rootPortal` / `custom*`)

`immediateChange` writes `v-model` on every roll; by default it is written on confirm only. `closeOnClickModal` controls whether tapping the scrim closes the sheet, `safeAreaInsetBottom` keeps the safe area, `zIndex` sets the stacking level and `rootPortal` is a placeholder for rendering outside the page flow (miniprograms have no portal host, so it is declared but inert). `customClass` / `customStyle` land on the sheet; `customViewClass` lands on the roller body.

<Demo name="datetime-picker-mp-sheet" description="immediateChange; cancelButtonText; closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle / customViewClass; displayFormatTabLabel." />

## Props

| Prop                                              | Type                                     | Default                 | Description                                                                                                  |
| ------------------------------------------------- | ---------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `modelValue`                                      | `string \| number`                       | `undefined`             | Timestamp, or `HH:mm[:ss]` for `time`                                                                        |
| `visible`                                         | `boolean`                                | `false`                 | Sheet visibility                                                                                             |
| `type`                                            | `DateTimeType`                           | `'datetime'`            | Column set                                                                                                   |
| `title`                                           | `string`                                 | `''`                    | Sheet title                                                                                                  |
| `cancelButtonText` / `confirmButtonText`          | `string`                                 | `'取消'` / `'确认'`     | Toolbar labels                                                                                               |
| `closeOnClickModal` / `safeAreaInsetBottom`       | `boolean`                                | `true`                  | Sheet behaviour                                                                                              |
| `itemHeight` / `visibleItemCount`                 | `number`                                 | `44` / `6`              | Row geometry                                                                                                 |
| `valueKey` / `labelKey`                           | `string`                                 | `'value'` / `'label'`   | Field-name placeholders (columns are generated; no data source)                                              |
| `minDate` / `maxDate`                             | `number`                                 | `undefined`             | Bounds                                                                                                       |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number`                                 | `0` / `23` / `0` / `59` | `time`-type bounds                                                                                           |
| `useSecond` / `minSecond` / `maxSecond`           | `boolean` / `number` / `number`          | `false` / `0` / `59`    | Seconds column                                                                                               |
| `formatter` / `filter`                            | function                                 | `undefined`             | Column hooks                                                                                                 |
| `beforeConfirm`                                   | `(value) => boolean \| Promise<boolean>` | `undefined`             | Veto hook                                                                                                    |
| `zIndex`                                          | `number`                                 | `15`                    | Stacking level                                                                                               |
| `immediateChange`                                 | `boolean`                                | `false`                 | Write `v-model` on every roll                                                                                |
| `lunar`                                           | `boolean`                                | `false`                 | Lunar roller — **AUI-added** (stem-branch year / months incl. leap / days 初一…三十; `v-model` stays solar)  |
| `customClass` / `customStyle` / `customViewClass` | `string`                                 | `''`                    | Root / sheet / roller classes                                                                                |
| `rootPortal`                                      | `boolean`                                | `false`                 | Render outside the page flow — **declared, not implemented** (no portal host on MP; forwarded to `sn-popup`) |
| `displayFormatTabLabel`                           | `((tab) => string) \| undefined`         | `undefined`             | Range tab label formatter — **declared, not implemented** (single-value mode only)                           |

> **Not implemented**: `root-portal`, `display-format-tab-label`, and the range-mode `toggle` event (this build ships single-value mode only).

## Events

| Event               | Description                                      | Payload            |
| ------------------- | ------------------------------------------------ | ------------------ |
| `update:modelValue` | Confirmed (or every roll with `immediateChange`) | `(value)`          |
| `update:visible`    | Sheet shown / hidden                             | `(value: boolean)` |
| `confirm`           | Confirm pressed and accepted                     | `{ value }`        |
| `change`            | Selection changed                                | `{ value }`        |
| `cancel` / `open`   | Sheet lifecycle                                  | —                  |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                         | Purpose                               |
| ------------------------------------------------------------- | ------------------------------------- |
| `--sn-mp-color-background-elevated`                           | Sheet surface                         |
| `--sn-mp-color-border-subtle`                                 | Toolbar rule                          |
| `--sn-mp-color-text-primary` / `--sn-mp-color-text-secondary` | Title / cancel label                  |
| `--sn-mp-color-action-primary`                                | Confirm label                         |
| `--sn-mp-font-size-md` / `--sn-mp-font-weight-semibold`       | Toolbar text / title & confirm weight |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-4`                     | Action padding / toolbar padding      |

## AI Patch Boundary

- AI may patch presentation and selection configuration: `title` / `cancelButtonText` / `confirmButtonText` / `type` / `minDate` / `maxDate` / `minHour` / `maxHour` / `minMinute` / `maxMinute` / `useSecond` / `minSecond` / `maxSecond` / `itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `formatter` / `filter` / `lunar` / `zIndex` / `closeOnClickModal` / `safeAreaInsetBottom` / `immediateChange`.
- `modelValue` is the runtime selection result: a patch may set the initial value, but must not overwrite the draft the user is rolling once the sheet is open; with `immediateChange` every roll writes back, so a patch should treat it as runtime state rather than static configuration.
- `visible` is host interaction state: a patch may set the initial visibility but should not keep flipping it while the user operates.
- `beforeConfirm` is a host validation callback: a patch should only change whether it is declared, never fabricate the verdict or skip business logic.
- `customClass` / `customStyle` / `customViewClass` may be patched for skin and layout tweaks, but must not be used to inject scoped styles that affect other components.

## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- The roller body carries the value in `aria-label` plus the hidden live region.

## Desktop H5 input

Beyond touch, the H5 build accepts desktop input on the sheet roller: hold the left mouse button and drag up or down to scroll, or turn the mouse wheel — one committed row per notch (both ends clamp to `minDate` / `maxDate` and the time bounds). The wheel gesture drives the roller instead of scrolling the page; clicking a row selects it directly. Mini-program targets stay touch-only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically: the sheet drops to the dark surface, the title and roller body switch to the dark primary text, the cancel label becomes dark secondary text and the confirm label keeps the brand color.

Wrap the component in `sn-config-provider` with `theme="dark"` to verify:

```vue
<sn-config-provider theme="dark">
  <sn-datetime-picker v-model="stamp" v-model:visible="open" type="date" title="Pick a date" />
</sn-config-provider>
```

## Related

- Roller body: [`sn-datetime-picker-view`](/en/components/uni/datetime-picker-view)
- Entry cell: [`sn-cell`](/en/components/uni/cell)
- Sheet container: [`sn-popup`](/en/components/uni/popup)
- Theme switching: [`sn-config-provider`](/en/components/uni/config-provider)
