# SnGrid — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnGrid component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

CSS Grid container with N equal-width columns + gap control. Mirrors naive-ui `n-grid` 1:1 on the props the docs site actually uses; advanced features (suffix / collapsed / collapsedRows / layoutShiftDisabled / self-vs-screen responsive observer) are §112 future markers.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-grid`
(https://www.naiveui.com/zh-CN/light/components/grid). New props added
here MUST also be added to the n-grid parity list.

## Import

```ts
import { SnGrid } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `cols` | `number \| string` | `24` | Number of grid columns. Falls back to 24 on invalid input (0 / negative / NaN). |
| `xGap` | `number \| string` | `0` | Horizontal gap (px). Strings pass through. |
| `yGap` | `number \| string` | `0` | Vertical gap (px). Strings pass through. |
| `itemResponsive` | `boolean` | `false` | Subscribe to container resize; n-grid full implementation also adjusts item widths per breakpoint (future expansion). |
| `itemStyle` | `string \| CSSProperties` | — | Inline style applied to each direct child. |

## Slots

| Name | Description |
|---|---|
| `default` | Direct children become grid items. |

## §112 future markers

Not yet implemented (intentional v0.1 scope cut). Documented here so the
n-grid parity list can be updated when any consumer needs them:

- `suffix` — last item fills remaining row space
- `collapsed` + `collapsedRows` — hide items past N rows
- `layoutShiftDisabled` — disable VResizeObserver
- `responsive: 'self' \| 'screen'` — breakpoint source

## Tokens Consumed (end: web)

No token aliases consumed — SnGrid is a structural layout primitive, not a
visual component. Colors / spacing are inherited from the grid items.

## Accessibility

- `display: grid` is announced by screen readers as a layout container.
- No interactive content — pure structural primitive.

## Versioning

`@snui/vue-web@0.4.0` — initial release. Part of AUI-WEB-LAYOUT-002
(M1 layout Web components).