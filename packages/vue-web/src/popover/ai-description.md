# SnPopover — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end popover component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A floating bubble card anchored to a trigger element: carries a titled
header and a body, opens on hover / click / focus (or fully controlled),
positions itself with viewport-aware flipping.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-popover` (https://www.naiveui.com/zh-CN/light/components/popover).

## Import

```ts
import SnPopover from '@snui/vue-web/src/popover/SnPopover.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `show` | `boolean \| undefined` | `undefined` | no | Show state; `undefined` = uncontrolled mode. |
| `defaultShow` | `boolean` | `false` | no | Initial state for uncontrolled mode. |
| `trigger` | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | no | Gesture that opens the bubble. `'manual'` = only `show` drives it. |
| `placement` | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'` | no | Bubble position relative to the trigger. |
| `delay` | `number \| [number, number]` | `100` | no | Open debounce (ms); array form sets `[open, close]`. |
| `duration` | `number` | `100` | no | Close debounce (ms). |
| `showArrow` | `boolean` | `false` | no | Render the directional arrow. |
| `arrow` | `boolean` | `true` | no | Alias of `showArrow` (both must be true to render). |
| `arrowPointToCenter` | `boolean` | `false` | no | Aim the arrow at the bubble centre instead of the trigger edge. |
| `arrowClass` | `string` | `undefined` | no | Class on the arrow element. |
| `arrowStyle` | `CSSProperties` | `undefined` | no | Style on the arrow element. |
| `header` | `string` | `''` | no | Card title section text. |
| `content` | `string` | `''` | no | Bubble body text. |
| `disabled` | `boolean` | `false` | no | Suppress showing entirely. |
| `raw` | `boolean` | `false` | no | Strip built-in card styling (caller paints). |
| `animated` | `boolean` | `true` | no | Enter animation on/off. |
| `overlap` | `boolean` | `false` | no | Bubble overlaps the trigger instead of sitting beside it. |
| `scrollable` | `boolean` | `false` | no | Cap body height and scroll overflow. |
| `displayDirective` | `'if' \| 'show'` | `'if'` | no | `'if'` unmounts on hide; `'show'` keeps the node. |
| `flip` | `boolean` | `true` | no | Flip to the opposite side when space runs out. |
| `keepAliveOnHover` | `boolean` | `true` | no | Keep open while the pointer is inside (hover trigger). |
| `width` | `number \| 'trigger'` | `undefined` | no | Fixed px width, or `'trigger'` to match the trigger width. |
| `to` | `string \| HTMLElement \| false` | `'body'` | no | Teleport target; `false` renders inline. |
| `zIndex` | `number` | `undefined` | no | Explicit stacking order (default CSS z-index 9999). |
| `contentClass` | `string` | `undefined` | no | Class on the body section. |
| `contentStyle` | `CSSProperties` | `undefined` | no | Style on the body section. |
| `onClickoutside` | `(e: MouseEvent) => void` | `undefined` | no | Click outside the bubble and trigger. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:show` | `boolean` | Show state change (v-model:show; controlled mode). |
| `show` | — | Bubble appeared. |
| `hide` | — | Bubble hidden. |

## Slots

| Name | Description |
|---|---|
| `default` | Trigger element (the visible target). |
| `header` | Card title — overrides the `header` prop. |
| `content` | Bubble body — overrides the `content` prop. |

## Divergences from the reference API

- Trigger renders from the default slot; the body is the `content`
  prop / `#content` slot (the reference uses `#trigger` + default).
- `arrow` is a local alias of `showArrow`; `showArrow` default is
  `false` (reference convention).
- `show` / `hide` events are local additions.
- Not implemented: `x` / `y` manual coordinates, `xScrollable`,
  `themeOverrides` (theming is token-driven).

## Accessibility

- Bubble: `role="dialog"` + `aria-modal="false"` (non-trapping).
- Trigger wrapper: `aria-expanded` + `aria-haspopup="dialog"`.
- Arrow is `aria-hidden="true"`.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background surface | `--sn-web-color-background-surface` | Card + arrow fill |
| Border subtle | `--sn-web-color-border-subtle` | Card + arrow border |
| Card shadow | `--sn-web-card-shadow` | Card elevation |
| Text primary | `--sn-web-color-text-primary` | Header + body text |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-FB-009.
