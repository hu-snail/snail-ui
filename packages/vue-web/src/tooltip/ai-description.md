# SnTooltip — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end tooltip component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A lightweight floating hint anchored to a trigger element: hovering,
clicking or focusing the trigger reveals a short piece of text beside it.
Content is expected to be non-interactive — a tooltip disappears as soon as
the pointer leaves, so it must never host controls.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-tooltip`, which itself extends `n-popover`
(https://www.naiveui.com/zh-CN/light/components/tooltip).

## Import

```ts
import { SnTooltip } from '@snui/vue-web';
import '@snui/tokens-web/styles';
```

## Props

| Name                            | Type                                        | Default     | Description                                                                                                                                               |
| ------------------------------- | ------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `show`                          | `boolean \| undefined`                      | `undefined` | Controlled visibility. `undefined` means uncontrolled.                                                                                                    |
| `defaultShow`                   | `boolean`                                   | `false`     | Initial visibility in uncontrolled mode.                                                                                                                  |
| `trigger`                       | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'`   | Gesture that opens the popover. `'manual'` ignores gestures entirely.                                                                                     |
| `placement`                     | `'top-start' \| 'top' \| … \| 'left-end'`   | `'top'`     | Twelve-way placement relative to the trigger.                                                                                                             |
| `content`                       | `string`                                    | `''`        | Popover text.                                                                                                                                             |
| `delay`                         | `number \| [number, number]`                | `100`       | Open delay in ms. A tuple's second item overrides `duration`.                                                                                             |
| `duration`                      | `number`                                    | `100`       | Close delay in ms.                                                                                                                                        |
| `arrow`                         | `boolean`                                   | `true`      | Draw the directional arrow.                                                                                                                               |
| `arrowPointToCenter`            | `boolean`                                   | `false`     | Aim the arrow at the popover centre instead of the trigger edge.                                                                                          |
| `arrowClass` / `arrowStyle`     | `string` / `CSSProperties`                  | `undefined` | Arrow element class / style.                                                                                                                              |
| `contentClass` / `contentStyle` | `string` / `CSSProperties`                  | `undefined` | Body element class / style.                                                                                                                               |
| `displayDirective`              | `'if' \| 'show'`                            | `'if'`      | `'if'` unmounts on hide; `'show'` retains the node and toggles `display`.                                                                                 |
| `animated`                      | `boolean`                                   | `true`      | Animate the enter / leave.                                                                                                                                |
| `raw`                           | `boolean`                                   | `false`     | Drop the built-in bubble styling.                                                                                                                         |
| `scrollable`                    | `boolean`                                   | `false`     | Let the body scroll past its max height.                                                                                                                  |
| `flip`                          | `boolean`                                   | `true`      | Flip to the opposite side when the chosen one does not fit.                                                                                               |
| `overlap`                       | `boolean`                                   | `false`     | Overlap the trigger instead of sitting beside it.                                                                                                         |
| `keepAliveOnHover`              | `boolean`                                   | `true`      | Keep open while the pointer is inside the bubble (hover trigger).                                                                                         |
| `width`                         | `number \| 'trigger'`                       | `undefined` | Fixed width, or match the trigger's width.                                                                                                                |
| `to`                            | `string \| HTMLElement \| false`            | `'body'`    | Teleport target. `false` renders in place.                                                                                                                |
| `zIndex`                        | `number`                                    | `undefined` | Explicit stacking order.                                                                                                                                  |
| `disabled`                      | `boolean`                                   | `false`     | Suppress showing entirely.                                                                                                                                |
| `wrapped`                       | `boolean`                                   | `true`      | Wrap the trigger in a structural `<span>` that owns the pointer listeners. **Local addition** — set `false` when the slot is already a focusable element. |
| `onClickoutside`                | `(e: MouseEvent) => void`                   | `undefined` | Called when a click lands outside popover and trigger.                                                                                                    |

## Events

| Event         | Payload   | When                  |
| ------------- | --------- | --------------------- |
| `update:show` | `boolean` | Visibility changed.   |
| `show`        | `()`      | The popover appeared. |
| `hide`        | `()`      | The popover hid.      |

## Slots

| Slot      | Scope            | Description                                                          |
| --------- | ---------------- | -------------------------------------------------------------------- |
| `default` | `{ triggerRef }` | The trigger element. The scope is only useful with `wrapped: false`. |
| `content` | `()`             | Rich popover content, replacing the `content` prop.                  |

## Methods

| Method    | Type            | Description                                                             |
| --------- | --------------- | ----------------------------------------------------------------------- |
| `show`    | `() => void`    | Imperative open (respects `disabled`).                                  |
| `hide`    | `() => void`    | Imperative close.                                                       |
| `isShown` | `() => boolean` | Read the effective visibility across controlled and uncontrolled modes. |

## Divergence — documented trade-offs

- **`wrapped`** is a local addition with no upstream counterpart. Upstream
  attaches listeners via `VOverflow` / `VBinder` on the trigger node itself;
  this implementation needs a structural element to hold them, so it wraps by
  default and lets callers opt out.
- **`x` / `y` manual positioning is not implemented.** Upstream accepts
  explicit CSS pixel coordinates; this implementation always derives the
  position from the trigger's rect.
- **No `header` / `footer` region.** `headerClass` / `headerStyle` /
  `footerClass` / `footerStyle` from the upstream popover are not modelled —
  use the `content` slot for structured content instead.
- **Animation timing is hard-coded** (180ms, one cubic-bezier) rather than
  read from a motion token; the tokens package has no easing alias yet.
- **Controlled mode needed an `immediate` watcher.** Both the positioning
  watcher and the outside-click watcher originally fired only on a
  false→true transition, so a consumer mounting with `show: true` got an
  unpositioned popover and no outside-click dismissal. Fixed here; the
  regression is covered by tests.

## Tokens Consumed (end: web)

| Token                               | Purpose                      |
| ----------------------------------- | ---------------------------- |
| `--sn-web-color-tooltip-background` | Bubble background.           |
| `--sn-web-color-text-on-primary`    | Bubble text colour fallback. |
