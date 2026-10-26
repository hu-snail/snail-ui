# SnFlex — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnFlex component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Generic flex container primitive: one flex row/column with gap, justify,
align, wrap and an opt-in children-expand behavior. Mirrors naive-ui
`n-flex` 1:1 on the props implemented here.

Difference vs SnSpace (AUI-WEB-LAYOUT-003): Space is the "gap between
children" semantic component; Flex is the raw container primitive — the
gap prop is a direct value with no further semantics attached.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-flex`
(https://www.naiveui.com/zh-CN/light/components/flex). New props added
here MUST also be added to the n-flex parity list.

## Import

```ts
import SnFlex from '@snui/vue-web/src/flex/SnFlex.vue'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `vertical` | `boolean` | `false` | Stack children in a column. Vertical layout always `nowrap` (n-flex semantics). |
| `gap` | `number \| 'small' \| 'medium' \| 'large' \| [number, number]` | `'medium'` | Gap between children. Tuple is `[horizontal, vertical]` px → `column-gap` / `row-gap`. Invalid values fall back to medium. |
| `wrap` | `boolean` | `true` | Allow horizontal children to wrap. `vertical` forces `nowrap` regardless. |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Main-axis distribution, passed through as-is (n-flex does NOT normalize `'start'`/`'end'` to `flex-*` — both are valid CSS Box Alignment values). |
| `align` | `'stretch' \| 'baseline' \| 'start' \| 'end' \| 'center' \| 'flex-start' \| 'flex-end'` | — | Cross-axis alignment. Unset → CSS `normal` (no `align-items` emitted). |
| `inline` | `boolean` | `false` | Render as `inline-flex`. |
| `expand` | `boolean` | `false` | **Snail extension** (n-flex main has no such prop): direct children get `flex: 1 1 auto` so they grow to fill the free main-axis space. |
| `customClass` | `string` | `''` | Extra class appended to the container (snail extension). |
| `customStyle` | `string \| Record<string, string>` | `''` | Inline style appended to the container (snail extension). |

## Slots

| Name | Description |
|---|---|
| `default` | Direct children are flex items of the container. |

## §112 future markers

Not yet implemented (intentional scope cut). Documented here so the
n-flex parity list can be updated when any consumer needs them:

- `reverse` — reverse the main-axis direction (`row-reverse` / `column-reverse`)

## Tokens Consumed (end: web)

- `--sn-web-space-gap-small` (fallback `8px`)
- `--sn-web-space-gap-medium` (fallback `12px`)
- `--sn-web-space-gap-large` (fallback `16px`)

Shared spacing tokens with SnSpace. Referenced as
`var(--sn-web-space-gap-*, <fallback>)` — the sanctioned override-hook
shape per the tokens-web alias guard. Px numbers bypass tokens by design
(direct value).

## Accessibility

- Pure layout container — no role, no interactive content.
- Screen readers announce children in DOM order (row or column order).

## Versioning

`@snui/vue-web@0.8.0` — initial release. Part of AUI-WEB-LAYOUT-004
(M1 layout Web components, space/flex pair with AUI-WEB-LAYOUT-003).
