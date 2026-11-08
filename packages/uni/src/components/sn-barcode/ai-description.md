# sn-barcode — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-barcode component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-barcode` (additive business component, AUI-BIZ-002).

## Purpose

Barcode rendered as plain views (run-length modules) — no canvas, no third-party
encoder, safe on every uni end. Supports CODE128 / CODE39 / EAN13 / EAN8 / UPC /
CODEBAR / ITF. Check digits are appended for short EAN/UPC input and validated
for full-length input; invalid input emits `error` instead of rendering a wrong
barcode. Encoding tables were cross-checked against JsBarcode (MIT) v3.11.6.

## Import

```vue
<sn-barcode text="690123456789" />
<sn-barcode text="HELLO123" format="CODE128" />
```

## Props

| Name           | Type                                                                        | Default        | Required | Description                                               |
| -------------- | --------------------------------------------------------------------------- | -------------- | -------- | --------------------------------------------------------- |
| `text`         | `string`                                                                    | `''`           | no       | Barcode content (per-format charset; see formats below).  |
| `format`       | `'CODE128' \| 'CODE39' \| 'EAN13' \| 'EAN8' \| 'UPC' \| 'CODEBAR' \| 'ITF'` | `'EAN13'`      | no       | Symbology.                                                |
| `showText`     | `boolean`                                                                   | `true`         | no       | Show text beside bars.                                    |
| `layout`       | `'horizontal' \| 'vertical'`                                                | `'horizontal'` | no       | Vertical renders the bars rotated 90°.                    |
| `textPosition` | `'bottom' \| 'top'`                                                         | `'bottom'`     | no       | Text position (along the layout axis).                    |
| `lineColor`    | `string`                                                                    | text token     | no       | Bar color (also used for the text).                       |
| `background`   | `string`                                                                    | `transparent`  | no       | Background color behind the bars.                         |
| `moduleWidth`  | `number`                                                                    | `2`            | no       | Module width (px).                                        |
| `height`       | `string`                                                                    | `'120rpx'`     | no       | Bar length (alias of `lineLength`).                       |
| `lineLength`   | `string`                                                                    | `''`           | no       | Bar length (lime-ui naming); wins over `height` when set. |
| `margin`       | `string`                                                                    | `''`           | no       | CSS margin on the root (e.g. `16rpx` / `8rpx 16rpx`).     |
| `textAlign`    | `'left' \| 'center' \| 'right'`                                             | `'center'`     | no       | Caption alignment.                                        |
| `fontSize`     | `string`                                                                    | `'22rpx'`      | no       | Text font size.                                           |
| `customClass`  | `string`                                                                    | `''`           | no       | Root custom class.                                        |
| `customStyle`  | `string`                                                                    | `''`           | no       | Root custom style.                                        |

## Formats

| Format    | Charset / notes                                                             |
| --------- | --------------------------------------------------------------------------- |
| `CODE128` | Printable ASCII (Code Set B); Mod-103 checksum computed internally.         |
| `CODE39`  | `0-9 A-Z - . space $ / + %` (auto-uppercased); wrapped in `*` start/stop.   |
| `EAN13`   | 12 digits (check digit appended) or 13 digits (validated). 95 modules.      |
| `EAN8`    | 7 digits (check digit appended) or 8 digits (validated). 67 modules.        |
| `UPC`     | 11 digits (check digit appended) or 12 digits (validated). 95 modules.      |
| `CODEBAR` | `A-D` start/stop + `0-9 - $ : / . +`; bare data is auto-wrapped with `A…A`. |
| `ITF`     | Even number of digits only; interleaved pairs.                              |

## Events

| Name       | Payload                | Description                                                                         |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `error`    | `SnBarcodeEncodeError` | `BARCODE_TEXT_INVALID` / `BARCODE_CHECKSUM_INVALID` / `BARCODE_FORMAT_UNSUPPORTED`. |
| `rendered` | `SnBarcodeEncoded`     | Encoded successfully (runs + displayText).                                          |
