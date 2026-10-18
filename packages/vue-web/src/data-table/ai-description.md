# SnDataTable — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end data table.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A feature-rich data table (AUI-WEB-DD-004): columns-driven rendering with
sorting, multi/single filtering, row selection (checkbox / radio), expand
rows, index columns, summary rows, fixed (sticky) columns, horizontal
scroll + sticky header, striped/bordered/size variants, loading state,
empty state and a simplified built-in pagination bar. For plain markup
tables use `SnTable`.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-data-table`
(https://www.naiveui.com/zh-CN/light/components/data-table,
src/data-table/src/{DataTable.tsx,use-table-data.ts,use-sorter.ts,use-check.ts,
styles/index.cssr.ts}).

## Import

```ts
import SnDataTable from '@snui/vue-web/src/data-table/SnDataTable.vue'
import type {
  DataTableColumn,
  DataTableColumns,
  DataTablePagination,
  DataTableRowData,
  DataTableRowKey,
  DataTableSortState,
  DataTableFilterState,
  DataTableCreateSummary,
} from '@snui/vue-web/src/data-table/sn-data-table-types'
// or
import { SnDataTable } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `columns` | `DataTableColumns` | `[]` | no | Column list (base / selection / expand / index). |
| `data` | `DataTableRowData[]` | `[]` | no | Row records. |
| `rowKey` | `(row) => DataTableRowKey` | — | no | Row key resolver (falls back to `row.key`). |
| `rowProps` | `(row, index) => HTMLAttributes` | — | no | Extra tr attributes. |
| `rowClassName` | `string \| (row, index) => string` | — | no | tr class. |
| `striped` | `boolean` | `false` | no | Zebra stripes on odd page rows. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Table scale (padding 8/12/12 px). |
| `bordered` | `boolean` | `true` | no | Outer frame border. |
| `bottomBordered` | `boolean` | `true` | no | Last-row bottom border; ineffective while bordered. |
| `singleLine` | `boolean` | `true` | no | Hide column separators. |
| `singleColumn` | `boolean` | `false` | no | Hide row separators. |
| `loading` | `boolean` | `false` | no | Dim body + centered spinner; blocks checking/paging. |
| `scrollX` | `number \| string` | — | no | Inner table min-width → horizontal scroll. |
| `maxHeight` | `number \| string` | — | no | Scroll container max-height → sticky header + fixed layout. |
| `summary` | `DataTableCreateSummary` | — | no | Summary rows (`value` + `colSpan`). |
| `summaryPlacement` | `'top' \| 'bottom'` | `'bottom'` | no | Summary position. |
| `checkedRowKeys` | `DataTableRowKey[]` | — | no | Checked keys (v-model:checked-row-keys). |
| `defaultCheckedRowKeys` | `DataTableRowKey[]` | `[]` | no | Uncontrolled initial checked keys. |
| `expandedRowKeys` | `DataTableRowKey[]` | — | no | Expanded keys (v-model:expanded-row-keys). |
| `defaultExpandedRowKeys` | `DataTableRowKey[]` | `[]` | no | Uncontrolled initial expanded keys. |
| `pagination` | `false \| DataTablePagination` | `false` | no | false disables; object renders the simplified bar. |

### Column contract (DataTableColumn)

Base column: `key` (required), `title` (string | render fn), `align`,
`titleAlign`, `width` / `minWidth` / `maxWidth`, `fixed` (`'left' | 'right'`,
sticky), `sorter` (`'default' | fn | true`), `defaultSortOrder`,
`sortOrder` (controlled), `filter` (`'default' | fn | true`),
`filterOptions`, `filterMultiple`, `filterMode` (`'or' | 'and'`),
`filterOptionValues` / `filterOptionValue` (controlled),
`defaultFilterOptionValues` / `defaultFilterOptionValue`, `ellipsis`,
`render(row, rowIndex)`, `className`.

Special columns: `{ type: 'selection', multiple?, disabled?(row) }`,
`{ type: 'expand', renderExpand(row, index), expandable?(row) }`,
`{ type: 'index', title? }` (task-spec extension; naive renders index via
`render`).

## Events

| Name | Parameters | Description |
|---|---|---|
| `update:checkedRowKeys` | `(keys, rows, { row, action })` | Selection changed; action ∈ check / uncheck / checkAll / uncheckAll. |
| `update:expandedRowKeys` | `(keys)` | Expand state changed. |
| `update:filters` | `(filters, column)` | Filter state committed. |
| `update:sorter` | `(DataTableSortState \| null)` | Header sort click; order cycles descend → ascend → false. |
| `update:page` | `(page)` | Pagination page changed. |
| `update:pageSize` | `(pageSize)` | Pagination size changed. |

## Slots

| Name | Description |
|---|---|
| `empty` | Replaces the default 无数据 empty state (inline svg + text). |

## Divergences from the reference API

- One scroll container + `position: sticky` thead instead of naive's
  dual-table header/body scroll sync; no colgroup (widths go on th/td).
- Sorter glyph is naive's single rotating arrow (ascend rotates -180deg).
- Filter menu is an inline absolute panel (outside click closes); single
  mode commits on option click, multiple mode commits on 确认 / 重置.
  Filter state shape follows `filterMultiple` (no legacy `shouldUseArray`
  compat).
- Built-in pagination is a simplified bar (page window + prev/next + native
  select size picker + total prefix). SnPagination is a future marker
  (AUI-WEB-DATA-008).
- `summary` renders `value` + `colSpan`; `rowSpan` is type-accepted only.
- `type: 'index'` is a task-spec extension (naive has no index type).
- `get-checkbox-props` is not implemented (not a naive prop); use the
  selection column's `disabled(row)`.
- Row checkbox clicks stop propagation (naive lets them reach rowProps
  onClick).
- ellipsis uses a native `title` attribute (no tooltip float).

## Deferred (future markers)

virtual-scroll, flex-height, resizable columns, column drag sort, tree
data (childrenKey / indent / cascade), ellipsis tooltip float, remote
data, default-expand-all, loading slot, render-cell / render-expand-icon /
render-filter-menu hooks, CSV export, exposed methods
(sort / filter / page / scrollTo / clearSorter / clearFilters).

## Accessibility

- Real `<table>` semantics; header checkbox and row checkboxes are
  `role="checkbox"` with `aria-checked` (`mixed` when indeterminate) and
  Enter/Space toggle; expand trigger is `role="button"` with
  `aria-expanded`; loading state exposes `role="status"`; pagination
  arrows have aria-labels, active page sets `aria-current="page"`.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Border subtle / default | `--sn-web-color-border-*` | Grid lines, checkbox / pagination borders |
| Background surface / subtle / elevated | `--sn-web-color-background-*` | td / th / filter-menu surfaces; hover / striped / sorting via color-mix |
| Text primary / secondary / tertiary / on-primary | `--sn-web-color-text-*` | th / td / icons / checkbox glyph |
| Action primary (+hover) | `--sn-web-color-action-primary(-hover)` | Active sort/filter icons, checked box, pagination active, spinner |
| Focus ring | `--sn-web-focus-ring` | Checkbox / expand trigger focus outline |
| Card shadow | `--sn-web-card-shadow` | Filter menu elevation |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-004.
