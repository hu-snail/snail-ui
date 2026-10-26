# SnSpace — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnSpace component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Child-spacing container: lays direct children in a row (or column) with a
controlled gap between them. Mirrors naive-ui `n-space` 1:1 on the props
implemented here. Unlike n-space's margin chain, the gap is a single CSS
`gap` declaration — children render as-is, no wrapper divs.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-space`
(https://www.naiveui.com/zh-CN/light/components/space). New props added
here MUST also be added to the n-space parity list.

## Import

```ts
import SnSpace from '@snui/vue-web/src/space/SnSpace.vue';
```

## Props

| Name          | Type                                                                                                                | Default    | Description                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `vertical`    | `boolean`                                                                                                           | `false`    | Stack children in a column. Vertical layout always `nowrap` (n-space semantics).                                           |
| `size`        | `number \| 'small' \| 'medium' \| 'large' \| [number, number]`                                                      | `'medium'` | Gap between children. Tuple is `[horizontal, vertical]` px → `column-gap` / `row-gap`. Invalid values fall back to medium. |
| `wrap`        | `boolean`                                                                                                           | `true`     | Allow horizontal children to wrap. `vertical` forces `nowrap` regardless.                                                  |
| `justify`     | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly' \| 'flex-start' \| 'flex-end'` | `'start'`  | Main-axis distribution. `'start'`/`'end'` normalize to `flex-start`/`flex-end` (n-space semantics).                        |
| `align`       | `'stretch' \| 'baseline' \| 'start' \| 'end' \| 'center' \| 'flex-start' \| 'flex-end'`                             | —          | Cross-axis alignment. Unset → CSS `normal` (no `align-items` emitted).                                                     |
| `inline`      | `boolean`                                                                                                           | `false`    | Render as `inline-flex`.                                                                                                   |
| `customClass` | `string`                                                                                                            | `''`       | Extra class appended to the container (snail extension).                                                                   |
| `customStyle` | `string \| Record<string, string>`                                                                                  | `''`       | Inline style appended to the container (snail extension).                                                                  |

## Slots

| Name      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | Direct children are spaced by the container gap. |

## §112 future markers

Not yet implemented (intentional scope cut). Documented here so the
n-space parity list can be updated when any consumer needs them:

- `reverse` — reverse the main-axis direction (`row-reverse` / `column-reverse`)
- `wrapItem` — permanently omitted is NOT the intent; with CSS gap the
  per-child wrapper is unnecessary, so this prop has no work to do here.
  Only revisit if the implementation ever moves back to a margin chain.
- `itemClass` / `itemStyle` — style hook for per-child wrapper divs
  (meaningless while children render unwrapped)

## Tokens Consumed (end: web)

- `--sn-web-space-gap-small` (fallback `8px`)
- `--sn-web-space-gap-medium` (fallback `12px`)
- `--sn-web-space-gap-large` (fallback `16px`)

Referenced as `var(--sn-web-space-gap-*, <fallback>)` — the sanctioned
override-hook shape per the tokens-web alias guard (literal fallback keeps
the declaration resolvable before the tokens are registered in the alias
layer). Px numbers bypass tokens by design (direct value).

## Accessibility

- Pure layout container — no role, no interactive content.
- Screen readers announce children in DOM order (row or column order).

## Versioning

`@snui/vue-web@0.8.0` — initial release. Part of AUI-WEB-LAYOUT-003
(M1 layout Web components, space/flex pair with AUI-WEB-LAYOUT-004).
