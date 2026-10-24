# sn-count-to — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-count-to component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Animated number roll-up: tweens from `startVal` to `endVal` with thousands separators, configurable decimals and an optional ease-out curve.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-count-to`
(https://wot-ui.cn/component/count-to.html). New props added here MUST also be
added to the wd-count-to parity list.

## Animation

`requestAnimationFrame` is not guaranteed on every miniprogram target, so the
tween runs on one `setInterval` at ~60fps (16ms). `useEasing` applies a cubic
ease-out (`1 - (1 - t)³`); `false` runs linear.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-count-to :end-val="2024" suffix=" 人" />
```

```ts
import { SnCountTo } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `color` | string | '' | no | Text color override. |
| `type` | 'default' | 'primary' | 'success' | 'warning' | 'error' | 'default' | no | Semantic text theme. |
| `startVal` | number | 0 | no | Start value. |
| `endVal` | number | 2024 | no | End value. |
| `duration` | number | 3000 | no | Tween duration in ms. |
| `autoStart` | boolean | true | no | Start on mount / on value change. |
| `decimals` | number | 0 | no | Decimal places to keep. |
| `decimal` | string | '.' | no | Decimal separator character. |
| `separator` | string | ',' | no | Thousands separator character. |
| `prefix` | string | '' | no | Text before the number. |
| `suffix` | string | '' | no | Text after the number. |
| `useEasing` | boolean | true | no | Cubic ease-out instead of a linear ramp. |
| `customClass` | string | '' | no | Custom class for the root node. |
| `customStyle` | string | '' | no | Custom inline style for the root node. |

## Exposed methods

`start()` · `pause()` · `reset()`.

## Events

| Event | Payload | Description |
|---|---|---|
| `mounted` | — | Component mounted (parity with the reference). |
| `finish` | — | Tween reached `endVal`. |

## Slots

None.

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-mp-color-text-primary` | `type="default"` text |
| Action primary | `--sn-mp-color-action-primary` | `type="primary"` text |
| Feedback success / warning / danger | `--sn-mp-color-feedback-success …` | `type="success"` / `warning` / `error` text |
| Font size MD | `--sn-mp-font-size-md` | Text size |
| Line height normal | `--sn-mp-font-line-height-normal` | Text line height |

## Accessibility

- Root: `role="status"` + `aria-live="polite"` + `aria-label` mirroring the rendered text.

## Dispose

One `setInterval` — cleared on `finish`, on value / duration changes, on
`pause()` and in `onBeforeUnmount` (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
