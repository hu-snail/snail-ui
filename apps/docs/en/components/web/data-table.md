# DataTable · Web

Data table (n-data-table aligned). Columns-driven rendering with sorting,
filtering, row selection (multi/single), expand rows, index columns,
summary rows, fixed (sticky) columns, horizontal scroll + sticky header,
loading / empty states and a simplified built-in pagination bar.

## When to Use

- Large structured datasets rendered from column definitions;
- In-table sort / filter / selection / expand interactions;
- Summary (totals) rows or fixed columns with horizontal scrolling.

## Basic

<Demo name="data-table-web-basic" description="columns + data + render cell." />

## Empty

<Demo name="data-table-web-empty" description="Default empty state + empty slot." />

## Border

<Demo name="data-table-web-border" description="bordered / single-line / single-column / bottom-bordered." />

## Size

<Demo name="data-table-web-size" description="small / medium / large." />

## Striped

<Demo name="data-table-web-striped" description="Zebra stripes on odd page rows." />

## Loading

<Demo name="data-table-web-loading" description="Loading mask + inline SVG spinner." />

## Row Props

<Demo name="data-table-web-row-props" description="rowProps events + rowClassName styling." />

## Filter & Sorter

<Demo name="data-table-web-filter-and-sorter" description="Uncontrolled sorter + filter (defaultSortOrder / sorter / filter)." />

### Remote-style Sorter

<Demo name="data-table-web-custom-sorter" description="sorter=true renders the icon only; sorting is remote." />

### Controlled Sorter

<Demo name="data-table-web-controlled-sorter" description="column.sortOrder controlled + update:sorter." />

### Controlled Filter

<Demo name="data-table-web-controlled-filter" description="filterOptionValues controlled + update:filters." />

## Selection

<Demo name="data-table-web-select" description="Multi-select + disabled rows + check-all / indeterminate." />

### Single Selection

<Demo name="data-table-web-select-single" description="Radio-like selection (multiple: false), no header check-all." />

## Expand

<Demo name="data-table-web-expand" description="type: expand + renderExpand + default-expanded-row-keys." />

## Summary

<Demo name="data-table-web-summary" description="summary returns value + colSpan." />

## Fixed Header

<Demo name="data-table-web-fixed-header" description="max-height scroll container + sticky header." />

## Fixed Columns

<Demo name="data-table-web-fixed-header-column" description="scroll-x + fixed left/right sticky columns." />

## Render Header

<Demo name="data-table-web-render-header" description="title as a render function." />

## Render Cell

<Demo name="data-table-web-render-cell" description="render returning VNodes." />

## Custom Column Style

<Demo name="data-table-web-custom-style" description="column.className cell styling." />

## Ellipsis

<Demo name="data-table-web-ellipsis" description="ellipsis + native title fallback." />

## Scroll X

<Demo name="data-table-web-scroll-x" description="scroll-x sets the content min-width." />

## Controlled Pagination

<Demo name="data-table-web-controlled-page" description="page / page-size controlled + size picker." />

## API

### SnDataTable Props

| Prop                      | Type                                       | Default    | Notes                                               |
| ------------------------- | ------------------------------------------ | ---------- | --------------------------------------------------- |
| columns                   | `DataTableColumn[]`                        | `[]`       | Column list (base / selection / expand / index)     |
| data                      | `object[]`                                 | `[]`       | Row records                                         |
| row-key                   | `(row) => string \| number`                | —          | Row key resolver (falls back to `row.key`)          |
| row-props                 | `(row, index) => HTMLAttributes`           | —          | Extra tr attributes                                 |
| row-class-name            | `string \| (row, index) => string`         | —          | tr class                                            |
| striped                   | `boolean`                                  | `false`    | Zebra stripes                                       |
| size                      | `'small' \| 'medium' \| 'large'`           | `'medium'` | Scale (th/td padding 8/12/12px)                     |
| bordered                  | `boolean`                                  | `true`     | Outer frame border                                  |
| bottom-bordered           | `boolean`                                  | `true`     | Last-row bottom border (ineffective while bordered) |
| single-line               | `boolean`                                  | `true`     | Hide column separators                              |
| single-column             | `boolean`                                  | `false`    | Hide row separators                                 |
| loading                   | `boolean`                                  | `false`    | Loading mask (blocks checking / paging)             |
| scroll-x                  | `number \| string`                         | —          | Inner table min-width (horizontal scroll)           |
| max-height                | `number \| string`                         | —          | Body max-height (sticky header, fixed layout)       |
| summary                   | `(pageData) => SummaryRow \| SummaryRow[]` | —          | Summary rows (value + colSpan)                      |
| summary-placement         | `'top' \| 'bottom'`                        | `'bottom'` | Summary position                                    |
| checked-row-keys          | `Array<string \| number>`                  | —          | Checked keys (v-model:checked-row-keys)             |
| default-checked-row-keys  | `Array<string \| number>`                  | `[]`       | Uncontrolled initial checked keys                   |
| expanded-row-keys         | `Array<string \| number>`                  | —          | Expanded keys (v-model:expanded-row-keys)           |
| default-expanded-row-keys | `Array<string \| number>`                  | `[]`       | Uncontrolled initial expanded keys                  |
| pagination                | `false \| object`                          | `false`    | Simplified pagination config (see below)            |

### DataTableColumn

Base column: `key` (required), `title` (string | render fn), `align` /
`titleAlign`, `width` / `minWidth` / `maxWidth`, `fixed` (`'left' | 'right'`,
sticky), `sorter` (`'default' | fn | true`), `defaultSortOrder`,
`sortOrder` (controlled), `filter` (`'default' | fn | true`),
`filterOptions`, `filterMultiple` (default `true`), `filterMode`
(`'or' | 'and'`), `filterOptionValues` / `filterOptionValue` (controlled),
`defaultFilterOptionValues` / `defaultFilterOptionValue`, `ellipsis`,
`render(row, rowIndex)`, `className`.

Special columns: `{ type: 'selection', multiple?, disabled?(row) }`,
`{ type: 'expand', renderExpand(row, index), expandable?(row) }`,
`{ type: 'index', title? }` (sn extension; naive renders index via render).

### DataTablePagination

`page` / `defaultPage` / `pageSize` / `defaultPageSize` / `itemCount` /
`pageCount` / `showSizePicker` / `pageSizes` / `onChange(page)` /
`onUpdatePageSize(pageSize)`. The built-in bar is a simplified
implementation (page window + prev/next + native select size picker +
total prefix); SnPagination is a future marker (AUI-WEB-DATA-008).

### Events

| Event                    | Parameters                      | Notes                                            |
| ------------------------ | ------------------------------- | ------------------------------------------------ |
| update:checked-row-keys  | `(keys, rows, { row, action })` | action ∈ check / uncheck / checkAll / uncheckAll |
| update:expanded-row-keys | `(keys)`                        | Expand changed                                   |
| update:filters           | `(filters, column)`             | Filter committed                                 |
| update:sorter            | `(DataTableSortState \| null)`  | Header click cycles descend → ascend → false     |
| update:page              | `(page)`                        | Page changed                                     |
| update:page-size         | `(pageSize)`                    | Page size changed                                |

### Slots

| Name  | Notes                            |
| ----- | -------------------------------- |
| empty | Replaces the default empty state |

See the component `ai-description.md` for the full contract.

## Known Divergences / Deferred

Single scroll container + sticky thead (not naive's dual-table sync);
inline filter panel closed by outside click; ellipsis via native title.
Deferred: virtual-scroll, flex-height, resizable columns, tree data,
ellipsis tooltip float, remote data, CSV export, exposed methods
(sort / filter / page / ...).
