# sn-badge — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-badge component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-badge`, prop surface mirrored 1:1.

## Purpose

Count / dot marker anchored to the top-right corner of wrapped content — an
icon, an avatar, a tab label. Wraps its slot instead of being positioned by the
caller, so the marker never drifts when the host changes size.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-badge :value="8"><sn-icon :icon="Bell" /></sn-badge>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnBadge } from '@snui/uni/components/sn-badge/sn-badge.vue';
```

## Props

| Name          | Type                                                        | Default     | Required | Description                                               |
| ------------- | ----------------------------------------------------------- | ----------- | -------- | --------------------------------------------------------- |
| `value`       | `string \| number`                                          | `undefined` | no       | Displayed value. A number over `max` renders `{max}+`.    |
| `max`         | `number`                                                    | `undefined` | no       | Overflow threshold, applied to numeric values only.       |
| `top`         | `string \| number`                                          | `undefined` | no       | Vertical nudge from the default anchor. A number is px.   |
| `right`       | `string \| number`                                          | `undefined` | no       | Horizontal nudge from the default anchor. A number is px. |
| `isDot`       | `boolean`                                                   | `false`     | no       | Render a small dot instead of a number.                   |
| `hidden`      | `boolean`                                                   | `false`     | no       | Hide the marker; the wrapped content still renders.       |
| `type`        | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `undefined` | no       | Marker colour. Unset falls back to danger red.            |
| `bgColor`     | `string`                                                    | `''`        | no       | Inline background override for the marker.                |
| `showZero`    | `boolean`                                                   | `false`     | no       | Render a `0` value (suppressed by default).               |
| `shape`       | `'circle' \| 'square' \| 'bubble'`                          | `'circle'`  | no       | Marker outline.                                           |
| `border`      | `boolean`                                                   | `false`     | no       | Draw a separating ring in the page background colour.     |
| `customClass` | `string`                                                    | `''`        | no       | Extra class on the root node.                             |
| `customStyle` | `string`                                                    | `''`        | no       | Inline style on the root node.                            |

## Events

None. The badge is decoration; taps belong to the wrapped content.

## Slots

| Name      | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `default` | The content the marker is anchored to (icon / avatar / text). |

## Visibility rules

1. `hidden` wins over everything.
2. `isDot` renders a marker even without a value.
3. No `value` (or an empty string) renders no marker.
4. `value === 0` renders nothing unless `showZero` is on.

## Tokens Consumed (end: mp)

| Token                                      | CSS Variable                                                | Purpose                     |
| ------------------------------------------ | ----------------------------------------------------------- | --------------------------- |
| Action primary                             | `--sn-mp-color-action-primary`                              | `primary` marker fill       |
| Feedback success / warning / danger / info | `--sn-mp-color-feedback-{success,warning,danger,info}`      | The other four marker fills |
| Text on primary                            | `--sn-mp-color-text-on-primary`                             | Marker label                |
| Background surface                         | `--sn-mp-color-background-surface`                          | `border` ring colour        |
| Text primary                               | `--sn-mp-color-text-primary`                                | Doodle skin outline         |
| Font size / weight                         | `--sn-mp-font-size-xs`, `--sn-mp-font-weight-{medium,bold}` | Label typography            |
| Radius                                     | `--sn-mp-radius-{sm,lg,full}`                               | Marker shape                |

## Accessibility

- The dot variant sets `aria-hidden="true"` on the marker — a dot has no text
  to announce, so exposing it would only add noise.
- A numeric badge keeps its text in the accessibility tree; the wrapped element
  should carry the accessible name.
- No interaction, so no keyboard contract.

## Versioning

`@snui/uni@0.1.0` — initial release. Display-family component (AUI-MP-DS-002).
