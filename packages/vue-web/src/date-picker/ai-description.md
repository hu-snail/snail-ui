# SnDatePicker (Web)

Web-end date picker component for `@snui/vue-web`. Mirrors naive-ui /
element-plus date-picker core surface (single + range modes, timestamp
values, month-grid panel, aside time columns, shortcuts, disabled dates).

## When to use

Use SnDatePicker when the user must enter a date / week / quarter / month /
year (optionally with a time of day), or a `[start, end]` range — booking
forms, report filters, scheduling. Prefer it over chained selects when the
calendar affordance matters.

## Props

| Prop                      | Type                                                                                                                                  | Default                                    | Notes                                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue                | `number \| [number, number] \| null`                                                                                                  | `null`                                     | `v-model`. Millisecond timestamps, local timezone. Range types bind `[start, end]`. Week = the week's Monday midnight; quarter = the quarter's first midnight.                                                                                                    |
| type                      | `'date' \| 'datetime' \| 'week' \| 'quarter' \| 'month' \| 'year' \| 'daterange' \| 'datetimerange' \| 'weekrange' \| 'quarterrange'` | `'date'`                                   | Panel + value mode. `*range` types are range modes.                                                                                                                                                                                                               |
| format                    | `string`                                                                                                                              | per-type default                           | Lowercase tokens: `yyyy yy MM M dd d HH H mm m ss s w ww q qq`. `w`/`ww` = ISO week number, `q`/`qq` = quarter. `yyyy` is the CALENDAR year — week formats at Dec/Jan boundaries may diverge from the ISO week-year. **Uppercase `YYYY-MM-DD` is NOT supported**. |
| placeholder               | `string \| [string, string]`                                                                                                          | `'请选择日期'` / `['开始日期','结束日期']` | Range modes accept a `[start, end]` pair.                                                                                                                                                                                                                         |
| clearable                 | `boolean`                                                                                                                             | `false`                                    | Shows × button when a value exists.                                                                                                                                                                                                                               |
| disabled                  | `boolean`                                                                                                                             | `false`                                    | Blocks open / select / clear.                                                                                                                                                                                                                                     |
| readonly                  | `boolean`                                                                                                                             | `false`                                    | Visible but inert.                                                                                                                                                                                                                                                |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'`                                                                                  | `'medium'`                                 | Trigger height + font preset.                                                                                                                                                                                                                                     |
| status                    | `'default' \| 'error' \| 'warning'`                                                                                                   | `'default'`                                | Border color + `aria-invalid`.                                                                                                                                                                                                                                    |
| disabledDate              | `(ts: number) => boolean`                                                                                                             | —                                          | Disable predicate over local-midnight timestamps. Day cells disable individually; month / quarter / year cells via their period start; week picks via their Monday. Disabled cells dim + `aria-disabled` + refuse picks.                                          |
| shortcuts                 | `Array<{ label, value: number \| [number, number] \| (() => …) }>`                                                                    | —                                          | Quick picks. Lazy getters resolve at click time; a click commits and closes.                                                                                                                                                                                      |
| shortcutsPosition         | `'left' \| 'right' \| 'bottom'`                                                                                                       | `'bottom'`                                 | Where the shortcuts bar renders (side column beside the panel body, or a bar above the footer).                                                                                                                                                                   |
| ariaLabel                 | `string`                                                                                                                              | `''`                                       | Accessible name (fallback: `'Date picker'`).                                                                                                                                                                                                                      |
| customClass / customStyle | `string` / `string \| object`                                                                                                         | —                                          | Root wrapper passthrough.                                                                                                                                                                                                                                         |

## Events

| Event               | Payload                                       | When                                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:modelValue` | `(value: number \| [number, number] \| null)` | Any committed pick, 确认, shortcut, or clear.                                                                                                                                                                               |
| `change`            | same                                          | Fires alongside `update:modelValue`.                                                                                                                                                                                        |
| `select`            | `(value: number \| [number, number] \| null)` | Per pick, before/without the final commit. Single: the draft value. Range: the provisional start after the first pick, the sorted pair after the second — pair with `disabledDate` to constrain the second end dynamically. |
| `clear`             | —                                             | Cleared via the × button.                                                                                                                                                                                                   |
| `focus` / `blur`    | `(FocusEvent)`                                | Trigger focus change.                                                                                                                                                                                                       |

## Value semantics

- Values are millisecond timestamps interpreted in the host's local
  timezone (`Date#getFullYear` / `new Date(y, m, d)` — no third-party
  date library).
- `date` / `week` / `quarter` / `month` / `year` commit at their period
  start (local midnight; week = Monday, quarter = quarter's first day);
  `datetime` / `datetimerange` commit the picked day combined with the
  selected time-of-day (default 00:00:00).
- Single `week` / `quarter` / `month` / `year` picks commit immediately
  and close the panel. `datetime` / `datetimerange` keep the panel open
  until 确认 (or Enter).
- Range: pick start, then end; when the second pick is earlier it swaps
  automatically; the committed tuple is always `[min, max]`. Clicking a
  day after a complete selection restarts the pick.
- `weekrange` highlights whole ISO weeks (start week through the END of
  the end week); `quarterrange` works on the quarter grid (second calendar
  steps one year).

## Panel

- Teleported to `body`, fixed-position (z-index 2000 default, override
  `--sn-web-date-picker-panel-z-index` / `--sn-web-time-picker-panel-z-index`)
  with bottom-preferred viewport flip (the simplified popper strategy
  shared with SnSelect / SnTimePicker).
- Month grid is Monday-first, 6×7, with clickable adjacent-month cells.
- Week types reuse the month grid — a click anywhere in a row picks that
  whole ISO week; the hovered row previews the range.
- Clicking the panel title drills down: day / quarter → month-of-year →
  year window. In `quarter` / `month` / `year` types the grids commit
  directly; in date types they are navigation-only.
- `datetime`: aside time columns (选择时间 header) sit RIGHT of the
  calendar — 左右布局. `datetimerange`: one time group per calendar
  (calendar | time | calendar | time), no visible per-side labels.
- Footer: 今天 jump (single `date` type) + 确认 confirm (time modes).
- Shortcuts render as a side column (left/right) or a bottom bar.

## Keyboard

- `Enter` — open; picks the cursor cell (closes for non-datetime types;
  commits + closes for datetime).
- `Space` — open (page scroll suppressed).
- `ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown` — move the cursor
  by one day / one week (one unit / one row in unit grids).
- `PageUp` / `PageDown` — page by the header unit (month in day view,
  year in unit views).
- `Escape` — close without committing.

## Accessibility

- Trigger: `role=combobox`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant` tracking the keyboard cursor, `aria-invalid`
  under `status: 'error'`.
- Panel grids: `role=grid` with `role=gridcell` cells carrying
  `aria-selected` / `aria-disabled`; weekday row uses `role=columnheader`.
  Time columns use `role=listbox` / `role=option`.

## Out of scope (not ported in this pass)

- Dual-panel month / year quick-jump (the drill-down title click is the
  simplified equivalent).
- `formatted-value` / `value-format` string binding.
- `disabled-time` callbacks (disabledDate covers the date axis).
- Uppercase format tokens (`YYYY-MM-DD`) — lowercase only.
- i18n: panel strings are zh-CN by default (en-US provided via locale).

## Tokens

All CSS consumes `--sn-web-date-picker-*` aliases with `--sn-web-color-*`
fallbacks (no hex literals). Themeable entry points: panel background /
border / z-index, cell selected / in-range / disabled fills, weekday text,
nav hover, time column geometry, shortcut styling, trigger size presets.
