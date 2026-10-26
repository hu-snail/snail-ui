# sn-circle — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-circle component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Circular progress ring with a centre label. The sweep is drawn with a CSS conic gradient rather than SVG, so it works on every uni target.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-circle`
(https://wot-ui.cn/component/circle.html). New props added here MUST also be
added to the wd-circle parity list.

## Not implemented (documented divergences)

- `stroke-linecap` (`butt` / `round` / `square`) — a conic sweep has no line
  caps, so the prop is accepted for parity but does not change the rendering.
- The reference draws with SVG `stroke-dasharray`; this implementation uses a
  masked `conic-gradient` because miniprogram has no reliable inline-SVG host
  for arbitrary shapes.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-circle v-model="percent" />
```

```ts
import { SnCircle } from '@snui/uni';
```

## Props

| Name            | Type    | Default                | Required | Description                                             |
| --------------- | ------- | ---------------------- | -------- | ------------------------------------------------------- |
| `modelValue`    | number  | 0                      | no       | Progress, 0–100 (clamped).                              |
| `size`          | number  | string                 | 120      | no                                                      | Ring diameter (bare number = rpx).                  |
| `color`         | string  | Record<string, string> | ''       | no                                                      | Solid color, or a `{ offset: color }` gradient map. |
| `layerColor`    | string  | ''                     | no       | Track color.                                            |
| `fill`          | string  | ''                     | no       | Inner disc color; empty renders a hollow ring.          |
| `speed`         | number  | 50                     | no       | Animation speed in percent per second; `0` disables it. |
| `text`          | string  | ''                     | no       | Centre text; empty shows the rounded percentage.        |
| `strokeWidth`   | number  | string                 | 18       | no                                                      | Ring thickness (bare number = rpx).                 |
| `strokeLinecap` | 'butt'  | 'round'                | 'square' | 'round'                                                 | no                                                  | Stroke cap (parity only). |
| `clockwise`     | boolean | true                   | no       | Sweep clockwise or counter-clockwise.                   |
| `customClass`   | string  | ''                     | no       | Custom class for the root node.                         |
| `customStyle`   | string  | ''                     | no       | Custom inline style for the root node.                  |

## Events

None — the component is presentational.

## Slots

| Slot      | Description                                               |
| --------- | --------------------------------------------------------- |
| `default` | Custom centre content (replaces `text` / the percentage). |

## Tokens Consumed (end: mp)

| Token              | CSS Variable                      | Purpose                 |
| ------------------ | --------------------------------- | ----------------------- |
| Action primary     | `--sn-mp-color-action-primary`    | Default sweep color     |
| Background subtle  | `--sn-mp-color-background-subtle` | Track ring              |
| Text primary       | `--sn-mp-color-text-primary`      | Centre text             |
| Font size LG       | `--sn-mp-font-size-lg`            | Centre text size        |
| Font weight medium | `--sn-mp-font-weight-medium`      | Centre text weight      |
| Line height tight  | `--sn-mp-font-line-height-tight`  | Centre text line height |

## Accessibility

- Root: `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
- `aria-label` mirrors the rendered centre text.
- Track / arc / disc nodes are `aria-hidden="true"`.
- No keyboard interaction (read-only indicator).

## Dispose

No timer and no listener — the sweep animation is a CSS transition. Nothing to
dispose.

## Versioning

`@snui/uni@0.5.0` — initial release.
