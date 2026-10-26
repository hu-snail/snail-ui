# List · Web

Generic list container with header / rows / footer areas and prefix /
suffix slots inside each row.

## When to use

- Message feeds, settings rows, notifications
- Divider, hover highlight, click cursor list variants
- Unified list header / footer areas

## Examples

### Basic

<Demo name="list-web-basic" description="header / footer + prefix / suffix slots." />

### Hoverable & clickable

<Demo name="list-web-hoverable" description="hoverable highlight + clickable pointer cursor." />

### Border & dividers

<Demo name="list-web-border" description="bordered outline; show-divider turns row dividers off." />

## API

### SnList Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Size marker (modifier class) |
| bordered | `boolean` | `false` | Outer border (rows padded 12px 20px) |
| clickable | `boolean` | `false` | Pointer cursor on rows |
| hoverable | `boolean` | `false` | Hover highlight on rows |
| show-divider | `boolean` | `true` | 1px dividers between rows |

### SnList Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | `SnListItem` rows |
| header | `()` | Header area |
| footer | `()` | Footer area |

### SnListItem Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | Row main content |
| prefix | `()` | Row leading content |
| suffix | `()` | Row trailing content |

An item used outside a list degrades to a standalone row (divider on).

See the component `ai-description.md` for the full contract.
