# VirtualList · Web

The virtual list renders only the rows inside the viewport (plus an overscan
buffer above and below) while a full-height sizer keeps native scrollbar
geometry, so tens of thousands of rows stay smooth to scroll.

## When to use

- Performance for long lists / log streams / large table bodies (hundreds to
  tens of thousands of rows).
- Fixed row heights position directly via `item-size`; content-driven heights
  turn on `item-resizable` measuring.
- Custom row content (the `item` slot) with a native scrolling experience
  (keyboard scrolling, scrollbar semantics).

## Examples

### Basic

1000 items at a fixed 32px row height: the viewport height is pinned by
`visible-height`, `overscan` extra rows render above and below as a buffer, and
row content comes from the `item` slot.

<Demo name="virtual-list-web-basic" description="Fixed item-size + visible-height + overscan + the item slot." />

### Dynamic row heights

With `item-resizable` on, rendered rows are measured by a ResizeObserver and the
prefix-sum table reflows; unmeasured rows fall back to the `item-size` estimate,
and the total scroll height grows as measurements come in when content lengths
vary.

<Demo name="virtual-list-web-resizable" description="itemResizable dynamic measuring — row heights follow content." />

### Scroll readout and overscan buffering

Two lists side by side show the effect of `overscan` and read back the scroll
offset through the `scroll` event and `update:scroll-top`: `scroll` is the
native high-frequency container event while `update:scroll-top` is committed
after an rAF throttle.

<Demo name="virtual-list-web-scroll" description="scroll / update:scroll-top live readout plus overscan 0 versus 12." />

## API

### Props

| Name           | Type                                                 | Default     | Notes                                                                                       |
| -------------- | ---------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| items          | `Array<Record<string, unknown> \| string \| number>` | `[]`        | Full data list; only the rows inside the viewport render.                                   |
| item-size      | `number`                                             | `30`        | Fixed row height (px); also the estimate for unmeasured rows.                               |
| item-resizable | `boolean`                                            | `false`     | Measure rendered rows with a ResizeObserver and reflow from the measurements.               |
| key-field      | `string`                                             | `'value'`   | Object field used as the render key; falls back to the row index when the field is missing. |
| overscan       | `number`                                             | `3`         | Extra rows rendered above / below the viewport to absorb fast scrolling.                    |
| visible-height | `number \| undefined`                                | `undefined` | Pin the viewport height (px); when omitted the container height is measured (default 100%). |

### Events

| Name              | Payload               | Notes                                                                                  |
| ----------------- | --------------------- | -------------------------------------------------------------------------------------- |
| scroll            | `(event: Event)`      | Native container scroll event, fired on every scroll.                                  |
| update:scroll-top | `(scrollTop: number)` | Scroll offset committed after the rAF throttle, for external readouts or lazy loading. |

### Slots

| Name | Params                                                                 | Notes                                                                                           |
| ---- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| item | `{ item: Record<string, unknown> \| string \| number; index: number }` | Row content; without it string / number entries render as text and object entries render empty. |

### Methods

None. The component exposes no instance methods through `defineExpose`.

Behavior notes:

- Fixed heights position at `index * itemSize`; dynamic heights keep a
  prefix-sum table resolved by binary search.
- `item-resizable` measures downward only: re-measuring never shifts rows above
  the measured window.
- Replacing the `items` array clears the measured-height cache.
- The render key comes from the `key-field` value; keeping entry identity stable
  avoids rebuilding the DOM wholesale.

## Tokens

| Token        | CSS variable                  | Purpose  |
| ------------ | ----------------------------- | -------- |
| Text primary | `--sn-web-color-text-primary` | Row text |

## Accessibility

- The scroll container carries `role="list"` and each row carries
  `role="listitem"`.
- The container is a natively focusable scrolling element, so keyboard scrolling
  and screen-reader scrollbar semantics come from the native scroll container.
- `visible-height` only pins the viewport height and does not change scrolling or
  focus behavior.

## AI Patch Boundary

| Safe for AI to generate                                              | Requires human review                                                                          |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `items` list content and the `key-field` name                        | The paging / incremental loading strategy for `items` and when the array is replaced wholesale |
| Size parameters such as `item-size` / `overscan` / `visible-height`  | Data requests and throttling policy inside `update:scroll-top` listeners                       |
| The `item-resizable` switch and static composition in docs and demos | Interactive controls and async data inside the `item` slot                                     |

- AI-generated JSON Patches may only modify the prop data surface above and must
  not inject slot content, event handlers or internal scroll offsets.
- `item-size` must be a positive number; `overscan` a non-negative integer.
- When replacing `items`, keep the `key-field` values stable so the DOM is not
  rebuilt wholesale.

See the component `ai-description.md` for the full contract.
