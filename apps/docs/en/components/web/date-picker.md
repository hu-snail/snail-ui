# DatePicker · Web

Date picker with date / datetime / month / year / daterange / datetimerange modes; no third-party date library.

## Basic (date)

<Demo name="date-picker-web-basic" description="Month grid; v-model in ms timestamps." />

## Date & time (datetime)

<Demo name="date-picker-web-datetime" description="Month grid + H/M/S columns + confirm." />

## Month / year

<Demo name="date-picker-web-month-year" description="type='month' / 'year' grids with drill-down." />

## Range (daterange / datetimerange)

<Demo name="date-picker-web-range" description="Dual calendars; start then end; auto-swap when reversed." />

## format

<Demo name="date-picker-web-format" description="Lowercase tokens: yyyy / MM / dd / HH / mm / ss." />

## Clearable / disabled

<Demo name="date-picker-web-states" description="clearable, disabled, readonly." />

## API

### SnDatePicker Props

| Prop                | Type                                                                | Default     | Notes                                               |
| ------------------- | ------------------------------------------------------------------- | ----------- | --------------------------------------------------- |
| type                | `'date'\|'datetime'\|'month'\|'year'\|'daterange'\|'datetimerange'` | `'date'`    | Mode (range values are arrays)                      |
| modelValue          | `number \| [number, number] \| null`                                | `null`      | ms timestamp (range: `[start, end]`)                |
| format              | `string`                                                            | per mode    | Lowercase tokens (yyyy/yy/MM/M/dd/d/HH/H/mm/m/ss/s) |
| placeholder         | `string \| [string, string]`                                        | —           | Placeholder (dual in range)                         |
| clearable           | `boolean`                                                           | `false`     | Clear button                                        |
| disabled / readonly | `boolean`                                                           | `false`     | Disabled / read-only                                |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                        | `'medium'`  | Size                                                |
| status              | `'default'\|'error'\|'warning'`                                     | `'default'` | Status                                              |

Events: `update:modelValue` / `change` / `clear` / `focus` / `blur`. Keyboard: Arrow move, PageUp/PageDown month/year paging, Enter pick/confirm, Esc close, Space open. ARIA: grid/gridcell + aria-selected. date/month/year commit on click; datetime modes require confirm. Weeks start Monday; panel copy is zh-CN.

**Out of scope** (see ai-description.md): shortcuts panel, disabled-date/min-max, hover range preview, i18n.

See the component `ai-description.md` for the full contract.
