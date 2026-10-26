# SnDatePicker (Web)

Web-end date picker component for `@snui/vue-web`. Mirrors naive-ui
`n-date-picker` core surface 1:1 (single / range modes, timestamp values,
month-grid panel with time columns).

## When to use

Use SnDatePicker when the user must enter a date (optionally with a time
of day), or a `[start, end]` date range — booking forms, report filters,
scheduling. Prefer it over three chained selects when the calendar
affordance matters.

## Props

| Prop                      | Type                                                                          | Default                                    | Notes                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| modelValue                | `number \| [number, number] \| null`                                          | `null`                                     | `v-model`. Millisecond timestamps, local timezone. Range types bind `[start, end]`.                                            |
| type                      | `'date' \| 'datetime' \| 'month' \| 'year' \| 'daterange' \| 'datetimerange'` | `'date'`                                   | Panel + value mode. `*range` types are range modes.                                                                            |
| format                    | `string`                                                                      | per-type default                           | Lowercase tokens only: `yyyy yy MM M dd d HH H mm m ss s`. **Uppercase `YYYY-MM-DD` is NOT supported** (documented deviation). |
| placeholder               | `string \| [string, string]`                                                  | `'请选择日期'` / `['开始日期','结束日期']` | Range modes accept a `[start, end]` pair.                                                                                      |
| clearable                 | `boolean`                                                                     | `false`                                    | Shows × button when a value exists.                                                                                            |
| disabled                  | `boolean`                                                                     | `false`                                    | Blocks open / select / clear.                                                                                                  |
| readonly                  | `boolean`                                                                     | `false`                                    | Visible but inert.                                                                                                             |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'`                          | `'medium'`                                 | Trigger height + font preset.                                                                                                  |
| status                    | `'default' \| 'error' \| 'warning'`                                           | `'default'`                                | Border color + `aria-invalid`.                                                                                                 |
| ariaLabel                 | `string`                                                                      | `''`                                       | Accessible name (fallback: `'Date picker'`).                                                                                   |
| customClass / customStyle | `string` / `string \| object`                                                 | —                                          | Root wrapper passthrough.                                                                                                      |

## Events

| Event               | Payload                                       | When                                 |
| ------------------- | --------------------------------------------- | ------------------------------------ |
| `update:modelValue` | `(value: number \| [number, number] \| null)` | Any committed pick, 确认, or clear.  |
| `change`            | same                                          | Fires alongside `update:modelValue`. |
| `clear`             | —                                             | Cleared via the × button.            |
| `focus` / `blur`    | `(FocusEvent)`                                | Trigger focus change.                |

## Value semantics

- Values are millisecond timestamps interpreted in the host's local
  timezone (`Date#getFullYear` / `new Date(y, m, d)` — the reference
  library's convention). No third-party date library is used.
- `date` / `month` / `year` commit at local midnight; `datetime` /
  `datetimerange` commit the picked day combined with the selected
  time-of-day (default 00:00:00).
- Single `date` / `month` / `year` picks commit immediately and close the
  panel (the reference's update-on-click behavior). `datetime` /
  `datetimerange` keep the panel open until 确认 (or Enter).
- Range: pick start, then end; when the second pick is earlier it swaps
  automatically; the committed tuple is always `[min, max]`. Clicking a
  day after a complete selection restarts the pick.

## Panel

- Teleported to `body`, fixed-position with bottom-preferred viewport
  flip (the simplified popper strategy shared with SnSelect /
  SnTimePicker).
- Month grid is Monday-first, 6×7, with clickable adjacent-month cells.
- Clicking the panel title drills down: day → month-of-year → year
  window. In `month` / `year` types the grids commit directly; in date
  types they are navigation-only.
- `datetime` appends hour / minute / second scroll columns and a 确认
  footer; `datetimerange` shows one time group per range side.

## Keyboard

- `Enter` — open; picks the cursor cell (closes for non-datetime types;
  commits + closes for datetime).
- `Space` — open (page scroll suppressed).
- `ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown` — move the cursor
  by one day / one week (one unit / one row in month / year grids).
- `PageUp` / `PageDown` — page by the header unit (month in day view,
  year in unit views).
- `Escape` — close without committing.

## Accessibility

- Trigger: `role=combobox`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant` tracking the keyboard cursor, `aria-invalid`
  under `status: 'error'`.
- Panel grids: `role=grid` with `role=gridcell` cells carrying
  `aria-selected`; weekday row uses `role=columnheader`. Time columns
  use `role=listbox` / `role=option`.

## Out of scope (not ported in this pass)

- Shortcuts bar (`shortcuts` prop) and panel action buttons.
- Dual-panel month / year quick-jump (the drill-down title click is the
  simplified equivalent).
- `formatted-value` / `value-format` string binding.
- `disabled-date` / `disabled-time` callbacks and min/max clamping.
- Uppercase format tokens (`YYYY-MM-DD`) — lowercase only.
- i18n: panel strings are zh-CN only.
- Hover-linked range preview (selected-interval highlight only).
- Reposition-on-scroll for the teleported panel.

## Tokens

All CSS consumes `--sn-web-date-picker-*` aliases with `--sn-web-color-*`
fallbacks (no hex literals). Themeable entry points: panel background /
border, cell selected / in-range fills, weekday text, nav hover, time
column geometry, trigger size presets.
