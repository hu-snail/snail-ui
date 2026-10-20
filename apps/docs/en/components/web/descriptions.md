# Descriptions · Web

Grouped key/value detail list in a grid, with column control, entry
spans and an optional bordered outline.

## When to use

- Detail panels and order summaries with grouped read-only fields
- Controlling total columns and per-entry spans
- Bordered grid for multi-line readability

## Examples

### Basic

<Demo name="descriptions-web-basic" description="Three columns by default, labels above content." />

### Columns

<Demo name="descriptions-web-columns" description="column sets the total grid columns (1 / 2 / 3)." />

### Span

<Demo name="descriptions-web-span" description="SnDescriptionsItem span widens an entry across columns." />

### Label placement

<Demo name="descriptions-web-placement" description="label-placement: top (default) / left." />

### Bordered

<Demo name="descriptions-web-bordered" description="bordered outline grid, combinable with label-placement / label-align." />

### Size

<Demo name="descriptions-web-size" description="size: small / medium / large." />

## API

### SnDescriptions Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| title | `string` | `undefined` | Title above the table; `header` slot overrides |
| column | `number` | `3` | Total grid columns |
| label-placement | `'left' \| 'top'` | `'top'` | Label position relative to content |
| label-align | `'left' \| 'right' \| 'center'` | `'left'` | Label alignment |
| separator | `string` | `':'` | Inline separator (left + non-bordered only) |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Font scale + cell padding |
| bordered | `boolean` | `false` | Bordered grid |
| label-class | `string` | `undefined` | Class on all label cells/spans |
| label-style | `string \| CSSProperties` | `undefined` | Style on all label cells/spans |
| content-class | `string` | `undefined` | Class on all content cells/spans |
| content-style | `string \| CSSProperties` | `undefined` | Style on all content cells/spans |

### SnDescriptions Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | `SnDescriptionsItem` entries |
| header | `()` | Header content, overrides `title` |

### SnDescriptionsItem Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| label | `string` | `undefined` | Label text; `label` slot overrides |
| span | `number` | `1` | Columns this entry occupies |
| label-class | `string` | `undefined` | Entry label class |
| label-style | `string \| CSSProperties` | `undefined` | Entry label style |
| content-class | `string` | `undefined` | Entry content class |
| content-style | `string \| CSSProperties` | `undefined` | Entry content style |

### SnDescriptionsItem Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | Entry content |
| label | `()` | Entry label, overrides `label` |

Layout: the grid expands over `column * 2` physical tracks; each row's
last entry stretches to fill the remaining tracks.

Cell padding matches the naive-ui reference 1:1: the label cell is
`0 12px 8px 0`, the content cell `0 0 12px 0` (small / large only change the
vertical rhythm); the bordered grid uses `12px 16px` (`8px 12px` small /
`16px 24px` large).

Style isolation: the component renders a real `<table>` / `<th>` / `<td>`, so
a host page's global table styles (the docs site's
`.vp-doc th { background-color }`, `.vp-doc th, .vp-doc td { border-top }`,
`.vp-doc table { border; border-radius }`) hit it too. Every table / row / cell
rule is scoped under the component root class so it always outranks the host —
which is why it no longer renders as a tinted, framed table inside the docs
site.

See the component `ai-description.md` for the full contract.
