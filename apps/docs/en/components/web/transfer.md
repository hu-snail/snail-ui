# Transfer · Web

The transfer shuttle presents candidates and selected items in two side-by-side
panels and handles batch selection with check-all headers, four move buttons
and per-panel search.

## When to use

- Batch-picking from a candidate set: permission assignment, department
  selection, field filtering.
- One-shot full migration (single chevrons move checked items, double chevrons
  move every movable item).
- Larger candidate sets that need per-panel search (`filterable`).
- Some entries are read-only and must not move (option-level `disabled`).

## Examples

### Basic

`v-model:value` binds the selected values and the target panel echoes them in
`value` order; the header checkboxes support select-all and the indeterminate
state, single chevrons move the checked items and double chevrons move every
movable item.

<Demo name="transfer-web-basic" description="v-model:value two-panel shuttle with a selected-order readout." />

### Filtering and panel titles

`filterable` shows a search input on both sides,
`source-filter-placeholder` / `target-filter-placeholder` customize the two
placeholders, `source-title` / `target-title` customize the panel titles; rows
with option-level `disabled` are dimmed and take no part in selection or
migration.

<Demo name="transfer-web-filter" description="filterable search + custom titles and placeholders + option-level disabled." />

### Custom row rendering

`render-source-label` / `render-target-label` receive `{ option }` and return a
node, which is how icons and grouping tags are layered into a row; the two
panels can render different shapes.

<Demo name="transfer-web-render" description="renderSourceLabel / renderTargetLabel custom row content on both panels." />

### Disabled state

Two levels of disabling side by side: option-level `disabled` locks a single
entry while the others still move; component-level `disabled` makes selection,
move buttons and search all inoperable, leaving the whole control read-only.

<Demo name="transfer-web-disabled" description="Option-level disabled versus component-level disabled." />

## API

### Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| options | `Array<{ label: string; value: string \| number; disabled?: boolean }>` | `[]` | Transferable entries; `label` is used both as the default row text and for search matching. |
| value | `Array<string \| number> \| undefined` | `undefined` | Selected values (the right panel data source). `undefined` means uncontrolled mode, seeded by `default-value`. |
| default-value | `Array<string \| number>` | `[]` | Initial selection for uncontrolled mode. |
| filterable | `boolean` | `false` | Show both filter inputs; matching is a contains check on `label`. |
| source-filter-placeholder | `string \| undefined` | `undefined` | Source filter placeholder; falls back to `请搜索` when omitted. |
| target-filter-placeholder | `string \| undefined` | `undefined` | Target filter placeholder; falls back to `请搜索` when omitted. |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Row height and control scale. |
| disabled | `boolean` | `false` | Disable every control (selection / move buttons / search). |
| source-title | `string \| undefined` | `undefined` | Source panel title; falls back to `源` when omitted. |
| target-title | `string \| undefined` | `undefined` | Target panel title; falls back to `目标` when omitted. |
| render-source-label | `(data: { option }) => VNodeChild` | `undefined` | Source row renderer; renders `option.label` when omitted. |
| render-target-label | `(data: { option }) => VNodeChild` | `undefined` | Target row renderer; renders `option.label` when omitted. |

### Events

| Name | Payload | Notes |
| --- | --- | --- |
| update:value | `(value: Array<string \| number>)` | Selected values committed by a move operation, in target-panel order. |

### Slots

None. Row customization goes through the `render-source-label` /
`render-target-label` render-function props.

### Methods

None. The component exposes no instance methods through `defineExpose`.

Behavior notes:

- Target panel order follows the `value` array order; values missing from
  `options` are skipped.
- Move buttons, top to bottom: move selected right, move all right, move
  selected left, move all left.
- Per-row checkbox state is internal and is not exposed via events.
- Override the list height via `--sn-transfer-list-height` (default 200px).

## Tokens

| Token | CSS variable | Purpose |
| --- | --- | --- |
| Border default | `--sn-web-color-border-default` | Panel outline |
| Border subtle | `--sn-web-color-border-subtle` | Header divider |
| Background surface | `--sn-web-color-background-surface` | List panel fill |
| Background subtle | `--sn-web-color-background-subtle` | Header fill and row hover |
| Text primary | `--sn-web-color-text-primary` | Panel titles and row text |
| Text tertiary | `--sn-web-color-text-tertiary` | Selected counts |
| Text disabled | `--sn-web-color-text-disabled` | Disabled row text |
| Input radius | `--sn-web-input-radius` | Panel radius (3px fallback) |
| Button height small | `--sn-web-button-height-small` | Row height for `size="small"` |
| Button height medium | `--sn-web-button-height-medium` | Row height for `size="medium"` |
| Button height large | `--sn-web-button-height-large` | Row height for `size="large"` |
| List height | `--sn-transfer-list-height` | Panel list height (default 200px) |

## Accessibility

- Both list panels carry `role="listbox"` and `aria-multiselectable="true"`,
  named after their panel title.
- Each row carries `role="option"` plus `aria-selected` and `aria-disabled`,
  updated as selection and disabled state change.
- The header checkbox is labelled `全选 <panel title>` and is disabled when
  there is nothing movable; it shows the mixed state when partially checked.
- The four move buttons are labelled `右移选中项` / `全部右移` / `左移选中项` /
  `全部左移` and are dimmed when inapplicable.
- Rows use native `checkbox` elements and toggle on row click, so Tab focus plus
  Space works; the filter inputs are labelled `过滤源列表` / `过滤目标列表`.

## AI Patch Boundary

| Safe for AI to generate | Requires human review |
| --- | --- |
| `options` data and static combinations with `value` | Commit / rollback logic inside `update:value` listeners |
| `source-title` / `target-title` / the two filter placeholders | How a controlled `v-model:value` couples with form validation and submit timing |
| Display switches `filterable` / `size` / `disabled` | Interactive controls and async data inside custom row renderers |
| Static composition used in docs and demos | Permission changes and batch API calls triggered by a move |

- AI-generated JSON Patches may only modify the prop data surface above and must
  not touch internal checkbox state, inject event handlers or slots.
- `value` must be a subset of the values present in `options`; patches that add
  `options` must keep `value` consistent.
- Options with `disabled: true` must not be patched into `value`.

See the component `ai-description.md` for the full contract.
