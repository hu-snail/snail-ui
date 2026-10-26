# sn-floating-panel — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-floating-panel component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Bottom sheet whose height is dragged and snapped to anchor points — the pattern
used by map apps (POI detail), music players and editors. Drag the handle (or the
content, when `content-draggable`) to resize; release snaps to the nearest anchor.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-floating-panel`
(https://wot-ui.cn/component/floating-panel.html). New props added here MUST also
be added to the wd-floating-panel parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-floating-panel v-model:height="h" :anchors="[120, 480]" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnFloatingPanel } from '@snui/uni';
```

## Props

| Name                  | Type       | Default | Required | Description                                                                   |
| --------------------- | ---------- | ------- | -------- | ----------------------------------------------------------------------------- |
| `height`              | `number`   | `0`     | no       | Panel height in design px (`v-model:height`). `0` starts at the first anchor. |
| `anchors`             | `number[]` | `[]`    | no       | Snap points in design px; empty = the wd default `[100, windowHeight * 0.6]`. |
| `duration`            | `number`   | `300`   | no       | Snap animation duration in ms; `0` disables the animation.                    |
| `contentDraggable`    | `boolean`  | `true`  | no       | Let the content area drag the panel too, not only the handle.                 |
| `safeAreaInsetBottom` | `boolean`  | `false` | no       | Pad the panel for the device safe area.                                       |
| `showScrollbar`       | `boolean`  | `true`  | no       | Render the scrollbar of the content area.                                     |
| `customClass`         | `string`   | `''`    | no       | Custom class for the root node.                                               |
| `customStyle`         | `string`   | `''`    | no       | Custom inline style for the root node.                                        |

## Events

| Name            | Payload              | Description                                                    |
| --------------- | -------------------- | -------------------------------------------------------------- |
| `update:height` | `number`             | Height changed (continuously during a drag, then on the snap). |
| `height-change` | `{ height: number }` | The drag settled — fires once per gesture (wd parity).         |

## Slots

| Name      | Description                               |
| --------- | ----------------------------------------- |
| `default` | Panel content (scrolls inside the panel). |

## Tokens Consumed (end: mp)

| Token         | CSS Variable                        | Purpose                    |
| ------------- | ----------------------------------- | -------------------------- |
| Surface       | `--sn-mp-color-background-elevated` | Panel background           |
| Text          | `--sn-mp-color-text-primary`        | Panel text                 |
| Handle        | `--sn-mp-color-border-default`      | Drag-handle bar (rest)     |
| Handle active | `--sn-mp-color-action-primary`      | Drag-handle bar (dragging) |
| Elevation     | `--sn-mp-shadow-lg`                 | Panel shadow               |
| Radius        | `--sn-mp-radius-xl/full`            | Panel + handle corners     |
| Spacing       | `--sn-mp-spacing-4`                 | Content padding            |

## Gestures

- `touchstart` / `touchmove` / `touchend` / `touchcancel` on the handle, and on the
  content area when `content-draggable` — no global listener (miniprogram has no
  `document`), so nothing has to be unbound.
- Dragging up grows the panel (`height = startHeight - dy`); the value never goes
  below 0.
- A tap on the handle ends the gesture without changing the height.
- `touchcancel` settles to the nearest anchor from wherever the finger left it.
- Starting a new drag interrupts a running snap so the finger takes over at once.

## Height model

`v-model:height` is in **design px**, the same unit as `anchors`. An external
`height` change moves the panel; a drag / snap reports back through
`update:height` and, once settled, `heightChange`.

## Anchors

The wd default is `[100, windowHeight * 0.6]`. There is no `window` on miniprogram,
so the default is resolved from `globalThis.uni.getSystemInfoSync()` when available
and falls back to the single static anchor otherwise. An explicit `anchors` array
always wins; it is sorted and non-finite / negative values are dropped.

## Accessibility

- Drag handle carries `role="separator"` + `aria-orientation="horizontal"` +
  `aria-valuenow` (the current height in design px)
- Handle bar is `aria-hidden="true"` (decorative)
- Interaction uses touch events; no keyboard path on mobile

## Disposal

One settle timer ends the snap animation and one generation token drops a stale
leg; both are cleared in `onBeforeUnmount` (AGENTS.md §41). No global listener and
no observer.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 overlay / interaction batch.
