# Cascader · Web

Cascading selector. Teleport multi-column panel, path v-model, filterable, hover expand.

## Basic

<Demo name="cascader-web-basic" description="Column-by-column selection with path v-model." />

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

| Prop                                    | Type                                         | Default     | Notes                               |
| --------------------------------------- | -------------------------------------------- | ----------- | ----------------------------------- |
| modelValue                              | `SnCascaderValue[]`                          | `[]`        | Full leaf path (clear commits `[]`) |
| options                                 | `SnCascaderOptionInput[]`                    | `[]`        | Tree options (children levels)      |
| placeholder                             | `string`                                     | —           | Placeholder                         |
| clearable                               | `boolean`                                    | `false`     | Clear button                        |
| filterable                              | `boolean`                                    | `false`     | Path-text match                     |
| disabled / readonly                     | `boolean`                                    | `false`     | Disabled / read-only                |
| size                                    | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | Size                                |
| status                                  | `'default'\|'error'\|'warning'`              | `'default'` | Status                              |
| labelField / valueField / childrenField | `string`                                     | —           | Field mapping                       |
| expandTrigger                           | `'click'\|'hover'`                           | `'click'`   | Sub-level expand trigger            |

Events: `update:modelValue` / `change` / `clear` / `focus` / `blur`; Slot: `empty`. Keyboard: ArrowLeft/Right switch columns, ArrowUp/Down move, Enter selects a leaf, Esc closes. Display: path labels joined with " / ".

See the component `ai-description.md` for the full contract.
