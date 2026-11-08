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

## Checkboxes + Drag & Drop

Checkboxes and native HTML5 drag & drop work together: drop on a row's top /
bottom edge to reorder siblings, drop in the middle of a non-leaf row to move
the node inside it. Checking does not cascade by default (a checked child leaves
the parent untouched); add `cascade` for linked checking.

<Demo name="tree-web-checkable-drag" description="checkable + draggable + line-mode=&quot;guide&quot;; drag to reorder or move into a folder." />

## Disabled

<Demo name="tree-web-disabled" description="disabled blocks select/check/expand; checkboxDisabled blocks checking only." />

## Prefix & Suffix

<Demo name="tree-web-prefix-suffix" description="option-level fields and tree-level render fns." />

## Node Icons

Put an `icon` field directly on the node data — no render prop needed. It accepts
a registered `SnIcon` name (via `registerSnIcons`, rendered at 14px), an icon
component, a VNode, a VNode array, or a zero-arg render fn. An unregistered plain
string falls back to text, so a typo never blanks a row. The folder/file icons
in the connector-line demo come from this field.

```ts
import { h } from 'vue';
import { Folder, FileCode } from 'lucide-vue-next';
import type { SnTreeOption } from '@snui/vue-web';

const data: SnTreeOption[] = [
  {
    key: 'src',
    label: 'src',
    icon: Folder, // icon component
    children: [{ key: 'app', label: 'app.ts', icon: FileCode }],
  },
  { key: 'readme', label: 'README.md', icon: h('i', { class: 'file-icon' }) }, // VNode
];
```

Type `SnTreeIcon = VNodeChild | Component | (() => VNodeChild)`, exported from
`@snui/vue-web`.

Drag & drop types `SnTreeDropPosition`, `SnTreeAllowDropInfo`,
`SnTreeAllowDrop`, `SnTreeDragInfo` and `SnTreeDropInfo` are exported from
`@snui/vue-web` too.

## Block Line

<Demo name="tree-web-block-line" description="Hover/selected background spans the whole row." />

## Connector Lines

L-shaped guides connect parents and children by default (`branch` mode): rows
inside an open branch keep the vertical guide and the last child ends its line
at the row center. `guide` mode draws vertical indent guides only. Four
independent options can be combined:

- `line-mode`: `branch` (default, L-shaped branch lines) or `guide`
  (indent guides: one vertical per level spanning the whole subtree, no
  horizontal segment; `line-corner` only applies to `branch`).
- `line-style`: `solid` (default) or `dashed`.
- `line-corner`: `square` (default) or `rounded`. The rounded elbow is a
  compact quarter-circle: the horizontal segment is lifted to sit just above
  the row center line with a box height equal to the radius, and its
  `border-left` bends into `border-bottom`. A non-last child keeps its
  full-height guide, so the arc leaves the unbroken trunk smoothly; a last
  child trims the guide to the arc's start and lets the arc close the branch.
  `--sn-web-tree-line-radius` (3px by default) controls the corner radius on
  **both axes**; keep it well below half the row height so the arc still reads
  as a corner.
- `line-color`: any CSS color or token, injected as
  `--sn-web-tree-line-color`; when omitted the token chain falls back to the
  border color.

Geometry follows `indent`. With `showLine: false` none of these options render
any extra DOM.

<Demo name="tree-web-line" description="Square solid / square dashed / rounded custom color." />

<Demo name="tree-web-guide" description="Indent guides via line-mode=&quot;guide&quot;: full-height verticals per level, no horizontals; solid vs dashed." />

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
| showLine            | `boolean`                                             | `false`      | Draw parent/child connector lines        |
| lineMode            | `'branch' \| 'guide'`                                 | `'branch'`   | L-shaped branches / indent guides        |
| lineStyle           | `'solid' \| 'dashed'`                                 | `'solid'`    | Stroke style; only when `showLine` is on |
| lineCorner          | `'square' \| 'rounded'`                               | `'square'`   | Elbow shape: right angle / rounded arc  |
| lineColor           | `string`                                              | `undefined`  | Line color; overrides the line-color var |
| draggable           | `boolean`                                             | `false`      | Enable native HTML5 row dragging         |
| allowDrop           | `(info: { node, dropPosition, phase }) => boolean`    | `undefined`  | Drag/drop gate; leaves reject `inside` by default |
| renderPrefix        | `(info: { option, checked, selected }) => VNodeChild` | `undefined`  | Node prefix render fn                    |
| renderSuffix        | `(info: { option, checked, selected }) => VNodeChild` | `undefined`  | Node suffix render fn                    |

### SnTree Events

| Event               | Parameters              | Notes                                                                              |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| update:expandedKeys | `(keys, options, meta)` | `meta.action`: `'expand' \| 'collapse'`                                            |
| update:selectedKeys | `(keys, options, meta)` | `meta.action`: `'select' \| 'unselect'`                                            |
| update:checkedKeys  | `(keys, options, meta)` | `meta.action`: `'check' \| 'uncheck'`; cascade mode emits fully-checked nodes only |
| dragStart           | `{ node, event }`       | A row started being dragged                                                        |
| dragEnter           | `{ node, event }`       | A dragged row entered another row                                                  |
| dragLeave           | `{ node, event }`       | A dragged row left another row                                                     |
| dragEnd             | `{ node, event }`       | The drag ended (dropped or cancelled)                                              |
| drop                | `{ node, dragNode, dropPosition, event }` | Dropped on a row; `dropPosition`: `'before' \| 'inside' \| 'after'` |

### SnTree Slots

| Slot  | Notes                               |
| ----- | ----------------------------------- |
| empty | Empty state when `data` has no rows |

### SnTreeOption Fields

| Field            | Type                           | Notes                                                     |
| ---------------- | ------------------------------ | --------------------------------------------------------- |
| key              | `string \| number`             | Unique node key (auto-generated when omitted)             |
| label            | `string`                       | Node text                                                 |
| children         | `SnTreeOption[]`               | Child nodes                                               |
| disabled         | `boolean`                      | Blocks select / check / expand                            |
| isLeaf           | `boolean`                      | Force leaf rendering (no switcher)                        |
| icon             | `SnTreeIcon`                   | Leading icon: name / component / VNode / render fn / text |
| prefix / suffix  | `string \| (() => VNodeChild)` | Per-node prefix / suffix                                  |
| checkboxDisabled | `boolean`                      | Disables only this node's checkbox                        |

A11y: `role="tree"`, rows as `role="treeitem"` with `aria-expanded` /
`aria-selected`, checkboxes as `role="checkbox"` with tri-state
`aria-checked`; connector lines are decorative (`aria-hidden`, pointer-events
off). Dragging uses native HTML5 drag & drop (mouse / trackpad); keyboard
reordering, virtual scroll, keyboard navigation, async children and check
strategies are future iterations.

See the component `ai-description.md` for the full contract.
