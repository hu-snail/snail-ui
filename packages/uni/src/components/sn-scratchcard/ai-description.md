# sn-scratchcard — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-scratchcard component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-scratchcard` (additive business component, AUI-BIZ-005).

## Purpose

Scratch-to-reveal cover over slotted prize content. Real pointer erasing on element-level 2d canvas (uni-app x App / H5); explicit tap-to-reveal degradation on legacy-canvas hosts. Fires `open` once the scratched ratio passes `ratio`.

## Import

```vue
<sn-scratchcard title="刮一刮" :ratio="0.6" @open="onOpen">
  <text>奖品内容</text>
</sn-scratchcard>
```

## Props

| Name             | Type     | Default             | Required | Description                               |
| ---------------- | -------- | ------------------- | -------- | ----------------------------------------- |
| `coverColor`     | `string` | `'#C5C5C5'`         | no       | Cover color (`coverImg` wins).            |
| `coverImg`       | `string` | `''`                | no       | Cover image.                              |
| `ratio`          | `number` | `0.8`               | no       | Reveal threshold (0-1).                   |
| `scratchRadius`  | `number` | `10`                | no       | Scratch radius (px).                      |
| `watermarkText`  | `string` | `''`                | no       | Cover watermark text.                     |
| `watermarkSize`  | `number` | `14`                | no       | Watermark font size (px).                 |
| `watermarkColor` | `string` | `'rgba(0,0,0,0.1)'` | no       | Watermark color.                          |
| `title`          | `string` | `''`                | no       | Cover title text.                         |
| `titleSize`      | `number` | `24`                | no       | Title font size (px).                     |
| `titleColor`     | `string` | `'rgba(0,0,0,0.8)'` | no       | Title color.                              |
| `customClass`    | `string` | `''`                | no       | Root custom class.                        |
| `customStyle`    | `string` | `''`                | no       | Root custom style (provide width/height). |

## Events

`open` — fired once when the scratched ratio passes `ratio`.

## Slots

`default` — prize content under the cover.

## Methods

`reset()` — repaint the cover for another round.
