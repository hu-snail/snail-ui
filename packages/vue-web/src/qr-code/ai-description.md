# SnQrCode — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end QR code component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Renders text content as a scannable QR code (Model 2, versions 1-40) on a
canvas or inline SVG, with configurable colors, size, padding, optional
center icon, error correction level, and a hover download toolbar.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-qr-code`
(https://www.naiveui.com/zh-CN/light/components/qr-code).

Encoding uses `./sn-qr-core.ts` — a from-scratch, zero-dependency QR encoder
implementing the same published algorithm (ISO/IEC 18004) as the MIT-licensed
QR-Code-generator the reference library vendors: byte mode (UTF-8 via
`TextEncoder`), smallest fitting version, automatic lowest-penalty mask,
EC-level boosting while the version holds.

## Import

```ts
import SnQrCode from '@snui/vue-web/src/qr-code/SnQrCode.vue';
```

## Props

| Name                   | Type                             | Default                                     | Required | Description                                                                              |
| ---------------------- | -------------------------------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `value`                | `string`                         | `''`                                        | no       | Text encoded into the QR code (`undefined` renders the `-` payload, like the reference). |
| `errorCorrectionLevel` | `'L' \| 'M' \| 'Q' \| 'H'`       | `'M'`                                       | no       | ~7% / 15% / 25% / 30% recoverable codewords.                                             |
| `size`                 | `number`                         | `100`                                       | no       | Square side length in px (padding included).                                             |
| `padding`              | `number \| string`               | `12`                                        | no       | Inner padding around the code; number → px.                                              |
| `color`                | `string`                         | theme (`--sn-web-color-text-primary`)       | no       | Dark-module color (any CSS color).                                                       |
| `backgroundColor`      | `string`                         | theme (`--sn-web-color-background-surface`) | no       | Light-module / box background color.                                                     |
| `iconSrc`              | `string`                         | —                                           | no       | Center icon image url.                                                                   |
| `iconSize`             | `number`                         | `40`                                        | no       | Center icon size in px.                                                                  |
| `iconBackgroundColor`  | `string`                         | theme (`--sn-web-color-background-surface`) | no       | Icon backing plate color.                                                                |
| `iconBorderRadius`     | `number`                         | `4`                                         | no       | Icon backing plate radius in px.                                                         |
| `type`                 | `'canvas' \| 'svg'`              | `'canvas'`                                  | no       | Render target.                                                                           |
| `shape`                | `'square' \| 'dot' \| 'rounded'` | `'square'`                                  | no       | Module shape; `dot` = mini-program-style circles with rounded-square finder eyes.        |
| `colors`               | `string[]`                       | `undefined`                                 | no       | Multi-color palette; data modules cycle deterministically, finder eyes keep `color`.     |
| `showToolbar`          | `boolean`                        | `true`                                      | no       | Reveal the floating download toolbar on hover/focus.                                     |

## Events

None. Downloading is a self-contained toolbar action.

## Slots

None.

## Exposed Methods

None.

## Divergences from the reference API

- `showToolbar` is a local addition (hover-revealed download button built
  from `canvas.toDataURL('image/png')`; SVG payload for `type="svg"` and when
  `toDataURL` is unavailable). The reference has no toolbar; its download
  demo wires the same logic by hand.
- The encoder is byte-mode only (no numeric/alphanumeric segment packing),
  and the canvas is drawn at `devicePixelRatio` resolution instead of the
  reference's fixed ×2 upscale.
- Payloads larger than version 40 throw `RangeError` (reference behaviour).
- Rendering degrades gracefully when the canvas 2D context is unavailable.

## Accessibility

- The canvas/svg carries `role="img"` and `aria-label="二维码：<value>"`.
- The download button is a real `<button>` with `aria-label="下载二维码"`.

## Tokens Consumed (end: web)

| Token                           | CSS Variable                         | Purpose                                   |
| ------------------------------- | ------------------------------------ | ----------------------------------------- |
| Text primary (+ color-mix 12%)  | `--sn-web-color-text-primary`        | Toolbar border (mixed with surface)       |
| Text secondary                  | `--sn-web-color-text-secondary`      | Toolbar icon color                        |
| Text primary (+ color-mix 4.7%) | `--sn-web-color-text-primary`        | Toolbar button hover (mixed with surface) |
| Background elevated             | `--sn-web-color-background-elevated` | Toolbar surface                           |

The QR foreground/background colors are user props (theme-independent), as in
the reference.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-015.
