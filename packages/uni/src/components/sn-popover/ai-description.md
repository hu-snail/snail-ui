# sn-popover — AI-Friendly Component Description
- Measured placement: the bubble is positioned from real measurements, not
  CSS anchoring. A hidden copy of the bubble stays mounted (`position: fixed;
  visibility: hidden`) so its natural size can be read; the trigger box is
  measured the same way. Opening folds both rects through a 12-entry
  placement table (`sn-popover-position.ts`) into inline styles.
- Two coordinate spaces, one table:
  - H5 / App — the bubble is `position: absolute` inside the component root,
    positioned root-relative.
  - mini-program — the bubble is `position: fixed` with VIEWPORT coordinates.
    The host wrapper there forces `overflow: hidden` on every view and is not
    a positioning context, so an `absolute` bubble would lose its origin and
    be clipped at the component box (AUI-POP-MP-001). The host is detected by
    capability (`createCanvasContextAsync` present, no DOM).
- On mini-programs the placement adapts to the screen: when the preferred
  side has no room and the opposite side does, the bubble flips to it (the
  arrow follows); otherwise it is clamped inside the viewport. The trigger is
  re-measured on every open, because viewport coordinates go stale when the
  page scrolls. `actualPlacement` exposes the placement in effect.
- The arrow is a CSS border triangle (per-side longhands — uni-app x App does
  not expand the 4-value `border-width` shorthand). It shares the bubble's
  fill through `--sn-popover-bg`, so one override recolours both.
- The after-enter leg re-measures the SHOWN bubble (`updatePosition`) and
  re-derives the styles only when its natural size changed — slotted / async
  content may settle to a different size than the hidden copy predicted.
- The transition is `sn-transition name="fade"`; it owns and disposes its own
  animation timer.

> Human-readable + AI-parseable description of the uni-end sn-popover component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tap-triggered bubble with two display modes — `normal` (a short text hint) and
`menu` (an action list) — anchored to its trigger in one of 12 placements.
Used for contextual hints and compact "more" action lists next to a control.
For a text-only dark hint use `sn-tooltip`; for a page-level filter bar use
`sn-drop-menu`.

The bubble is single-line (`white-space: nowrap`): it grows with its content
and never wraps or clips. The `content` slot replaces the built-in body in
both modes.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-popover`
(https://wot-ui.cn/component/popover.html). New props added here MUST also be
added to the wd-popover parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-popover v-model="open" content="文字提示">
  <sn-button>显示气泡</sn-button>
</sn-popover>
<sn-popover v-model="open" mode="menu" :content="actions" @menuclick="onPick">
  <sn-button>更多</sn-button>
</sn-popover>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnPopover } from '@snui/uni';
```

## Props

| Name             | Type                                      | Default    | Required | Description                                                                            |
| ---------------- | ----------------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------- |
| `modelValue`     | `boolean`                                 | `false`    | no       | Whether the bubble is shown (`v-model`).                                              |
| `content`        | `string \| SnPopoverMenuItem[]`           | `''`        | no       | A string in `normal` mode, a row list in `menu` mode. Replaced by the `content` slot.  |
| `mode`           | `'normal' \| 'menu'`                      | `'normal'` | no       | Bubble display mode.                                                                   |
| `placement`      | 12-direction `PopoverPlacement`           | `'bottom'` | no       | Where the bubble sits relative to the trigger.                                          |
| `offset`         | `number \| number[] \| { x: number; y: number }` | `0`  | no       | Extra distance in px. For `-start` / `-end` it shifts the bubble and counter-shifts the arrow so the arrow keeps pointing at the trigger. |
| `visibleArrow`   | `boolean`                                 | `true`     | no       | Render the arrow. When off, the arrow's gap is dropped from the placement too.         |
| `disabled`       | `boolean`                                 | `false`    | no       | Disables the TRIGGER — a trigger tap is ignored. It does not block a page-driven `v-model`. |
| `showClose`      | `boolean`                                 | `false`    | no       | Render a close button at the bubble's top-right corner.                               |
| `customClass`    | `string`                                  | `''`       | no       | Extra class on the root node.                                                          |
| `customStyle`    | `string`                                  | `''`       | no       | Custom inline style for the root node. Override `--sn-popover-*` tokens here.          |
| `customArrow`    | `string`                                  | `''`       | no       | Extra class on the arrow node.                                                         |
| `customPop`      | `string`                                  | `''`       | no       | Extra class on the bubble container (shown bubble and hidden copy both).              |

### `SnPopoverMenuItem`

| Field       | Type     | Description                                                       |
| ----------- | -------- | ----------------------------------------------------------------- |
| `content`   | `string` | Row text.                                                          |
| `iconClass` | `string` | Optional row icon — a name resolved through `sn-icon` (registry → built-in catalog → provider). |

## Events

| Name                | Payload                                      | Description                          |
| ------------------- | -------------------------------------------- | ------------------------------------ |
| `update:modelValue` | `boolean`                                    | Visibility changed.                  |
| `open`              | —                                            | Bubble shown.                        |
| `close`             | —                                            | Bubble hidden.                       |
| `change`            | `{ show: boolean }`                          | Visibility changed.                  |
| `menuclick`         | `{ item: SnPopoverMenuItem, index: number }` | A `menu` mode row was tapped; the bubble closes. |

`open` / `close` / `change` ride the shown-state watcher, so they land one
tick after `update:modelValue`.

## Slots

| Name      | Description                                       |
| --------- | ------------------------------------------------- |
| `default` | Trigger content.                                   |
| `content` | Custom bubble body; replaces `content` in both modes. |

## Exposed Methods

| Name               | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `open()`           | Show the bubble. Closes every other registered bubble first.        |
| `close()`          | Hide the bubble. Idempotent — a no-op when already closed.          |
| `updatePosition()` | Re-measure the shown bubble and re-derive the placement when its size changed. |

## Tokens Consumed (end: mp)

| Token          | CSS Variable                                                                                             | Purpose                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Bubble surface | `--sn-popover-bg` (default `--sn-mp-color-background-elevated`), `--sn-popover-color` (default `--sn-mp-color-text-secondary`) | Bubble fill + arrow fill / text; override through `custom-style` |
| Radius         | `--sn-popover-radius` (default `--sn-mp-radius-md`)                                                      | Bubble corners                                                 |
| Divider        | `--sn-popover-border` (default `--sn-mp-color-border-subtle`)                                             | Menu row dividers                                              |
| Arrow          | `--sn-popover-arrow-size` (default `9px` — the placement math is px)                                     | Arrow leg                                                      |
| Stack order    | `--sn-popover-z-index` (default `500`)                                                                    | Bubble layer                                                   |
| Elevation      | `--sn-mp-shadow-md`                                                                                       | Bubble shadow                                                  |
| Spacing        | `--sn-mp-spacing-1/2/4`, `--sn-mp-spacing-0`                                                              | Padding / icon gap                                             |
| Typography     | `--sn-mp-font-size-md`, `--sn-mp-font-line-height-normal`                                                 | Bubble text                                                    |
| Icons          | `--sn-mp-icon-size-medium` (menu row), `--sn-mp-icon-size-small` (close)                                 | Icon scale                                                     |

## Accessibility

- The trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- The bubble container carries `role="dialog"`; the arrow and the hidden
  measurement copy are `aria-hidden="true"`
- A `menu` body carries `role="menu"`; its rows carry `role="menuitem"`
- The close button carries `role="button"` + `aria-label`
- Interaction uses `@tap`; no hover trigger (miniprogram has none)

## Documented Divergences

- Menu row dividers are real elements, not `::after` (uni-app x App has no
  pseudo-elements).
- `iconClass` resolves through `sn-icon` instead of a font-icon class: this
  library ships no icon font.
- `disabled` only guards the trigger (`toggle`): a page can still drive the
  bubble through `v-model`.
- Outside close (AUI-OPT-07): the close rides the shared queue in
  `utils/outside-close.ts`. The page root binds `@tap="closeOutside"` and the
  trigger stops propagation, so a tap outside closes the bubble AND still
  reaches whatever control sits under it. Opening one bubble closes the
  others — one gesture switches.
- App trigger catcher (uni-app x App): an `#ifdef APP` transparent node over
  the trigger box receives the tap, because slot-content taps never reach the
  component's own views there.
- Mini-program fixed layer (AUI-POP-MP-001): there the bubble is `position:
  fixed` with viewport coordinates, and it flips to the opposite side when
  the preferred one has no room. This diverges from the reference library,
  which relies on `virtualHost` to drop the host wrapper — an option the
  uni-app x compile does not carry into the component's json, so the wrapper
  is always present there and would clip an `absolute` bubble.

## Disposal

This component owns no timer — the fade legs belong to `sn-transition`, which
clears its own on unmount. The outside-close registration is removed in
`onBeforeUnmount`. No global listener.

## Versioning

**Breaking** — wot-ui parity rewrite: measured placement with a hidden
measurement copy, CSS border-triangle arrow, `sn-transition` fade. The
additive sheet presentation, rich card body (title / subtitle / header icon),
action pills, `cancelText`, `trigger`, `closeOnClickOutside`, the `footer`
slot and the `rootPortal` placeholder prop were removed. The released version
is assigned by changesets.
