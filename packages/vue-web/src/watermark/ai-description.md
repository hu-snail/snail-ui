# SnWatermark — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end watermark component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A watermark overlay: paints repeated text or image tiles above wrapped
content (or the whole viewport) to mark ownership, prevent screenshot
reuse, or label confidential pages.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-watermark` (https://www.naiveui.com/zh-CN/light/components/watermark).

## Import

```ts
import SnWatermark from '@snui/vue-web/src/watermark/SnWatermark.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `content` | `string \| string[]` | `undefined` | no | Watermark text; array items render as separate lines. |
| `image` | `string` | `undefined` | no | Watermark image URL (drawn instead of text). |
| `cross` | `boolean` | `false` | no | Stagger alternate tiles. |
| `fullscreen` | `boolean` | `false` | no | Cover the viewport instead of the wrapper. |
| `fontSize` | `number` | `16` | no | Text size (px). |
| `lineHeight` | `number` | `16` | no | Text line height (px). |
| `width` | `number` | `128` | no | Tile width (px). |
| `height` | `number` | `64` | no | Tile height (px). |
| `rotate` | `number` | `0` | no | Tile rotation (degrees). |
| `x` | `number` | `0` | no | Tile x offset (px). |
| `y` | `number` | `0` | no | Tile y offset (px). |
| `zIndex` | `number` | `10` | no | Overlay stacking order. |
| `opacity` | `number` | `0.5` | no | Overlay opacity (0–1). |
| `fontFamily` | `string` | `undefined` | no | Text font family. |
| `fontWeight` | `number \| string` | `undefined` | no | Text font weight. |
| `fontStyle` | `'normal' \| 'italic' \| 'oblique'` | `undefined` | no | Text font style. |
| `fontColor` | `string` | `undefined` | no | Text color. |
| `background` | `string` | `undefined` | no | Tile background color. |
| `grayscale` | `number` | `0` | no | CSS filter grayscale amount (0–1). |
| `blend` | `CSSProperties['mixBlendMode']` | `undefined` | no | CSS mix-blend-mode on the overlay. |

## Events

None.

## Slots

| Name | Description |
|---|---|
| `default` | Content the watermark covers (ignored when `fullscreen` is set). |

## Implementation Notes

- Canvas rendering: a single tile is painted offscreen with
  `canvas.getContext('2d')` + `toDataURL()` and repeated as the
  overlay's `background-image` (`pointer-events: none`).
- Degraded mode: without a canvas environment (SSR / happy-dom / tests)
  the component renders a repeated text `<span>` grid with the same
  geometry instead of crashing.
- `grayscale` / `blend` map to CSS `filter` / `mix-blend-mode` on the
  overlay rather than per-pixel canvas operations.
- `fullscreen` teleports a `position: fixed` overlay to `body`.

## Divergences from the reference API

- Theme defaults are local (fontSize 16, width 128, height 64,
  opacity 0.5); the reference defaults differ.
- `x` / `y` shift the mark inside each tile rather than spacing tiles
  apart.
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- The overlay is `aria-hidden="true"` and `pointer-events: none` — it is
  decorative and never intercepts interaction.
- Watermark text is not part of the accessible tree; convey important
  information with real page content instead.

## Tokens Consumed (end: web)

None — the watermark is fully prop-driven (canvas paint colors and the
degraded text grid come from props only).

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-024.
