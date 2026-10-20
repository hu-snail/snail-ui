# Waterfall · Web

Slot-driven masonry container: every direct child of the `default` slot is
wrapped in a `.sn-waterfall__item` box, and the boxes are distributed into N
columns by CSS multi-column layout. Each column packs on its own, so a short
column never leaves a hole beside a tall item (the failure mode of a row /
`grid` layout).

## When to use

- Card walls, image walls, product / feed listings with **uneven heights**
- When the column count should follow the container width without a single
  line of measuring code
- When you want "fill by column" rather than a row-aligned grid

## Examples

### Basic

<Demo name="waterfall-web-basic" description="Three columns by default; v-for driven, uneven heights." />

### Responsive columns

<Demo name="waterfall-web-responsive" description="min-column-width switches the container to column-width, so the column count follows the container." />

### Card wall & masonry off

<Demo name="waterfall-web-card" description="SnCard as the item; switch the column count, or set masonry=false for a plain stack." />

## API

### SnWaterfall Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| columns | `number` | `3` | Logical column count, emitted as `column-count`; coerced to an integer ≥ 1 (floored, `0` / `NaN` / `Infinity` fall back to `1`). Ignored when `min-column-width` is set or `masonry=false` |
| min-column-width | `number \| string` | — | Minimum column width (number → px, string verbatim). When set the container emits `column-width` **instead of** `column-count`, so the column count follows the available width (responsive mode); `columns` is then ignored |
| column-gap | `number \| string` | `16` | Gap between columns (number → px), applied as `column-gap` through `--sn-waterfall-column-gap` |
| row-gap | `number \| string` | `16` | Gap between items (number → px), applied as each item box's `margin-bottom` through `--sn-waterfall-row-gap` |
| masonry | `boolean` | `true` | Convenience "off" switch: `false` renders a plain vertical stack (no `column-count` / `column-width` emitted) |

### SnWaterfall Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | The items; every direct child (including each entry a `<template v-for>` expands to) gets its own `.sn-waterfall__item` wrapper |

### Custom properties (CSS variables)

| Name | Default | Notes |
| --- | --- | --- |
| `--sn-waterfall-column-gap` | `16px` | Column gap — retune without touching the prop |
| `--sn-waterfall-row-gap` | `16px` | Vertical gap between items |

### Notes

- **naive-ui has no waterfall component** (there is no `n-waterfall` in its
  export list, and `n-grid` only lays out uniform rows), so this component is
  deliberately not 1:1 with naive-ui — an explicit divergence allowed by
  AGENTS.md §112. The layout technique follows this repo's own docs demo card
  wall (`apps/docs/.vitepress/utils/demo-grid.ts` plus §13 of
  `apps/docs/.vitepress/theme/custom.css`): CSS multi-column layout.
- Zero JS measurement: no `ResizeObserver`, no scroll listener — the browser
  re-flows the columns itself. The trade-off is **column-major** order (column 1
  fills top to bottom, then column 2) instead of row-major.
- The root renders `role="list"` and each item wrapper renders
  `role="listitem"`; other semantics can be requested by overriding the root
  role through fallthrough attrs.
- The last item keeps its `row-gap` bottom margin (matching the in-repo demo
  card wall, so the container height does not jump when items are appended).
  Use `row-gap="0"` for a flush bottom edge.

See the component `ai-description.md` for the full contract.