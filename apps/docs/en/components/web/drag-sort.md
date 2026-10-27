# DragSort 拖拽排序（Web 端）

`SnDragSort` — a drag-and-drop sortable list: live preview while dragging,
commit on release, `v-model` binds the complete reordered array. Zero
runtime dependencies (HTML5 DnD + TransitionGroup FLIP).

## When to use

- Ordering is the user's edit: task lists, playlists, field order, board
  columns, priority queues
- Lists with pinned rows that must never be displaced (`disabled` rows)
- Keyboard users must be able to reorder too (Alt + arrows)

Not for: sorting by a computed value (just `sort` the array); dragging
between multiple containers (single list only).

## Examples

### Basic

Drag any row onto a target; the list reorders live and commits on release.
Rows with `disabled: true` are locked — not draggable, not drop targets,
never crossed. Keyboard: focus a row, then `Alt + ↑/↓`.

<Demo name="drag-sort-web-basic" description="Live preview + locked row + Alt+arrow keyboard moves." />

### Handle mode

With `handle`, only the built-in grip starts a drag; row content stays
text-selectable. Locked rows render no grip.

<Demo name="drag-sort-web-handle" description="Only the grip drags; the pinned notice is locked." />

### Horizontal

`direction="horizontal"` lays rows out on the x axis; the midpoint check
uses left/right halves and the keyboard switches to `Alt + ←/→`.

<Demo name="drag-sort-web-horizontal" description="Horizontal tag ordering with left/right midpoint." />

## API

### SnDragSort Props

| Name       | Type                         | Default      | Notes                                                                 |
| ---------- | ---------------------------- | ------------ | --------------------------------------------------------------------- |
| modelValue | `SnDragSortItem[]`           | `[]`         | `v-model` row array; `key` required, extra fields pass to the slot    |
| direction  | `'vertical' \| 'horizontal'` | `'vertical'` | Layout axis; also picks the dragover midpoint axis and the arrow keys |
| disabled   | `boolean`                    | `false`      | Disables dragging AND keyboard moves for the whole list               |
| handle     | `boolean`                    | `false`      | Only the built-in grip initiates a drag; rows stay selectable         |

`SnDragSortItem` = `{ key: string | number; disabled?: boolean } & Record<string, unknown>`

Events: `update:modelValue` (the complete next array; the item objects keep
their identity) and `sort({ from, to })` (indexes of the committed move).
Drags and keyboard moves share the same commit path.

Slot: `#item="{ item, index, isDragging }"` for row content; rows render
`item.label ?? key` without it.

Behavior notes: hovering a row's half (top/bottom or left/right) previews
the insertion live; release (`dragend`, including a cancelled drag)
commits the visible order (vuedraggable semantics). HTML5 DnD has no touch
support — this is a PC-end component.

See the component `ai-description.md` for the full contract.
