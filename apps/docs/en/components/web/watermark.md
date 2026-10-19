# Watermark · Web

Tiles a text or image watermark over a page or a content area to mark
ownership, discourage screenshots, or label confidential pages.

## When to use

- Tile copyright / attribution info over a page or a region.
- Internal systems and reports need a "confidential" notice.
- Fullscreen mode covers the viewport — dialogs, players, overlays.

## Basic

Wraps content and tiles the watermark above it. Pass an array for
multi-line marks; `cross` staggers adjacent tiles.

<Demo name="watermark-web-basic" description="Wrapped content / multi-line text / cross stagger / rotate & opacity." />

### Fullscreen

With `fullscreen` the watermark covers the viewport (fixed, teleported
to body) and wraps nothing.

<Demo name="watermark-web-fullscreen" description="fullscreen coverage + zIndex." />

## API

### SnWatermark Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| content | `string \| string[]` | — | Watermark text; array items = lines |
| image | `string` | — | Watermark image URL (replaces text) |
| cross | `boolean` | `false` | Stagger adjacent tiles |
| fullscreen | `boolean` | `false` | Cover the whole viewport |
| fontSize | `number` | `16` | Text size (px) |
| lineHeight | `number` | `16` | Text line height (px) |
| width | `number` | `128` | Tile width (px) |
| height | `number` | `64` | Tile height (px) |
| rotate | `number` | `0` | Tile rotation (degrees) |
| x | `number` | `0` | Tile x offset (px) |
| y | `number` | `0` | Tile y offset (px) |
| zIndex | `number` | `10` | Overlay stacking order |
| opacity | `number` | `0.5` | Overlay opacity (0–1) |
| fontFamily | `string` | — | Text font family |
| fontWeight | `number \| string` | — | Text font weight |
| fontStyle | `'normal' \| 'italic' \| 'oblique'` | — | Text font style |
| fontColor | `string` | — | Text color |
| background | `string` | — | Tile background color |
| grayscale | `number` | `0` | Overlay CSS grayscale (0–1) |
| blend | `CSSProperties['mixBlendMode']` | — | Overlay mix-blend-mode |

### SnWatermark Slots

| Slot | Notes |
| --- | --- |
| default | Content the watermark covers (ignored when `fullscreen`) |

No events. Implementation: one tile is painted on an offscreen canvas →
`toDataURL` becomes the overlay's repeating `background-image`
(`pointer-events: none`). Without a canvas environment (SSR / tests) it
degrades to a repeated text grid.

## Tokens

Fully prop-driven (canvas paint colors and the degraded text grid come
from props); consumes no theme tokens.

## Accessibility

- The overlay is `aria-hidden="true"` with `pointer-events: none` —
  purely decorative, never intercepts interaction.
- Watermark text is not exposed to assistive tech; convey important
  information with real page content.

## AI Patch Boundary

- Patches may change `content` / `opacity` / `rotate` / `zIndex`.
- The watermark never affects content semantics; patches must not place
  business-critical information only in the watermark.
- `fullscreen` teleports to body; patches must not manipulate teleported
  nodes directly.

See the component `ai-description.md` for the full contract.
