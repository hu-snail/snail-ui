# Watermark · Web

Tiles a text or image watermark over a page or a region to mark ownership,
discourage screenshots, or label confidential pages.

## When to use

- Tile copyright / attribution info over a page or a region.
- Internal systems and reports need a "confidential" notice.
- Fullscreen mode covers the viewport — dialogs, players, overlays.

## Demos

### Basic

Wraps content and tiles the watermark above it; `rotate` / `opacity` control
the tilt and the density.

<Demo name="watermark-web-basic" description="Wrapped content / rotate and opacity." />

### Multi-line content and staggered tiles

With an array, `content` renders one line per item spaced by `lineHeight`;
`cross` staggers adjacent tiles by half a tile.

<Demo name="watermark-web-content" description="content array / cross stagger side by side." />

### Style customisation

`fontSize` / `lineHeight` / `rotate` / `opacity` / `fontColor` /
`fontWeight` can be adjusted live; text always rotates around the tile
centre.

<Demo name="watermark-web-style" description="fontSize / rotate / opacity / fontColor adjusted live." />

### Fullscreen

With `fullscreen` the watermark covers the viewport (fixed) and wraps
nothing; `zIndex` controls the overlay stacking order.

<Demo name="watermark-web-fullscreen" description="fullscreen coverage + zIndex." />

## API

### Props

All props are optional.

| Name       | Type                                | Default     | Description                                                                   |
| ---------- | ----------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| content    | `string \| string[]`                | `undefined` | Watermark text; array items are separate lines, an empty string draws nothing |
| image      | `string`                            | `undefined` | Watermark image URL; drawn instead of text                                    |
| cross      | `boolean`                           | `false`     | Stagger adjacent tiles by half a tile                                         |
| fullscreen | `boolean`                           | `false`     | Cover the whole viewport instead of wrapping content                          |
| fontSize   | `number`                            | `16`        | Text size (px)                                                                |
| lineHeight | `number`                            | `16`        | Text line height (px)                                                         |
| width      | `number`                            | `128`       | Tile width (px)                                                               |
| height     | `number`                            | `64`        | Tile height (px)                                                              |
| rotate     | `number`                            | `0`         | Tile rotation (degrees)                                                       |
| x          | `number`                            | `0`         | Tile x offset (px)                                                            |
| y          | `number`                            | `0`         | Tile y offset (px)                                                            |
| zIndex     | `number`                            | `10`        | Overlay stacking order                                                        |
| opacity    | `number`                            | `0.5`       | Overlay opacity (0–1)                                                         |
| fontFamily | `string`                            | `undefined` | Text font family                                                              |
| fontWeight | `number \| string`                  | `undefined` | Text font weight                                                              |
| fontStyle  | `'normal' \| 'italic' \| 'oblique'` | `undefined` | Text font style                                                               |
| fontColor  | `string`                            | `undefined` | Text color                                                                    |
| background | `string`                            | `undefined` | Tile background color                                                         |
| grayscale  | `number`                            | `0`         | Overlay CSS grayscale (0–1)                                                   |
| blend      | `CSSProperties['mixBlendMode']`     | `undefined` | Overlay mix-blend-mode                                                        |

### Slots

| Name    | Scope | Description                                                  |
| ------- | ----- | ------------------------------------------------------------ |
| default | —     | Content the watermark covers; not rendered when `fullscreen` |

No events.

Implementation: a single tile is painted on an offscreen canvas and becomes
the overlay's repeating background image with `pointer-events: none`;
without a canvas environment (SSR / tests) it degrades to a repeated text
grid with the same geometry. `fontColor` / `background` therefore need real
CSS color values — canvas cannot resolve `var(...)` references.

## Tokens

Fully prop-driven (both the canvas paint colors and the degraded text grid
come from props); consumes no theme tokens.

## Accessibility

- The overlay is `aria-hidden="true"` with `pointer-events: none` — purely
  decorative, never intercepts interaction.
- Watermark text is not exposed to assistive tech; convey important
  information with real page content.

## AI Patch Boundary

- Patches may change `content` / `opacity` / `rotate` / `zIndex`.
- The watermark never affects content semantics; patches must not place
  business-critical information only in the watermark.
- Tiles are rendered by the internal canvas / text grid; patches must not
  manipulate overlay nodes directly.

See the component `ai-description.md` for the full contract.
