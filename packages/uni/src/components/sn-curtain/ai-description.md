# sn-curtain — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-curtain component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Full-screen image curtain for promotions, announcements and festival pop-ups. A
centred image on a scrim, with a close button whose position is configurable and
an optional tap-through link (`to`).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-curtain`
(https://wot-ui.cn/component/curtain.html). New props added here MUST also be
added to the wd-curtain parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-curtain v-model="show" src="/static/promo.png" to="/pages/campaign" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnCurtain } from '@snui/uni';
```

## Props

| Name                  | Type                                                                                           | Default   | Required | Description                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------- | --------- | -------- | -------------------------------------------------------------------------- |
| `modelValue`          | `boolean`                                                                                      | `false`   | no       | Whether the curtain is shown (`v-model`).                                  |
| `src`                 | `string`                                                                                       | `''`      | no       | Image URL — a network / package path, not a base64 blob.                   |
| `width`               | `number`                                                                                       | `0`       | no       | Image width in design px; `0` fits the screen width.                       |
| `to`                  | `string`                                                                                       | `''`      | no       | Page path opened through `uni.navigateTo` on tap.                          |
| `closePosition`       | `'inset' \| 'top' \| 'bottom' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'inset'` | no       | Close button position.                                                     |
| `closeOnClickModal`   | `boolean`                                                                                      | `false`   | no       | Close when the scrim is tapped.                                            |
| `closeOnClick`        | `boolean`                                                                                      | `true`    | no       | Close when the image is tapped.                                            |
| `hideWhenClose`       | `boolean`                                                                                      | `true`    | no       | Remove the node once the leave animation finished.                         |
| `zIndex`              | `number`                                                                                       | `10`      | no       | Stacking level.                                                            |
| `customCloseClass`    | `string`                                                                                       | `''`      | no       | Extra class on the close button.                                           |
| `customCloseStyle`    | `string`                                                                                       | `''`      | no       | Extra inline style on the close button.                                    |
| `showMenuByLongpress` | `boolean`                                                                                      | `false`   | no       | WeChat long-press menu on the image (WeChat only).                         |
| `customClass`         | `string`                                                                                       | `''`      | no       | Custom class for the root node.                                            |
| `customStyle`         | `string`                                                                                       | `''`      | no       | Custom inline style for the root node.                                     |
| `rootPortal`          | `boolean`                                                                                      | `false`   | no       | **Not implemented** — declared for parity; miniprogram has no portal host. |

## Events

| Name                                     | Payload   | Description                                           |
| ---------------------------------------- | --------- | ----------------------------------------------------- |
| `update:modelValue`                      | `boolean` | Visibility changed.                                   |
| `click`                                  | —         | The image was tapped.                                 |
| `close`                                  | —         | A close was requested (image / scrim / close button). |
| `closed`                                 | —         | The leave animation finished.                         |
| `click-modal`                            | —         | The scrim was tapped.                                 |
| `before-enter` / `enter` / `after-enter` | —         | Enter animation legs.                                 |
| `before-leave` / `leave` / `after-leave` | —         | Leave animation legs.                                 |
| `load`                                   | `Event`   | The image loaded.                                     |
| `error`                                  | —         | The image failed to load; the curtain hides itself.   |

## Slots

| Name    | Description                                       |
| ------- | ------------------------------------------------- |
| `close` | Custom close button; replaces the built-in glyph. |

## Tokens Consumed (end: mp)

| Token         | CSS Variable                        | Purpose                      |
| ------------- | ----------------------------------- | ---------------------------- |
| Scrim         | `--sn-mp-color-background-overlay`  | Full-screen scrim            |
| Close surface | `--sn-mp-color-background-elevated` | Close button fill            |
| Close glyph   | `--sn-mp-color-text-secondary`      | Close button icon            |
| Close border  | `--sn-mp-color-border-default`      | Close button outline         |
| Radius        | `--sn-mp-radius-md/full`            | Image + close button corners |

## Accessibility

- Root carries `role="dialog"` + `aria-modal="true"`
- Scrim is `aria-hidden="true"`; the image carries no role
- Close button carries `role="button"` + `aria-label="close"`
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Documented Divergences

- The deprecated `value` prop is not declared — `v-model` is the single source of truth.
- `root-portal` is declared but not implemented.
- `show-menu-by-longpress` maps to `<image>`'s own attribute (WeChat honours it only).
- `to` navigates through `globalThis.uni.navigateTo` behind an existence guard; a
  rejected or throwing navigation is swallowed and `click` still fires, so the
  host can drive routing itself (AGENTS.md §20 / §60).

## Disposal

One transition timer drives the leave leg; it is cleared in `onBeforeUnmount`
(AGENTS.md §41). No global listener; the `to` navigation promise rejection is
handled so it cannot become an unhandled rejection.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 overlay / interaction batch.
