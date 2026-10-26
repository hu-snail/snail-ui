# Watermark · uni-app

`sn-watermark` is the watermark layer of `@snui/uni` (mobile / miniprogram / H5): it tiles rotated text / image cells over a region. Auto-registered through easycom (`components/sn-watermark/sn-watermark.vue` → `<sn-watermark>`); geometry uses `rpx`.

> **Not implemented**
>
> - **No canvas**: wot-ui paints a canvas tile and exports it as a background image, but `uni.createCanvasContext` + `canvasToTempFilePath` is async and behaves differently per vendor, and mini-program WXSS has no data-URL background path. This round therefore renders the tiles as real nodes in a rotated grid. **Consequence**: the watermark is a visual marking, not the tamper-proof canvas overlay the reference produces.
> - `fontStyle` / `fontWeight` / `fontFamily` apply to the rendered `<text>`; glyph metrics differ from the canvas reference.

## Basic usage

`content` renders text tiles; `fullScreen` defaults to `true` (`position: fixed`) — set it to `false` to scope the layer to its parent (which needs `position: relative`). The layer is `pointer-events: none`, so it never blocks taps.

<Demo name="watermark-mp-basic" description="A text watermark over a contract preview area." />

## Tiles and layout

`width` / `height` set the tile size and `gutterX` / `gutterY` the spacing (all px); `rotate` sets the rotation and `layout="staggered"` offsets every other row.

<Demo name="watermark-mp-config" description="Three tile size / gutter / rotation / staggered combinations." />

## Image tiles and font control

`image` wins over `content` and `imageWidth` / `imageHeight` size the tile; a text tile's glyphs are shaped by `fontFamily` / `fontStyle` / `fontWeight`. `zIndex` and `customStyle` apply to the root node and `customClass` appends a custom class.

<Demo name="watermark-mp-image" description="Image tiles, font family / style / weight, z-index and customClass / customStyle." />

## Props

| Prop        | Type                              | Default       | Description                           |
| ----------- | --------------------------------- | ------------- | ------------------------------------- |
| content     | string                            | ''            | Watermark text                        |
| image       | string                            | ''            | Watermark image source                |
| imageHeight | number                            | 100           | Image height (px)                     |
| imageWidth  | number                            | 100           | Image width (px)                      |
| gutterX     | number                            | 0             | Horizontal gutter (px)                |
| gutterY     | number                            | 0             | Vertical gutter (px)                  |
| width       | number                            | 100           | Tile width (px)                       |
| height      | number                            | 100           | Tile height (px)                      |
| fullScreen  | boolean                           | true          | Cover the whole viewport              |
| color       | string                            | ''            | Text color override                   |
| size        | number                            | 14            | Text size (px)                        |
| fontStyle   | 'normal' \| 'italic' \| 'oblique' | 'normal'      | Font style                            |
| fontWeight  | string \| number                  | 'normal'      | Font weight                           |
| fontFamily  | string                            | 'PingFang SC' | Font family                           |
| rotate      | number                            | -25           | Rotation angle in degrees             |
| zIndex      | number                            | 1100          | Stacking level                        |
| opacity     | number                            | —             | Opacity, 0–1                          |
| layout      | 'grid' \| 'staggered'             | 'grid'        | Repeat layout                         |
| customStyle | string                            | ''            | Custom inline style for the root node |
| customClass | string                            | ''            | Custom class for the root node        |

## Events

None.

## Slots

| Slot    | Description                                        |
| ------- | -------------------------------------------------- |
| default | Custom tile content (replaces `content` / `image`) |

## Theme variables

| Variable                       | Purpose               |
| ------------------------------ | --------------------- |
| --sn-mp-color-text-disabled    | Default watermark ink |
| --sn-mp-font-line-height-tight | Tile text line height |

## Accessibility

- Root: `aria-hidden="true"` + `pointer-events: none` — the layer is decorative and never traps taps

## Dark mode

The default ink uses `--sn-mp-color-text-disabled`, overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

> A literal passed through `color` does not flip with the theme — prefer `var(--sn-mp-*)` colors in dark mode.

## Related

- Scrim: [`sn-overlay`](/en/components/uni/overlay)
- Image: [`sn-img`](/en/components/uni/img)
