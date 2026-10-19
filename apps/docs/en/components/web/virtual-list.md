# VirtualList · Web

Virtual scrolling list: renders only the rows inside the viewport (plus
overscan) while a full-height sizer keeps native scrollbar geometry —
smooth scrolling for tens of thousands of rows.

## When to use

- Performance for long lists / log streams / large table bodies
  (hundreds to tens of thousands of rows).
- Fixed row heights position directly via `itemSize`; content-driven
  heights enable `itemResizable` measuring.
- Custom row content (`item` slot) with a native scrolling experience
  (keyboard scrolling, scrollbar semantics).

## Examples

### Basic (fixed row height)

1000 rows at a fixed 32px height — only the visible window + overscan
rows render.

<Demo name="virtual-list-web-basic" description="Fixed itemSize + visibleHeight + the item slot." />

### Dynamic heights (itemResizable)

With `itemResizable`, rendered rows are measured by a ResizeObserver and
the prefix-sum table reflows; unmeasured rows fall back to `itemSize`.

<Demo name="virtual-list-web-resizable" description="itemResizable dynamic measuring — row heights follow content." />

## API

### SnVirtualList Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | `Array<Record<string, unknown> \| string \| number>` | `[]` | Full data list; only the visible window renders |
| item-size | `number` | `30` | Fixed row height (px); also the estimate for unmeasured rows |
| item-resizable | `boolean` | `false` | Measure rendered rows with ResizeObserver and reflow |
| key-field | `string` | `'value'` | Object field used as the render key |
| overscan | `number` | `3` | Extra rows rendered above / below the window |
| visible-height | `number \| undefined` | `undefined` | Pin the viewport height (px); when omitted the container height is measured (default 100%) |

### SnVirtualList Events

| Event | Payload | Notes |
| --- | --- | --- |
| scroll | `(event: Event)` | Native container scroll event |
| update:scroll-top | `(scrollTop: number)` | Scroll offset committed after the rAF throttle |

### SnVirtualList Slots

| Slot | Params | Notes |
| --- | --- | --- |
| item | `{ item, index }` | Row content; raw values render as text by default |

Behavior notes:

- Fixed heights position at `index * itemSize`; dynamic heights keep a
  prefix-sum table resolved by binary search.
- `itemResizable` measures downward only: re-measuring never shifts rows
  above the measured window.
- Replacing the `items` array clears the measured-height cache.

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-text-primary` | Row text |

## Accessibility

| Attribute | Notes |
| --- | --- |
| `role="list"` | Scroll container |
| `role="listitem"` | Each row |
| Native scroll container | Keyboard scrolling and screen-reader scrollbar semantics for free |

## AI Patch Boundary

- AI-generated JSON Patches may only modify the prop data surface above
  (e.g. `items`, `itemSize`, `overscan`).
- Patches must not inject slot content, event handlers or internal
  scroll offsets.
- `itemSize` must be a positive number; `overscan` a non-negative
  integer.
- When replacing `items`, keep the `keyField` values stable so the DOM
  is not rebuilt wholesale.

See the component `ai-description.md` for the full contract.
