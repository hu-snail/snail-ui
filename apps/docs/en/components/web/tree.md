# Tree · Web

Hierarchical data panel with expand/collapse, single/multiple selection,
and cascading checkboxes with indeterminate parents.

## Basic

<Demo name="tree-web-basic" description="defaultExpandedKeys + v-model:selected-keys." />

## Custom Fields

<Demo name="tree-web-fields" description="keyField / labelField / childrenField remapping." />

## Multiple

<Demo name="tree-web-multiple" description="Array v-model, click to toggle." />

## Cascade

<Demo name="tree-web-cascade" description="checkable + cascade, v-model:checked-keys." />

## Disabled

<Demo name="tree-web-disabled" description="disabled blocks select/check/expand; checkboxDisabled blocks checking only." />

## Prefix & Suffix

<Demo name="tree-web-prefix-suffix" description="option-level fields and tree-level render fns." />

## Block Line

<Demo name="tree-web-block-line" description="Hover/selected background spans the whole row." />

## Empty

<Demo name="tree-web-empty" description="Default empty text + empty slot." />

## API

### SnTree Props

| Prop                | Type                                                  | Default      | Notes                                    |
| ------------------- | ----------------------------------------------------- | ------------ | ---------------------------------------- |
| data                | `SnTreeOption[]`                                      | `[]`         | Node data                                |
| keyField            | `string`                                              | `'key'`      | Key field name                           |
| labelField          | `string`                                              | `'label'`    | Label field name                         |
| childrenField       | `string`                                              | `'children'` | Children field name                      |
| defaultExpandedKeys | `SnTreeKey[]`                                         | `[]`         | Uncontrolled initial expanded keys       |
| expandedKeys        | `SnTreeKey[] \| undefined`                            | `undefined`  | Controlled (v-model:expanded-keys)       |
| defaultExpandAll    | `boolean`                                             | `false`      | Expand all non-leaf nodes initially      |
| selectable          | `boolean`                                             | `true`       | Click to select                          |
| selectedKeys        | `SnTreeKey[] \| undefined`                            | `undefined`  | Controlled (v-model:selected-keys)       |
| defaultSelectedKeys | `SnTreeKey[]`                                         | `[]`         | Uncontrolled initial selection           |
| multiple            | `boolean`                                             | `false`      | Multiple selection                       |
| cancelable          | `boolean`                                             | `true`       | Click a selected node to deselect        |
| checkable           | `boolean`                                             | `false`      | Render checkboxes                        |
| checkedKeys         | `SnTreeKey[] \| undefined`                            | `undefined`  | Controlled (v-model:checked-keys)        |
| defaultCheckedKeys  | `SnTreeKey[]`                                         | `[]`         | Uncontrolled initial checking            |
| cascade             | `boolean`                                             | `false`      | Cascade checking + indeterminate parents |
| blockLine           | `boolean`                                             | `false`      | Full-row hover/selected background       |
| indent              | `number`                                              | `24`         | Per-level indent (px)                    |
| renderPrefix        | `(info: { option, checked, selected }) => VNodeChild` | `undefined`  | Node prefix render fn                    |
| renderSuffix        | `(info: { option, checked, selected }) => VNodeChild` | `undefined`  | Node suffix render fn                    |

### SnTree Events

| Event               | Parameters              | Notes                                                                              |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| update:expandedKeys | `(keys, options, meta)` | `meta.action`: `'expand' \| 'collapse'`                                            |
| update:selectedKeys | `(keys, options, meta)` | `meta.action`: `'select' \| 'unselect'`                                            |
| update:checkedKeys  | `(keys, options, meta)` | `meta.action`: `'check' \| 'uncheck'`; cascade mode emits fully-checked nodes only |

### SnTree Slots

| Slot  | Notes                               |
| ----- | ----------------------------------- |
| empty | Empty state when `data` has no rows |

A11y: `role="tree"`, rows as `role="treeitem"` with `aria-expanded` /
`aria-selected`, checkboxes as `role="checkbox"` with tri-state
`aria-checked`. Drag, virtual scroll, keyboard navigation, async children
and check strategies are future iterations.

See the component `ai-description.md` for the full contract.
