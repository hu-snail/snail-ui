# sn-overlay — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-overlay component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Full-screen scrim layer for mobile / miniprogram. Renders a dark translucent
surface with optional centred content, a fade in / out animation and a
close-on-tap contract. Used standalone (e.g. a blocking scrim) or as the base
layer of a custom modal.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-overlay`
(https://wot-ui.cn/component/overlay.html). New props added here MUST also be
added to the wd-overlay parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-overlay :show="blocking" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnOverlay } from '@snui/uni';
```

## Props

| Name          | Type                                          | Default | Required | Description                                                                   |
| ------------- | --------------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------- |
| `show`        | `boolean`                                     | `false` | no       | Whether the overlay is shown.                                                 |
| `duration`    | `number \| boolean \| Record<string, number>` | `300`   | no       | Animation duration; `false` disables, a record sets enter / leave separately. |
| `lockScroll`  | `boolean`                                     | `true`  | no       | Intercept `touchmove` so the page behind cannot scroll.                       |
| `zIndex`      | `number`                                      | `10`    | no       | Stacking level.                                                               |
| `customStyle` | `string`                                      | `''`    | no       | Custom inline style for the root node.                                        |
| `customClass` | `string`                                      | `''`    | no       | Custom class for the root node.                                               |

## Events

| Name           | Payload | Description                              |
| -------------- | ------- | ---------------------------------------- |
| `click`        | `Event` | Overlay tapped.                          |
| `before-enter` | —       | Enter animation about to start.          |
| `enter`        | —       | Enter animation started.                 |
| `after-enter`  | —       | Enter animation finished.                |
| `before-leave` | —       | Leave animation about to start.          |
| `leave`        | —       | Leave animation started.                 |
| `after-leave`  | —       | Leave animation finished (node removed). |

## Slots

| Name      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | Content rendered on top of the scrim (centred). |

## Tokens Consumed (end: mp)

| Token           | CSS Variable                       | Purpose                              |
| --------------- | ---------------------------------- | ------------------------------------ |
| Scrim           | `--sn-mp-color-background-overlay` | Overlay background (dark-mode aware) |
| Text on primary | `--sn-mp-color-text-on-primary`    | Content text color over the scrim    |

## Accessibility

- Root carries `data-snui-component="overlay"`; tap target is the whole scrim
- Decorative by default — pass an accessible name on the content you put inside
- Mobile tap (`@tap`), no keyboard focus trap

## Disposal

The only disposable resource is the animation timer; it is cleared in
`onBeforeUnmount` (AGENTS.md §41). Scroll lock is an inline `touchmove`
interceptor, so no global listener is registered and nothing else can leak.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M1 feedback-category uni
components (popup / overlay / loading / progress / empty).
