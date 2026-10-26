# SnTimePicker (Web)

Web-end time picker component for `@snui/vue-web`. Mirrors naive-ui
`n-time-picker` main surface 1:1 (timestamp value, `HH:mm` / `HH:mm:ss`
formats, 12-hour mode).

## When to use

Use SnTimePicker when the user must enter a time of day — booking forms,
scheduling, opening-hours editors. Prefer it over a masked text input
when the value must be an exact timestamp without typos.

## Props

| Prop                      | Type                                                 | Default                | Notes                                                                                                          |
| ------------------------- | ---------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| modelValue                | `number \| null`                                     | `null`                 | `v-model`. Millisecond timestamp; the time-of-day part is edited, the date part is preserved (local timezone). |
| format                    | `'HH:mm' \| 'HH:mm:ss'`                              | `'HH:mm:ss'`           | Display format + panel column count. `HH:mm` is minute-precision: commits normalize seconds to `0`.            |
| placeholder               | `string`                                             | `'Please select time'` | Empty-state text.                                                                                              |
| clearable                 | `boolean`                                            | `false`                | Shows × button when a value exists.                                                                            |
| disabled                  | `boolean`                                            | `false`                | Blocks open / select / clear.                                                                                  |
| readonly                  | `boolean`                                            | `false`                | Visible but inert.                                                                                             |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'`             | Trigger height + font preset.                                                                                  |
| status                    | `'default' \| 'error' \| 'warning'`                  | `'default'`            | Border color + `aria-invalid`.                                                                                 |
| use12Hours                | `boolean`                                            | `false`                | 12-hour faces (12, 1 … 11, clock order) plus an AM/PM column.                                                  |
| ariaLabel                 | `string`                                             | `''`                   | Accessible name (fallback: `'Time picker'`).                                                                   |
| customClass / customStyle | `string` / `string \| object`                        | —                      | Root wrapper passthrough.                                                                                      |

## Events

| Event               | Payload                   | When                                                     |
| ------------------- | ------------------------- | -------------------------------------------------------- |
| `update:modelValue` | `(value: number \| null)` | Any cell click, any keyboard step, Enter confirm, clear. |
| `change`            | `(value: number \| null)` | Same — fires alongside `update:modelValue`.              |
| `focus` / `blur`    | `(FocusEvent)`            | Trigger focus change.                                    |

## Value semantics

- The value is a millisecond timestamp; `Date#getHours` / `Date#setHours`
  (the reference library's convention) read and write the time-of-day in
  the host's local timezone.
- Committing keeps the bound value's date and replaces only the
  time-of-day. A `null` model commits against today's date.
- Every column interaction commits immediately — clicking a cell or
  pressing ArrowUp / ArrowDown on the active column emits
  `update:modelValue` right away (the reference's
  update-on-interact behavior).
- Enter confirms what the panel shows and closes; it commits when the
  model is `null` or the shown draft differs from the bound value, and
  never re-emits an unchanged value. Escape closes without committing a
  `null` model (unconfirmed steps are discarded on the next open).
- `format: 'HH:mm'` hides the seconds column and zeroes the seconds part
  on commit.

## Keyboard

- `Enter` — open the panel; second `Enter` confirms + closes.
- `Space` — open the panel (page scroll suppressed).
- `ArrowUp` / `ArrowDown` — step the active column's value (wraps:
  hour 0 ⇄ 23, face 12 ⇄ 1, minute/second 0 ⇄ 59) and commit.
- `Tab` / `Shift+Tab` — cycle the active column forward / backward.
- `Escape` — close the panel.

## Panel

Teleported to `body`, `position: fixed` against the trigger rect —
bottom preferred, flips to top when the viewport lacks room below (the
simplified popper strategy SnSelect documents; no reposition-on-scroll).
Columns are scrollable lists; the selected cell is highlighted and
scrolled into view on open and on every step. Clicking a cell selects it
directly and keeps the panel open.

## Tokens

All styling resolves through `--sn-web-time-picker-*` aliases with
`--sn-web-color-*` fallbacks:

| Token                                           | Default                              | Purpose                |
| ----------------------------------------------- | ------------------------------------ | ---------------------- |
| `--sn-web-time-picker-height`                   | `22–40px` (per size)                 | Trigger height         |
| `--sn-web-time-picker-radius`                   | `6px`                                | Corner radius          |
| `--sn-web-time-picker-border-color`             | `--sn-web-color-border-default`      | Trigger border         |
| `--sn-web-time-picker-border-color-focus`       | `--sn-web-color-action-primary`      | Open/focus border      |
| `--sn-web-time-picker-bg`                       | `--sn-web-color-background-surface`  | Trigger background     |
| `--sn-web-time-picker-text-color`               | `--sn-web-color-text-primary`        | Value text             |
| `--sn-web-time-picker-placeholder-color`        | `--sn-web-color-text-tertiary`       | Placeholder text       |
| `--sn-web-time-picker-panel-bg`                 | `--sn-web-color-background-elevated` | Panel fill             |
| `--sn-web-time-picker-panel-height`             | `224px`                              | Column viewport height |
| `--sn-web-time-picker-col-width`                | `56px`                               | Column width           |
| `--sn-web-time-picker-col-bg-active`            | `--sn-web-color-background-subtle`   | Active column tint     |
| `--sn-web-time-picker-item-bg-hover`            | `--sn-web-color-background-subtle`   | Cell hover fill        |
| `--sn-web-time-picker-item-bg-selected`         | `--sn-web-color-action-primary`      | Selected cell fill     |
| `--sn-web-time-picker-item-text-color-selected` | `--sn-web-color-text-on-primary`     | Selected cell text     |
| `--sn-web-time-picker-panel-z-index`            | `1000`                               | Panel stacking         |

## Accessibility

- Trigger: `role="combobox"` + `aria-expanded` + `aria-haspopup="listbox"`.
- Panel: `role="group"` containing one `role="listbox"` per column.
- Cells: `role="option"` + `aria-selected` + `data-column` / `data-value`.
- `aria-activedescendant` tracks the active column's selection;
  `aria-controls` points at the open panel.
- `aria-invalid` mirrors `status="error"`; `aria-readonly` /
  `aria-disabled` mirror their props.

## When NOT to use

- A date (or date + time) — use a date picker.
- Free-form duration input ("2h 30m") — use SnInput.
