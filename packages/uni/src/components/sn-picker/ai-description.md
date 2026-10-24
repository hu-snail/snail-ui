# sn-sn-picker — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Bottom-sheet picker: sheet chrome (mask, toolbar, title, cancel / confirm) composed on `sn-popup` around the `sn-picker-view` roller. Owns the draft selection and writes `v-model` on confirm..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Bottom-sheet picker: sheet chrome (mask, toolbar, title, cancel / confirm) composed on `sn-popup` around the `sn-picker-view` roller. Owns the draft selection and writes `v-model` on confirm.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-picker`
(https://wot-ui.cn/component/picker.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-picker v-model="values" v-model:visible="open" :columns="columns" title="Fruit" />
```

```ts
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `Array<string \| number>` | `[]` | Confirmed value per column. |
| `visible` | `boolean` | `false` | Sheet visibility (`v-model:visible`). |
| `columns` | `Array<Array<...>>` | `[]` | Columns, or the option tree in `cascade` mode. |
| `cascade` | `boolean` | `false` | Treat `columns` as a tree. |
| `title` | `string` | `''` | Toolbar title (empty = no title row). |
| `cancelButtonText` / `confirmButtonText` | `string` | `'取消'` / `'确认'` | Toolbar labels. |
| `valueKey` / `labelKey` / `childrenKey` | `string` | `'value'` / `'label'` / `'children'` | Option keys. |
| `itemHeight` / `visibleItemCount` | `number` | `44` / `6` | Row geometry. |
| `beforeConfirm` | `({ value, selectedItems }) => boolean \| Promise<boolean>` | `undefined` | Veto hook for confirm. |
| `closeOnClickModal` | `boolean` | `true` | Mask tap closes. |
| `zIndex` | `number` | `15` | Stacking level. |
| `safeAreaInsetBottom` | `boolean` | `true` | Safe-area padding. |
| `immediateChange` | `boolean` | `false` | Write `v-model` on every roll. |
| `customClass` / `customStyle` / `customViewClass` | `string` | `''` | Root / sheet / roller forwarding. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `(value: Array)` | Confirmed (or every roll with `immediateChange`). |
| `update:visible` | `(value: boolean)` | Sheet shown / hidden. |
| `confirm` | `{ value, selectedItems }` | Confirm button pressed and accepted. |
| `cancel` | — | Cancel pressed. |
| `open` | — | Sheet opened. |


## Not Implemented

`root-portal` — uni-app miniprograms have no portal host (same divergence as `sn-popup`).


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
- The sheet itself is the `sn-popup` panel, already `role="dialog"` + `aria-modal`.


## Versioning

`@snui/uni@0.5.0` — initial release.
