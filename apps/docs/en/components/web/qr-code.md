# QR Code · Web

Renders text as a scannable QR code with error correction levels, custom
colors, size, a center icon, and image download.

## When to use

- Turning links, text, or configuration data into something scannable
- Branding the code with custom colors or a center icon
- Exporting the code as an image (PNG / SVG)

## Examples

### Basic

<Demo name="qr-code-web-basic" description="A default-size code from value." />

### Size

<Demo name="qr-code-web-size" description="size controls the whole box (padding included)." />

### Color

<Demo name="qr-code-web-color" description="color / background-color for dark and light modules." />

### Error correction

<Demo name="qr-code-web-error-correction" description="error-correction-level switches L/M/Q/H." />

### Icon

<Demo name="qr-code-web-icon" description="icon-src overlays a center icon; level H keeps it decodable." />

### Download

<Demo name="qr-code-web-download" description="Hover toolbar downloads PNG, or export manually." />

### Render type

<Demo name="qr-code-web-type" description="type switches between canvas and svg targets." />

## API

### SnQrCode Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value | `string` | `''` | Text encoded into the code |
| error-correction-level | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | ~7% / 15% / 25% / 30% recoverable codewords |
| size | `number` | `100` | Whole box size (padding included, px) |
| padding | `number \| string` | `12` | Inner padding (number → px) |
| color | `string` | `'#000'` | Dark-module color |
| background-color | `string` | `'#FFF'` | Light-module / box color |
| icon-src | `string` | `undefined` | Center icon url |
| icon-size | `number` | `40` | Center icon size (px) |
| icon-background-color | `string` | `'#FFF'` | Icon plate color |
| icon-border-radius | `number` | `4` | Icon plate radius (px) |
| type | `'canvas' \| 'svg'` | `'canvas'` | Render target |
| show-toolbar | `boolean` | `true` | Reveal the floating download toolbar on hover/focus |

### Encoding notes

- QR Code Model 2, versions 1-40; the smallest fitting version is chosen
- Text is UTF-8 byte-mode encoded; payloads beyond version 40 throw
- The error correction level is upgraded while the version holds
- The mask pattern follows the standard penalty evaluation

### Accessibility

- canvas / svg carry `role="img"` and `aria-label="二维码：<value>"`
- The download control is a real `<button>` with `aria-label="下载二维码"`
