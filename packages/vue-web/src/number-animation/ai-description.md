# SnNumberAnimation — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end number animation
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Rolls a number from `from` to `to` with an ease-out tween
(requestAnimationFrame + performance.now). Supports decimal precision,
locale thousands separators, replay via the exposed `play()` method, and
a `finish` event.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-number-animation`
(https://www.naiveui.com/zh-CN/light/components/number-animation).

## Import

```ts
import SnNumberAnimation from '@snui/vue-web/src/number-animation/SnNumberAnimation.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `from` | `number` | `0` | no | Start value. |
| `to` | `number` | `0` | no | Target value; the animation runs towards it. |
| `precision` | `number` | `0` | no | Digits kept after the decimal point. |
| `showSeparator` | `boolean` | `false` | no | Format the integer part with locale thousands separators. |
| `locale` | `string` | — | no | BCP-47 locale for `Intl.NumberFormat` (separators + decimal mark). |
| `active` | `boolean` | `true` | no | Start / restart the animation. |
| `duration` | `number` | `2000` | no | Animation duration in ms (non-reactive, captured at setup). |

## Events

| Name | Parameters | Description |
|---|---|---|
| `finish` | — | Animation reached `to`. |

## Slots

None (renders formatted text only).

## Exposed Methods

| Name | Parameters | Description |
|---|---|---|
| `play` | — | Replay the animation; ignored while one is already running. |

## Divergences from the reference API

- Default `duration` is 2000 (the reference *source*; its docs page still
  says 3000 — source wins per AGENTS.md §112).
- `locale` defaults to the runtime locale (naive falls back to its
  config-provider locale).
- Renders a neutral inline `<span class="sn-number-animation">` wrapper
  with `font-variant-numeric: tabular-nums` (naive renders a bare text
  fragment; web-end components carry the marker attribute).
- New tweens supersede pending ones and pending frames are cancelled on
  unmount (naive keeps the rAF loop alive after unmount). Single-animation
  behaviour is unchanged.
- `round` is a local helper (no lodash dependency in this package).

## Accessibility

- Text content updates at animation frequency; consumers who need stable
  screen-reader output should render a visually hidden static value.

## Tokens Consumed (end: web)

None — plain text wrapper, numeral-width CSS only.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-014.
