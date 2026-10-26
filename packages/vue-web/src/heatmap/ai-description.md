# SnHeatmap — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end heatmap
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A GitHub-contribution-style heatmap: one column per calendar week, one row
per weekday, colored by activity level, with month / week labels and a
color indicator footer.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-heatmap`
(https://www.naiveui.com/zh-CN/light/components/heatmap, source
`src/heatmap/src/Heatmap.tsx` + `Rect.tsx` + `interface.ts`, a 2.42+
component).

## Import

```ts
import SnHeatmap from '@snui/vue-web/src/heatmap/SnHeatmap.vue';
```

## Props

| Name                    | Type                                                   | Default     | Required | Description                                                                                                                                                                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------ | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                  | `Array<{ timestamp: number, value?: number \| null }>` | `undefined` | no       | Data source; gaps inside the range fill with 0, days before the range / after the last date render blank.                                                                                                                                                                                                               |
| `loading-data`          | `Array<{ timestamp: number, value?: number \| null }>` | `undefined` | no       | Data shown while loading.                                                                                                                                                                                                                                                                                               |
| `active-colors`         | `string[]`                                             | `undefined` | no       | Custom level colors (light → dark); overrides the built-in theme.                                                                                                                                                                                                                                                       |
| `minimum-color`         | `string`                                               | `undefined` | no       | Custom color for the minimum level (0 / empty scale base).                                                                                                                                                                                                                                                              |
| `color-theme`           | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'`   | `undefined` | no       | Built-in color theme.                                                                                                                                                                                                                                                                                                   |
| `fill-calendar-leading` | `boolean`                                              | `false`     | no       | Fill the leading blank week cells with 0 instead of blanks.                                                                                                                                                                                                                                                             |
| `first-day-of-week`     | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                      | `0`         | no       | Week start; `0 = Monday` … `6 = Sunday`.                                                                                                                                                                                                                                                                                |
| `loading`               | `boolean`                                              | `false`     | no       | Loading state; without `loading-data` renders a 7 × 53 skeleton.                                                                                                                                                                                                                                                        |
| `show-color-indicator`  | `boolean`                                              | `true`      | no       | Show the bottom color indicator.                                                                                                                                                                                                                                                                                        |
| `show-week-labels`      | `boolean`                                              | `true`      | no       | Show the left week labels.                                                                                                                                                                                                                                                                                              |
| `show-month-labels`     | `boolean`                                              | `true`      | no       | Show the top month labels.                                                                                                                                                                                                                                                                                              |
| `size`                  | `'small' \| 'medium' \| 'large'`                       | `'medium'`  | no       | Scale preset (rects 10 / 11 / 12 px, gaps 2 / 3 / 3 px).                                                                                                                                                                                                                                                                |
| `tooltip`               | `boolean \| SnHeatmapTooltipConfig`                    | `false`     | no       | Per-cell hover tooltip (SnTooltip wrap, lazy popover); `true` = default content `YYYY-MM-DD：value`, object = `TooltipProps` subset (`content` — bubble text when the `tooltip` slot is absent, `placement` default `'top'`, `showArrow` default `true`, `delay` default `100`, `style` / `class` on the popover body). |
| `x-gap`                 | `number \| string`                                     | `undefined` | no       | Overrides the vertical (row) side of the grid spacing (second `border-spacing` value, like the reference cssr).                                                                                                                                                                                                         |
| `y-gap`                 | `number \| string`                                     | `undefined` | no       | Overrides the horizontal (column) side of the grid spacing (first `border-spacing` value, like the reference cssr).                                                                                                                                                                                                     |

## Events

None (the reference has no events).

## Slots

| Name                      | Parameters                                                                    | Description                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `footer`                  | —                                                                             | Left footer area.                                                                                                                                                               |
| `indicator`               | —                                                                             | Replaces the whole right-side indicator.                                                                                                                                        |
| `indicator-leading-text`  | —                                                                             | Leading indicator text (default '少').                                                                                                                                          |
| `indicator-trailing-text` | —                                                                             | Trailing indicator text (default '多').                                                                                                                                         |
| `tooltip`                 | Cell data object `{ timestamp, value, color, dayOfWeek, rowIndex, colIndex }` | Custom per-cell tooltip content; 1:1 with the reference `DayRect` (`dayOfWeek` 0 = Sunday; `color` is the custom palette entry or the level's `--sn-heatmap-color-N` variable). |

## Behavior

- Grid: 7 rows × N week columns; row = weekday (relative to
  `first-day-of-week`), column = calendar week; input is sorted and
  week-aligned before layout.
- Levels: 5 buckets; value ≤ 0 / null → level 0; otherwise
  `ceil(min(value / max, 1) × 4)` clamped — the max comes from the data.
- `value: null` cells (outside the data range) render as blank squares;
  `value: 0` renders the minimum color.
- Month labels: each column takes the month of its first non-null cell;
  months covering fewer than 3 weeks are dropped.
- Loading: `loading` + no `loading-data` → 7 × 53 pulsing skeleton;
  `loading-data` renders that data with the loading class; tooltips are
  suppressed while loading.

## Divergences from the reference API

- Built-in scales are token-driven `color-mix` ramps over
  `--sn-web-color-*`; `colorTheme` maps green/blue/orange/red onto the
  semantic feedback hues and purple onto a danger/primary mix. Custom
  `activeColors` / `minimumColor` strings are honored verbatim.
- Cell tooltips wrap each rect in the first-party `SnTooltip` (uncontrolled
  hover trigger, like the reference wrapping `n-tooltip`); `tooltip: false`
  renders no tooltip instances at all. The object form forwards a
  `TooltipProps` subset (`placement` / `showArrow` / `delay` /
  popover-body `style` / `class`). The default content renders
  `YYYY-MM-DD：value` (the reference uses `toLocaleDateString()`); the
  `tooltip` slot receives the reference `DayRect` shape. Loading cells skip
  the tooltip (reference `Rect.tsx` parity).
- Labels ('少' / '多', week chars '一'…'日', month names 'M月') are fixed
  zh-CN strings (the reference derives them from its locale system).
- The loading pulse is a scoped keyframes class (the reference injects a
  runtime-hashed css-render animation).
- `data` items carrying an explicit `undefined` value render the minimum
  color (the reference does the same; only explicit `null` renders blank).

## Accessibility

- Week / month label cells are real `th` elements; decorative empty week
  header cells are `aria-hidden`.
- Cells are plain colored squares (the reference exposes no grid roles
  either); with `tooltip` enabled the popover carries `role="tooltip"`
  from SnTooltip.

## Tokens Consumed (end: web)

| Token                                      | CSS Variable                        | Purpose                                                                                                   |
| ------------------------------------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Action primary                             | `--sn-web-color-action-primary`     | Default scale base                                                                                        |
| Feedback success / info / warning / danger | `--sn-web-color-feedback-*`         | colorTheme bases                                                                                          |
| Background surface                         | `--sn-web-color-background-surface` | Scale ramp base; minimum level mixes 2% text-primary over it (batch visual spec, not `background-subtle`) |
| Text secondary / primary                   | `--sn-web-color-text-*`             | Labels; loading pulse mix; minimum-level mix                                                              |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-008.
