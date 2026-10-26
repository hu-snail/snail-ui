# Scratchcard (uni)

`sn-scratchcard` covers content with a scratchable layer; once the scratched ratio passes the threshold the layer clears and `open` fires.

## When to use

- Scratch-to-reveal prizes, coupons, surprise boxes

## Demos

### Basic

Prize content goes in the default slot; `ratio` sets the threshold, `title` / `watermarkText` customize the cover.

<Demo name="scratchcard-mp" description="Real pointer scratching, threshold open callback, and reset." />

### Rendering strategy

- **uni-app x App / H5**: element-level 2d canvas — pointer moves erase via `destination-out`, and `touchend` samples the transparent ratio.
- **Mini-programs / App-vue**: the legacy canvas context has no compositing, so the cover degrades to tap-to-reveal (still firing `open`) — an explicit, predictable behavior.

## API

### Props

| Name             | Type     | Default             | Description                                         |
| ---------------- | -------- | ------------------- | --------------------------------------------------- |
| `coverColor`     | `string` | `'#C5C5C5'`         | Cover color (`coverImg` wins)                       |
| `coverImg`       | `string` | `''`                | Cover image                                         |
| `ratio`          | `number` | `0.8`               | Reveal threshold (0-1)                              |
| `scratchRadius`  | `number` | `10`                | Scratch radius (px)                                 |
| `watermarkText`  | `string` | `''`                | Cover watermark text                                |
| `watermarkSize`  | `number` | `14`                | Watermark font size (px)                            |
| `watermarkColor` | `string` | `'rgba(0,0,0,0.1)'` | Watermark color                                     |
| `title`          | `string` | `''`                | Cover title text                                    |
| `titleSize`      | `number` | `24`                | Title font size (px)                                |
| `titleColor`     | `string` | `'rgba(0,0,0,0.8)'` | Title color                                         |
| `customClass`    | `string` | `undefined`         | Root custom class                                   |
| `customStyle`    | `string` | `undefined`         | Root custom style (provide at least width / height) |

### Events

| Name   | Payload | Description                                 |
| ------ | ------- | ------------------------------------------- |
| `open` | —       | Scratched ratio passed `ratio` (fires once) |

### Slots

| Name      | Payload | Description                   |
| --------- | ------- | ----------------------------- |
| `default` | —       | Prize content under the cover |

### Methods

| Name    | Type         | Description                         |
| ------- | ------------ | ----------------------------------- |
| `reset` | `() => void` | Repaint the cover for another round |
