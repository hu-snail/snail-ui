# Heatmap · Web

A GitHub-style contribution heatmap: columns = weeks, rows = weekdays,
colored by activity level.

## Basic

Pass `data` (`{ timestamp, value }` list); the grid is week-aligned and
gap-filled automatically. Week / month labels and the indicator are
toggleable.

<Demo name="heatmap-web-basic" description="Data + label/indicator toggles + size." />

## Custom colors

`active-colors` (light → dark) and `minimum-color` override the built-in scale.

<Demo name="heatmap-web-colors" description="active-colors / minimum-color customization." />

## Slots

`footer` for the left footer area, `indicator` to replace the indicator
block, `indicator-leading-text` / `indicator-trailing-text` for the scale
texts; `tooltip` enables the native hover hint.

<Demo name="heatmap-web-slots" description="footer / indicator / indicator text slots + tooltip." />

## Color themes

`color-theme` offers `green` / `blue` / `orange` / `purple` / `red`.

<Demo name="heatmap-web-themes" description="The five built-in color themes." />

## API

### SnHeatmap Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| data | `Array<{ timestamp: number, value?: number \| null }>` | `undefined` | Data source; in-range gaps fill with 0, out-of-range days stay blank |
| loading-data | `Array<{ timestamp: number, value?: number \| null }>` | `undefined` | Data shown while loading |
| active-colors | `string[]` | `undefined` | Custom level colors, light → dark |
| minimum-color | `string` | `undefined` | Custom minimum-level color |
| color-theme | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'` | `undefined` | Built-in color theme |
| fill-calendar-leading | `boolean` | `false` | Fill leading blanks with 0 |
| first-day-of-week | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Week start, 0 = Monday |
| loading | `boolean` | `false` | Loading state; renders a 7 × 53 skeleton without loading-data |
| show-color-indicator | `boolean` | `true` | Bottom color indicator |
| show-week-labels | `boolean` | `true` | Left week labels |
| show-month-labels | `boolean` | `true` | Top month labels |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Scale (rects 10 / 11 / 12 px) |
| tooltip | `boolean` | `false` | Native title hint ('date value') |
| x-gap | `number \| string` | `undefined` | Overrides the vertical (row) side of the spacing (second border-spacing value) |
| y-gap | `number \| string` | `undefined` | Overrides the horizontal (column) side of the spacing (first border-spacing value) |

### Events

None.

### Slots

| Name | Parameters | Notes |
| --- | --- | --- |
| footer | — | Left footer area |
| indicator | — | Replaces the right-side indicator |
| indicator-leading-text | — | Leading scale text (default '少') |
| indicator-trailing-text | — | Trailing scale text (default '多') |

The grid is always 7 rows (one per weekday); data is sorted and
week-aligned; levels use 5 buckets scaled by the data max.

See the component `ai-description.md` for the full contract.
