# SnCascader (Web)

<!-- Internal alignment note (AGENTS.md §112.2a / §114.4 — not user-facing copy):
     Reference library: naive-ui `n-cascader`
     https://www.naiveui.com/zh-CN/light/components/cascader
     Props + semantics mirror n-cascader's main surface. -->

Web-end cascader component for `@snui/vue-web`. Lets the user pick one value
(or many, in `multiple` tree-check mode) by drilling through a tree: each
level renders its own fixed-width column and the committed value is the full
root-to-leaf path (one path per leaf in multiple mode).

## When to use

Use SnCascader when the choice is naturally hierarchical — region pickers
(country / province / city), category trees, department chains. Use SnSelect
when the choices are a flat list; use SnTreeSelect when the tree should
render as one expandable list instead of side-by-side columns.

## SnCascader Props

| Prop          | Type                                                                | Default           | Notes                                                                                                                               |
| ------------- | ------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| modelValue    | `Array<string \| number> \| Array<Array<string \| number>> \| null` | `[]`              | `v-model`. Single: one full leaf path, root-first. Multiple: one path per committed leaf. Clear commits `[]`.                       |
| options       | `Array<{ label, value, disabled?, children? }>`                     | `[]`              | Tree options (recursive `children`).                                                                                                |
| labelField    | `string`                                                            | `'label'`         | Label key remapping.                                                                                                                |
| valueField    | `string`                                                            | `'value'`         | Value key remapping.                                                                                                                |
| childrenField | `string`                                                            | `'children'`      | Children key remapping.                                                                                                             |
| placeholder   | `string`                                                            | `'Please select'` | Empty-state text.                                                                                                                   |
| clearable     | `boolean`                                                           | `false`           | Shows × button when a value exists.                                                                                                 |
| filterable    | `boolean`                                                           | `false`           | Enables the internal filter input.                                                                                                  |
| multiple      | `boolean`                                                           | `false`           | Tree-check mode: checkbox per row; parent check cascades to all selectable descendant leaves; one removable tag per committed path. |
| maxTagCount   | `number`                                                            | —                 | Multiple only — max visible tags before the rest collapse into `+N`.                                                                |
| disabled      | `boolean`                                                           | `false`           | Blocks open / select / clear.                                                                                                       |
| readonly      | `boolean`                                                           | `false`           | Visible but inert.                                                                                                                  |
| size          | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'`                | `'medium'`        | Trigger + row height / font preset.                                                                                                 |
| status        | `'default' \| 'error' \| 'warning'`                                 | `'default'`       | Border color + `aria-invalid`.                                                                                                      |
| expandTrigger | `'click' \| 'hover'`                                                | `'click'`         | How a parent row opens the next column.                                                                                             |
| ariaLabel     | `string`                                                            | `''`              | Accessible name for the trigger.                                                                                                    |
| emptyText     | `string`                                                            | `'No options'`    | Empty state text (`empty` slot wins).                                                                                               |

## SnCascader Events

| Event               | Payload                                                                 | When                                                         |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `update:modelValue` | `(value: Array<string \| number>)` or `(value: (string \| number)[][])` | Leaf selected / cleared; multiple commits one path per leaf. |
| `change`            | Same as `update:modelValue`                                             | Selection committed (clear included).                        |
| `clear`             | —                                                                       | Clear button activated.                                      |
| `focus` / `blur`    | `(FocusEvent)`                                                          | Trigger focus change.                                        |

## SnCascader Slots

| Slot    | Description                                 |
| ------- | ------------------------------------------- |
| `empty` | Empty state (no options / no filter match). |

## Selection semantics

- Each menu column has a fixed width (`--sn-web-cascader-column-width`,
  default 160px) that does NOT adapt to its content — long labels ellipsize
  inside the row (full text available via the row `title`), naive-ui parity.
- Only leaves commit. Clicking (or hovering, per `expandTrigger`) a parent
  swaps the next column to its children; the walked ancestors stay
  highlighted so the current path is always visible.
- The bound value is the full root-to-leaf path array. The trigger echoes
  the path labels joined with `" / "` (e.g. `Asia / China / Beijing`).
- Reopening the menu restores the committed path: ancestors re-expand and
  the leaf is highlighted (multiple mode: the first bound path re-expands).
- A bound path that no longer exists in `options` renders the placeholder.
- `filterable` matches case-insensitively against the full path text, so
  typing a parent label keeps every leaf below it; matches render as a
  flat list of full-path rows and a click commits directly.
- `multiple` (tree check): every row renders a checkbox and the menu stays
  open while toggling. Checking a leaf adds its path; checking a parent
  adds every selectable (non-disabled) descendant leaf path; unchecking
  removes the same set. A parent whose subtree is partially checked shows
  an indeterminate checkbox. The trigger renders one removable tag per
  committed path (`maxTagCount` collapses the rest into `+N`); the clear
  button removes every path at once.

## Keyboard

- `Enter` — open the menu; on a highlighted parent, expand it; on a
  highlighted leaf, select and close (multiple mode: toggle the check and
  keep the menu open).
- `Space` — open the menu (page scroll suppressed; inside the filter input
  it types a space instead).
- `ArrowUp` / `ArrowDown` — move the highlight within the active column
  (wraps, skips disabled rows).
- `ArrowRight` — expand the highlighted parent and enter its child column.
- `ArrowLeft` — collapse back to the parent column.
- `Escape` — close the menu.

## Tokens

All styling resolves through `--sn-web-cascader-*` aliases with
`--sn-web-color-*` fallbacks:

| Token                                         | Default                                   | Purpose                                    |
| --------------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| `--sn-web-cascader-height`                    | `22–40px` (per size)                      | Trigger height                             |
| `--sn-web-cascader-radius`                    | `6px`                                     | Corner radius                              |
| `--sn-web-cascader-border-color`              | `--sn-web-color-border-default`           | Trigger border                             |
| `--sn-web-cascader-border-color-focus`        | `--sn-web-color-action-primary`           | Open/focus border                          |
| `--sn-web-cascader-bg`                        | `--sn-web-color-background-surface`       | Trigger fill                               |
| `--sn-web-cascader-text-color`                | `--sn-web-color-text-primary`             | Value text                                 |
| `--sn-web-cascader-placeholder-color`         | `--sn-web-color-text-tertiary`            | Placeholder text                           |
| `--sn-web-cascader-menu-bg`                   | `--sn-web-color-background-elevated`      | Dropdown fill                              |
| `--sn-web-cascader-menu-z-index`              | `1000`                                    | Dropdown stacking                          |
| `--sn-web-cascader-column-width`              | `160px`                                   | Column fixed width (no content adaptation) |
| `--sn-web-cascader-menu-max-height`           | `260px`                                   | Columns scroll cap                         |
| `--sn-web-cascader-option-bg-hover`           | `--sn-web-color-background-surface-hover` | Row highlight                              |
| `--sn-web-cascader-option-bg-selected`        | `--sn-web-color-action-primary-soft`      | Selected leaf fill                         |
| `--sn-web-cascader-option-text-color-in-path` | `--sn-web-color-action-primary`           | Walked parent text                         |
| `--sn-web-cascader-checkbox-*`                | `--sn-web-color-*` (box / border / check) | Multiple-mode checkbox glyph               |
| `--sn-web-cascader-tag-*`                     | `--sn-web-color-*` (bg / text / close)    | Multiple-mode trigger tags                 |

## Accessibility

- Trigger: `role="combobox"` + `aria-expanded` + `aria-haspopup="listbox"`.
- Every column is a `role="listbox"` (labeled by level); rows are
  `role="option"` with `aria-selected` / `aria-disabled`. Multiple mode
  adds `aria-multiselectable="true"` per column.
- Keyboard highlight exposed through `aria-activedescendant`.
- `aria-invalid` mirrors `status="error"`.

## When NOT to use

- Flat choices — use SnSelect.
- Single expandable tree list instead of columns — use SnTreeSelect.
- Parent-node value commits (checkStrategy / check-strictly) — not
  supported yet; values are always leaf paths. Use SnTreeSelect for a
  strict parent/child check model.
