# SnStatistic — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end statistic component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A statistic display: a small label above a large value, with optional
prefix / suffix decorations and tabular-numeral alignment for rolling
numbers.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-statistic` (https://www.naiveui.com/zh-CN/light/components/statistic).

## Import

```ts
import SnStatistic from '@snui/vue-web/src/statistic/SnStatistic.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | — | no | Label shown above the value. |
| `value` | `string \| number` | — | no | Statistic value; takes precedence over the default slot. `0` is a valid value. |
| `tabularNums` | `boolean` | `false` | no | Render digits with equal widths (`font-variant-numeric: tabular-nums`). |

## Events

None.

## Slots

| Name | Description |
|---|---|
| `default` | Value content — used only when `value` is not passed. |
| `label` | Label — used only when `label` is not passed. |
| `prefix` | Prefix rendered before the value content. |
| `suffix` | Suffix rendered after the value content. |

## Divergences from the reference API

- Theme colors are mapped to web tokens: label → text tertiary, value /
  prefix / suffix → text secondary. Metrics keep the naive cssr values
  (label 14px, value 24px, value margin-top 4px, prefix/suffix 4px gutters).
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- Plain presentational block (no ARIA roles in the reference either);
  pair the label text with meaningful wording in the value for context.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text tertiary | `--sn-web-color-text-tertiary` | Label color |
| Text secondary | `--sn-web-color-text-secondary` | Value / prefix / suffix color |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-016.
