# DatePicker · Web

Date picker with date / datetime / week / quarter / month / year and their range modes; no third-party date library. Single `datetime` uses a side-by-side "calendar | time columns" layout; `datetimerange` uses four header fields + dual calendars + a time popover; `monthrange` uses dual year | month panes.

## Basic (date)

<Demo name="date-picker-web-basic" description="Month grid; v-model in ms timestamps." />

## Date & time (datetime, side-by-side)

<Demo name="date-picker-web-datetime" description="Calendar | H/M/S columns layout + confirm." />

## Week / quarter

<Demo name="date-picker-web-week-quarter" description="type='week' / 'quarter' / 'weekrange': week-row picks (value = Monday), quarter grid (value = quarter start)." />

## Month / year

<Demo name="date-picker-web-month-year" description="type='month' / 'year' grids with drill-down." />

## Range (daterange / datetimerange)

<Demo name="date-picker-web-range" description="Dual calendars; start then end; auto-swap when reversed; datetimerange uses a four-field header (start date / start time | end date / end time) with an H/M/S popover (Now / Confirm) and a Clear / Confirm footer; input-position='bottom' moves the input bar under the calendars. The panel is sized by the calendars, not by the inputs." />

## Month range (monthrange)

<Demo name="date-picker-web-month-range" description="Dual scrollable year | month panes with range highlight, auto-swap and a Clear / Confirm footer; values are the first-day timestamps of both months." />

## Shortcuts / dynamic constraints

<Demo name="date-picker-web-shortcuts" description="shortcuts (left/right/bottom), disabledDate, and onSelect + disabledDate dynamic range limiting." />

## format

<Demo name="date-picker-web-format" description="Lowercase tokens: yyyy / MM / dd / HH / mm / ss / ww (ISO week) / qq (quarter)." />

## Clearable / disabled

<Demo name="date-picker-web-states" description="clearable, disabled, readonly." />

## API

### SnDatePicker Props

| Prop                | Type                                                                                                                              | Default     | Notes                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| type                | `'date'\|'datetime'\|'week'\|'quarter'\|'month'\|'year'\|'daterange'\|'datetimerange'\|'weekrange'\|'quarterrange'\|'monthrange'` | `'date'`    | Mode (range values are arrays)                                                                  |
| modelValue          | `number \| [number, number] \| null`                                                                                              | `null`      | ms timestamp (range: `[start, end]`; week = Monday, quarter = quarter start)                    |
| format              | `string`                                                                                                                          | per mode    | Lowercase tokens (…/w/ww/q/qq); `yyyy` is the calendar year                                     |
| placeholder         | `string \| [string, string]`                                                                                                      | —           | Placeholder (dual in range)                                                                     |
| clearable           | `boolean`                                                                                                                         | `false`     | Clear button                                                                                    |
| disabledDate        | `(ts: number) => boolean`                                                                                                         | —           | Disable predicate (period cells via their start; weeks via Monday); disabled cells refuse picks |
| shortcuts           | `{ label, value: number \| [number, number] \| (() => …) }[]`                                                                     | —           | Quick picks; lazy getters resolve on click, commit and close                                    |
| shortcutsPosition   | `'left' \| 'right' \| 'bottom'`                                                                                                   | `'bottom'`  | Shortcuts placement (side column / bottom bar)                                                  |
| inputPosition       | `'top' \| 'bottom'`                                                                                                               | `'top'`     | datetimerange four-field bar placement (bottom opens the time popover upward)                   |
| disabled / readonly | `boolean`                                                                                                                         | `false`     | Disabled / read-only                                                                            |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                                                                                      | `'medium'`  | Size                                                                                            |
| status              | `'default'\|'error'\|'warning'`                                                                                                   | `'default'` | Status                                                                                          |

Events: `update:modelValue` / `change` / **`select`** (fires per pick: range emits the provisional start, then the sorted pair — pair with `disabledDate` for dynamic range limiting) / `clear` / `focus` / `blur`. Keyboard: Arrow move, PageUp/PageDown paging, Enter pick/confirm, Esc close, Space open (monthrange Arrows step by month / quarter, PageUp/Down by year). ARIA: grid/gridcell + aria-selected / aria-disabled. date/week/quarter/month/year commit on click; datetime modes and monthrange require confirm. Weeks start Monday; panel z-index defaults to 2000 (`--sn-web-date-picker-panel-z-index`). The focus halo derives from the theme primary (`--sn-web-date-picker-focus-ring` overrides it) instead of the global blue focus ring.

**Out of scope** (see ai-description.md): disabledTime, dual-panel month/year quick-jump, formatted-value/value-format.

See the component `ai-description.md` for the full contract.
