# sn-transition — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-transition component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Enter / leave animation wrapper: 11 built-in animation names (single or combined), per-leg durations, lazy rendering and destroy-on-leave.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-transition`
(https://wot-ui.cn/component/transition.html). New props added here MUST also be
added to the wd-transition parity list.

## How the legs work

Same generation-token pattern as `sn-popup`: every enter / leave bumps a counter,
awaits one tick so the browser commits the initial style, then flips the target
state and arms one timer for `after-enter` / `after-leave`. A superseded leg
drops its result, so a fast open→close→open cannot strand the node.

`name` accepts one animation name or an array; the array is joined into
`sn-transition--<a>-<b>` (e.g. `['fade', 'up']` → `fade-up`).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-transition :show="open" name="fade-up">
  <text>内容</text>
</sn-transition>
```

```ts
import { SnTransition } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `show` | boolean | false | no | Whether the content is shown. |
| `duration` | number | boolean | Record<string, number> | 300 | no | Animation duration; `false` disables it, a record sets per-leg. |
| `lazyRender` | boolean | false | no | Defer the first render until `show` turns true. |
| `name` | TransitionName | TransitionName[] | — | no | One animation name, or several to combine. |
| `destroy` | boolean | true | no | Hide with `display: none` after the leave animation. |
| `enterClass` | string | '' | no | Class on the enter start frame. |
| `enterActiveClass` | string | '' | no | Class while entering. |
| `enterToClass` | string | '' | no | Class on the enter end frame. |
| `leaveClass` | string | '' | no | Class on the leave start frame. |
| `leaveActiveClass` | string | '' | no | Class while leaving. |
| `leaveToClass` | string | '' | no | Class on the leave end frame. |
| `disableTouchMove` | boolean | false | no | Intercept touchmove so the page behind cannot scroll. |
| `customClass` | string | '' | no | Custom class for the root node. |
| `customStyle` | string | '' | no | Custom inline style for the root node. |

## Events

| Event | Payload | Description |
|---|---|---|
| `before-enter` | — | Enter leg about to start. |
| `enter` | — | Enter leg started. |
| `after-enter` | — | Enter leg finished. |
| `before-leave` | — | Leave leg about to start. |
| `leave` | — | Leave leg started. |
| `after-leave` | — | Leave leg finished. |
| `click` | Event | Root tapped. |

## Slots

| Slot | Description |
|---|---|
| `default` | Animated content. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| (none) | `—` | The wrapper consumes no color token; the animation is transform / opacity only. |

## Accessibility

- The wrapper adds no ARIA role — semantics belong to the content inside.
- `disableTouchMove` intercepts touchmove only; no global listener is registered.

## Dispose

One animation timer, cleared on every leg start and in `onBeforeUnmount`
(AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
