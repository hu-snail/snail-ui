# sn-swipe-action — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-swipe-action component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Swipe-to-reveal row for mobile lists (mail, chat, cart). Swiping left exposes the
`right` action area, swiping right exposes the `left` one; a tap on the open row
closes it and reports `click`. Supports two presentation forms: full-bleed rows
and floating cards with pill buttons (iOS Mail style) — the component paints no
background, so the form is decided by what the slots render.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-swipe-action`
(https://wot-ui.cn/component/swipe-action.html). New props added here MUST also be
added to the wd-swipe-action parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-swipe-action v-model="state">
  <template #right><view @tap="remove">删除</view></template>
  内容
</sn-swipe-action>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSwipeAction } from '@snui/uni';
```

## Props

| Name          | Type                                                | Default   | Required | Description                             |
| ------------- | --------------------------------------------------- | --------- | -------- | --------------------------------------- |
| `modelValue`  | `'left' \| 'close' \| 'right'`                      | `'close'` | no       | Current swipe state (`v-model`).        |
| `disabled`    | `boolean`                                           | `false`   | no       | Disable swiping — the row stays closed. |
| `beforeClose` | `(reason, position) => boolean \| Promise<boolean>` | —         | no       | Close guard; `false` blocks the close.  |
| `customClass` | `string`                                            | `''`      | no       | Custom class for the root node.         |
| `customStyle` | `string`                                            | `''`      | no       | Custom inline style for the root node.  |

### `beforeClose` arguments

| Argument   | Type                            | Description                   |
| ---------- | ------------------------------- | ----------------------------- |
| `reason`   | `'click' \| 'swipe' \| 'other'` | What triggered the close.     |
| `position` | `'left' \| 'right'`             | Which side is currently open. |

## Events

| Name                | Payload                                            | Description                         |
| ------------------- | -------------------------------------------------- | ----------------------------------- |
| `update:modelValue` | `'left' \| 'close' \| 'right'`                     | Swipe state changed.                |
| `click`             | `{ reason: 'click', position: 'left' \| 'right' }` | The open row was tapped and closed. |

## Slots

| Name      | Description                                   |
| --------- | --------------------------------------------- |
| `default` | Row content (the area that slides).           |
| `left`    | Left action area — revealed by swiping right. |
| `right`   | Right action area — revealed by swiping left. |

## Exposed Methods

| Name                        | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| `close(reason?, position?)` | Close the row; resolves `false` when `beforeClose` blocked it. |

## Tokens Consumed (end: mp)

| Token         | CSS Variable                        | Purpose                  |
| ------------- | ----------------------------------- | ------------------------ |
| Text          | `--sn-mp-color-text-primary`        | Content text             |
| Disabled text | `--sn-mp-color-text-disabled`       | Disabled row text        |

Row and action surfaces are consumer-owned (paint them with e.g.
`--sn-mp-color-background-elevated` on the slot content); the component itself
consumes only the text tokens above.

## Surfaces

The component paints no background — surfaces belong to the slot content. This
is what enables the floating-card form (iOS Mail style): the default slot
paints a rounded card, the action slots paint pill buttons, and the page canvas
shows through between them while a row is open. Classic full-bleed rows keep
working by painting the surface on the slot content (or via `custom-style` on
the root).

## Gestures

- `touchstart` / `touchmove` / `touchend` / `touchcancel` on the root node only —
  no global listener, so nothing has to be unbound (miniprogram has no `document`).
- The row drags from where it sits: the content offset at `touchstart` is the
  drag base, so touching an open row does not snap it shut.
- A mostly-vertical gesture is handed to the page scroll; a horizontal one
  `preventDefault()`s so the page does not move while the row follows the finger.
- Settle decision on release: (1) an open row dragged back towards rest closes
  first (an opposite drag is closing intent — a side flip only happens once the
  drag crosses the centre); (2) past the open threshold (30% of the side's
  distance, min 24px) the dragged side settles open; (3) a flick (≥0.5 px/ms)
  settles below the threshold; (4) everything else springs back closed with the
  300ms spring-feel settle transition (`cubic-bezier(0.32, 0.72, 0, 1)`).
- `touchcancel` (a system gesture stealing the touch) settles the row closed, so it
  can never stick half-open.
- The open distance equals the real action-area width, measured once per gesture
  through `uni.createSelectorQuery()` → the DOM node → a fallback constant.
- While the row is closed (no drag, no settle animation, no open side) the action
  areas are translated fully outside the root's `overflow: hidden` clip
  (`translateX(±100%)`), so the closed state never relies on the content layer
  painting over them (uni-app x App edge-leak fix). Content offsets are applied
  in px — the unit every measurement and touch delta already uses.

## Accessibility

- Content area carries `role="button"` + `aria-expanded`
- Interaction uses `@tap` and touch events; no keyboard path on mobile

## Documented Divergences

- A row with neither the `left` nor the `right` slot cannot be swiped (gesture ignored).
- `click` fires when the open content area is tapped (wd semantics: "tapped and
  closed"), so the tap closes the row and reports the event.
- `before-close` is also consulted for the swipe-driven close, not only for `close()`.
- The settle uses a travel threshold + flick instead of committing on every
  horizontal travel: small drags spring back closed.

## Disposal

One settle timer runs the open / closed transition; it is cleared in
`onBeforeUnmount` (AGENTS.md §41). Measurement is best-effort and creates no
observer, so nothing else can leak.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 overlay / interaction batch.
