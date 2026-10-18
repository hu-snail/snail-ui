# SnTable — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end simple table.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A simple, presentational `<table>` wrapper (AUI-WEB-DD-017): the consumer
writes `thead / tbody / tr / th / td` markup; the component supplies the
merged border grid, header background, striped rows and the size scale.
For data-driven tables with sorting / filtering / selection use
`SnDataTable` instead.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-table`
(https://www.naiveui.com/zh-CN/light/components/table,
src/table/src/Table.tsx + src/table/src/styles/index.cssr.ts).

## Import

```ts
import SnTable from '@snui/vue-web/src/table/SnTable.vue'
// or
import { SnTable } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `bordered` | `boolean` | `true` | no | Draw the surrounding border (full radius). |
| `bottomBordered` | `boolean` | `true` | no | Keep the last row's bottom border; ineffective while `bordered` is true (naive semantics). |
| `singleColumn` | `boolean` | `false` | no | Remove the row separators (cell bottom borders). |
| `singleLine` | `boolean` | `true` | no | Remove the column separators (cell right borders). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Table scale (th/td padding 6/12/12 px, font-size 14/14/15 px). |
| `striped` | `boolean` | `false` | no | Zebra stripes on even tbody rows. |

## Events

None.

## Slots

| Name | Description |
|---|---|
| `default` | Full table markup (thead / tbody / tr / th / td) authored by the consumer. |

## Divergences from the reference API

- Slotted `th`/`td` are styled through `:deep()` (slot content is compiled
  in the parent scope).
- naive-ui's inside-modal / inside-popover theme context variants are not
  ported.
- Theme colors are mapped to `--sn-web-*` (grid `border-subtle`, header
  `background-subtle`).

## Accessibility

- Renders a real `<table>` element; header/body semantics come from the
  consumer's own `thead` / `th` / `scope` markup.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Border subtle | `--sn-web-color-border-subtle` | Grid lines + outer border |
| Background surface / subtle | `--sn-web-color-background-*` | td / th background; striped via color-mix |
| Text primary / secondary | `--sn-web-color-text-*` | th / td text |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-017.
