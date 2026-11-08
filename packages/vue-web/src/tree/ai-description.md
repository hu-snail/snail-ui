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
import SnTree from '@snui/vue-web/src/tree/SnTree.vue';
import type {
  SnTreeKey,
  SnTreeOption,
  SnTreeIcon,
  SnTreeLineCorner,
  SnTreeLineStyle,
  SnTreeRenderSidePart,
} from '@snui/vue-web/src/tree/sn-tree-types';
```

## Props

| Name                  | Type                       | Default      | Required | Description                                                                     |
| --------------------- | -------------------------- | ------------ | -------- | ------------------------------------------------------------------------------- |
| `data`                | `SnTreeOption[]`           | `[]`         | no       | Tree node data.                                                                 |
| `keyField`            | `string`                   | `'key'`      | no       | Field name of the node key.                                                     |
| `labelField`          | `string`                   | `'label'`    | no       | Field name of the node label.                                                   |
| `childrenField`       | `string`                   | `'children'` | no       | Field name of the child list.                                                   |
| `defaultExpandedKeys` | `SnTreeKey[]`              | `[]`         | no       | Uncontrolled initially expanded keys.                                           |
| `expandedKeys`        | `SnTreeKey[] \| undefined` | `undefined`  | no       | Controlled expanded keys (`v-model:expanded-keys`); `undefined` = uncontrolled. |
| `defaultExpandAll`    | `boolean`                  | `false`      | no       | Expand every non-leaf node initially.                                           |
| `selectable`          | `boolean`                  | `true`       | no       | Allow selecting nodes by click.                                                 |
| `selectedKeys`        | `SnTreeKey[] \| undefined` | `undefined`  | no       | Controlled selected keys (`v-model:selected-keys`).                             |
| `defaultSelectedKeys` | `SnTreeKey[]`              | `[]`         | no       | Uncontrolled initially selected keys.                                           |
| `multiple`            | `boolean`                  | `false`      | no       | Allow multiple selected nodes.                                                  |
| `cancelable`          | `boolean`                  | `true`       | no       | Clicking a selected node deselects it.                                          |
| `checkable`           | `boolean`                  | `false`      | no       | Render a checkbox per node.                                                     |
| `checkedKeys`         | `SnTreeKey[] \| undefined` | `undefined`  | no       | Controlled checked keys (`v-model:checked-keys`).                               |
| `defaultCheckedKeys`  | `SnTreeKey[]`              | `[]`         | no       | Uncontrolled initially checked keys.                                            |
| `cascade`             | `boolean`                  | `false`      | no       | Checkboxes cascade to children; parents show an indeterminate state.            |
| `blockLine`           | `boolean`                  | `false`      | no       | Hover/selected background spans the whole node row.                             |
| `indent`              | `number`                   | `24`         | no       | Per-level indent width (px).                                                    |
| `showLine`            | `boolean`                  | `false`      | no       | Draw connector lines between parent and child rows.                             |
| `lineMode`            | `SnTreeLineMode`           | `'branch'`   | no       | `'branch'` (L connectors) \| `'guide'` (vertical indent guides).                |
| `lineStyle`           | `SnTreeLineStyle`          | `'solid'`    | no       | Connector stroke: `'solid'` \| `'dashed'` (AUI additive).                       |
| `lineCorner`          | `SnTreeLineCorner`         | `'square'`   | no       | Elbow shape: `'square'` \| `'rounded'` (AUI additive).                          |
| `lineColor`           | `string`                   | `undefined`  | no       | Any CSS color / token; overrides `--sn-web-tree-line-color` (AUI additive).    |
| `draggable`           | `boolean`                  | `false`      | no       | Enable native HTML5 row drag & drop (mirrors n-tree `draggable`).               |
| `allowDrop`           | `SnTreeAllowDrop`          | `undefined`  | no       | Drag/drop gate `(info) => boolean`; `inside` on a leaf is rejected by default.  |
| `renderPrefix`        | `SnTreeRenderSidePart`     | `undefined`  | no       | Node prefix render fn, receives `{ option, checked, selected }`.                |
| `renderSuffix`        | `SnTreeRenderSidePart`     | `undefined`  | no       | Node suffix render fn, receives `{ option, checked, selected }`.                |

### TreeOption fields

`key?` / `label?` / `children?` / `disabled?` / `isLeaf?` /
`icon?` (`SnTreeIcon`) / `prefix?` (string \| render fn) /
`suffix?` (string \| render fn) / `checkboxDisabled?`. Field names are
remapped by `keyField` / `labelField` / `childrenField`. Nodes missing `key`
get a deterministic `__sn_auto__…` key.

`SnTreeIcon = VNodeChild | Component | (() => VNodeChild)` (AUI additive,
data-level). Resolution via `resolveTreeIcon()`:

| Value                            | Rendering                                              |
| -------------------------------- | ------------------------------------------------------ |
| registered `SnIcon` name (string) | `h(SnIcon, { name, size: 14 })`                       |
| unregistered string              | plain text (no blank row on a typo)                     |
| VNode / VNode[] / number / string | rendered as-is                                        |
| component object / function      | mounted with `h()`                                     |
| `null` / `undefined` / boolean   | no icon element                                        |

No render prop is needed; the icon renders before the label in a 14px slot
(`.sn-tree__node-icon`), colored by `--sn-web-color-text-tertiary`.
`icon` is not affected by field-name remapping.

Drag & drop types `SnTreeDropPosition`, `SnTreeAllowDropInfo`, `SnTreeAllowDrop`,
`SnTreeDragInfo` and `SnTreeDropInfo` are exported from the package entry.

## Events

| Name                  | Parameters                                                                    | Description                                           |
| --------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| `update:expandedKeys` | `(keys, options, meta: { node, action: 'expand' \| 'collapse' \| 'filter' })` | Expansion changed — supports `v-model:expanded-keys`. |
| `update:selectedKeys` | `(keys, options, meta: { node, action: 'select' \| 'unselect' })`             | Selection changed — supports `v-model:selected-keys`. |
| `update:checkedKeys`  | `(keys, options, meta: { node, action: 'check' \| 'uncheck' })`               | Checking changed — supports `v-model:checked-keys`.   |
| `dragStart`           | `{ node: SnTreeOption, event: DragEvent }`                                    | A row started being dragged.                          |
| `dragEnter`           | `{ node: SnTreeOption, event: DragEvent }`                                    | A dragged row entered another row.                    |
| `dragLeave`           | `{ node: SnTreeOption, event: DragEvent }`                                    | A dragged row left another row.                       |
| `dragEnd`             | `{ node: SnTreeOption, event: DragEvent }`                                    | The drag ended (dropped or cancelled).                |
| `drop`                | `{ node, dragNode, dropPosition, event }`                                     | Dropped on `node`; `dropPosition`: `'before' \| 'inside' \| 'after'`. |

`options` maps each emitted key to its `SnTreeOption` (or `null`).

## Slots

| Name    | Description                                              |
| ------- | -------------------------------------------------------- |
| `empty` | Rendered when `data` produces no rows (default: 无数据). |

## Deferred (future markers — not implemented)

- `virtual-scroll` (and the `scrollTo` method)
- keyboard navigation (`keyboard` prop)
- `check-strategy` (fixed to `'all'`)
- `on-load` async children (and the loading spinner in the switcher)
- `accordion`, `block-node`, `ellipsis`, `expand-on-click`, `filter` /
  `pattern`, `node-props`, `render-label`, `render-switcher-icon`,
  `checkbox-placement`,
  `override-default-node-click-behavior`, `scrollbar-props`, controlled
  `indeterminate-keys`, `watch-props`, `getCheckedData` /
  `getIndeterminateData` methods.

## Divergences from the reference API

- Expand/collapse renders without the motion animation (direct show/hide).
- Disabled nodes block every interaction (the reference still allows
  expanding a disabled node's switcher).
- The empty state is a plain text row (customizable via the `empty` slot),
  not the `n-empty` sub-component.
- Checkboxes render in the leading slot **before** the switcher (the requested
  file-tree order), while the reference's `checkbox-placement="left"` renders
  the switcher first. `checkbox-placement` itself is not implemented.
- Drag & drop is the simplified single-level model: no horizontal
  drag-left-to-reparent offset levels, no `expand-on-dragenter`, and dropping
  inside the current parent is not special-cased.

## Behavior Notes

- Drag & drop (mirrors n-tree): `draggable` marks every enabled row
  `draggable="true"`. `dragstart` records the dragged key; `dragover` resolves
  `before` / `inside` / `after` from the pointer Y (8px edge bands, leaf rows
  split in half) and only calls `preventDefault()` for accepted targets;
  `drop` emits `{ node, dragNode, dropPosition, event }` and never mutates
  `data` — the host moves the node. Built-in guards: no self-drop, no drop into
  the dragged subtree, no `inside` on leaves, disabled rows stay inert.
  `allowDrop` adds a host gate with `phase: 'drag' | 'drop'`. Visuals:
  `sn-tree__node--dragging` (dimmed), `--drop-before` / `--drop-after` (2px
  primary line), `--drop-inside` (tinted row + 1px outline).

- Connector lines (AUI additive): `showLine` renders L-shaped guides from a
  parent switcher center to each child row; a branch's vertical guide keeps
  running while siblings follow and ends at the row center on its last child.
  `lineStyle: 'dashed'` switches every segment to a dashed border. Geometry
  comes from `resolveTreeLineLayout()` over the flat visible-row depths
  (shared with SnTreeSelect), mapped to `indent`-based x positions. Lines are
  decorative (`aria-hidden`, `pointer-events: none`).
- Line geometry (AUI additive): `lineMode: 'branch'` (default) draws the
  L-shaped connectors above. `'guide'` draws indent guides instead — one
  full-height vertical per ancestor level, running through the whole subtree
  (including the last branch) and ending at the bottom of the last row, with
  no horizontal segment. `lineCorner` only applies to `'branch'`; `lineStyle`
  and `lineColor` apply to both modes.
- Corner shape (AUI additive): `lineCorner: 'square'` (default) draws a
  right-angle L; `'rounded'` adds `sn-tree--line-rounded`. The horizontal
  segment becomes a **compact quarter-circle** (`top: 50% - R + 1px`,
  `height: R`, `border-left` + `border-bottom` +
  `border-bottom-left-radius: R`), so the arc leaves the trunk and flattens
  into the branch within a few pixels. The elbow-level vertical guide is
  marked `sn-tree__line--elbow`:
  - non-last child → the guide stays full-height, so the trunk is unbroken
    and the branch curves away from it tangentially (a graceful Y, never a
    notch);
  - last child (`--half`) → the guide stops at the arc's top edge, so the arc
    alone closes the branch.
  Ancestor guides at other levels stay straight full-height lines.
  `--sn-web-tree-line-radius` (3px fallback) is the corner radius on both
  axes. Dashed + rounded dashes the bottom edge of the arc.
- Line color (AUI additive): `lineColor` is bound as an inline
  `--sn-web-tree-line-color` on the root, which the existing
  `color: var(--sn-web-tree-line-color, var(--sn-web-color-border-default))`
  chain already reads. Omitting it leaves host-level token overrides intact.
  `lineMode` / `lineCorner` / `lineColor` / `lineStyle` are inert when `showLine`
  is false.
- Node parts (AUI additive fix): `icon` / `prefix` / `suffix` are rendered
  through `SnTreePart`, a render-function wrapper that returns the value as a
  `VNodeChild`. Text interpolation (`{{ vnode }}`) must never be used —
  Vue's `toDisplayString` JSON.stringify's a VNode, whose
  `vnode -> component -> vnode` cycle throws
  `TypeError: Converting circular structure to JSON` and blanks the whole tree.
- Selection: content click only (the reference's `check-on-click` is not
  implemented); switcher / checkbox clicks stop propagation.
- Cascade checking: checking a parent checks all non-disabled descendants;
  unchecking a child leaves the parent indeterminate. Emitted
  `checkedKeys` contain fully-checked nodes only (indeterminate parents
  excluded, matching the reference). Controlled parent keys expand to
  their subtree.
- A11y: `role="tree"` on the root, `role="treeitem"` + `aria-expanded` /
  `aria-selected` / `aria-disabled` per row, `role="checkbox"` +
  `aria-checked` (`true` / `false` / `mixed`) on checkboxes. Dragging uses
  native HTML5 drag & drop (mouse / trackpad); keyboard reordering and keyboard
  navigation are deferred.

## Tokens Consumed (end: web)

| Token                                           | CSS Variable                       | Purpose                                                      |
| ----------------------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| Text primary / tertiary / disabled / on-primary | `--sn-web-color-text-*`            | Node text, switcher + empty color, disabled text, check mark |
| Background subtle                               | `--sn-web-color-background-subtle` | Row hover background                                         |
| Action primary                                  | `--sn-web-color-action-primary`    | Checked checkbox, selected background tint (10% `color-mix`) |
| Border default                                  | `--sn-web-color-border-default`    | Checkbox frame + connector line fallback                      |
| Tree line color                                 | `--sn-web-tree-line-color`         | Connector stroke (falls back to border default); set by `lineColor` |
| Tree line radius                                | `--sn-web-tree-line-radius`        | Rounded elbow corner radius on both axes (`3px` fallback) |

## Versioning

`@snui/vue-web@0.2.0` — initial release. Part of AUI-WEB-DD-021.
