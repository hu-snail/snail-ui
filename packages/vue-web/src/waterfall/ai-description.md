# SnWaterfall — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end waterfall
> (masonry) container. Consumed by `@snui/cli` and `@snui/ai` (MCP) for
> end-aware listing. **`end: web`** marker — consumed by
> `list_components({ end: 'web' })`.

## Purpose

A slot-driven masonry container (瀑布流): every direct child of the
`default` slot is wrapped in one `.sn-waterfall__item` box and the boxes
are packed into N columns, so a tall item does not push its neighbour
down and leave a hole beside it. Typical use: card walls, image grids,
product/feed listings of wildly different heights.

## Reference Library

**Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO
masonry / waterfall component (there is no `n-waterfall` in its
`src/components.ts` export list, and `n-grid` only lays out uniform
rows). Per AGENTS.md §112 there is therefore no upstream API to mirror —
this component defines its own surface, and the divergence is deliberate
rather than an oversight.

The **layout technique** is not invented here either: it is the CSS
multi-column approach this repo already uses for its own docs demo grid —
`apps/docs/.vitepress/utils/demo-grid.ts` groups each demo section into
`.sn-demo-grid` / `.sn-demo-cell`, and `apps/docs/.vitepress/theme/
custom.css` §13 ("Demo cards — waterfall layout") declares `column-count`
/ `column-gap` on the group plus `break-inside: avoid` on the cards.
`SnWaterfall` is that technique promoted to a public component.

## Import

```ts
import { SnWaterfall } from '@snui/vue-web';
```

## Props

| Name             | Type               | Default     | Description                                                                                                                                                                                                                 |
| ---------------- | ------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`        | `number`           | `3`         | Logical column count, applied as `column-count`. Coerced to an integer ≥ 1 (a fractional value is floored, `0` / `NaN` / `Infinity` fall back to `1`). Ignored when `minColumnWidth` is set, and when `masonry` is `false`. |
| `minColumnWidth` | `number \| string` | `undefined` | Minimum column width (number → px, string verbatim). When set, the container emits `column-width` **instead of** `column-count`, so the column count follows the available width (responsive mode); `columns` is ignored.   |
| `columnGap`      | `number \| string` | `16`        | Gap between columns (number → px). Applied as `column-gap` through `--sn-waterfall-column-gap`.                                                                                                                             |
| `rowGap`         | `number \| string` | `16`        | Gap between items (number → px). Applied as `margin-bottom` on each item box through `--sn-waterfall-row-gap`.                                                                                                              |
| `masonry`        | `boolean`          | `true`      | Convenience "off" switch: `false` renders a plain vertical stack (single column, no multi-column layout, `column-count` / `column-width` not emitted).                                                                      |

## Slots

| Name      | Params | Description                                                         |
| --------- | ------ | ------------------------------------------------------------------- |
| `default` | `()`   | The items. Each direct child becomes one `.sn-waterfall__item` box. |

## Events

None — pure layout container. It is uncontrolled and stateless: all of
its geometry comes from props and the browser's own column algorithm.

## Divergences

- **No naive-ui counterpart** (see Reference Library) — nothing to be
  1:1 with.
- **`role="list"` / `role="listitem"` are applied.** Wrapping each slot
  child is unavoidable, and the result is exactly the ARIA list pattern
  (`div[role=list]` > `div[role=listitem]`), so the roles do not distort
  anything the consumer wrote — they only name the collection. A consumer
  that needs other semantics can override the root role through
  fallthrough attrs (`<SnWaterfall :role="'region'">`).
- **Comment placeholders are dropped.** A `v-if="false"` inside the slot
  leaves a Comment vnode behind; it is filtered out instead of becoming an
  empty item box (each box carries the `row-gap` margin, so an empty box
  would punch a hole into its column). `null` / `undefined` / boolean
  children are skipped for the same reason.
- **Fragment children are flattened recursively** (`<template v-for>` over
  a data list, including nested fragments), mirroring
  `SnDescriptions.flattenSlotChildren`, so v-for-driven item lists render
  one box per entry.
- **Trailing `row-gap` is kept**: the last item also carries its
  `margin-bottom`, matching the in-repo demo grid. The container height
  stays predictable and does not jump when items are appended; use
  `row-gap="0"` for a flush bottom edge.
- **Column-major order.** With CSS multi-column the browser fills column 1
  to the bottom, then column 2, … — a JS-positioned masonry could order
  items top-to-bottom / left-to-right, but that needs measuring. This is
  the accepted trade-off for having no JS at all.
- **`columns` is a hint**, not a guarantee: the browser renders fewer
  columns when the available width cannot hold them.

## Tokens Consumed (end: web)

None of the `--sn-web-*` colour aliases: the container paints nothing of
its own (no background, border, text or shadow), so there is no colour to
tokenize. It exposes two component-scoped knobs instead, both inlined
from props with a literal fallback in the component's `<style scoped>`:

| Custom property             | Default | Use                               |
| --------------------------- | ------- | --------------------------------- |
| `--sn-waterfall-column-gap` | `16px`  | `column-gap` between the columns. |
| `--sn-waterfall-row-gap`    | `16px`  | `margin-bottom` on each item box. |

Consumers may retune either by setting the property on the root (or any
ancestor) without touching the props. All lengths are px.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Data-display batch (Waterfall).
Component id AUI-WEB-DD-030.
