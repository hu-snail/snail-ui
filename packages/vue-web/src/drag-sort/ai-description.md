# SnDragSort (Web)

Drag-and-drop sortable list for `@snui/vue-web` (AUI-WEB-FORM-018).

**Reference library: explicit divergence** — naive-ui has no sortable list
(verified against its component list). Per AGENTS.md §112 the surface
follows the near-universal sortable convention established by
`vuedraggable` / dnd-kit: items in via `v-model`, the complete reordered
array out via `update:modelValue`, an optional grip handle, per-item lock.

## When to use

Ordering is data: task / playlist / field / column ordering, priority
queues, "manage pins" panels. The reorder itself is the user's edit — the
component never mutates the prop array; it emits a **new reordered array**
(v-model) containing the consumer's original item objects.

## Mechanism (zero dependencies)

- HTML5 Drag & Drop on the rows — no sortable library is added
  (AGENTS.md §57).
- **Live preview**: while dragging, hovering a row's half (top/bottom for
  `vertical`, left/right for `horizontal`) reorders the list immediately;
  the commit happens once on `dragend` (which always fires after `drop`),
  so drop-inside and cancel-outside both land on the visible order.
- `<TransitionGroup>` FLIP animates rows sliding to their preview
  positions (disabled under `prefers-reduced-motion`).
- Locked (`disabled`) rows are neither draggable nor drop targets and a
  drag can never cross over one.
- Keyboard parity: Alt+Arrow moves the focused row (Up/Down vertical,
  Left/Right horizontal), swapping with the nearest movable neighbour and
  skipping over locked rows — the a11y path for users who cannot drag.
- `handle` restricts drag initiation to the built-in grip icon; rows stay
  text-selectable. Without it every row is grabbable.

Platform note: HTML5 DnD has no touch support on mobile browsers — this is
a PC-end component; on touch use the keyboard path or a pointer-event based
implementation.

## Props

| Prop       | Type                         | Default      | Notes                                                                        |
| ---------- | ---------------------------- | ------------ | ---------------------------------------------------------------------------- |
| modelValue | `SnDragSortItem[]`           | `[]`         | `v-model` — rows in render order. `key` required; extra fields flow through. |
| direction  | `'vertical' \| 'horizontal'` | `'vertical'` | Layout axis + the midpoint the dragover measures against.                    |
| disabled   | `boolean`                    | `false`      | Disables dragging AND keyboard moves for the whole list.                     |
| handle     | `boolean`                    | `false`      | Only the built-in grip initiates a drag; row content stays selectable.       |

`SnDragSortItem` = `{ key: string | number; disabled?: boolean } & Record<string, unknown>`.

## Events

| Event               | Payload                        | When                                                                  |
| ------------------- | ------------------------------ | --------------------------------------------------------------------- |
| `update:modelValue` | `SnDragSortItem[]`             | A move was committed (drag end or keyboard). New array, same objects. |
| `sort`              | `{ from: number; to: number }` | Indexes of the committed move (pre-move `from`, post-move `to`).      |

## Slots

| Slot   | Scoped props                           | Description                                              |
| ------ | -------------------------------------- | -------------------------------------------------------- |
| `item` | `item`, `index`, `isDragging: boolean` | Row content. Without it rows render `item.label ?? key`. |

## Accessibility

- Container `role="list"`, rows `role="listitem"`, each row focusable
  (`tabindex=0`) with a visible `:focus-visible` ring.
- `aria-keyshortcuts` advertises the Alt+Arrow moves per direction;
  `aria-disabled` marks locked rows.
- Keyboard moves emit the same `update:modelValue` / `sort` events as drags.

## Tokens

All styling resolves through `--sn-web-drag-sort-*` aliases with
`--sn-web-color-*` fallbacks: `--sn-web-drag-sort-gap`, `-item-gap`,
`-item-padding-x/y`, `-item-bg`, `-item-bg-disabled`, `-item-border-color`,
`-item-border-color-hover`, `-item-radius`, `-item-text-color`,
`-item-text-color-disabled`, `-item-focus-ring`, `-handle-color`,
`-handle-color-hover`, `-move-duration`.

## When NOT to use

- Reordering a plain text list with up/down buttons only (no drag) —
  plain buttons are lighter.
- Sorting by a computed value — sort the array, don't drag.
- Multi-list drag between containers — not supported (single list only).
