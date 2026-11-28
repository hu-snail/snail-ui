# sn-tooltip — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tooltip component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tap-triggered **text-only** hint bubble for mobile / miniprogram. A trigger
element with a short hint attached to one of twelve placements. Used for
icon-only buttons, truncated labels and inline explanations.

Scope split from `sn-popover` (deliberate): the tooltip renders plain text on
the platform-standard dark transient plate (the toast token pair) — there is
deliberately no `content` slot, no title / description / icon / actions. Rich
anchored cards, menus and bottom sheets belong to `sn-popover`; page-level
filters to `sn-drop-menu`. The former `content` slot and object-row rendering
were removed when the two components were split (breaking, by design).

Outside taps close the bubble through the wot-ui-style `useQueue` /
`closeOutside` page-root hook (see docs). Recolor the plate via
`--sn-tooltip-bg` / `--sn-tooltip-color`.

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
| `trigger`      | `'slot' \| 'manual'`                                                                                                                                                 | `'slot'`   | no       | `slot` (default) toggles from the trigger tap (an App-only catcher node receives it on uni-app x App). `manual` leaves toggling to the page via v-model — for remote tap targets only; slotted components with page-bound listeners are inert on App. |
| `content`      | `string \| string[]`                                                                                                                                                 | `''`       | no       | Bubble text; an array renders one plain-text line per entry. Non-string entries (legacy object rows) are dropped, never stringified. |
| `placement`    | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` | no       | Bubble anchor.                                                                                                   |
| `offset`       | `number \| number[] \| { x?, y? }`                                                                                                                                   | `0`        | no       | Gap between trigger and bubble, in design px. Published as `--sn-tooltip-offset-x` / `-y`; the 14rpx gap stays a static margin (MP-safe) and a nonzero offset re-adds it inline on the pop node.                       |
| `visibleArrow` | `boolean`                                                                                                                                                            | `true`     | no       | Render the arrow pointing at the trigger.                                                                        |
| `theme`        | `'dark' \| 'light'`                                                                                                                                                  | `'dark'`   | no       | Plate appearance (AUI addition — wd-tooltip is dark-only): `dark` translucent toast plate; `light` white surface plate with `--sn-mp-shadow-md`, arrow re-skins with it. |
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

## Exposed Methods

| Name               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `open()`           | Show the bubble and emit `update:modelValue`.  |
| `close()`          | Hide the bubble and emit `update:modelValue`.  |
| `updatePosition()` | Compatibility no-op — placement is CSS-driven. |

## Tokens Consumed (end: mp)

| Token          | CSS Variable                                                                                                                                                     | Purpose                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Component vars | `--sn-tooltip-bg` (default: `--sn-mp-color-background-inverse`), `--sn-tooltip-color` (default: `--sn-mp-color-text-on-primary`), `--sn-tooltip-width` (default `320rpx`) | Dark transient plate (toast token pair) / text on it / fixed plate width |
| Elevation      | — (the dark plate reads without a shadow)                                                                                                                        | The former bubble shadow is gone with the dark plate                         |
| Radius         | `--sn-mp-radius-md`                                                                                                                                              | Plate corners                                                                |
| Spacing        | `--sn-mp-spacing-3/4`                                                                                                                                            | Plate padding / gaps                                                         |
| Elevation (light theme) | `--sn-mp-shadow-md`                                                                                                                                    | `theme="light"` 白色底盘的投影（dark 无阴影）                                |
| Typography     | `--sn-mp-font-size-xs`, `--sn-mp-font-line-height-normal`                                                                                                        | Plate text                                                                   |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble carries `role="tooltip"`; the arrow is `aria-hidden="true"`
- Close button carries `role="button"` + `aria-label="close"`
- Interaction uses `@tap` (miniprogram has no `click` / `hover`); no focus trap

## Documented Divergences

- Text hints only (split from sn-popover, breaking by design): the `content`
  slot and object-row rendering were removed; `content` is `string \| string[]`.
- No hover trigger: miniprogram / touch devices have no `hover`, so the trigger
  is tapped to toggle. The `trigger` prop switches between slot-internal
  toggling and page-driven v-model toggling — it is not a hover/click selector.
- Dark plate: the bubble rides the platform-standard toast token pair instead
  of the elevated card surface, so the tooltip reads as a hint, not a card.
- Fixed plate width (additive, cross-platform): `max-content` / `vw` sizing is
  unsupported on uni-app x App — the plate width is the `--sn-tooltip-width`
  component var; text wraps inside it.
- Click-outside close: wot-ui `useQueue` / `closeOutside` parity — the page
  root binds the tap dispatcher; the component registers an idempotent close.
  No mask is rendered (a mask swallowed taps and broke one-gesture switching).
  On uni-app x App the page-root dispatcher never sees page taps, so the App
  close paths are the trigger re-tap and the bubble's own close button.
- App trigger catcher (uni-app x App): taps on slot content never reach the
  component's own views there — an `#ifdef APP` transparent catcher over the
  trigger box receives the tap and runs the same toggle. Web / MP strip the
  node; there the wrapper's `@tap` fires by native bubbling.
- `root-portal` is declared but not implemented (no portal host on miniprogram).
- `updatePosition()` is a no-op: the bubble is placed by CSS, nothing is measured.

## Disposal

One transition timer keeps the bubble mounted for the fade-out leg; it is cleared
on every leg change and in `onBeforeUnmount` (AGENTS.md §41). No global listener
is registered, so nothing else can leak.

## Versioning

`@snui/uni@0.4.0` — M2 overlay / interaction batch. Text-only scope split and
dark plate added in the reference-design refactor (breaking: `content` slot and
object rows removed).
