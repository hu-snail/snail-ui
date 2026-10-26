# SnRate — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnRate component.
> Consumed by `@snui/cli`'s `generateDocs()` and `generateLlmsTxt()` to produce
> machine-readable docs without parsing `.vue` files.

## Purpose

Star rating input. Mirrors naive-ui `n-rate` 1:1 for the web end: click (or
arrow-key) a value from 0 to `count`, with optional half-star precision and
click-again-to-clear.

## Import

```ts
import { SnRate } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `number \| null` | `null` | no | Bound rating value. `null` / 0 = unrated. |
| `count` | `number` | `5` | no | Number of stars rendered. |
| `allowHalf` | `boolean` | `false` | no | Half-star precision (0.5 steps, left/right hit zones). |
| `readonly` | `boolean` | `false` | no | Read-only — value visible, interaction suppressed. |
| `disabled` | `boolean` | `false` | no | Disabled — greyed out, interaction suppressed. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Star glyph size preset. |
| `color` | `string` | `''` | no | Filled-star color (any CSS color; token variable recommended). Applied via the `--sn-rate-color` CSS variable. |
| `clearable` | `boolean` | `false` | no | Clicking the current rating again resets the value to 0. |
| `ariaLabel` | `string` | `''` | no | Accessible label for the radiogroup. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `(value: number) => void` | v-model sync. |
| `change` | `(value: number) => void` | Fired on every committed rating change (click / keyboard). |

## Slots

| Name | Description |
|---|---|
| `icon` | Custom per-star glyph. Slot props: `{ index: number, filled: boolean }`. Replaces the built-in SVG star. |

## Tokens Consumed

| Token | CSS Variable | Purpose |
|---|---|---|
| Rate color | `--sn-web-rate-color` | Filled-star fill (fallback: action primary) |
| Rate inactive | `--sn-web-rate-inactive` | Unfilled-star stroke (fallback: border default) |
| Rate gap | `--sn-web-rate-gap` | Gap between stars |
| Rate size (small/medium/large) | `--sn-web-rate-size-*` | Star glyph size per preset |
| Rate disabled opacity | `--sn-web-rate-disabled-opacity` | Disabled state opacity |
| Focus ring | `--sn-web-focus-ring` | Keyboard focus outline |
| Color action primary | `--sn-web-color-action-primary` | Default filled-star color fallback |
| Color border default | `--sn-web-color-border-default` | Default unfilled-star color fallback |

## Accessibility

- Root: `role="radiogroup"` + `aria-label` (default `"Rating"`), `aria-disabled` / `aria-readonly` when set.
- Each star: `role="radio"`, `aria-checked`, `aria-label` (`"N stars"`), keyboard focusable via roving tabindex (single tab stop at the active star).
- Keyboard: `ArrowLeft` / `ArrowRight` decrement / increment (±1, or ±0.5 with `allowHalf`), clamped to `[0, count]`.
- Stars are SVG paths (no emoji, per AGENTS.md §113).

## Notes

- Half-star hit zones are two explicit 50% spans — no pointer-offset math, works on all pointer types.
- `color` prop composes with tokens: it sets `--sn-rate-color`, which overrides `--sn-web-rate-color` for that instance only.
