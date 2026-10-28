# Pagination · Web

The pagination bar splits long lists and table results into pages and owns
ellipsis collapsing, the quick page jumper, the per-page-size picker and the
compact simple mode.

## When to use

- Data exceeds a single screen and must be paged.
- The total result count must be stated (`show-total`) or the user must be
  able to jump straight to a page (`show-quick-jumper`).
- The page size should be switchable while the page-count semantics stay
  correct (`show-size-picker` + `page-sizes`).
- Toolbar space is tight and only prev / next plus the current-page input
  should remain (`simple`).

## Examples

### Basic

The baseline controlled form: `v-model:page` binds the current page,
`item-count` derives the page count, `show-total` renders `共 N 条`, and
`show-quick-jumper` opens the jump input (Enter / blur commits and clamps
out-of-range values into the legal range).

<Demo name="pagination-web-basic" description="v-model:page + item-count derived page count + show-total + show-quick-jumper." />

### Quick jumper and page size

The jump input and the size picker used together: they emit `update:page`
and `update:page-size` respectively, and the host renders the written-back
values below to prove the controlled round trip. After a size change the
page count is re-derived from `item-count / page-size`.

<Demo name="pagination-web-jumper" description="show-quick-jumper + show-size-picker, with live page and page-size readout." />

### Page-size options and item-count coupling

`page-sizes` uses the `{ label, value }` form for custom option labels
(10 / 20 / 50 / 100); when the host swaps the total item count it also resets
the page to 1, and the page always stays inside the range derived from the
page count.

<Demo name="pagination-web-pagesize" description="label/value page-sizes plus a page converging when the data set changes." />

### Ellipsis collapsing, simple mode and the label slot

Three side-by-side forms: when the page count exceeds `page-slot` the bar
collapses into first / current-neighborhood / last + ellipsis; `simple`
collapses everything into one row (prev / page input / page count / next);
the `label` slot customizes the text inside each page button.

<Demo name="pagination-web-picker-simple" description="Ellipsis collapsing, simple mode and the label slot side by side." />

### Ellipsis collapsing and disabled state

The effect of `page-slot` side by side: with the default 9 all eight pages are
laid out flat, narrowing it to 5 keeps the first and last while collapsing the
middle into an ellipsis; once `disabled` is set the pages, the jump input and
the size picker all become inoperable and no longer emit events.

<Demo name="pagination-web-disabled" description="page-slot ellipsis collapsing versus the fully disabled state." />

### Quick switch (ellipsis jump)

Clicking an ellipsis `…` opens a panel listing the pages hidden in that gap
(scrollable, current page highlighted) for one-click jumps; prev / next
render as bordered buttons.

<Demo name="pagination-web-quick-switch" description="Ellipsis quick-switch panel + bordered arrows for long page lists." />

## API

### Props

| Name              | Type                                                | Default            | Notes                                                                                                                          |
| ----------------- | --------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| page              | `number \| undefined`                               | `undefined`        | Current page. `undefined` means uncontrolled mode, seeded by `default-page`; out-of-range values clamp into `[1, page count]`. |
| item-count        | `number`                                            | `0`                | Total item count, used to derive the page count when `page-count` is not given.                                                |
| page-size         | `number \| null \| undefined`                       | `undefined`        | Page size. `undefined` / `null` falls back to internal state (seeded by `default-page-size`).                                  |
| default-page      | `number`                                            | `1`                | Initial page for uncontrolled mode.                                                                                            |
| default-page-size | `number`                                            | `10`               | Initial page size for uncontrolled mode.                                                                                       |
| page-count        | `number`                                            | `undefined`        | Explicit page count; wins over the `item-count / page-size` derivation.                                                        |
| page-sizes        | `Array<number \| { label: string; value: number }>` | `[10, 20, 30, 40]` | Size-picker options; plain numbers render as `N / 页`.                                                                         |
| show-quick-jumper | `boolean`                                           | `false`            | Render the `跳至` input; commits on Enter / blur, not rendered in simple mode.                                                 |
| show-size-picker  | `boolean`                                           | `false`            | Render the per-page-size select.                                                                                               |
| page-slot         | `number`                                            | `9`                | Maximum number of page buttons; more pages collapse into ellipsis.                                                             |
| show-total        | `boolean`                                           | `false`            | Render `共 N 条`.                                                                                                              |
| simple            | `boolean`                                           | `false`            | Compact mode: prev / page input / page count / next — no page list and no jump input.                                          |
| quick-switch      | `boolean`                                           | `true`             | Quick switch: clicking an ellipsis opens a panel of the hidden pages for one-click jumps; `false` restores the static marker.  |
| disabled          | `boolean`                                           | `false`            | Disable every control; interactions while disabled emit no events.                                                             |

### Events

| Name             | Payload              | Notes                                                         |
| ---------------- | -------------------- | ------------------------------------------------------------- |
| update:page      | `(page: number)`     | Page committed (page click / jump input / simple-mode input). |
| update:page-size | `(pageSize: number)` | Page size committed (size-picker select).                     |

### Slots

| Name   | Params             | Notes                                                            |
| ------ | ------------------ | ---------------------------------------------------------------- |
| prev   | —                  | Prev-button content, replacing the default left chevron.         |
| next   | —                  | Next-button content, replacing the default right chevron.        |
| prefix | —                  | Content before the pager.                                        |
| suffix | —                  | Content after the pager.                                         |
| label  | `{ page: number }` | Text inside a page button; ellipsis markers never go through it. |

### Methods

None. The component exposes no instance methods through `defineExpose`; every
interaction goes through props and events.

Behavior notes:

- **Quick switch**: clicking an ellipsis opens a scrollable panel of the pages
  hidden in that gap (current page highlighted) for one-click jumps;
  `quick-switch: false` restores the static `aria-hidden` marker.
- Prev / next arrows render as bordered buttons (primary border on hover)
  while page numbers stay borderless; both are flex-centred.
- With `page` / `page-size` controlled the component only reports events and
  never writes the value itself.
- In simple mode `show-quick-jumper` has no effect; `show-total` still renders
  to the left of the pager.

## Tokens

| Token               | CSS variable                    | Purpose                                                           |
| ------------------- | ------------------------------- | ----------------------------------------------------------------- |
| Text secondary      | `--sn-web-color-text-secondary` | Default page numbers / ellipsis                                   |
| Text tertiary       | `--sn-web-color-text-tertiary`  | Total / jumper label / page count                                 |
| Action primary      | `--sn-web-color-action-primary` | Active page tint (16% primary fill + primary text)                |
| Button height small | `--sn-web-button-height-small`  | Minimum width / height of page items and ellipsis (28px fallback) |

## Accessibility

- The root carries `role="navigation"` and `aria-label="Pagination"`.
- The active page button carries `aria-current="page"` and the accessible name
  `第 N 页`.
- Prev / next buttons are labelled `上一页` / `下一页`; the jump input carries a
  descriptive `aria-label`, and the simple-mode input carries
  `当前页码，共 N 页`.
- Pages and prev / next use native `button` elements, the jump and simple
  inputs use native `input` elements, so keyboard operation works directly;
  `disabled` is synced to the native attribute.
- Ellipsis markers are decorative (`aria-hidden`) and are not announced.

## AI Patch Boundary

| Safe for AI to generate                                                             | Requires human review                                                                             |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Data-surface bindings such as `page` / `page-size` / `page-count` / `item-count`    | How a controlled `v-model:page` is synced with the host data source (when the list is re-fetched) |
| Display switches `show-total` / `show-quick-jumper` / `show-size-picker` / `simple` | Whether the page is reset to 1 after a page-size change                                           |
| `page-sizes` option labels and a static `page-slot` value                           | Slot content (`label` / `prefix` / `suffix`) and event handlers                                   |
| Static composition used in docs and demos                                           | Data requests triggered by paging                                                                 |

- AI-generated JSON Patches may only modify the prop data surface above and
  must not inject event handlers, slot content or internal state.
- When both `page-count` and `item-count` appear, `page-count` wins — keep the
  two semantically consistent when patching.

See the component `ai-description.md` for the full contract.
