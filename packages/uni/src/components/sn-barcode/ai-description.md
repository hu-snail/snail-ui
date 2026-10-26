# sn-barcode — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-barcode component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-barcode` (additive business component, AUI-BIZ-002).

## Purpose

EAN-13 barcode rendered as plain views (run-length modules) — no canvas, no third-party encoder. Check digit is appended for 12-digit input and validated for 13-digit input; invalid input emits `error` instead of rendering a wrong barcode.

## Import

```vue
<sn-barcode text="690123456789" />
```

## Props

| Name           | Type                | Default    | Required | Description                                                   |
| -------------- | ------------------- | ---------- | -------- | ------------------------------------------------------------- |
| `text`         | `string`            | `''`       | no       | Barcode content (12/13 digits).                               |
| `format`       | `'EAN13'`           | `'EAN13'`  | no       | Format; only EAN13 implemented (CODE128 etc. are follow-ups). |
| `showText`     | `boolean`           | `true`     | no       | Show text beside bars.                                        |
| `textPosition` | `'bottom' \| 'top'` | `'bottom'` | no       | Text position.                                                |
| `lineColor`    | `string`            | text token | no       | Bar color.                                                    |
| `moduleWidth`  | `number`            | `2`        | no       | Module width (px).                                            |
| `height`       | `string`            | `'120rpx'` | no       | Bar area height.                                              |
| `fontSize`     | `string`            | `'22rpx'`  | no       | Text font size.                                               |
| `customClass`  | `string`            | `''`       | no       | Root custom class.                                            |
| `customStyle`  | `string`            | `''`       | no       | Root custom style.                                            |

## Events

| Name       | Payload                | Description                                                                         |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------- |
| `error`    | `SnBarcodeEncodeError` | `BARCODE_TEXT_INVALID` / `BARCODE_CHECKSUM_INVALID` / `BARCODE_FORMAT_UNSUPPORTED`. |
| `rendered` | `SnBarcodeEncoded`     | Encoded successfully (runs + displayText).                                          |
