# Barcode (uni)

`sn-barcode` renders barcodes with plain views — no canvas, no images, works on every uni end. Supported formats: CODE128 / CODE39 / EAN13 / EAN8 / UPC / CODEBAR / ITF (tables cross-checked against JsBarcode, MIT).

## When to use

- Product / ticket / inventory code display
- Offline rendering without a third-party encoder

## Demos

### Basic

A short EAN/UPC input gets its check digit appended automatically; a full-length input is validated. Invalid input goes through the `error` event — a wrong barcode is never rendered.

<Demo name="barcode-mp" description="Auto check digit / explicit 13 digits with custom bar color / invalid input error." />

### Format support

Choose the symbology with `format`:

| Format    | Charset / notes                                                            |
| --------- | -------------------------------------------------------------------------- |
| `CODE128` | Printable ASCII (Code Set B), internal Mod-103 checksum                    |
| `CODE39`  | `0-9 A-Z - . space $ / + %` (auto-uppercased), wrapped in `*` start/stop   |
| `EAN13`   | 12 digits (check digit appended) or 13 digits (validated), 95 modules      |
| `EAN8`    | 7 digits (check digit appended) or 8 digits (validated), 67 modules        |
| `UPC`     | 11 digits (check digit appended) or 12 digits (validated), 95 modules      |
| `CODEBAR` | `A-D` start/stop + `0-9 - $ : / . +`; bare data is auto-wrapped with `A…A` |
| `ITF`     | Even number of digits, interleaved pairs                                   |

### Layout & styling

- `layout="vertical"` rotates the bars 90°
- `lineLength` / `height`: bar length (`lineLength` wins)
- `lineColor`: bar + text color; `background`: background color
- `textAlign`: caption alignment; `margin`: root margin

## API

### Props

| Name           | Type                                                                        | Default         | Description                   |
| -------------- | --------------------------------------------------------------------------- | --------------- | ----------------------------- |
| `text`         | `string`                                                                    | `''`            | Content (per-format charset)  |
| `format`       | `'CODE128' \| 'CODE39' \| 'EAN13' \| 'EAN8' \| 'UPC' \| 'CODEBAR' \| 'ITF'` | `'EAN13'`       | Barcode format                |
| `showText`     | `boolean`                                                                   | `true`          | Show the text under the bars  |
| `layout`       | `'horizontal' \| 'vertical'`                                                | `'horizontal'`  | Layout direction              |
| `textPosition` | `'bottom' \| 'top'`                                                         | `'bottom'`      | Text position                 |
| `lineColor`    | `string`                                                                    | `undefined`     | Bar color (text token)        |
| `background`   | `string`                                                                    | `'transparent'` | Background color              |
| `moduleWidth`  | `number`                                                                    | `2`             | Module width (px)             |
| `height`       | `string`                                                                    | `'120rpx'`      | Bar length (alias)            |
| `lineLength`   | `string`                                                                    | `''`            | Bar length (wins over height) |
| `margin`       | `string`                                                                    | `''`            | Root margin (CSS margin)      |
| `textAlign`    | `'left' \| 'center' \| 'right'`                                             | `'center'`      | Caption alignment             |
| `fontSize`     | `string`                                                                    | `'22rpx'`       | Text font size                |
| `customClass`  | `string`                                                                    | `undefined`     | Root custom class             |
| `customStyle`  | `string`                                                                    | `undefined`     | Root custom style             |

### Events

| Name       | Payload                         | Description                                                                                          |
| ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `error`    | `(error: SnBarcodeEncodeError)` | Encoding failed (`BARCODE_TEXT_INVALID` / `BARCODE_CHECKSUM_INVALID` / `BARCODE_FORMAT_UNSUPPORTED`) |
| `rendered` | `(encoded: SnBarcodeEncoded)`   | Encoding succeeded                                                                                   |

## Dark mode

Bars default to the text color token and invert automatically; override with `lineColor`.
