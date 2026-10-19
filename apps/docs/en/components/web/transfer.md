# Transfer · Web

Shuttle list: the left panel holds unselected items (source), the right
panel holds selected items (target), with check-all headers, four move
buttons and per-panel filtering.

## When to use

- Batch-picking from a candidate set (permissions, departments, fields).
- One-shot full migration (single chevron moves checked items, double
  chevron moves all movable items).
- Larger candidate sets that need per-panel search (`filterable`).
- Some entries are read-only and must not move (option-level `disabled`).

## Examples

### Basic

`v-model:value` binds the selected values; the header checkboxes support
select-all and the indeterminate state; single chevrons move checked
items, double chevrons move everything movable.

<Demo name="transfer-web-basic" description="v-model:value two-panel shuttle with a selected readout." />

### Filtering / disabled options / custom rows

`filterable` shows a search input on both sides (placeholders are
independently configurable); `disabled` options cannot be checked or
moved; `renderSourceLabel` / `renderTargetLabel` customize row content.

<Demo name="transfer-web-filter" description="filterable search + sourceTitle / targetTitle + disabled option + renderSourceLabel." />

## API

### SnTransfer Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| options | `Array<{ label: string; value: string \| number; disabled?: boolean }>` | `[]` | Transferable entries |
| value | `Array<string \| number> \| undefined` | `undefined` | Selected values (controlled); internal state when omitted |
| default-value | `Array<string \| number>` | `[]` | Initial selection for uncontrolled mode |
| filterable | `boolean` | `false` | Show both filter inputs |
| source-filter-placeholder | `string \| undefined` | `undefined` | Source filter placeholder (falls back to 请搜索) |
| target-filter-placeholder | `string \| undefined` | `undefined` | Target filter placeholder (falls back to 请搜索) |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Row / button scale |
| disabled | `boolean` | `false` | Disable every control |
| source-title | `string \| undefined` | `undefined` | Source panel title (falls back to 源) |
| target-title | `string \| undefined` | `undefined` | Target panel title (falls back to 目标) |
| render-source-label | `({ option }) => VNodeChild \| undefined` | `undefined` | Custom source row renderer |
| render-target-label | `({ option }) => VNodeChild \| undefined` | `undefined` | Custom target row renderer |

### SnTransfer Events

| Event | Payload | Notes |
| --- | --- | --- |
| update:value | `(value: Array<string \| number>)` | Selected values committed by a move operation |

### SnTransfer Slots

None. Row customization goes through the `renderSourceLabel` /
`renderTargetLabel` render-function props.

Behavior notes:

- Target panel order follows the `value` array order.
- Move buttons, top to bottom: move selected right, move all right,
  move selected left, move all left.
- Per-row checkbox state is internal and is not exposed via events.
- Override the list height via `--sn-transfer-list-height`
  (default 200px).

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-border-default` / `-subtle` | Panel border / header divider |
| `--sn-web-color-background-surface` / `-subtle` | Panel + header / row hover |
| `--sn-web-color-text-primary` / `-tertiary` / `-disabled` | Row text / counts / disabled text |
| `--sn-web-input-radius` | Panel radius |
| `--sn-web-button-height-small` / `-medium` / `-large` | Row heights per size |
| `--sn-transfer-list-height` | List height (overridable, default 200px) |

## Accessibility

| Attribute | Notes |
| --- | --- |
| `role="listbox"` + `aria-multiselectable="true"` | Both list containers |
| `role="option"` + `aria-selected` / `aria-disabled` | Row semantics, updated with selection |
| Header checkboxes | Mixed state when partially checked; disabled on empty lists |
| Move-button `aria-label` | Right/selected, right/all, left/selected, left/all; disabled when inapplicable |
| Native checkboxes | Rows toggle on click; Tab + Space keyboard operable |

## AI Patch Boundary

- AI-generated JSON Patches may only modify the prop data surface above
  (e.g. `value`, `options`, `sourceTitle`).
- Patches must not touch internal checkbox state, inject event handlers
  or slots.
- `value` must be a subset of the values present in `options`; patches
  that add `options` must keep `value` consistent.
- Options with `disabled: true` must not be patched into `value`.

See the component `ai-description.md` for the full contract.
