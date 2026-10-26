# ImgCropper · uni-app

`sn-img-cropper` is the image cropper of `@snui/uni` (mobile / miniprogram / H5): a fixed crop frame with one-finger pan, two-finger zoom and 90° rotation steps. Auto-registered through easycom (`components/sn-img-cropper/sn-img-cropper.vue` → `<sn-img-cropper>`); geometry uses `rpx`.

## Basic usage

`v-model` controls visibility and `img-src` is the source image. `confirm` reports the transform plus the source rectangle the frame covers; the host rasterizes from that geometry.

<Demo name="img-cropper-mp-basic" description="Open the cropper, drag / zoom / rotate, and see the geometry reported on confirm." />

## Ratio and rotation

`aspect-ratio` takes a `"width:height"` string (default `1:1`); a malformed value falls back to 1:1. `disabled-rotate` hides the rotate control and disables `setRotate`.

<Demo name="img-cropper-mp-ratio" description="Switching between 1:1 / 16:9 / 9:16, disabled rotation and custom button labels." />

## Gestures

The crop stage listens to `@touchstart` / `@touchmove` / `@touchend` / `@touchcancel`:

- one finger drag → pans the image
- two fingers spread / pinch → zooms (clamped between `0.5` and `max-scale`)

There is no `window.addEventListener`, no timer and no async measurement.

## Declared but inert in this implementation

The following wd-img-cropper props **are declared** (reference-API parity, so a config type-checks unchanged) but have no rendering effect here:

| Prop | Note |
| --- | --- |
| `export-scale` / `quality` / `file-type` | They only matter when exporting an image file, which needs `<canvas>` + `uni.canvasToTempFilePath` — outside this package's cross-end element allowlist. The host rasterizes from the geometry `confirm` reports and applies these three |
| `img-width` / `img-height` | They do size the **preview box**: a number is a design px value (×2 into rpx internally) and a string is used verbatim (only `%` is meaningful). Leaving them empty keeps the `100%` fit |

<Demo name="img-cropper-mp-export" description="img-width / img-height preview box, the max-scale cap, and export-scale / quality / file-type substituted into the confirm result." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the cropper is open (`v-model`) |
| `imgSrc` | `string` | `''` | Source image URL |
| `disabledRotate` | `boolean` | `false` | Disable rotation |
| `maxScale` | `number` | `3` | Maximum zoom factor (falls back to 3 when ≤ 0.5) |
| `imgWidth` | `number \| string` | `undefined` | Preview image width: number = design px, string used verbatim |
| `imgHeight` | `number \| string` | `undefined` | Preview image height: same |
| `exportScale` | `number` | `1` | Export scale factor (declared, this build never rasterizes) |
| `quality` | `number` | `0.92` | Export quality 0–1 (declared, never rasterizes) |
| `fileType` | `'png' \| 'jpg'` | `'png'` | Export format (declared, never rasterizes) |
| `cancelButtonText` | `string` | `'取消'` | Cancel button label |
| `confirmButtonText` | `string` | `'完成'` | Confirm button label |
| `aspectRatio` | `string` | `'1:1'` | Crop-frame ratio, `width:height` |
| `customClass` | `string` | `''` | Custom class for the root node |
| `customStyle` | `string` | `''` | Custom inline style for the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Visibility change (`v-model`) | `boolean` |
| `confirm` | Cropping confirmed; the layer then closes | `SnImgCropperResult` |
| `cancel` | Cropping cancelled; the layer then closes | — |
| `imgloaded` | The image finished loading | `{ src }` |
| `imgloaderror` | The image failed to load | `{ error }` |

### `SnImgCropperResult`

| Field | Type | Meaning |
| --- | --- | --- |
| `offsetX` / `offsetY` | `number` | Applied translation in rpx |
| `scale` | `number` | Applied zoom factor |
| `rotate` | `number` | Applied rotation in degrees (multiple of 90) |
| `source` | `{ x, y, width, height }` | Source rectangle covered by the frame, in source-image px |
| `frame` | `{ width, height }` | Crop-frame size in rpx |

## Slots

None.

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-overlay` | Layer scrim / tool-button plate |
| `--sn-mp-color-background-elevated` | Frame border / bottom action bar |
| `--sn-mp-color-background-sunken` | Frame plate behind the image |
| `--sn-mp-color-border-subtle` | Rule-of-thirds grid lines |
| `--sn-mp-color-action-primary` | Frame corner marks |
| `--sn-mp-color-text-on-primary` | Tool labels / glyphs |
| `--sn-mp-font-size-sm` | Tool label size |
| `--sn-mp-font-line-height-normal` | Tool label line height |
| `--sn-mp-radius-full` | Round tool buttons |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-5` / `--sn-mp-spacing-8` | Tool padding / footer padding / toolbar gap |

## Accessibility

- The layer root carries `role="dialog"`, `aria-modal="true"` and `aria-label="image cropper: <src>"`
- The rotate and reset controls are `role="button"` with `aria-label`s
- The grid and corner marks are `aria-hidden="true"` — they are guides, not content
- Gestures are touch-only with no keyboard pan / zoom, which matches the mobile-only positioning of this end

## Dark mode

The scrim, frame border, grid lines and corner marks all use `--sn-mp-color-*` semantic tokens, all overridden in the dark block of `@snui/tokens-mp/styles`, so they adapt automatically. Verify with sn-config-provider's theme set to dark:

## Related

- Image upload: [`sn-upload`](/en/components/uni/upload)
- Image display: [`sn-img`](/en/components/uni/img)
