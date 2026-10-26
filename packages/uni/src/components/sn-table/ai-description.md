# sn-table — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-table component pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Data table with header, borders, zebra stripes, an ordinal index column,
sortable headers and a left-pinned column. Horizontal scrolling comes from a
`<scroll-view scroll-x>`; setting `height` turns on vertical scrolling and
`fixed-header` pins the header row inside it.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-table` +
`wd-table-column` (https://wot-ui.cn/component/table.html). New props added here
MUST also be added to the wd-table parity list.

## Parent / child shape

`wd-table` splits its surface across a container and a column child, and the
reference table's `desc` column names the child's props — so this port keeps the
pair:

```
<sn-table :data="rows">
  <sn-table-column prop="name" label="名称" />
  <sn-table-column prop="amount" label="金额" align="right" sortable />
</sn-table>
```

Columns register through `provide` / `inject` in their own `onMounted`, so
column order is DOM order and the container is not mutated mid-render (the
`sn-tabs` / `sn-sidebar` pattern).

## Not implemented (documented divergences)

- **`virtual` / `row-height` / `buffer`** are NOT declared. A reliable virtual
  scroller needs `scroll-top` plus per-row height measurement, and
  `scroll-view` reports scroll offsets inconsistently across WeChat / Alipay /
  H5. Every row is rendered instead; use `height` + `fixed-header` for long
  datasets.
- **`span-method`** is NOT declared: cross-end `rowspan` / `colspan` inside a
  `<scroll-view>` breaks the pinned-column offsets the container computes from
  its own width bookkeeping.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-table :data="rows"> … </sn-table>
```

```ts
import { SnTable, SnTableColumn } from '@snui/uni';
```

## Props — `sn-table`

| Name          | Type                            | Default     | Required          | Description                                                        |
| ------------- | ------------------------------- | ----------- | ----------------- | ------------------------------------------------------------------ |
| `data`        | `Record<string, unknown>[]`     | `[]`        | yes (in practice) | Table rows.                                                        |
| `border`      | `boolean`                       | `true`      | no                | Draw cell borders.                                                 |
| `stripe`      | `boolean`                       | `true`      | no                | Zebra-stripe body rows.                                            |
| `height`      | `string \| number`              | `undefined` | no                | Max height (bare number = design px). Turns on vertical scrolling. |
| `showHeader`  | `boolean`                       | `true`      | no                | Render the header row.                                             |
| `ellipsis`    | `boolean`                       | `false`     | no                | Clamp cell text to two lines.                                      |
| `index`       | `boolean \| SnTableIndexConfig` | `false`     | no                | Ordinal column; an object customises `label` / `width` / `align`.  |
| `fixedHeader` | `boolean`                       | `true`      | no                | Pin the header row while scrolling vertically.                     |
| `customClass` | `string`                        | `''`        | no                | Custom class for the root node.                                    |
| `customStyle` | `string`                        | `''`        | no                | Custom inline style for the root node.                             |

## Props — `sn-table-column`

| Name       | Type                            | Default  | Required          | Description                             |
| ---------- | ------------------------------- | -------- | ----------------- | --------------------------------------- |
| `prop`     | `string`                        | `''`     | yes (in practice) | Data field name.                        |
| `label`    | `string`                        | `''`     | yes (in practice) | Header label.                           |
| `width`    | `string \| number`              | `100`    | no                | Column width (bare number = design px). |
| `sortable` | `boolean`                       | `false`  | no                | Header tap cycles asc → desc → none.    |
| `fixed`    | `boolean`                       | `false`  | no                | Pin the column to the left edge.        |
| `align`    | `'left' \| 'center' \| 'right'` | `'left'` | no                | Content alignment.                      |

## Events — `sn-table`

| Name          | Payload                  | Description                                                          |
| ------------- | ------------------------ | -------------------------------------------------------------------- |
| `sort-method` | `{ prop, label, order }` | A sortable header was tapped. The component does not reorder `data`. |
| `row-click`   | `{ rowIndex, row }`      | A body row was tapped.                                               |

## Slots

| Slot      | Component         | Description                                       |
| --------- | ----------------- | ------------------------------------------------- |
| `default` | `sn-table`        | Column declarations (`sn-table-column` children). |
| `empty`   | `sn-table`        | Replaces the built-in "暂无数据" row.             |
| `value`   | `sn-table-column` | Custom cell content, receives `{ row, index }`.   |

## Tokens Consumed (end: mp)

| Token                  | CSS Variable                        | Purpose                                 |
| ---------------------- | ----------------------------------- | --------------------------------------- |
| Background elevated    | `--sn-mp-color-background-elevated` | Table surface                           |
| Background subtle      | `--sn-mp-color-background-subtle`   | Header row                              |
| Background soft        | `--sn-mp-color-background-soft`     | Stripe row                              |
| Border subtle          | `--sn-mp-color-border-subtle`       | Cell borders                            |
| Text primary           | `--sn-mp-color-text-primary`        | Body text                               |
| Text secondary         | `--sn-mp-color-text-secondary`      | Header text                             |
| Text tertiary          | `--sn-mp-color-text-tertiary`       | Empty-state text                        |
| Text disabled          | `--sn-mp-color-text-disabled`       | Idle sort arrow                         |
| Action primary         | `--sn-mp-color-action-primary`      | Active sort arrow                       |
| Font size SM           | `--sn-mp-font-size-sm`              | Cell text                               |
| Font weight semibold   | `--sn-mp-font-weight-semibold`      | Header text                             |
| Line height normal     | `--sn-mp-font-line-height-normal`   | Cell line height                        |
| Spacing 1 / 3 / 4 / 10 | `--sn-mp-spacing-*`                 | Header gap, cell padding, empty padding |
| Radius LG              | `--sn-mp-radius-lg`                 | Table corners                           |

## Accessibility

- Root carries `role="table"`; header cells are `role="columnheader"`, body
  cells `role="cell"`, rows `role="row"`
- A sortable header carries `aria-sort` (`ascending` / `descending` / `none`)
- The sort arrows are `aria-hidden="true"` — the state is in `aria-sort`
- Row taps are pointer-only; the host decides whether a row needs a keyboard
  affordance

## Dispose

No timer, no listener, no layout measurement. Columns unregister in their own
`onBeforeUnmount` so a removed column stops occupying a slot (AGENTS.md §41).

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 display-category uni
components (qr-code / table / image-preview / video-preview / img-cropper).
