# Progress · uni-app

`sn-progress` is the linear progress bar of `@snui/uni` (mobile / miniprogram / H5): a 0–100 value mapped to a fill width, an optional percentage label (inside the fill or beside the bar) and a fill color that can be solid, a gradient stop list or threshold colors. Auto-registered through easycom (`components/sn-progress/sn-progress.vue` → `<sn-progress>`); geometry uses `rpx`.

## Basic usage

`percentage` is clamped to 0–100; the label sits outside on the right by default and shows the rounded value.

<Demo name="progress-mp-basic" description="0 / 30 / 68 / 100 plus hide-text." />

## Status and custom colors

- `status`: `success` / `warning` / `danger`, takes precedence over `color`
- `color`: a string (solid), a string array (gradient), or `{ color, percentage }[]` (thresholds — the highest reached threshold wins)
- `duration`: milliseconds per 1% — the whole transition lasts `percentage × duration`

<Demo name="progress-mp-color" description="success / warning / danger status colors, plus a solid color and a gradient array." />

## Label placement and alignment

`percentPosition` controls the percentage label:

- `type: 'outer'` (default) — the label sits to the right of the bar
- `type: 'inner'` — the label sits inside the fill (the track grows taller)
- `align: 'left' | 'center' | 'right'` — outer label alignment

<Demo name="progress-mp-label" description="outer left / outer center / inner right / inner center, plus the duration animation." />

## Custom class and style

`customClass` appends a root class and `customStyle` writes a root inline style; the two can be combined.

<Demo name="progress-mp-custom" description="custom-class dashed outline / custom-style padding / both together." />

## Props

| Prop              | Type                                                                   | Default                             | Description                                               |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------- |
| `percentage`      | `number`                                                               | `0`                                 | Progress value, max 100 (out-of-range values are clamped) |
| `hideText`        | `boolean`                                                              | `false`                             | Hide the percentage text                                  |
| `color`           | `string \| string[] \| SnProgressColor[]`                              | `''`                                | Fill color: solid / gradient stops / thresholds           |
| `status`          | `'success' \| 'danger' \| 'warning' \| ''`                             | `''`                                | Status; takes precedence over `color`                     |
| `duration`        | `number`                                                               | `30`                                | Milliseconds per 1% of progress                           |
| `percentPosition` | `{ type?: 'inner' \| 'outer'; align?: 'left' \| 'center' \| 'right' }` | `{ type: 'outer', align: 'right' }` | Percentage label placement                                |
| `customClass`     | `string`                                                               | `''`                                | Custom class for the root node                            |
| `customStyle`     | `string`                                                               | `''`                                | Custom inline style for the root node                     |

`SnProgressColor` = `{ color: string; percentage?: number }`.

## Events

None — `sn-progress` is purely presentational.

## Slots

None.

## Tokens

| Variable                          | Purpose                         |
| --------------------------------- | ------------------------------- |
| `--sn-mp-color-action-primary`    | Default fill color              |
| `--sn-mp-color-feedback-success`  | `status="success"` fill         |
| `--sn-mp-color-feedback-warning`  | `status="warning"` fill         |
| `--sn-mp-color-feedback-danger`   | `status="danger"` fill          |
| `--sn-mp-color-background-subtle` | Track color                     |
| `--sn-mp-color-text-secondary`    | Outer label / inner label at 0% |
| `--sn-mp-color-text-on-primary`   | Inner label over the fill       |
| `--sn-mp-font-size-sm`            | Label size                      |
| `--sn-mp-font-line-height-normal` | Label line height               |
| `--sn-mp-spacing-3`               | Label padding / margin          |
| `--sn-mp-radius-full`             | Track and fill rounding         |
| `--sn-mp-radius-xs`               | Corners under the Doodle skin   |

## Accessibility

- Root carries `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- `aria-label` mirrors the rendered percentage text
- No keyboard interaction (read-only indicator)

## Dark mode

The fill and track colors all come from semantic tokens (`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-background-subtle` / `--sn-mp-color-text-*`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

> A custom literal passed through `color` (e.g. `#5b8def`) does not flip with the theme — same behaviour as wot-ui. In dark mode prefer colors written as `var(--sn-mp-*)`.

## Related

- Indeterminate loading: [`sn-loading`](/en/components/uni/loading)
