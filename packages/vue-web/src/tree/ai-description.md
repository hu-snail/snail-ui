# SnTree — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end tree component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Display hierarchical data with expand / collapse, single or multiple node
selection, and cascading checkbox checking, in a scrollable panel.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-tree`
(https://www.naiveui.com/zh-CN/light/components/tree) — scoped subset.

## Import

```ts
import SnTree from '@snui/vue-web/src/tree/SnTree.vue'
import type {
  SnTreeKey,
  SnTreeOption,
  SnTreeRenderSidePart,
} from '@snui/vue-web/src/tree/sn-tree-types'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `data` | `SnTreeOption[]` | `[]` | no | Tree node data. |
| `keyField` | `string` | `'key'` | no | Field name of the node key. |
| `labelField` | `string` | `'label'` | no | Field name of the node label. |
| `childrenField` | `string` | `'children'` | no | Field name of the child list. |
| `defaultExpandedKeys` | `SnTreeKey[]` | `[]` | no | Uncontrolled initially expanded keys. |
| `expandedKeys` | `SnTreeKey[] \| undefined` | `undefined` | no | Controlled expanded keys (`v-model:expanded-keys`); `undefined` = uncontrolled. |
| `defaultExpandAll` | `boolean` | `false` | no | Expand every non-leaf node initially. |
| `selectable` | `boolean` | `true` | no | Allow selecting nodes by click. |
| `selectedKeys` | `SnTreeKey[] \| undefined` | `undefined` | no | Controlled selected keys (`v-model:selected-keys`). |
| `defaultSelectedKeys` | `SnTreeKey[]` | `[]` | no | Uncontrolled initially selected keys. |
| `multiple` | `boolean` | `false` | no | Allow multiple selected nodes. |
| `cancelable` | `boolean` | `true` | no | Clicking a selected node deselects it. |
| `checkable` | `boolean` | `false` | no | Render a checkbox per node. |
| `checkedKeys` | `SnTreeKey[] \| undefined` | `undefined` | no | Controlled checked keys (`v-model:checked-keys`). |
| `defaultCheckedKeys` | `SnTreeKey[]` | `[]` | no | Uncontrolled initially checked keys. |
| `cascade` | `boolean` | `false` | no | Checkboxes cascade to children; parents show an indeterminate state. |
| `blockLine` | `boolean` | `false` | no | Hover/selected background spans the whole node row. |
| `indent` | `number` | `24` | no | Per-level indent width (px). |
| `renderPrefix` | `SnTreeRenderSidePart` | `undefined` | no | Node prefix render fn, receives `{ option, checked, selected }`. |
| `renderSuffix` | `SnTreeRenderSidePart` | `undefined` | no | Node suffix render fn, receives `{ option, checked, selected }`. |

### TreeOption fields

`key?` / `label?` / `children?` / `disabled?` / `isLeaf?` /
`prefix?` (string \| render fn) / `suffix?` (string \| render fn) /
`checkboxDisabled?`. Field names are remapped by `keyField` /
`labelField` / `childrenField`. Nodes missing `key` get a deterministic
`__sn_auto__…` key.

## Events

| Name | Parameters | Description |
|---|---|---|
| `update:expandedKeys` | `(keys, options, meta: { node, action: 'expand' \| 'collapse' \| 'filter' })` | Expansion changed — supports `v-model:expanded-keys`. |
| `update:selectedKeys` | `(keys, options, meta: { node, action: 'select' \| 'unselect' })` | Selection changed — supports `v-model:selected-keys`. |
| `update:checkedKeys` | `(keys, options, meta: { node, action: 'check' \| 'uncheck' })` | Checking changed — supports `v-model:checked-keys`. |

`options` maps each emitted key to its `SnTreeOption` (or `null`).

## Slots

| Name | Description |
|---|---|
| `empty` | Rendered when `data` produces no rows (default: 无数据). |

## Deferred (future markers — not implemented)

- `draggable` + drag events (`on-dragstart` / `on-drop` / …)
- `virtual-scroll` (and the `scrollTo` method)
- keyboard navigation (`keyboard` prop)
- `check-strategy` (fixed to `'all'`)
- `on-load` async children (and the loading spinner in the switcher)
- `accordion`, `block-node`, `ellipsis`, `expand-on-click`, `filter` /
  `pattern`, `node-props`, `render-label`, `render-switcher-icon`,
  `show-line`, `checkbox-placement`,
  `override-default-node-click-behavior`, `scrollbar-props`, controlled
  `indeterminate-keys`, `watch-props`, `getCheckedData` /
  `getIndeterminateData` methods.

## Divergences from the reference API

- Expand/collapse renders without the motion animation (direct show/hide).
- Disabled nodes block every interaction (the reference still allows
  expanding a disabled node's switcher).
- The empty state is a plain text row (customizable via the `empty` slot),
  not the `n-empty` sub-component.

## Behavior Notes

- Selection: content click only (the reference's `check-on-click` is not
  implemented); switcher / checkbox clicks stop propagation.
- Cascade checking: checking a parent checks all non-disabled descendants;
  unchecking a child leaves the parent indeterminate. Emitted
  `checkedKeys` contain fully-checked nodes only (indeterminate parents
  excluded, matching the reference). Controlled parent keys expand to
  their subtree.
- A11y: `role="tree"` on the root, `role="treeitem"` + `aria-expanded` /
  `aria-selected` / `aria-disabled` per row, `role="checkbox"` +
  `aria-checked` (`true` / `false` / `mixed`) on checkboxes. Keyboard
  navigation is deferred.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary / tertiary / disabled / on-primary | `--sn-web-color-text-*` | Node text, switcher + empty color, disabled text, check mark |
| Background subtle | `--sn-web-color-background-subtle` | Row hover background |
| Action primary | `--sn-web-color-action-primary` | Checked checkbox, selected background tint (10% `color-mix`) |
| Border default | `--sn-web-color-border-default` | Checkbox frame |

## Versioning

`@snui/vue-web@0.2.0` — initial release. Part of AUI-WEB-DD-021.
