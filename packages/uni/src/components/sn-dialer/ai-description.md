# sn-dialer — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-dialer component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-dialer` (additive business component, AUI-BIZ-003).

## Purpose

Lucky-draw wheel. Sectors are stacked half-discs rotated by 360/n; the host decides the winning index (backend draw) and calls `run(index)`; the wheel eases out for `turns` rotations and fires `done(index)`. transform-only animation; both-end safe.

## Import

```vue
<sn-dialer ref="dialerRef" :prize-list="prizes" @click="onGo" @done="onDone" />
```

## Props

| Name            | Type              | Default                 | Required | Description                                 |
| --------------- | ----------------- | ----------------------- | -------- | ------------------------------------------- |
| `prizeList`     | `SnDialerPrize[]` | `[]`                    | no       | Prizes `{ id, name, img?, color? }` (2-12). |
| `turns`         | `number`          | `5`                     | no       | Rotation turns.                             |
| `duration`      | `number`          | `3`                     | no       | Duration (seconds).                         |
| `size`          | `string`          | `'600rpx'`              | no       | Wheel diameter.                             |
| `prizeBgColors` | `string[]`        | `['#FFF0A3','#FFFCE6']` | no       | Alternating sector colors.                  |
| `borderColor`   | `string`          | `'#FFD752'`             | no       | Wheel border color.                         |
| `fontSize`      | `string`          | `'24rpx'`               | no       | Prize name font size.                       |
| `color`         | `string`          | text token              | no       | Prize name color.                           |
| `customClass`   | `string`          | `''`                    | no       | Root custom class.                          |
| `customStyle`   | `string`          | `''`                    | no       | Root custom style.                          |

## Events

`click` (pointer tapped), `done(index)`.

## Slots

`prize({ item, index })`, `pointer`.

## Methods

`run(index)` — spin to the prize index (ignored while spinning).
