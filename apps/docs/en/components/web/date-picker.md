# DatePicker · Web

Date picker with date / datetime / week / quarter / month / year and their range modes; no third-party date library. Datetime panels use a side-by-side "calendar | time columns" layout.

## Basic (date)

<Demo name="date-picker-web-basic" description="Month grid; v-model in ms timestamps." />

## Date & time (datetime, side-by-side)

<Demo name="date-picker-web-datetime" description="Calendar | H/M/S columns layout + confirm." />

## Week / quarter

<Demo name="date-picker-web-week-quarter" description="type='week' / 'quarter' / 'weekrange': week-row picks (value = Monday), quarter grid (value = quarter start)." />

## Month / year

<Demo name="date-picker-web-month-year" description="type='month' / 'year' grids with drill-down." />

## Range (daterange / datetimerange)

<Demo name="date-picker-web-range" description="Dual calendars; start then end; auto-swap when reversed; datetimerange puts a time group beside each calendar." />

## Shortcuts / dynamic constraints

<Demo name="date-picker-web-shortcuts" description="shortcuts (left/right/bottom), disabledDate, and onSelect + disabledDate dynamic range limiting." />

## format

<Demo name="date-picker-web-format" description="Lowercase tokens: yyyy / MM / dd / HH / mm / ss / ww (ISO week) / qq (quarter)." />

## Clearable / disabled

<Demo name="date-picker-web-states" description="clearable, disabled, readonly." />

## API

### SnDatePicker Props

| Prop                | Type                                                                                                                | Default     | Notes                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| type                | `'date'\|'datetime'\|'week'\|'quarter'\|'month'\|'year'\|'daterange'\|'datetimerange'\|'weekrange'\|'quarterrange'` | `'date'`    | Mode (range values are arrays)                                                                  |
| modelValue          | `number \| [number, number] \| null`                                                                                | `null`      | ms timestamp (range: `[start, end]`; week = Monday, quarter = quarter start)                    |
| format              | `string`                                                                                                            | per mode    | Lowercase tokens (…/w/ww/q/qq); `yyyy` is the calendar year                                     |
| placeholder         | `string \| [string, string]`                                                                                        | —           | Placeholder (dual in range)                                                                     |
| clearable           | `boolean`                                                                                                           | `false`     | Clear button                                                                                    |
| disabledDate        | `(ts: number) => boolean`                                                                                           | —           | Disable predicate (period cells via their start; weeks via Monday); disabled cells refuse picks |
| shortcuts           | `{ label, value: number \| [number, number] \| (() => …) }[]`                                                       | —           | Quick picks; lazy getters resolve on click, commit and close                                    |
| shortcutsPosition   | `'left' \| 'right' \| 'bottom'`                                                                                     | `'bottom'`  | Shortcuts placement (side column / bottom bar)                                                  |
| disabled / readonly | `boolean`                                                                                                           | `false`     | Disabled / read-only                                                                            |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                                                                        | `'medium'`  | Size                                                                                            |
| status              | `'default'\|'error'\|'warning'`                                                                                     | `'default'` | Status                                                                                          |

Events: `update:modelValue` / `change` / **`select`** (fires per pick: range emits the provisional start, then the sorted pair — pair with `disabledDate` for dynamic range limiting) / `clear` / `focus` / `blur`. Keyboard: Arrow move, PageUp/PageDown paging, Enter pick/confirm, Esc close, Space open. ARIA: grid/gridcell + aria-selected / aria-disabled. date/week/quarter/month/year commit on click; datetime modes require confirm. Weeks start Monday; panel z-index defaults to 2000 (`--sn-web-date-picker-panel-z-index`).

**Out of scope** (see ai-description.md): disabledTime, dual-panel month/year quick-jump, formatted-value/value-format.

See the component `ai-description.md` for the full contract.
