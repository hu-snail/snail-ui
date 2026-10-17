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

## API

### SnTreeSelect Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `SnTreeSelectValue \| SnTreeSelectValue[]` | — | Single value or multiple array |
| multiple | `boolean` | `false` | Multi-select (independent, no cascade) |
| options | `SnTreeSelectOptionInput[]` | `[]` | Tree options |
| defaultExpandAll | `boolean` | `false` | Expand all initially |
| placeholder | `string` | — | Placeholder |
| clearable | `boolean` | `false` | Clear button |
| filterable | `boolean` | `false` | Label match + ancestor expansion |
| disabled / readonly | `boolean` | `false` | Disabled / read-only |
| size / status | same as other form components | `'medium'` / `'default'` | Size / status |
| labelField / keyField / childrenField | `string` | — | Field mapping (raw `key` field takes priority) |

Events: `update:modelValue` / `change` / `clear` / `focus` / `blur`; Slot: `empty`. Keyboard: ArrowUp/Down move, ArrowLeft collapse/go-parent, ArrowRight expand/drill, Enter select, Esc close. ARIA: tree + treeitem (aria-level/expanded/selected).

See the component `ai-description.md` for the full contract.
