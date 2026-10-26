# SnSelect / SnOption (Web)

Web-end select component for `@snui/vue-web`. Mirrors naive-ui `n-select`
main surface 1:1 (single / multiple / filterable / remote / grouped
options).

## When to use

Use SnSelect when the user picks one (or several) values from a list too
long for radios — form filters, category pickers, tag-style multi-select.

## SnSelect Props

| Prop                      | Type                                                        | Default           | Notes                                                           |
| ------------------------- | ----------------------------------------------------------- | ----------------- | --------------------------------------------------------------- |
| modelValue                | `string \| number \| boolean \| null \| Array`              | `null`            | `v-model`. Array when `multiple`.                               |
| multiple                  | `boolean`                                                   | `false`           | Tag-style multi-select.                                         |
| options                   | `Array<{ label, value, disabled, children? } \| raw value>` | `[]`              | Object options or bare `string/number/boolean` values.          |
| labelField                | `string`                                                    | `'label'`         | Label key remapping (naive `label-field`).                      |
| valueField                | `string`                                                    | `'value'`         | Value key remapping (naive `value-field`).                      |
| childrenField             | `string`                                                    | `'children'`      | Group children key remapping (naive `children-field`).          |
| placeholder               | `string`                                                    | `'Please select'` | Empty-state text.                                               |
| clearable                 | `boolean`                                                   | `false`           | Shows × button when a value exists.                             |
| filterable                | `boolean`                                                   | `false`           | Enables the internal filter input.                              |
| filter                    | `(pattern, option) => boolean`                              | label substring   | Custom filter predicate (naive `filter`).                       |
| disabled                  | `boolean`                                                   | `false`           | Blocks open / select / clear.                                   |
| readonly                  | `boolean`                                                   | `false`           | Visible but inert.                                              |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'`        | `'medium'`        | Trigger height + font preset.                                   |
| status                    | `'default' \| 'error' \| 'warning'`                         | `'default'`       | Border color + `aria-invalid`.                                  |
| maxTagCount               | `number`                                                    | —                 | Collapse extra multiple tags into `+N`.                         |
| tag                       | `boolean`                                                   | `false`           | Pill-style value display (naive `tag`).                         |
| loading                   | `boolean`                                                   | `false`           | Spinner replaces the arrow.                                     |
| remote                    | `boolean`                                                   | `false`           | Typing emits `search`; host swaps `options` + drives `loading`. |
| ariaLabel                 | `string`                                                    | `''`              | Accessible name (fallback: `label`).                            |
| label                     | `string`                                                    | `''`              | Accessible label for the menu listbox.                          |
| emptyText                 | `string`                                                    | `'No options'`    | Empty state text (`empty` slot wins).                           |
| customClass / customStyle | `string` / `string \| object`                               | —                 | Root wrapper passthrough.                                       |

## SnSelect Events

| Event               | Payload           | When                                        |
| ------------------- | ----------------- | ------------------------------------------- |
| `update:modelValue` | `(value)`         | Selection committed / tag removed / clear.  |
| `update:value`      | `(value)`         | Same — naive-ui spelling.                   |
| `change`            | `(value)`         | Selection committed.                        |
| `search`            | `(query: string)` | Every filter keystroke (`remote` included). |
| `clear`             | —                 | Clear button activated.                     |
| `focus` / `blur`    | `(FocusEvent)`    | Trigger focus change.                       |
| `scroll`            | `(Event)`         | Menu body scrolled to the bottom.           |

## SnSelect Slots

| Slot     | Description                       |
| -------- | --------------------------------- |
| `header` | Dropdown top area.                |
| `empty`  | Empty state (no matching option). |
| `action` | Dropdown bottom area.             |

## SnOption (internal)

Rendered by SnSelect via provide/inject — not exported from the package
entry. Each row carries `role="option"`, `aria-selected`, `aria-disabled`
and a stable DOM id so `aria-activedescendant` tracks the keyboard
highlight.

## Keyboard

- `Enter` — open the menu; second `Enter` selects the highlighted option.
- `Space` — open the menu (page scroll suppressed).
- `ArrowUp` / `ArrowDown` — move the highlight (wraps, skips disabled rows).
- `Escape` — close the menu.
- `Backspace` — removes the last tag (multiple + filterable + empty query).

## Tokens

All styling resolves through `--sn-web-select-*` aliases with
`--sn-web-color-*` fallbacks:

| Token                                | Default                                   | Purpose            |
| ------------------------------------ | ----------------------------------------- | ------------------ |
| `--sn-web-select-height`             | `22–40px` (per size)                      | Trigger height     |
| `--sn-web-select-radius`             | `6px`                                     | Corner radius      |
| `--sn-web-select-border-color`       | `--sn-web-color-border-default`           | Trigger border     |
| `--sn-web-select-border-color-focus` | `--sn-web-color-action-primary`           | Open/focus border  |
| `--sn-web-select-bg`                 | `--sn-web-color-background-surface`       | Trigger background |
| `--sn-web-select-text-color`         | `--sn-web-color-text-primary`             | Value text         |
| `--sn-web-select-placeholder-color`  | `--sn-web-color-text-tertiary`            | Placeholder text   |
| `--sn-web-select-tag-bg`             | `--sn-web-color-background-soft`          | Tag pill fill      |
| `--sn-web-select-menu-bg`            | `--sn-web-color-background-elevated`      | Dropdown fill      |
| `--sn-web-select-option-bg-hover`    | `--sn-web-color-background-surface-hover` | Row highlight      |
| `--sn-web-select-option-bg-selected` | `--sn-web-color-action-primary-soft`      | Selected row fill  |
| `--sn-web-select-menu-z-index`       | `1000`                                    | Dropdown stacking  |

## Accessibility

- Trigger: `role="combobox"` + `aria-expanded` + `aria-haspopup="listbox"`.
- Menu: `role="listbox"` (`aria-multiselectable` in multiple mode).
- Rows: `role="option"` + `aria-selected` + `aria-disabled`.
- Keyboard highlight exposed through `aria-activedescendant`.
- `aria-invalid` mirrors `status="error"`.

## When NOT to use

- Two or three fixed choices — use SnRadioGroup.
- Free-form text entry — use SnInput.
