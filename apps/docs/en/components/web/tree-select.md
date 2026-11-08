# TreeSelect · Web

Tree selector. Teleport tree panel (indent + expand arrows), single / multiple / filterable.

## Basic

<Demo name="tree-select-web-basic" description="Tree panel single select; parents and leaves selectable." />

## Multiple

<Demo name="tree-select-web-multiple" description="Tag display with removal; independent checks, no cascade." />

## Expand-all + filterable

<Demo name="tree-select-web-filter" description="defaultExpandAll; filterable expands ancestors of hits." />

## Custom fields

<Demo name="tree-select-web-fields" description="labelField / keyField / childrenField." />

## Clearable / disabled

<Demo name="tree-select-web-states" description="clearable, disabled, disabled option." />

## Connector Lines

Draw connector lines between parents and children in the dropdown panel.
The same four options as `SnTree` apply: `line-mode` (`branch` / `guide`;
`guide` draws full-height vertical indent guides and no horizontal branch),
`line-style` (`solid` / `dashed`), `line-corner` (`square` / `rounded`, only
for `branch`) and `line-color` (any CSS color).
The rounded elbow is a compact quarter-circle (the horizontal segment is
lifted just above the row center line with a box height equal to the radius;
a non-last child keeps its full-height guide so the trunk stays unbroken, a
last child trims the guide to the arc's start and lets the arc close the
branch). `--sn-web-tree-select-line-radius` (3px by default) is the corner
radius on both axes and should stay well below half the row height.
`line-color` is injected on the Teleported panel element, so it overrides
`--sn-web-tree-select-line-color` (border color by default).
Positions follow the panel's indent / switcher-size tokens.

<Demo name="tree-select-web-line" description="Square solid / square dashed / rounded custom color." />

<Demo name="tree-select-web-guide" description="Indent guides via line-mode=&quot;guide&quot;: full-height verticals per level, no horizontals; solid vs dashed." />

## Option Icons

Each entry in `options` can carry an `icon` field directly — no render prop. It
is rendered before the node label inside the dropdown panel and accepts the
same values as `SnTree`: a registered `SnIcon` name, an icon component, a
VNode / VNode array, or a zero-arg render fn. An unregistered string falls
back to plain text. Color follows `--sn-web-tree-select-node-icon-color`.

```ts
import { h } from 'vue';
import { Folder, FileCode } from 'lucide-vue-next';

const options = [
  {
    label: 'src',
    value: 'src',
    icon: Folder, // icon component
    children: [{ label: 'app.ts', value: 'app.ts', icon: FileCode }],
  },
  { label: 'README.md', value: 'README.md', icon: h('i', { class: 'file-icon' }) }, // VNode
];
```

Type `SnTreeSelectIcon = VNodeChild | Component | (() => VNodeChild)`, exported
from `@snui/vue-web`. `icon` is not affected by `labelField` / `keyField` /
`childrenField` remapping.

## API

### SnTreeSelect Props

| Prop                                  | Type                                       | Default                  | Notes                                          |
| ------------------------------------- | ------------------------------------------ | ------------------------ | ---------------------------------------------- |
| modelValue                            | `SnTreeSelectValue \| SnTreeSelectValue[]` | —                        | Single value or multiple array                 |
| multiple                              | `boolean`                                  | `false`                  | Multi-select (independent, no cascade)         |
| options                               | `SnTreeSelectOptionInput[]`                | `[]`                     | Tree options                                   |
| defaultExpandAll                      | `boolean`                                  | `false`                  | Expand all initially                           |
| placeholder                           | `string`                                   | —                        | Placeholder                                    |
| clearable                             | `boolean`                                  | `false`                  | Clear button                                   |
| filterable                            | `boolean`                                  | `false`                  | Label match + ancestor expansion               |
| disabled / readonly                   | `boolean`                                  | `false`                  | Disabled / read-only                           |
| size / status                         | same as other form components              | `'medium'` / `'default'` | Size / status                                  |
| labelField / keyField / childrenField | `string`                                   | —                        | Field mapping (raw `key` field takes priority) |
| showLine                              | `boolean`                                  | `false`                  | Draw parent/child connector lines in panel     |
| lineMode                              | `'branch' \| 'guide'`                      | `'branch'`               | L-shaped branches / indent guides              |
| lineStyle                             | `'solid' \| 'dashed'`                      | `'solid'`                | Stroke style: solid / dashed                   |
| lineCorner                            | `'square' \| 'rounded'`                    | `'square'`               | Elbow shape: right angle / rounded arc        |
| lineColor                             | `string`                                   | `undefined`              | Line color; overrides the panel's color var    |

Option data fields: `label` / `key` or `value` / `children` / `disabled` /
`icon` (`SnTreeSelectIcon`). Icons apply to dropdown nodes only, not to the
selected tag display.

Events: `update:modelValue` / `change` / `clear` / `focus` / `blur`; Slot: `empty`. Keyboard: ArrowUp/Down move, ArrowLeft collapse/go-parent, ArrowRight expand/drill, Enter select, Esc close. ARIA: tree + treeitem (aria-level/expanded/selected).

See the component `ai-description.md` for the full contract.
