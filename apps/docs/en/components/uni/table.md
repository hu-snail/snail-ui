# Table · uni-app

`sn-table` is the data table of `@snui/uni` (mobile / miniprogram / H5): header, borders, zebra stripes, an ordinal index column, sortable headers and a left-pinned column. Auto-registered through easycom (`components/sn-table/sn-table.vue` → `<sn-table>`, `sn-table-column.vue` → `<sn-table-column>`); geometry uses `rpx`.

Horizontal scrolling is a `<scroll-view scroll-x>`; pass `height` to turn on vertical scrolling and `fixed-header` to pin the header while it scrolls. Columns are declared as `sn-table-column` children and collected by the container through provide/inject, so **column order is DOM order**.

## Basic usage

`data` is the row array; columns are declared by each `sn-table-column`'s `prop` / `label`. `index` adds the ordinal column, `sortable` makes a header tappable (`none → asc → desc`), and the component **never reorders `data`** — it reports the order through `sort-method` and the host sorts its own rows.

<Demo name="table-mp-basic" description="Index column, sortable header, fixed height / pinned header / left-pinned column." />

## Cells and empty state

- `ellipsis` clamps cell text to two lines
- The `value` slot fully replaces a cell's content and receives `{ row, index }`
- With no rows the built-in "暂无数据" row renders; the `empty` slot replaces it
- `border` / `stripe` control borders and zebra stripes

<Demo name="table-mp-cell" description="Two-line ellipsis, a value slot rendering sn-tag, and the built-in empty row." />

## Borders, stripes and the header

- `border` / `stripe` toggle the cell borders and the zebra rows
- `showHeader=false` hides the header row, leaving the body only
- An object passed to `index` customises the index column's label / width / alignment (`{ label, width, align }`)
- `customClass` / `customStyle` apply to the table root

<Demo name="table-mp-style" description="The border / stripe switches, an index config object, show-header off, and customClass / customStyle." />

## Not implemented

The following wd-table props are **not declared** (CONTRIBUTING §2.2: unimplemented capabilities do not appear in the API):

| Prop | Reason |
| --- | --- |
| `virtual` / `row-height` / `buffer` | A reliable virtual scroller needs `scroll-top` plus per-row height measurement, and `<scroll-view>` reports scroll offsets inconsistently across WeChat / Alipay / H5. Every row is rendered so behaviour is identical on all targets; combine `height` + `fixed-header` for long datasets |
| `span-method` | Cross-end `rowspan` / `colspan` breaks the pinned-column offsets computed from the column widths |

## Props (`sn-table`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `Record<string, unknown>[]` | `[]` | Table rows |
| `border` | `boolean` | `true` | Draw cell borders |
| `stripe` | `boolean` | `true` | Zebra-stripe body rows |
| `height` | `string \| number` | `undefined` | Max height (a number is design px); turns on vertical scrolling |
| `showHeader` | `boolean` | `true` | Render the header row |
| `ellipsis` | `boolean` | `false` | Clamp cell text to two lines |
| `index` | `boolean \| SnTableIndexConfig` | `false` | Ordinal column; an object customises `label` / `width` / `align` |
| `fixedHeader` | `boolean` | `true` | Pin the header (`position: sticky`) |
| `customClass` | `string` | `''` | Custom class for the root node |
| `customStyle` | `string` | `''` | Custom inline style for the root node |

## Props (`sn-table-column`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | `''` | Data field name |
| `label` | `string` | `''` | Header label |
| `width` | `string \| number` | `100` | Column width (a number is design px) |
| `sortable` | `boolean` | `false` | Header tap cycles the sort order |
| `fixed` | `boolean` | `false` | Pin the column to the left edge |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Content alignment |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `sort-method` | A sortable header was tapped | `{ prop, label, order }` |
| `row-click` | A body row was tapped | `{ rowIndex, row }` |

## Slots

| Slot | Component | Description |
| --- | --- | --- |
| `default` | `sn-table` | Column declarations (`sn-table-column` children) |
| `empty` | `sn-table` | Replaces the built-in empty row |
| `value` | `sn-table-column` | Custom cell content, receives `{ row, index }` |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-elevated` | Table surface |
| `--sn-mp-color-background-subtle` | Header row |
| `--sn-mp-color-background-soft` | Stripe row |
| `--sn-mp-color-border-subtle` | Cell borders |
| `--sn-mp-color-text-primary` | Body text |
| `--sn-mp-color-text-secondary` | Header text |
| `--sn-mp-color-text-tertiary` | Empty-state text |
| `--sn-mp-color-text-disabled` | Idle sort arrow |
| `--sn-mp-color-action-primary` | Active sort arrow |
| `--sn-mp-font-size-sm` | Cell text size |
| `--sn-mp-font-weight-semibold` | Header weight |
| `--sn-mp-font-line-height-normal` | Cell line height |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-10` | Header gap / cell padding / empty padding |
| `--sn-mp-radius-lg` | Table corners |

## Accessibility

- Root is `role="table"`; header cells are `role="columnheader"`, body cells `role="cell"`, rows `role="row"`
- A sortable header carries `aria-sort` (`ascending` / `descending` / `none`)
- Sort arrows are `aria-hidden="true"` — the state lives in `aria-sort`
- Row taps are pointer-only; the host decides whether a row needs a keyboard affordance

## Dark mode

The surface, header, stripes, borders and text all use `--sn-mp-color-*` semantic tokens, all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider's theme set to dark:

## Related

- Pagination: [`sn-pagination`](/en/components/uni/pagination)
- Empty-state illustration: [`sn-empty`](/en/components/uni/empty)
- Loading state: [`sn-loading`](/en/components/uni/loading)
