# SnEquation — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end equation component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Render a LaTeX math expression inline (or in display mode) via KaTeX,
with no setup needed — KaTeX ships inside the package.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-equation` (https://www.naiveui.com/zh-CN/light/components/equation).

## Import

```ts
import SnEquation from '@snui/vue-web/src/equation/SnEquation.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `string` | `''` | no | LaTeX expression string. |
| `katex` | `SnEquationKatex` | `undefined` | no | Custom katex-like renderer; overrides the bundled one. |
| `katexOptions` | `Record<string, unknown>` | `undefined` | no | Options forwarded to `renderToString` (e.g. `displayMode`, `macros`, `fleqn`). `throwOnError` defaults to `false`. |

## Events

None.

## Slots

None.

## Rendered Markup

The wrapper tag/class is extracted from the katex output itself, matching
n-equation: `span.katex` inline, `span.katex-display` with
`katexOptions: { displayMode: true }`. The root also carries
`data-snui-component="equation"`.

## Styles

KaTeX CSS + fonts are delivered via the `@snui/vue-web/styles` barrel
(copy-styles pipeline appends `katex.min.css` and copies `dist/fonts`).
No component-level styles exist in this SFC.

## Divergences (vs n-equation)

- KaTeX is a bundled dependency: the `katex` prop is an override hook
  (naive requires the instance via prop or config-provider injection).
- No config-provider katex injection; the bundled import is the default.
