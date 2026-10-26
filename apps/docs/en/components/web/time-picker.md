# TimePicker · Web

Teleport three-column (H/M/S) panel with 12-hour mode and full keyboard support.

## Basic

<Demo name="time-picker-web-basic" description="v-model (ms timestamp) + default HH:mm:ss." />

## format (columns)

<Demo name="time-picker-web-format" description="HH:mm hides the seconds column; seconds zero on commit." />

## 12-hour (use12Hours)

<Demo name="time-picker-web-12h" description="Clock-face order 12/1…11 + AM/PM column." />

## Clearable / disabled / readonly

<Demo name="time-picker-web-states" description="clearable, disabled, readonly." />

## API

### SnTimePicker Props

| Prop                | Type                                         | Default      | Notes                                        |
| ------------------- | -------------------------------------------- | ------------ | -------------------------------------------- |
| modelValue          | `number \| null`                             | `null`       | ms timestamp (local TZ; date part preserved) |
| format              | `'HH:mm' \| 'HH:mm:ss'`                      | `'HH:mm:ss'` | Drives column count                          |
| placeholder         | `string`                                     | —            | Placeholder                                  |
| clearable           | `boolean`                                    | `false`      | Clear button                                 |
| disabled / readonly | `boolean`                                    | `false`      | Disabled / read-only                         |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`   | Size                                         |
| status              | `'default'\|'error'\|'warning'`              | `'default'`  | Status                                       |
| use12Hours          | `boolean`                                    | `false`      | 12-hour + AM/PM                              |

Keyboard: ArrowUp/Down steps the active column (immediate commit), Tab/Shift+Tab switch columns, Enter confirms, Esc closes. ARIA: combobox trigger + per-column listbox.

See the component `ai-description.md` for the full contract.
