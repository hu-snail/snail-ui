# Barcode (uni)

`sn-barcode` renders an EAN-13 barcode with plain views — no canvas, no images, works on both ends.

## When to use

- Product / ticket EAN-13 code display
- Offline rendering without a third-party encoder

## Demos

### Basic

A 12-digit input gets its check digit appended automatically; a 13-digit input is validated. Invalid input goes through the `error` event — a wrong barcode is never rendered.

<Demo name="barcode-mp" description="Auto check digit / explicit 13 digits with custom bar color / invalid input error." />

### Format support

Currently `format="EAN13"` (full L/G/R tables and the leading-digit parity template). CODE128 and other formats are registered as follow-ups; requesting one emits `BARCODE_FORMAT_UNSUPPORTED`.

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Content (12 or 13 digits) |
| `format` | `'EAN13'` | `'EAN13'` | Barcode format |
| `showText` | `boolean` | `true` | Show the text under the bars |
| `textPosition` | `'bottom' \| 'top'` | `'bottom'` | Text position |
| `lineColor` | `string` | `undefined` | Bar color (text token) |
| `moduleWidth` | `number` | `2` | Module width (px) |
| `height` | `string` | `'120rpx'` | Bar area height |
| `fontSize` | `string` | `'22rpx'` | Text font size |
| `customClass` | `string` | `undefined` | Root custom class |
| `customStyle` | `string` | `undefined` | Root custom style |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `error` | `(error: SnBarcodeEncodeError)` | Encoding failed (`BARCODE_TEXT_INVALID` / `BARCODE_CHECKSUM_INVALID` / `BARCODE_FORMAT_UNSUPPORTED`) |
| `rendered` | `(encoded: SnBarcodeEncoded)` | Encoding succeeded |

## Dark mode

Bars default to the text color token and invert automatically; override with `lineColor`.
