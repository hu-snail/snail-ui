# sn-lucky — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-lucky component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-lucky-grid` (additive business component, AUI-BIZ-004).

## Purpose

Grid lucky draw: `play()` cycles the highlight clockwise along the grid perimeter; the host requests the result then calls `stop(index)` to decelerate and settle; `end(index)` fires. Supports rows/cols ≥ 3 (prizes on the perimeter, button in the middle).

## Import

```vue
<sn-lucky ref="gridRef" :prizes="prizes" @start="onStart" @end="onEnd" />
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `rows` | `number` | `3` | no | Rows (≥3). |
| `cols` | `number` | `3` | no | Columns (≥3). |
| `prizes` | `SnLuckyPrize[]` | `[]` | no | Prizes `{ name, img?, color? }` along the perimeter. |
| `gutter` | `string` | `'8rpx'` | no | Cell gap. |
| `cellHeight` | `string` | `'120rpx'` | no | Cell height. |
| `speed` | `number` | `60` | no | Cycling step interval (ms). |
| `customClass` | `string` | `''` | no | Root custom class. |
| `customStyle` | `string` | `''` | no | Root custom style. |

## Events

`start` — play began; `end(index)` — settled.

## Slots

`prize({ item, index, isActive })`, `button({ isPlaying })`.

## Methods

`play()` — start cycling; `stop(index)` — decelerate to the index (ignored before play).
