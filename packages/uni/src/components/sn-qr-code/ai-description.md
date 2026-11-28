# sn-qr-code — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-qr-code component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

QR Code rendered on a `<canvas>` for mobile / miniprogram. The matrix comes
from a from-scratch ISO/IEC 18004 Model 2 encoder in `sn-qr-core.ts` — versions
1-40, four EC levels, numeric / alphanumeric / byte segments, 8 masks with the
N1-N4 penalty evaluation, Reed-Solomon over GF(2^8). No runtime dependency and
no dynamic code execution (AGENTS.md §23).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-qr-code`
(https://wot-ui.cn/component/qr-code.html). New props added here MUST also be
added to the wd-qr-code parity list.

## Extensions beyond the reference library

- **`cornerRadius`** is an AUI extension, not a `wd-qr-code` prop. It rounds
  the four structural corner blocks (see below). Default `6` design px, `0`
  restores the standard square corners. It is recorded here so the parity list
  stays explicit instead of silently drifting.

## Not implemented (documented divergences)

- **`logo` / `logo-width` / `logo-height` / `logo-background-color` /
  `logo-radius` / `logo-border-color` / `logo-border-width`** are NOT declared.
  Painting an image into a uni canvas requires `uni.getImageInfo` (or
  `downloadFile`) before `drawImage`, and that capability plus its async timing
  differ per vendor. A logo that silently misses on one target would also break
  the error-correction budget the code was sized for.
- **`background-image`** is NOT declared, for the same reason.

## Corner blocks

`cornerRadius` rounds the three 7×7 finder patterns and, on version ≥ 2, the
5×5 bottom-right alignment pattern. Each block is repainted as a rounded 回
(dark outer ring → light ring → dark 3×3 / 1×1 centre) with the original module
footprint, so no data module changes, the plate stays square and the code stays
scannable. Version 1 has no alignment pattern, hence only three corner blocks.
The radius is a design-px value scaled into device pixels and capped at 1.5
modules; the rounded-square filler degrades `roundRect` → an `arc` path → a
plain `fillRect` for canvas hosts with fewer path APIs.

## Painting

The host is detected first, because `uni.createCanvasContext` is a deprecated
shim on uni-app x (it paints into a detached surface and leaves the QR blank):

1. **uni-app x App / Web**: `uni.getElementById(id).getContext('2d')`. The
   bitmap is sized from the element box × devicePixelRatio and modules are
   drawn directly in device pixels — no `scale()` transform.
2. **uni-app x mini-programs** (WeChat / Alipay / …): `uni.getElementById` is
   App/Web-only, so the canvas is resolved **only** through
   `uni.createCanvasContextAsync({ id, component })` → `CanvasContext.getContext('2d')`.
   The resolved surface is cached and reused by every repaint. If the host
   exposes no resizable bitmap, coordinates stay in **logical px** (multiplying
   by DPR there pushed the whole matrix off-screen and produced a blank QR).
3. **Classic uni-app**: `uni.createCanvasContext(canvasId, instance.proxy)` —
   WeChat / Alipay / App, with a `draw()` flush; mini-programs also stay in
   logical px. The DOM `<canvas>` `getContext('2d')` is the H5 / docs fallback.
4. Neither available (unit tests, SSR) → the grid stays unpainted; rendering
   never throws.

First paint is retried a bounded number of times on uni-app x and mini-programs
(and on the `<canvas>` `@ready` callback): the element box is only measurable
after layout, and a mini-program native canvas can hand out a context long
before it is drawable, so a short repaint tail runs even after a "successful"
first paint. `draw()` is issued for legacy and asynchronously resolved
contexts; synchronously resolved W3C canvases do not need it.

The rounded corner blocks degrade `roundRect` → `arc` path → square `fillRect`;
if a host throws on every path call, the skipped finder / alignment modules are
repainted square so the code stays complete and scannable.

## Colors

A canvas cannot resolve `var(--sn-mp-*)`, so `color-dark` / `color-light` are
plain CSS colors with `''` defaults (the code's own black-on-white). A QR must
stay dark-on-light to scan, so the module colors deliberately do **not** follow
`.sn-theme-dark`; everything else in the component uses `--sn-mp-*` tokens.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-qr-code text="https://snui.dev" :size="200" />
```

```ts
import { SnQrCode } from '@snui/uni';
```

## Props

| Name                | Type                                                 | Default      | Required | Description                                          |
| ------------------- | ---------------------------------------------------- | ------------ | -------- | ---------------------------------------------------- |
| `text`              | `string`                                             | `''`         | no       | Payload encoded into the code.                       |
| `size`              | `number`                                             | `200`        | no       | Canvas side length in design px (clamped 40-1000).   |
| `correctLevel`      | `'L' \| 'M' \| 'Q' \| 'H'`                           | `'H'`        | no       | Error correction level.                              |
| `colorDark`         | `string`                                             | `''`         | no       | Dark module color; `''` = the code's own dark.       |
| `colorLight`        | `string`                                             | `''`         | no       | Light module + quiet-zone color.                     |
| `margin`            | `number`                                             | `0`          | no       | Quiet zone in design px, painted inside the canvas.  |
| `dotType`           | `'square' \| 'dots' \| 'rounded' \| 'liquid'`        | `'square'`   | no       | Module shape.                                        |
| `dotScale`          | `number`                                             | `1`          | no       | Module fill ratio (clamped 0.4-1).                   |
| `cornerRadius`      | `number`                                             | `6`          | no       | AUI extension: corner-block radius in design px; `0` = square. |
| `enableGradient`    | `boolean`                                            | `false`      | no       | Paint dark modules with a linear gradient.           |
| `gradientColor`     | `string`                                             | `''`         | no       | Gradient end color; `''` falls back to `colorDark`.  |
| `gradientColors`    | `string[]`                                           | `[]`         | no       | Multi-stop gradient (2+); wins over `gradientColor`. |
| `gradientDirection` | `'diagonal' \| 'horizontal' \| 'vertical' \| number` | `'diagonal'` | no       | Gradient direction; a number is an angle in degrees. |
| `canvasId`          | `string`                                             | `''`         | no       | Canvas id; `''` = per-instance generated.            |
| `customClass`       | `string`                                             | `''`         | no       | Custom class for the root node.                      |
| `customStyle`       | `string`                                             | `''`         | no       | Custom inline style for the root node.               |

## Events

| Name    | Payload   | Description                         |
| ------- | --------- | ----------------------------------- |
| `click` | `Event`   | The code was tapped.                |
| `error` | `unknown` | Encoding or canvas-context failure. |

## Methods

| Name            | Returns           | Description                                                                                                                                                                                 |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exportImage()` | `Promise<string>` | `data:image/...` URL on uni-app x / H5 (canvas `toDataURL()`), temp file path on classic uni-app (`uni.canvasToTempFilePath`). Rejects with `{ code: 'CAPABILITY_UNSUPPORTED' }` when no export capability exists, `{ code: 'EXPORT_FAILED' }` on a platform failure. |

## Slots

None.

## Tokens Consumed (end: mp)

| Token               | CSS Variable                        | Purpose                    |
| ------------------- | ----------------------------------- | -------------------------- |
| Border subtle       | `--sn-mp-color-border-subtle`       | Frame around the code      |
| Background elevated | `--sn-mp-color-background-elevated` | Root plate / error panel   |
| Radius MD           | `--sn-mp-radius-md`                 | Root + error panel corners |
| Spacing 4           | `--sn-mp-spacing-4`                 | Error panel padding        |
| Feedback danger     | `--sn-mp-color-feedback-danger`     | Encode-failure text        |
| Font size SM        | `--sn-mp-font-size-sm`              | Encode-failure text        |
| Line height normal  | `--sn-mp-font-line-height-normal`   | Encode-failure text        |

## Accessibility

- Root carries `role="img"`; `aria-label` is `QR code: <text>` (or `QR code`)
- The encode-failure overlay carries `role="alert"`
- No keyboard interaction; the tap target is the root node

## Dispose

One cached legacy context, one cached async mini-program surface, bounded
first-paint retry timers and at most one pending async context request — all
released in `onBeforeUnmount` (AGENTS.md §41). No listener, no interval.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 display-category uni
components (qr-code / table / image-preview / video-preview / img-cropper).
