# sn-sn-datetime-picker — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Bottom-sheet date / time picker: `sn-popup` chrome around the `sn-datetime-picker-view` roller, owning the draft value and writing `v-model` on confirm..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Bottom-sheet date / time picker: `sn-popup` chrome around the `sn-datetime-picker-view` roller, owning the draft value and writing `v-model` on confirm.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-datetime-picker`
(https://wot-ui.cn/component/datetime-picker.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-datetime-picker v-model="stamp" v-model:visible="open" type="date" title="Birthday" />
```

```ts
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | Timestamp, or `HH:mm[:ss]` for `time`. |
| `visible` | `boolean` | `false` | Sheet visibility. |
| `type` | `DateTimeType` | `'datetime'` | Column set. |
| `title` | `string` | `''` | Sheet title. |
| `cancelButtonText` / `confirmButtonText` | `string` | `'取消'` / `'确认'` | Toolbar labels. |
| `closeOnClickModal` / `safeAreaInsetBottom` | `boolean` | `true` | Sheet behaviour. |
| `itemHeight` / `visibleItemCount` | `number` | `44` / `6` | Row geometry. |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` | Parity only. |
| `minDate` / `maxDate` | `number` | `undefined` | Bounds. |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number` | `0` / `23` / `0` / `59` | `time`-type bounds. |
| `useSecond` / `minSecond` / `maxSecond` | `boolean` / `number` / `number` | `false` / `0` / `59` | Seconds column. |
| `formatter` / `filter` | function | `undefined` | Column hooks. |
| `beforeConfirm` | `(value) => boolean \| Promise<boolean>` | `undefined` | Veto hook. |
| `zIndex` | `number` | `15` | Stacking level. |
| `immediateChange` | `boolean` | `false` | Write `v-model` on every roll. |
| `customClass` / `customStyle` / `customViewClass` | `string` | `''` | Root / sheet / roller forwarding. |
| `rootPortal` | `boolean` | `false` | **Declared, not implemented** — forwarded to `sn-popup`; miniprogram has no portal host. |
| `displayFormatTabLabel` | `((tab) => string) \| undefined` | `undefined` | **Declared, not implemented** — single-value mode only, no range tabs. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `(value)` | Confirmed (or every roll with `immediateChange`). |
| `update:visible` | `(value: boolean)` | Sheet shown / hidden. |
| `confirm` | `{ value }` | Confirm pressed and accepted. |
| `change` | `{ value }` | Selection changed. |
| `cancel` / `open` | — | Sheet lifecycle. |


## Not Implemented

`root-portal` (declared, forwarded to `sn-popup`, no portal host on miniprogram),
`display-format-tab-label` and the range-mode `toggle` event (this build ships
single-value mode only).


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-background-elevated` | Sheet surface |
| `--sn-mp-color-border-subtle` | Toolbar rule |
| `--sn-mp-color-text-primary` / `-secondary` | Title / cancel label |
| `--sn-mp-color-action-primary` | Confirm label |
| `--sn-mp-font-size-md` | Toolbar text |
| `--sn-mp-spacing-2` / `-3` / `-4` | Toolbar padding |


## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- The roller body carries the value in `aria-label` plus the hidden live region.


## Versioning

`@snui/uni@0.5.0` — initial release.
