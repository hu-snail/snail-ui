# sn-picker-view — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end roller picker body.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

The multi-column roller body behind `sn-picker`. Renders one wheel per column
and resolves option keys (`valueKey` / `labelKey` / `childrenKey`). In
`cascade` mode it derives the visible columns from the selected path.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-picker-view`
(https://wot-ui.cn/component/picker-view.html). New props added here MUST also
be added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-picker-view v-model="values" :columns="[['a', 'b']]" />
```

```ts
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';
import type { PickerViewChangePayload } from '@snui/uni-src/components/sn-picker-view/sn-picker-view-types';
```

## Props

| Name                          | Type                                       | Default      | Required | Description                                     |
| ----------------------------- | ------------------------------------------ | ------------ | -------- | ----------------------------------------------- |
| `modelValue`                  | `Array<string \| number>`                  | `[]`         | no       | Selected value per column.                      |
| `columns`                     | `Array<Array<string \| number \| object>>` | `[]`         | no       | Columns; the option tree when `cascade` is set. |
| `itemHeight`                  | `number`                                   | `44`         | no       | Row height in px design units.                  |
| `visibleItemCount`            | `number`                                   | `6`          | no       | Number of visible rows.                         |
| `valueKey`                    | `string`                                   | `'value'`    | no       | Option key holding the value.                   |
| `labelKey`                    | `string`                                   | `'label'`    | no       | Option key holding the label.                   |
| `childrenKey`                 | `string`                                   | `'children'` | no       | Option key holding the children (cascade).      |
| `immediateChange`             | `boolean`                                  | `false`      | no       | Emit `change` while dragging.                   |
| `cascade`                     | `boolean`                                  | `false`      | no       | Treat `columns` as a nested tree.               |
| `disabled`                    | `boolean`                                  | `false`      | no       | Disables the roller.                            |
| `customClass` / `customStyle` | `string`                                   | `''`         | no       | Root forwarding.                                |

## Events

| Name                | Payload                   | When                                                    |
| ------------------- | ------------------------- | ------------------------------------------------------- |
| `update:modelValue` | `(value: Array)`          | Selection changed.                                      |
| `change`            | `PickerViewChangePayload` | Selection settled (or per move with `immediateChange`). |
| `pickstart`         | —                         | Touch drag started.                                     |
| `pickend`           | —                         | Touch drag ended.                                       |

## Exposed API

| Member                                | Signature           | Description                                     |
| ------------------------------------- | ------------------- | ----------------------------------------------- |
| `getSelectedValues`                   | `() => Array`       | Current value per column.                       |
| `getSelectedOptions`                  | `() => Array`       | Current raw option per column.                  |
| `getSelectedLabels`                   | `() => string[]`    | Current label per column.                       |
| `getSelectedIndex` / `getColumnIndex` | `() => number[]`    | Selected row index per column.                  |
| `getColumnsData` / `getColumnData`    | `(index?) => Array` | Normalized column data.                         |
| `resetColumns`                        | `() => void`        | Reset every column to its first selectable row. |

## Tokens Consumed (end: mp)

| Token                                                     | Purpose                       |
| --------------------------------------------------------- | ----------------------------- |
| `--sn-mp-color-background-elevated`                       | Roller surface                |
| `--sn-mp-color-text-primary` / `-secondary` / `-disabled` | Row text                      |
| `--sn-mp-color-border-subtle`                             | Selection indicator           |
| `--sn-mp-font-size-md`                                    | Row text size                 |
| `--sn-mp-font-weight-semibold`                            | Active row weight             |
| `--sn-mp-spacing-2` / `-3`                                | Indicator inset / row padding |

## Accessibility

- Root is `role="group"` with `aria-disabled`.
- Each row is `role="button"` with `aria-selected` / `aria-disabled`.

## Versioning

`@snui/uni@0.5.0` — initial release.
