# Cascader · Web

Cascading selector. Teleport multi-column panel, path v-model, filterable, hover expand. Columns have a fixed width (they do not adapt to content); long labels ellipsize.

## Basic

<Demo name="cascader-web-basic" description="Column-by-column selection with path v-model." />

## Multiple (tree check)

Set `multiple` to enable checkbox tree selection. Every row renders a checkbox; checking a parent cascades to all of its selectable descendant leaves (v-model holds one full path per committed leaf). The trigger renders one removable tag per path, `maxTagCount` collapses the rest into `+N`, and the menu stays open while toggling.

<Demo name="cascader-web-multiple" description="multiple: parent cascade, tag echo and per-tag removal." />

## Filterable

<Demo name="cascader-web-filterable" description="Full-path text match, flattened hits." />

## Custom fields

<Demo name="cascader-web-fields" description="labelField / valueField / childrenField." />

## Expand trigger

<Demo name="cascader-web-trigger" description="click (default) / hover." />

## Clearable / disabled

<Demo name="cascader-web-states" description="clearable, disabled, disabled option." />

## API

### SnCascader Props

| Prop                                    | Type                                         | Default     | Notes                                                          |
| --------------------------------------- | -------------------------------------------- | ----------- | -------------------------------------------------------------- |
| modelValue                              | `SnCascaderValue[]` \| `SnCascaderValue[][]` | `[]`        | Single: one leaf path; multiple: array of paths (clear → `[]`) |
| options                                 | `SnCascaderOptionInput[]`                    | `[]`        | Tree options (children levels)                                 |
| placeholder                             | `string`                                     | —           | Placeholder                                                    |
| clearable                               | `boolean`                                    | `false`     | Clear button                                                   |
| filterable                              | `boolean`                                    | `false`     | Path-text match                                                |
| multiple                                | `boolean`                                    | `false`     | Tree-check multiple mode: parent check cascades to leaves      |
| maxTagCount                             | `number`                                     | —           | Max visible tags before collapsing into `+N` (multiple)        |
| disabled / readonly                     | `boolean`                                    | `false`     | Disabled / read-only                                           |
| size                                    | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | Size                                                           |
| status                                  | `'default'\|'error'\|'warning'`              | `'default'` | Status                                                         |
| labelField / valueField / childrenField | `string`                                     | —           | Field mapping                                                  |
| expandTrigger                           | `'click'\|'hover'`                           | `'click'`   | Sub-level expand trigger                                       |

Events: `update:modelValue` / `change` / `clear` / `focus` / `blur`; Slot: `empty`. Keyboard: ArrowLeft/Right switch columns, ArrowUp/Down move, Enter selects a leaf (toggles the check in multiple mode without closing), Esc closes. Display: path labels joined with " / "; one tag per path in multiple mode. Column width is fixed via `--sn-web-cascader-column-width` (default 160px) and does not adapt to content; the panel width is driven by the expanded columns (one column initially, one more per expanded level) and does not stretch to the trigger width.

See the component `ai-description.md` for the full contract.
