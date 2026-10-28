# Waterfall · Web

An image / feed-first masonry container: every direct child of the `default`
slot is wrapped in a `.sn-waterfall__item` box, and the boxes are placed into N
columns by **shortest column first**. Each column is a vertical flex container,
so the order inside a column is your data order (left to right, then deeper) —
not the "fill column 1 to the bottom, then column 2" order CSS multi-column
gives you.

## When to use

- Card walls, image walls, product / feed listings with **uneven heights**
- When the column count should follow the container width without measuring code
- When you need **smooth scrolling**: lazy images that resolve late must not
  re-flow the whole wall

## Examples

### Basic

<Demo name="waterfall-web-basic" description="Three columns by default; v-for driven, uneven heights." />

### Image wall & lazy loading

<Demo name="waterfall-web-image" description="SnImage as the item: width/height reserve the space, lazy pre-loads one screen ahead, and a late image only grows its own column." />

### Responsive columns

<Demo name="waterfall-web-responsive" description="min-column-width follows the container width (computed from the measured width once mounted)." />

### Card wall & masonry off

<Demo name="waterfall-web-card" description="SnCard as the item; switch the column count, or set masonry=false for a plain stack." />

## API

### SnWaterfall Props

| Name             | Type               | Default | Notes                                                                                                                                                                                                               |
| ---------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| columns          | `number`           | `3`     | Logical column count, coerced to an integer ≥ 1 (floored, `0` / `NaN` / `Infinity` fall back to `1`). Acts as the **pre-measurement guess** in `min-column-width` mode; ignored when `masonry=false`                |
| min-column-width | `number \| string` | —       | Minimum column width (number → px, string parsed as px for the column math). When set the column count follows the **measured** container width (responsive mode); before a width exists it falls back to `columns` |
| column-gap       | `number \| string` | `16`    | Gap between columns (number → px), emitted as `--sn-waterfall-column-gap`                                                                                                                                           |
| row-gap          | `number \| string` | `16`    | Gap between items (number → px), emitted as `--sn-waterfall-row-gap` and applied as each column's `row-gap`                                                                                                         |
| masonry          | `boolean`          | `true`  | Convenience "off" switch: `false` renders a plain vertical stack (items get their `margin-bottom` back, matching the old stacked behaviour)                                                                         |

### SnWaterfall Slots

| Name    | Params | Notes                                                                                                                           |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| default | `()`   | The items; every direct child (including each entry a `<template v-for>` expands to) gets its own `.sn-waterfall__item` wrapper |

### Custom properties (CSS variables)

| Name                        | Default | Notes                                         |
| --------------------------- | ------- | --------------------------------------------- |
| `--sn-waterfall-column-gap` | `16px`  | Column gap — retune without touching the prop |
| `--sn-waterfall-row-gap`    | `16px`  | Vertical gap between items                    |

### Notes

- **naive-ui has no waterfall component** (there is no `n-waterfall` in its
  export list, and `n-grid` only lays out uniform rows), so this component is
  deliberately not 1:1 with naive-ui — an explicit divergence allowed by
  AGENTS.md §112.
- **The layout is no longer pure CSS multi-column**: columns are assigned in JS
  by shortest-column-first (`waterfall-assign.ts`, pure functions with their own
  unit tests) and laid out inside by the browser's flex layout. Scrolling has no
  per-frame JS work, and a resolved image only grows its own column.
- **A placed item never moves between columns**: new items are appended to the
  currently shortest column, so appending data — or an image resolving late —
  never moves what is already on screen (or its in-flight image requests). The
  trade-off is that the columns are only "as even as possible", not optimal.
- **A child's `key` is its identity**: the `:key` of the v-for decides which
  column it belongs to; without a key the index is used, which makes membership
  positional — always key your feed items.
- **Give images both `width` and `height`**: the browser then reserves the
  aspect ratio before the bytes arrive, which drops layout shift to zero; when
  the size is unknown the container measures items with a `ResizeObserver` and
  uses those heights for **subsequent** placements.
- **Without measurement** (SSR, browsers without `ResizeObserver`) items are
  distributed round-robin: even columns, left-to-right reading order — a static
  balanced layout instead of a crash.
- The root renders `role="list"`, each item wrapper `role="listitem"` and each
  column wrapper `role="presentation"` (so the items stay owned by the list);
  other semantics can be requested by overriding the root role through
  fallthrough attrs.
- In masonry mode the vertical gap comes from the columns' `row-gap`, so there
  is **no trailing gap** (the container ends flush with the last item — what an
  infinite scroll wants); `masonry=false` keeps the old `margin-bottom`.

See the component `ai-description.md` for the full contract.
