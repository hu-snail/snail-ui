# sn-img-cropper — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-img-cropper component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Image cropper layer: a fixed crop frame with drag-to-pan, two-finger
zoom-to-scale and 90° rotation steps. `confirm` reports the resulting transform
plus the source rectangle it maps to, and the host rasterizes from that geometry.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-img-cropper`
(https://wot-ui.cn/component/img-cropper.html). New props added here MUST also be
added to the wd-img-cropper parity list.

## Not implemented (documented divergences)

- **`export-scale` / `quality` / `file-type`** are NOT declared. They only matter
  when rasterizing to a file, which needs `<canvas>` + `uni.canvasToTempFilePath`
  — outside the cross-end element allowlist CONTRIBUTING §2.3 gives this package.
  The host rasterizes from the geometry `confirm` reports.
- **`img-width` / `img-height`** are NOT declared either: the image is fitted to
  the crop frame by `aspect-ratio`, so a separate preview size would fight the
  frame instead of describing it.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-img-cropper v-model="visible" img-src="…" aspect-ratio="1:1" @confirm="onConfirm" />
```

```ts
import { SnImgCropper } from '@snui/uni';
```

## Props

| Name                | Type               | Default     | Required          | Description                                                        |
| ------------------- | ------------------ | ----------- | ----------------- | ------------------------------------------------------------------ |
| `modelValue`        | `boolean`          | `false`     | no                | Whether the layer is visible (`v-model`).                          |
| `imgSrc`            | `string`           | `''`        | yes (in practice) | Source image URL.                                                  |
| `imgWidth`          | `number \| string` | `undefined` | no                | Preview image width; a number is rpx, a string is verbatim (`%`).  |
| `imgHeight`         | `number \| string` | `undefined` | no                | Preview image height; a number is rpx, a string is verbatim (`%`). |
| `exportScale`       | `number`           | `1`         | no                | Export scale factor (declared for parity; the host applies it).    |
| `quality`           | `number`           | `0.92`      | no                | Export image quality, 0–1 (declared for parity).                   |
| `fileType`          | `'png' \| 'jpg'`   | `'png'`     | no                | Export image type (declared for parity).                           |
| `disabledRotate`    | `boolean`          | `false`     | no                | Disable rotation entirely.                                         |
| `maxScale`          | `number`           | `3`         | no                | Maximum zoom factor.                                               |
| `cancelButtonText`  | `string`           | `'取消'`    | no                | Cancel button label.                                               |
| `confirmButtonText` | `string`           | `'完成'`    | no                | Confirm button label.                                              |
| `aspectRatio`       | `string`           | `'1:1'`     | no                | Crop-frame ratio, `"width:height"`.                                |
| `customClass`       | `string`           | `''`        | no                | Custom class for the root node.                                    |
| `customStyle`       | `string`           | `''`        | no                | Custom inline style for the root node.                             |

## Events

| Name                | Payload              | Description                                |
| ------------------- | -------------------- | ------------------------------------------ |
| `update:modelValue` | `boolean`            | Visibility change (`v-model`).             |
| `confirm`           | `SnImgCropperResult` | Cropping confirmed; the layer then closes. |
| `cancel`            | —                    | Cropping cancelled; the layer then closes. |
| `imgloaded`         | `{ src }`            | The `<image>` reported `load`.             |
| `imgloaderror`      | `{ error }`          | The `<image>` reported `error`.            |

### `SnImgCropperResult`

| Field                 | Type                      | Meaning                                                    |
| --------------------- | ------------------------- | ---------------------------------------------------------- |
| `offsetX` / `offsetY` | `number`                  | Applied translation in rpx.                                |
| `scale`               | `number`                  | Applied zoom factor.                                       |
| `rotate`              | `number`                  | Applied rotation in degrees (multiple of 90).              |
| `source`              | `{ x, y, width, height }` | Source rectangle covered by the frame, in source-image px. |
| `frame`               | `{ width, height }`       | Crop-frame size in rpx.                                    |

## Slots

None.

## Tokens Consumed (end: mp)

| Token                 | CSS Variable                        | Purpose                                   |
| --------------------- | ----------------------------------- | ----------------------------------------- |
| Background overlay    | `--sn-mp-color-background-overlay`  | Layer scrim / tool buttons                |
| Background elevated   | `--sn-mp-color-background-elevated` | Frame border / footer bar                 |
| Background sunken     | `--sn-mp-color-background-sunken`   | Frame plate behind the image              |
| Border subtle         | `--sn-mp-color-border-subtle`       | Rule-of-thirds grid lines                 |
| Action primary        | `--sn-mp-color-action-primary`      | Frame corner marks                        |
| Text on primary       | `--sn-mp-color-text-on-primary`     | Tool labels / glyphs                      |
| Font size SM          | `--sn-mp-font-size-sm`              | Tool label                                |
| Line height normal    | `--sn-mp-font-line-height-normal`   | Tool label                                |
| Radius full           | `--sn-mp-radius-full`               | Round tool buttons                        |
| Spacing 3 / 4 / 5 / 8 | `--sn-mp-spacing-*`                 | Tool padding, footer padding, toolbar gap |

## Accessibility

- The layer root carries `role="dialog"`, `aria-modal="true"` and
  `aria-label="image cropper: <src>"`
- The rotate and reset controls are `role="button"` with `aria-label`s
- The grid and corner marks are `aria-hidden="true"` — they are guides, not
  content
- Gestures are touch-only; there is no keyboard pan / zoom, which matches the
  mobile-only surface of this end

## Dispose

No timer, no listener, no async measurement. `onBeforeUnmount` drops the gesture
snapshot; `sn-popup` owns its animation timer (AGENTS.md §41).

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 display-category uni
components (qr-code / table / image-preview / video-preview / img-cropper).
