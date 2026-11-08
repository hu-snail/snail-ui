# Waterfall · uni-app

`sn-waterfall` is the waterfall (masonry) container of `@snui/uni` (mobile / miniprogram / H5): every direct child of the default slot is wrapped in one box and placed into N columns by shortest-column-first, so a tall item no longer pushes its neighbour down and leaves a hole beside it. Built for image walls / feed listings / card walls, with container-level image lazy loading built in. Auto-registered through easycom (`components/sn-waterfall/sn-waterfall.vue` → `<sn-waterfall>`); geometry uses `rpx`.

Guarantees:

- **Reading order**: the order inside a column equals the slot order — never shuffled.
- **Append-only**: an item that is on screen never moves to another column; a late-loading image only grows its own column.
- **Fallback without measurement**: where no measurement exists (SSR / unit tests) items are distributed round-robin — balanced columns instead of a crash or a single long column.

## Basic usage

`columns` sets the column count; pair it with `sn-img` (`mode="widthFix"` lets the height follow the image's real ratio) for the standard image wall. Give each `v-for` item a `:key` so its identity is stable.

<Demo name="waterfall-mp-basic" description="Two-column image wall: column count, column gap and row gap; items pack into the shortest column." />

## Image lazy loading

The container's `lazyLoad` cascades to every nested `sn-img` through provide/inject: **an image that does not pass `lazyLoad` inherits the container config, an explicit prop wins**. That is "one switch lazy-loads the whole wall" — native `<image lazy-load>` only takes effect inside a scrollable area, which is exactly where a waterfall lives.

<Demo name="waterfall-mp-lazy-load" description="Container lazy-load on, images inherit it; a single image can still opt out." />

The three contracts of `lazyLoad`:

1. Every `<sn-img>` inside `<sn-waterfall lazy-load>` inherits it — no per-image boilerplate;
2. An image that explicitly passes `:lazy-load="false"` wins (e.g. a hero image that must not lazily load);
3. `sn-img` **outside** any waterfall is unaffected and keeps the wd-img default (off).

> Pairing this with append-only placement is what makes it work: a late-resolving image only grows its own column — it never re-packs the wall or restarts another image's in-flight request.

## Responsive column count

`minColumnWidth` switches on responsive mode: the column count follows the **measured container width**, and `columns` becomes the pre-measurement guess (first paint / SSR). Useful across width tiers — rotation, tablet, desktop H5.

<Demo name="waterfall-mp-responsive" description="min-column-width responsive columns that appear and disappear with the container width." />

## Turning the waterfall off

`masonry=false` renders a plain vertical stack (items get their `margin-bottom` back) — literally "stop masonry".

<Demo name="waterfall-mp-masonry-off" description="masonry=false degrades to a single stacked column." />

## Props

| Prop           | Type             | Default | Description                                                                                                                                                                                 |
| -------------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| columns        | number           | 3       | Logical column count (integer ≥ 1; a fractional value is floored, `0` / `NaN` / `Infinity` fall back to `1`). Pre-measurement guess in `minColumnWidth` mode; ignored when `masonry=false`. |
| minColumnWidth | string \| number | ''      | Minimum column width (bare number = rpx, strings pass through). When set, the column count follows the measured container width (responsive mode).                                          |
| columnGap      | string \| number | 16      | Gap between columns (bare number = rpx), applied through `--sn-waterfall-column-gap` as the root's `column-gap`.                                                                            |
| rowGap         | string \| number | 16      | Gap between items (bare number = rpx), applied through `--sn-waterfall-row-gap` as each column's `row-gap`.                                                                                 |
| masonry        | boolean          | true    | Convenience off switch: `false` renders a plain vertical stack.                                                                                                                             |
| lazyLoad       | boolean          | false   | Container-level image lazy-load config: cascades to nested `sn-img` (inherited unless the image passes its own), handed to native `<image lazy-load>`.                                      |
| customClass    | string           | ''      | Custom class for the root node.                                                                                                                                                             |
| customStyle    | string           | ''      | Custom inline style for the root node.                                                                                                                                                      |

## Events

None. A pure layout container — its geometry comes from measurement plus the placement rules; nothing is emitted.

## Slots

| Slot    | Description                                                         |
| ------- | ------------------------------------------------------------------- |
| default | The items: each direct child becomes one `.sn-waterfall__item` box. |

## Layout model

```text
root (.sn-waterfall, flex row, column-gap)
├── column 1 (.sn-waterfall__column, flex column, row-gap)  ← flex: 1 1 0
│   └── item (.sn-waterfall__item)  ← the slot child
├── column 2 …
└── column N …
```

- **Placement is JS**: a new item goes to the currently shortest column; ties resolve leftwards.
- **Layout inside a column is the platform's** (flex column + `row-gap`): no per-frame JS positioning, no absolute positioning, no transform bookkeeping — scrolling stays compositing-only.
- **Measurement is a selector query, and it only measures what is pending**: mobile has no ResizeObserver, so `uni.createSelectorQuery` batches only the items without a usable height; a round runs after mount and after the item set changes, and is skipped entirely when nothing is pending. The first measurement re-packs once; from then on only new keys trigger placement.
- **Keying**: a child's `:key` is its placement identity; a keyless child falls back to its index (positional membership) — key your items when you append into a feed.

## Methods

| Name      | Signature  | Description                                                                                                                                                                                                |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `refresh` | `(): void` | Re-measure every item (the new heights inform the next placement). Use it when images resolve later than the built-in policy (at most two attempts per item) — e.g. after a placeholder → real image swap. |

## Performance

The two hot paths are per-render JS and the per-batch native measurement; both written O(n) degrade as the feed grows (native round-trips accumulate O(n²)). What changed:

| Path                       | Before                                       | Now                                                                        | Measured                                                                  |
| -------------------------- | -------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Per-render placement check | `join('\0')` signature (array + long string) | Key-by-key early-exit compare (append O(1), content O(n), zero allocation) | n=1000: 0.143ms → 0.0135ms; ~4000 → ~1 allocation per render              |
| Measurement volume         | Full wall every round                        | Pending items only                                                         | 10 pages × 20 items: 1100 → 200 boxes (5.5×); 500-row wall + 20: 500 → 20 |
| Unrelated re-render        | Full-wall query per update                   | O(1) counter gate — skipped when nothing is pending                        | rowGap / parent state change → 0 queries                                  |
| Fixed-columns mount        | Always measured container + probed viewport  | Both only in `minColumnWidth` mode                                         | fixed mode: 0 container queries, 0 viewport probes                        |
| Long-lived feed            | Heights of removed items never released      | Heights + pooled entries pruned on placement rebuild                       | —                                                                         |

## Theme variables

| Variable                  | Default | Use                           |
| ------------------------- | ------- | ----------------------------- |
| --sn-waterfall-column-gap | 16rpx   | `column-gap` between columns. |
| --sn-waterfall-row-gap    | 16rpx   | `row-gap` inside each column. |

Consumers may retune either on the root (or any ancestor) without touching the props. All lengths are rpx (750 design canvas).

## Accessibility

- The root is a pure layout container and does not intercept interaction; the tap target belongs to the slot content (e.g. `sn-img`).
- The decorative geometry (column wrappers) carries no reading-tree semantics.

## Dark mode

The container paints nothing of its own (no background, border, text or shadow), so there is nothing to adapt and nothing light can leak through; the colours of images and content come from each slot component's own semantic tokens (`sn-img`, `sn-card`, …).

## Related

- Image: [`sn-img`](/en/components/uni/img) (lazy loading, loading / error states)
- Paged list: [`sn-paging`](/en/components/uni/paging) (a waterfall can be its content)
- Grid: [`sn-grid`](/en/components/uni/grid)
