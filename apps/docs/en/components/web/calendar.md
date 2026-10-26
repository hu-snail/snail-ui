# Calendar · Web

A month-view panel for browsing dates and picking a day.

## Basic

Pick a date with `v-model:value`, customize cells via the default slot, disable dates with `is-date-disabled`.

<Demo name="calendar-web-basic" description="v-model:value + custom cells + disabled dates." />

## API

### SnCalendar Props

| Prop             | Type                                   | Default     | Notes                                                         |
| ---------------- | -------------------------------------- | ----------- | ------------------------------------------------------------- |
| value            | `number \| null`                       | `undefined` | Selected date (millisecond timestamp), v-model:value          |
| default-value    | `number \| null`                       | `null`      | Uncontrolled initial selection; anchors the first panel month |
| is-date-disabled | `(ts: number) => boolean \| undefined` | `undefined` | Return true to disable a date                                 |

### Events

| Name         | Parameters                                     | Notes                                                           |
| ------------ | ---------------------------------------------- | --------------------------------------------------------------- |
| update:value | `(value: number, time: { year, month, date })` | Selection changed; `month` is 1-based                           |
| panel-change | `(info: { year, month })`                      | Panel switched via prev / today / next or an out-of-month click |

### Slots

| Name    | Parameters              | Notes                                    |
| ------- | ----------------------- | ---------------------------------------- |
| default | `{ year, month, date }` | Custom cell content under the day number |
| header  | `{ year, month }`       | Custom header title                      |

Grid weeks start on Monday; the first row shows inline weekday labels; the grid pads to whole weeks (28 / 35 / 42 cells).

See the component `ai-description.md` for the full contract.
