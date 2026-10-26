# sn-progress — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-progress component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Linear progress bar for mobile / miniprogram. Shows a 0–100 value as a filled
rail with an optional percentage label placed inside the fill or beside the
bar. Fill color can be a solid color, a gradient stop list or
`{ color, percentage }` thresholds.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-progress`
(https://wot-ui.cn/component/progress.html). New props added here MUST also be
added to the wd-progress parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-progress :percentage="60" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnProgress } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `percentage` | `number` | `0` | no | Progress value, 0–100 (out-of-range values are clamped). |
| `hideText` | `boolean` | `false` | no | Hide the percentage text. |
| `color` | `string \| string[] \| SnProgressColor[]` | `''` | no | Fill color: solid, gradient stops, or `{ color, percentage }` thresholds. |
| `status` | `'success' \| 'danger' \| 'warning' \| ''` | `''` | no | Semantic status; overrides `color` when set. |
| `duration` | `number` | `30` | no | Milliseconds the bar takes to advance 1% (total = percentage × duration). |
| `percentPosition` | `{ type?: 'inner' \| 'outer'; align?: 'left' \| 'center' \| 'right' }` | `{ type: 'outer', align: 'right' }` | no | Percentage label placement + alignment. |
| `customClass` | `string` | `''` | no | Custom class for the root node. |
| `customStyle` | `string` | `''` | no | Custom inline style for the root node. |

`SnProgressColor` = `{ color: string; percentage?: number }` — the color
applies from `percentage` upwards; the highest reached threshold wins.

## Events

None — `sn-progress` is purely presentational.

## Slots

None.

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Action primary | `--sn-mp-color-action-primary` | Default fill color |
| Feedback success | `--sn-mp-color-feedback-success` | `status="success"` fill |
| Feedback warning | `--sn-mp-color-feedback-warning` | `status="warning"` fill |
| Feedback danger | `--sn-mp-color-feedback-danger` | `status="danger"` fill |
| Background subtle | `--sn-mp-color-background-subtle` | Rail (track) color |
| Text secondary | `--sn-mp-color-text-secondary` | Outer label + zero-state inner label |
| Text on primary | `--sn-mp-color-text-on-primary` | Inner label over the fill |
| Font size SM | `--sn-mp-font-size-sm` | Label size |
| Line height normal | `--sn-mp-font-line-height-normal` | Label line height |
| Spacing 3 | `--sn-mp-spacing-3` | Label padding / margin |
| Radius full | `--sn-mp-radius-full` | Rail + fill rounding |
| Radius XS | `--sn-mp-radius-xs` | Doodle skin corners |

## Accessibility

- Root carries `role="progressbar"` with `aria-valuenow` / `aria-valuemin` /
  `aria-valuemax`, plus `aria-label` set to the rendered percentage text
- No keyboard interaction (read-only indicator)

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M1 feedback-category uni
components (popup / overlay / loading / progress / empty).
