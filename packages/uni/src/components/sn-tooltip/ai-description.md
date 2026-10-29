# sn-tooltip — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tooltip component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tap-triggered text hint bubble for mobile / miniprogram. A trigger element with a
short hint attached to one of twelve placements. Used for icon-only buttons,
truncated labels and inline explanations.
Outside taps close the bubble through the wot-ui-style `useQueue` /
`closeOutside` page-root hook (see docs). The bubble
defaults to the elevated surface — white in the light theme — with the page
text color; recolor via `--sn-tooltip-bg` / `--sn-tooltip-color`.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-tooltip`
(https://wot-ui.cn/component/tooltip.html). New props added here MUST also be
added to the wd-tooltip parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-tooltip content="删除后不可恢复" placement="top">
  <text>删除</text>
</sn-tooltip>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnTooltip } from '@snui/uni';
```

## Props

| Name           | Type                                                                                                                                                                 | Default    | Required | Description                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `modelValue`   | `boolean`                                                                                                                                                            | `false`    | no       | Whether the bubble is shown (`v-model`).                                                                         |
| `content`      | `string \| Array<Record<string, unknown> \| string>`                                                                                                                 | `''`       | no       | Bubble text; an array renders one line per entry (`label` / `text` / `content` / `name` key, or a plain string). |
| `placement`    | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` | no       | Bubble anchor.                                                                                                   |
| `offset`       | `number \| number[] \| { x?, y? }`                                                                                                                                   | `0`        | no       | Gap between trigger and bubble, in design px. Published as `--sn-tooltip-offset-x` / `-y`.                       |
| `visibleArrow` | `boolean`                                                                                                                                                            | `true`     | no       | Render the arrow pointing at the trigger.                                                                        |
| `disabled`     | `boolean`                                                                                                                                                            | `false`    | no       | Disables the trigger — taps are ignored and the bubble stays closed.                                             |
| `showClose`    | `boolean`                                                                                                                                                            | `false`    | no       | Render a close button inside the bubble.                                                                         |
| `customArrow`  | `string`                                                                                                                                                             | `''`       | no       | Extra class on the arrow node.                                                                                   |
| `customPop`    | `string`                                                                                                                                                             | `''`       | no       | Extra class on the bubble node.                                                                                  |
| `customClass`  | `string`                                                                                                                                                             | `''`       | no       | Custom class for the root node.                                                                                  |
| `customStyle`  | `string`                                                                                                                                                             | `''`       | no       | Custom inline style for the root node.                                                                           |
| `rootPortal`   | `boolean`                                                                                                                                                            | `false`    | no       | **Not implemented** — declared for parity; miniprogram has no portal host.                                       |

## Events

| Name                | Payload             | Description                                         |
| ------------------- | ------------------- | --------------------------------------------------- |
| `update:modelValue` | `boolean`           | Visibility changed.                                 |
| `open`              | —                   | Bubble shown.                                       |
| `close`             | —                   | Bubble hidden.                                      |
| `change`            | `{ show: boolean }` | Visibility changed (single listener for both legs). |

## Slots

| Name      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | Trigger content (the element the bubble points at). |
| `content` | Custom bubble body; replaces `content`.             |

## Exposed Methods

| Name               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `open()`           | Show the bubble and emit `update:modelValue`.  |
| `close()`          | Hide the bubble and emit `update:modelValue`.  |
| `updatePosition()` | Compatibility no-op — placement is CSS-driven. |

## Tokens Consumed (end: mp)

| Token            | CSS Variable                                              | Purpose                                |
| ---------------- | --------------------------------------------------------- | -------------------------------------- |
| Component vars   | `--sn-tooltip-bg` (default: `--sn-mp-color-background-elevated`), `--sn-tooltip-color` (default: `--sn-mp-color-text-primary`) | Bubble fill (white in the light theme) / text; the arrow follows the fill |
| Secondary text   | `--sn-mp-color-text-secondary`                            | Close glyph color                      |
| Elevation        | `--sn-mp-shadow-md`                                       | Bubble shadow                          |
| Radius           | `--sn-mp-radius-md`                                       | Bubble corners                         |
| Spacing          | `--sn-mp-spacing-2/3/4`                                   | Bubble padding / gaps                  |
| Typography       | `--sn-mp-font-size-sm`, `--sn-mp-font-line-height-normal` | Bubble text                            |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble carries `role="tooltip"`; the arrow is `aria-hidden="true"`
- Close button carries `role="button"` + `aria-label="close"`
- Interaction uses `@tap` (miniprogram has no `click` / `hover`); no focus trap

## Documented Divergences

- No hover trigger: miniprogram / touch devices have no `hover`, so the trigger
  is tapped to toggle.
- Click-outside close: wot-ui `useQueue` / `closeOutside` parity — the page
  root binds the tap dispatcher; the component registers an idempotent close.
  No mask is rendered (a mask swallowed taps and broke one-gesture switching).
- `root-portal` is declared but not implemented (no portal host on miniprogram).
- `updatePosition()` is a no-op: the bubble is placed by CSS, nothing is measured.

## Disposal

One transition timer keeps the bubble mounted for the fade-out leg; it is cleared
on every leg change and in `onBeforeUnmount` (AGENTS.md §41). No global listener
is registered, so nothing else can leak.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 overlay / interaction batch
(tooltip / popover / drop-menu / curtain / swipe-action / floating-panel).
