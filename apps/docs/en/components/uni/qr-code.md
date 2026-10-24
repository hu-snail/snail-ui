# QRCode · uni-app

`sn-qr-code` is the QR code component of `@snui/uni` (mobile / miniprogram / H5): it encodes for real and paints the matrix on a `<canvas>`. Auto-registered through easycom (`components/sn-qr-code/sn-qr-code.vue` → `<sn-qr-code>`); geometry uses `rpx`.

The encoder is the in-repo `sn-qr-core.ts` (ISO/IEC 18004 Model 2): versions 1-40, four EC levels, numeric / alphanumeric / byte segment modes, 8 masks with the N1-N4 penalty evaluation and Reed-Solomon over GF(2^8). **No dependency is added**, and no `eval` / `new Function` is used.

## Basic usage

`text` is the payload, `size` is the canvas side length in design px (converted to rpx at 2×). `correct-level` defaults to `H` (~30% recoverable); use `M` for long payloads so the modules stay large enough to scan.

<Demo name="qr-code-mp-basic" description="Default EC level H versus level M." />

## Module shapes and colors

`dot-type` accepts `square`, `dots`, `rounded` and `liquid` (dots plus bridges that fuse neighbouring dark modules). `dot-scale` is the module fill ratio inside its cell (0.4-1). `color-dark` / `color-light` restyle the two module colors; `enable-gradient` turns on a linear gradient, `gradient-color` for a single end color, `gradient-colors` for a multi-stop gradient, and `gradient-direction` takes `diagonal` / `horizontal` / `vertical` or an angle in degrees.

<Demo name="qr-code-mp-dot-type" description="Four module shapes, custom dark / light colors and a vertical gradient." />

## Quiet zone and export

`margin` is the quiet zone painted inside the canvas (design px, capped at a third of the side). `exportImage()` resolves with a temp file path through `uni.canvasToTempFilePath`; hosts without that capability reject with `{ code: 'CAPABILITY_UNSUPPORTED' }`, platform failures reject with `{ code: 'EXPORT_FAILED' }`.

<Demo name="qr-code-mp-export" description="A code with a quiet zone plus exportImage resolving to a temp path." />

## Multi-color gradients, angles and canvasId

Two or more `gradientColors` override `gradientColor`; `gradientDirection` accepts `diagonal` / `horizontal` / `vertical` or a raw angle in degrees. `canvasId` pins the canvas id (the default derives from the instance uid so two codes on one page never collide) and `customClass` / `customStyle` apply to the root node.

<Demo name="qr-code-mp-canvas" description="A three-color gradient, a 45° gradient, a custom canvasId and root class / style." />

## Paint paths

1. `uni.createCanvasContext(canvasId, instance)` — WeChat / Alipay / App
2. Falls back to the `<canvas>` element's own `getContext('2d')` — H5 / docs preview
3. Neither available (unit tests / SSR) — the grid stays unpainted and rendering never throws

## Not implemented

The following wd-qr-code props are **not declared** (CONTRIBUTING §2.2: unimplemented capabilities do not appear in the API):

| Prop | Reason |
| --- | --- |
| `logo` / `logo-width` / `logo-height` / `logo-background-color` / `logo-radius` / `logo-border-color` / `logo-border-width` | Painting an image into a uni canvas needs `uni.getImageInfo` (or `downloadFile`) before `drawImage`; that capability and its async timing differ per vendor, and a silently missing logo would also break the error-correction budget the code was sized for |
| `background-image` | Same reason (decode → draw → export chain) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Payload encoded into the code |
| `size` | `number` | `200` | Canvas side in design px (clamped 40-1000) |
| `correctLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'H'` | Error correction level |
| `colorDark` | `string` | `''` | Dark module color; `''` = the code's own dark |
| `colorLight` | `string` | `''` | Light module + quiet-zone color |
| `margin` | `number` | `0` | Quiet zone width in design px |
| `dotType` | `'square' \| 'dots' \| 'rounded' \| 'liquid'` | `'square'` | Module shape |
| `dotScale` | `number` | `1` | Module fill ratio (clamped 0.4-1) |
| `enableGradient` | `boolean` | `false` | Paint dark modules with a linear gradient |
| `gradientColor` | `string` | `''` | Gradient end color; `''` falls back to `colorDark` |
| `gradientColors` | `string[]` | `[]` | Multi-stop gradient (2+), wins over `gradientColor` |
| `gradientDirection` | `'diagonal' \| 'horizontal' \| 'vertical' \| number` | `'diagonal'` | Gradient direction; a number is an angle |
| `canvasId` | `string` | `''` | Canvas id; `''` generates one per instance |
| `customClass` | `string` | `''` | Custom class for the root node |
| `customStyle` | `string` | `''` | Custom inline style for the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `click` | The code was tapped | `Event` |
| `error` | Encoding failed or the canvas context is unavailable | `unknown` |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `exportImage` | `Promise<string>` | Exports the code, resolving with a temp file path |

## Slots

None.

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-border-subtle` | Frame around the code |
| `--sn-mp-color-background-elevated` | Root plate / failure panel |
| `--sn-mp-radius-md` | Root and failure-panel corners |
| `--sn-mp-spacing-4` | Failure-panel padding |
| `--sn-mp-color-feedback-danger` | Encode-failure text color |
| `--sn-mp-font-size-sm` | Encode-failure text size |
| `--sn-mp-font-line-height-normal` | Encode-failure text line height |

## Accessibility

- Root carries `role="img"`; `aria-label` is `QR code: <text>` (or `QR code` when empty)
- The encode-failure overlay carries `role="alert"`
- No keyboard interaction; the tap target is the root node

## Dark mode

The frame, plate and failure text all use `--sn-mp-color-*` semantic tokens, all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. The code itself stays dark-modules-on-light-quiet-zone: an inverted (light-on-dark) QR is unreadable for most scanners, so `colorDark` / `colorLight` deliberately do not follow the theme. Verify with sn-config-provider's theme set to dark:

## Related

- Image display and preview: [`sn-img`](/en/components/uni/img)
- Image preview layer: [`sn-image-preview`](/en/components/uni/image-preview)
