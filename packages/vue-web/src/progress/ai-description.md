# SnProgress — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end progress component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A progress indicator in three shapes: a horizontal line bar, a circular
ring, and a multi-ring variant with a colour legend. Optional status
glyphs (success / error) and a processing (stripe) animation.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-progress` (https://www.naiveui.com/zh-CN/light/components/progress).

## Import

```ts
import SnProgress from '@snui/vue-web/src/progress/SnProgress.vue';
```

## Props

| Name                 | Type                                                       | Default     | Required | Description                                                                  |
| -------------------- | ---------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------- |
| `type`               | `'line' \| 'circle' \| 'multiple-circle'`                  | `'line'`    | no       | Progress bar shape.                                                          |
| `percentage`         | `number \| number[]`                                       | `0`         | no       | Value(s) in percent, clamped to 0–100. Array form for `multiple-circle`.     |
| `height`             | `number \| string`                                         | `undefined` | no       | Line rail height; number = px, string passes through. Falls back to 8px.     |
| `borderRadius`       | `number \| string`                                         | `undefined` | no       | Line rail corner radius.                                                     |
| `fillBorderRadius`   | `number \| string`                                         | `undefined` | no       | Line fill radius; falls back to `borderRadius`.                              |
| `strokeWidth`        | `number`                                                   | `6`         | no       | Circle ring stroke width (px).                                               |
| `indicatorPlacement` | `'inside' \| 'outside' \| 'top'`                           | `'outside'` | no       | Indicator placement for `type='line'`.                                       |
| `color`              | `string \| { color, stop? }[] \| (percentage) => string`   | `undefined` | no       | Fill color: solid, gradient stops, or resolver function. Overrides `status`. |
| `railColor`          | `string \| { color, stop? }[]`                             | `undefined` | no       | Rail color.                                                                  |
| `showIndicator`      | `boolean`                                                  | `true`      | no       | Render the indicator text / glyph.                                           |
| `status`             | `'default' \| 'success' \| 'error' \| 'info' \| 'warning'` | `'default'` | no       | Status — drives the default fill color and circle glyph.                     |
| `processing`         | `boolean`                                                  | `false`     | no       | Animated striped fill (line) / pulsing arc (circle).                         |
| `offsetDegree`       | `number`                                                   | `0`         | no       | Circle start-angle offset in degrees (0 = 12 o'clock).                       |

## Events

None.

## Slots

| Name      | Scope            | Description                                        |
| --------- | ---------------- | -------------------------------------------------- |
| `default` | `{ percentage }` | Custom indicator content.                          |
| `icon`    | —                | Custom glyph for the circle success / error state. |

## Divergences from the reference API

- Reference props `unit` and `circleGap` are not implemented: indicators
  always use '%' and multiple-circle rings keep a fixed 2px gap.
- `indicatorPlacement` only affects `type='line'`; circle /
  multiple-circle indicators are always centred in the ring
  (multiple-circle shows a colour legend below the rings instead).
- Status colors map to web tokens (success → feedback-success, error →
  feedback-danger, warning → feedback-warning, info → feedback-info,
  default → action-primary). Metrics: rail 8px, circle stroke 6px,
  circle size 120px, indicator font 14px.
- `processing` animates a striped overlay on the line fill and pulses
  the fill arc on circle types (the reference only animates line
  processing).
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- `type='line'` / `'circle'`: root carries `role="progressbar"` with
  `aria-valuemin` / `aria-valuemax` / `aria-valuenow`.
- `type='multiple-circle'`: root carries `role="img"` +
  `aria-label` summarising every value.
- Decorative SVG parts are `aria-hidden="true"`.

## Tokens Consumed (end: web)

| Token                                      | CSS Variable                       | Purpose                      |
| ------------------------------------------ | ---------------------------------- | ---------------------------- |
| Action primary                             | `--sn-web-color-action-primary`    | Default fill                 |
| Feedback success / danger / info / warning | `--sn-web-color-feedback-*`        | Status fills + circle glyphs |
| Background subtle                          | `--sn-web-color-background-subtle` | Rail color                   |
| Text secondary                             | `--sn-web-color-text-secondary`    | Indicator text               |
| Text on primary                            | `--sn-web-color-text-on-primary`   | Indicator inside the fill    |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-FB-014.
