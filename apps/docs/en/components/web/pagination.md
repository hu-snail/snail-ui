# Pagination · Web

Pagination bar: splits long lists / table results into pages, with
ellipsis collapsing, a quick page jumper, a per-page-size picker and a
compact simple mode.

## When to use

- Data exceeds one screen and needs batching.
- The total count needs to be shown (`showTotal`) or the user should be
  able to jump straight to a page (`showQuickJumper`).
- Users need to change the page size (`showSizePicker` + `pageSizes`).
- Toolbar space is tight — use `simple` to keep only prev / next plus
  the current-page input.

## Examples

### Basic

`v-model:page` controls the current page, `showTotal` renders the total,
`showQuickJumper` opens the jump input (Enter commits).

<Demo name="pagination-web-basic" description="v-model:page + showTotal + showQuickJumper." />

### Size picker / ellipsis / simple mode

When pages exceed `pageSlot` (default 9) the bar collapses into
first / current-neighborhood / last + ellipsis; `showSizePicker` switches
the page size; `simple` collapses to one row; the `label` slot
customizes page-number content.

<Demo name="pagination-web-picker-simple" description="showSizePicker + pageSizes, pageSlot ellipsis, simple mode, label slot." />

## API

### SnPagination Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| page | `number \| undefined` | `undefined` | Current page (controlled); internal state when omitted |
| item-count | `number` | `0` | Total item count used to derive the page count |
| page-size | `number \| null \| undefined` | `undefined` | Page size (controlled); internal state when omitted |
| default-page | `number` | `1` | Initial page for uncontrolled mode |
| default-page-size | `number` | `10` | Initial page size for uncontrolled mode |
| page-count | `number \| undefined` | `undefined` | Explicit page count; wins over `itemCount / pageSize` |
| page-sizes | `Array<number \| { label: string; value: number }>` | `[10, 20, 30, 40]` | Size-picker options; plain numbers render as `N / 页` |
| show-quick-jumper | `boolean` | `false` | Jump-to-page input; commits on Enter / blur |
| show-size-picker | `boolean` | `false` | Page-size select (built on SnSelect) |
| page-slot | `number` | `9` | Max page buttons before ellipsis collapsing |
| show-total | `boolean` | `false` | Show `共 N 条` |
| simple | `boolean` | `false` | Compact: prev / page input / count / next |
| disabled | `boolean` | `false` | Disable every control |

### SnPagination Events

| Event | Payload | Notes |
| --- | --- | --- |
| update:page | `(page: number)` | Page committed (click / jumper / simple input) |
| update:page-size | `(pageSize: number)` | Page size committed |

### SnPagination Slots

| Slot | Params | Notes |
| --- | --- | --- |
| prev | — | Custom prev-button content (default chevron icon) |
| next | — | Custom next-button content |
| prefix | — | Content before the pager |
| suffix | — | Content after the pager |
| label | `{ page: number }` | Custom page-number label |

Ellipsis markers are static indicators (`aria-hidden`) — no
hover-to-jump fast-forward / fast-backward.

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-text-secondary` | Base text / ellipsis |
| `--sn-web-color-text-tertiary` | Total / jumper label / page count |
| `--sn-web-color-action-primary` | Active page tint (16%) + text |
| `--sn-web-button-height-small` | Item height (28px fallback) |

## Accessibility

| Attribute | Notes |
| --- | --- |
| `role="navigation"` + `aria-label="Pagination"` | Root semantics |
| `aria-current="page"` | Active page button |
| `aria-label` 第 N 页 / 上一页 / 下一页 | Button accessible names |
| Native `button` / `input` | Keyboard operable; `disabled` syncs the native attribute |

## AI Patch Boundary

- AI-generated JSON Patches may only modify the prop data surface above
  (e.g. `page`, `pageSize`, `showTotal`).
- Patches must not inject event handlers, slot content or internal state.
- With `page` / `pageSize` controlled, the component only reports
  events; patches must update the host data source accordingly.
- When both `pageCount` and `itemCount` appear, `pageCount` wins — keep
  the two semantically consistent when patching.

See the component `ai-description.md` for the full contract.
