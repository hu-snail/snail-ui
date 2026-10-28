# SnSplit (Web)

Web-end split component pair for `@snui/vue-web`: `SnSplit` (container) +
`SnSplitPanel` (panel). Surface mirrors naive-ui `n-splitter` /
`n-splitter-panel` (naive 2.38+) with an explicitly simplified collapse model
(see "Differences from naive-ui").

The container owns percent size state for its panels and the drag / keyboard
logic of the dividers. Each panel renders its own divider (except the first)
as a sibling fragment node, so the container's flex row is
`[panel][divider][panel]` and percent widths are exact flex-item sizes.

## When to use

Two or more resizable panes in a row (file explorers, inspector layouts) or
column. Panels lay out by percent; dividers are draggable, keyboard operable
and double-clickable.

## Sizing model

- Sizes are **percent** of the container axis. A `number` prop value is a
  percent (`30` = 30%); strings must be `"N%"`. `"100px"` and other units are
  unsupported (treated as unset) — a documented simplification.
- At mount the container normalizes once: explicit `defaultSize` values are
  kept; unsized panels share the remainder equally (two unsized panels →
  50/50). Over-subscribed defaults (> 100%) are scaled down proportionally.
- Dragging a divider only redistributes percent between the two adjacent
  panels (pair sum is conserved), clamped by both panels' `minSize` /
  `maxSize`.
- The divider is a real flex item (default hit area 10px), so percent sizes
  may shrink by `flex-shrink: 1` to fit the divider pixels in.

## SnSplit props

| Prop        | Type                         | Default        | Notes                                                                     |
| ----------- | ---------------------------- | -------------- | ------------------------------------------------------------------------- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split axis.                                                               |
| `disabled`  | `boolean`                    | `false`        | Disables drag + keyboard; dividers become `aria-disabled` and untabbable. |

## SnSplit events

| Event    | Payload                                    | When                                                                                                                                                                |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resize` | `{ before, after, beforeSize, afterSize }` | A gesture finished: drag end, keyboard commit, dblclick. `before`/`after` are the adjacent panels' percents (numbers); `beforeSize`/`afterSize` are `"N%"` strings. |

## SnSplitPanel props

| Prop          | Type               | Default | Notes                                                        |
| ------------- | ------------------ | ------- | ------------------------------------------------------------ |
| `defaultSize` | `number \| string` | —       | Initial percent; unset panels share the remainder equally.   |
| `minSize`     | `number \| string` | `0`     | Lower drag / keyboard bound, percent.                        |
| `maxSize`     | `number \| string` | `100`   | Upper drag / keyboard bound, percent.                        |
| `collapsible` | `boolean`          | `false` | Enables snap-to-collapse when a drag pushes below `minSize`. |
| `collapsed`   | `boolean`          | `false` | `v-model:collapsed`. Collapsed size is 0.                    |

## SnSplitPanel events

| Event              | Payload   | When                                                             |
| ------------------ | --------- | ---------------------------------------------------------------- |
| `update:collapsed` | `boolean` | Collapse snap (drag below min), expand (dblclick / drag past 0). |

## Slots

| Slot      | On             | Notes          |
| --------- | -------------- | -------------- |
| `default` | `SnSplitPanel` | Panel content. |

## Interaction

- **Drag**: pointerdown on a divider starts the gesture; `pointermove` /
  `pointerup` / `pointercancel` live on `document` for the duration and are
  always detached at drag end and on unmount (AGENTS.md §41/42).
- **Keyboard** (divider is focusable, `role="separator"`):
  `ArrowRight`/`ArrowDown` grows the leading panel by 2% of the container
  axis, `ArrowLeft`/`ArrowUp` shrinks it; `Home` moves the divider to the
  leading panel's min, `End` to the trailing panel's min. Every press emits
  `resize`.
- **Double-click** on a divider: if one side is collapsed it expands back to
  its `defaultSize` (taking percent from the other side); otherwise both
  adjacent panels are restored toward their defaults scaled to keep the pair
  sum constant.

## Divider appearance

- While idle the divider shows **no visible line** — adjacent panels meet
  cleanly. Distinguish modules through panel backgrounds (see the docs demos)
  or host-provided borders.
- On hover, keyboard focus or an active drag, a **rounded vertical bar
  appears centered** in the 10px hit area (horizontal split; a horizontal bar
  for a vertical split), signalling the grab point.

## Collapse semantics (simplified vs naive-ui)

- Collapsed means **size 0** (naive-ui keeps `minSize` reserved — not
  implemented).
- Drag a collapsible panel below its `minSize` → snaps to collapsed (size 0)
  and emits `update:collapsed: true`; the freed percent goes to the panel the
  gesture grows (donor `maxSize` is not re-clamped — collapse overrides
  resize constraints, matching naive-ui behavior).
- Expand paths: divider double-click, dragging the collapsed panel's divider
  past 0, or the host clearing `v-model:collapsed`. Expansion takes percent
  from the nearest non-collapsed neighbor (next first, then previous),
  clamped by the neighbor's `minSize` and the expanding panel's
  `defaultSize` / `maxSize`.
- Bind `v-model:collapsed` for the state to survive; without a binding the
  container still applies the size change and emits the event.

## Accessibility

- Divider: `role="separator"`, `tabindex="0"`, `aria-orientation`
  (`vertical` for a horizontal split — the divider is a vertical line —
  and `horizontal` for a vertical split), `aria-valuenow` (leading panel
  percent), `aria-valuemin` / `aria-valuemax` (effective drag bounds),
  `aria-disabled` when the split is disabled.
- Divider bar appears on hover / focus / active drag; keyboard focus also
  draws the focus ring on the hit area.

## Tokens

`--sn-web-split-divider-size` (hit area, `10px`),
`--sn-web-split-divider-bar-size` (bar thickness, `3px`),
`--sn-web-split-divider-bar-length` (bar length, `32px`),
`--sn-web-split-divider-bar-radius` (bar rounding, `999px`),
`--sn-web-split-divider-bar-color` (falls back to
`--sn-web-color-border-default`), `--sn-web-split-divider-bar-color-active`
(falls back to `--sn-web-color-action-primary`).

## Differences from naive-ui

- Collapse: naive keeps the panel at `minSize` with collapsible buttons on
  the divider; here collapse is `v-model:collapsed` at size 0 with dblclick /
  drag / host to restore, and the collapsed panel's divider stays in place
  for keyboard + dblclick restore.
- The idle divider line of naive-ui is replaced by a hidden-by-default bar
  that appears centered on hover / focus / drag.
- `show-collapsible` buttons, controlled `size` / `v-model:size` per panel,
  px unit support and runtime panel-set re-normalization (panels added or
  removed after mount keep their current sizes) are not implemented.
- `onResize` payload shape is `{ before, after, beforeSize, afterSize }`
  percentages of the two panels adjacent to the moved divider.

## Limitations

- Panels must be direct children of `SnSplit` (injection-based; a panel
  rendered outside a split container degrades to a static box).
- The panel set is normalized once at container mount; panels added or
  removed later keep the current size distribution.
