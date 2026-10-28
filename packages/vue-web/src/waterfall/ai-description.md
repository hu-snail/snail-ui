# SnWaterfall — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end waterfall
> (masonry) container. Consumed by `@snui/cli` and `@snui/ai` (MCP) for
> end-aware listing. **`end: web`** marker — consumed by
> `list_components({ end: 'web' })`.

## Purpose

An image / feed-first masonry container (瀑布流): every direct child of the
`default` slot is wrapped in one `.sn-waterfall__item` box and the boxes are
placed into N columns by shortest-column-first, so a tall item does not push
its neighbour down and leave a hole beside it. Typical use: image walls, card
walls, product / feed listings of wildly different heights.

## Reference Library

**Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO
masonry / waterfall component (there is no `n-waterfall` in its
`src/components.ts` export list, and `n-grid` only lays out uniform
rows). Per AGENTS.md §112 there is therefore no upstream API to mirror —
this component defines its own surface, and the divergence is deliberate
rather than an oversight.

## Import

```ts
import { SnWaterfall } from '@snui/vue-web';
```

## Props

| Name             | Type               | Default     | Description                                                                                                                                                                                                                                                                    |
| ---------------- | ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `columns`        | `number`           | `3`         | Logical column count, coerced to an integer ≥ 1 (a fractional value is floored, `0` / `NaN` / `Infinity` fall back to `1`). Acts as the **pre-measurement guess** in `minColumnWidth` mode; ignored when `masonry` is `false`.                                                 |
| `minColumnWidth` | `number \| string` | `undefined` | Minimum column width (number → px; a string is resolved against the live layout, and parsed as px for the placement math). When set, the column count follows the **measured** container width (responsive mode); before a width exists (SSR / first paint) `columns` is used. |
| `columnGap`      | `number \| string` | `16`        | Gap between columns (number → px), exposed as `--sn-waterfall-column-gap` and applied as the root's `column-gap`.                                                                                                                                                              |
| `rowGap`         | `number \| string` | `16`        | Gap between items (number → px), exposed as `--sn-waterfall-row-gap` and applied as each column's `row-gap`.                                                                                                                                                                   |
| `masonry`        | `boolean`          | `true`      | Convenience "off" switch: `false` renders a plain vertical stack (one column; items get their `margin-bottom` back).                                                                                                                                                           |

## Slots

| Name      | Params | Description                                                         |
| --------- | ------ | ------------------------------------------------------------------- |
| `default` | `()`   | The items. Each direct child becomes one `.sn-waterfall__item` box. |

## Events

None — uncontrolled and stateless from the consumer's point of view. Its
geometry comes from the measured layout (one `ResizeObserver`) plus the
placement rules; nothing is emitted.

## Layout model

```text
root (role=list, flex row, column-gap)
├── column 1 (role=presentation, flex column, row-gap)  ← flex: 1 1 0
│   └── item (role=listitem)  ← the slot child
├── column 2 …
└── column N …
```

- **Placement is JS** (pure functions in `./waterfall-assign`, unit-tested):
  each new item goes to the currently shortest column; ties resolve leftwards.
- **Layout inside a column is the browser's** (flex column + `row-gap`): there
  is no per-frame JS positioning, no absolute positioning and no transform
  bookkeeping, which is what keeps scrolling to compositing only.
- **Append-only**: an item that has been placed never moves to another column.
  Appending data — or an image resolving late — therefore never moves what is
  on screen (or restarts its in-flight image requests). The trade-off is that
  the columns are "as even as possible", not optimal.
- **Measurement**: one `ResizeObserver` watches the container (width → column
  count in `minColumnWidth` mode) and every item (height → the score used by
  _subsequent_ placements). Its callback only writes into a `Map`: no DOM
  reads, no DOM writes, no re-render, so a resolving image cannot thrash the
  layout while the user scrolls.
- **Keying**: a child's vnode `key` is its identity across renders (prefix
  `k:`); a child without a key falls back to its index (prefix `#`), which
  makes membership positional.

## Lazy loading

The container loads nothing itself. Pair it with `SnImage lazy` (native
`loading="lazy"`, or IntersectionObserver through
`intersection-observer-options`):

```vue
<SnWaterfall :columns="4">
  <SnImage v-for="p in photos" :key="p.id" :src="p.src" :width="p.w" :height="p.h" lazy />
</SnWaterfall>
```

Giving images both `width` and `height` lets the browser reserve the aspect
ratio before the bytes arrive, which removes the layout shift entirely; when
the size is unknown, the measured heights shape the next placement instead.

## Fallbacks (explicit, AGENTS.md §85)

- **No `ResizeObserver`** (SSR, older browsers, happy-dom): items are
  distributed round-robin — even columns, left-to-right reading order — so the
  container degrades to a static balanced layout instead of a crash or a single
  long column.
- **No measured container width** in `minColumnWidth` mode: `columns` is used
  as the guess (SSR renders a real grid rather than one long column).
- **String `minColumnWidth` / gaps**: resolved against the live layout when
  possible; for the placement math the numeric part is read as px (`parsePx`),
  while the CSS always receives the original string.

## Divergences

- **No naive-ui counterpart** (see Reference Library) — nothing to be 1:1 with.
- **No longer CSS multi-column.** The previous revision distributed boxes with
  `column-count` / `column-width`, which filled column-major and re-flowed
  every column when a late image changed a height. The public props are
  unchanged; the layout technique and the ordering guarantees are the change.
- **`role="list"` / `role="listitem"` are applied**, with `role="presentation"`
  on the column wrappers so the items stay owned by the list. A consumer that
  needs other semantics can override the root role through fallthrough attrs
  (`<SnWaterfall :role="'region'">`).
- **Comment placeholders are dropped.** A `v-if="false"` inside the slot
  leaves a Comment vnode behind; it is filtered out instead of becoming an
  empty item box. `null` / `undefined` / boolean children are skipped too.
- **Fragment children are flattened recursively** (`<template v-for>` over a
  data list, including nested fragments), mirroring
  `SnDescriptions.flattenSlotChildren`, so v-for-driven item lists render one
  box per entry.
- **No trailing `row-gap` in masonry mode**: the gap lives on the columns as
  `row-gap`, so the container ends flush with the last item (what an infinite
  scroll wants). `masonry=false` keeps the old trailing `margin-bottom`.

## Tokens Consumed (end: web)

None of the `--sn-web-*` colour aliases: the container paints nothing of
its own (no background, border, text or shadow), so there is no colour to
tokenize. It exposes two component-scoped knobs instead, both inlined
from props with a literal fallback in the component's `<style scoped>`:

| Custom property             | Default | Use                               |
| --------------------------- | ------- | --------------------------------- |
| `--sn-waterfall-column-gap` | `16px`  | `column-gap` between the columns. |
| `--sn-waterfall-row-gap`    | `16px`  | `row-gap` inside each column.     |

Consumers may retune either by setting the property on the root (or any
ancestor) without touching the props. All lengths are px.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Data-display batch (Waterfall).
Component id AUI-WEB-DD-030. The column placement is implemented in
`./waterfall-assign.ts` (pure functions, unit-tested in
`waterfall-assign.test.ts`).
