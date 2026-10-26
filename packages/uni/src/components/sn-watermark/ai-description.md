# sn-watermark — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-watermark component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Repeating text / image watermark layer rendered as a rotated tile grid.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-watermark`
(https://wot-ui.cn/component/watermark.html). New props added here MUST also be
added to the wd-watermark parity list.

## Not implemented (documented divergences)

- **Canvas rendering** — the reference paints a canvas tile and exports it as a
  background image. `uni.createCanvasContext` + `canvasToTempFilePath` is async
  and per-vendor, and mini-program WXSS has no data-URL background path, so this
  implementation renders the tile content as real nodes in a rotated grid
  instead. Consequence: the watermark is a visual marking, not a tamper-proof
  canvas overlay.
- `font-style` / `font-weight` / `font-family` affect the rendered `<text>`;
  exact glyph metrics differ from the canvas reference.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-watermark content="仅供内部使用" />
```

```ts
import { SnWatermark } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `content` | string | '' | no | Watermark text. |
| `image` | string | '' | no | Watermark image source. |
| `imageHeight` | number | 100 | no | Image height in px. |
| `imageWidth` | number | 100 | no | Image width in px. |
| `gutterX` | number | 0 | no | Horizontal gutter between tiles, in px. |
| `gutterY` | number | 0 | no | Vertical gutter between tiles, in px. |
| `width` | number | 100 | no | Tile width in px. |
| `height` | number | 100 | no | Tile height in px. |
| `fullScreen` | boolean | true | no | Cover the whole viewport. |
| `color` | string | '' | no | Text color override. |
| `size` | number | 14 | no | Text size in px. |
| `fontStyle` | 'normal' | 'italic' | 'oblique' | 'normal' | no | Font style. |
| `fontWeight` | string | number | 'normal' | no | Font weight. |
| `fontFamily` | string | 'PingFang SC' | no | Font family. |
| `rotate` | number | -25 | no | Rotation angle in degrees. |
| `zIndex` | number | 1100 | no | Stacking level. |
| `opacity` | number | — | no | Opacity, 0–1. |
| `layout` | 'grid' | 'staggered' | 'grid' | no | Repeat layout. |
| `customStyle` | string | '' | no | Custom inline style for the root node. |
| `customClass` | string | '' | no | Custom class for the root node. |

## Events

None — the component is presentational.

## Slots

| Slot | Description |
|---|---|
| `default` | Custom tile content (replaces `content` / `image`). |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text disabled | `--sn-mp-color-text-disabled` | Default watermark ink |
| Line height tight | `--sn-mp-font-line-height-tight` | Tile text line height |

## Accessibility

- Root: `aria-hidden="true"` and `pointer-events: none` — the layer is decorative and never traps taps.

## Dispose

No timer, no listener, no async draw.

## Versioning

`@snui/uni@0.5.0` — initial release.
