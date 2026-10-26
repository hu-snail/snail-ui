# sn-popup — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-popup component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Positioned popup layer for mobile / miniprogram: a scrim plus a panel anchored
to `center` / `top` / `right` / `bottom` / `left`, with an enter / leave
animation and a close-on-scrim-tap contract. The mobile counterpart of the web
dialog / drawer family.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-popup`
(https://wot-ui.cn/component/popup.html). New props added here MUST also be
added to the wd-popup parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-popup v-model="visible" position="bottom" round>内容</sn-popup>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnPopup } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `boolean` | `false` | no | Visibility (`v-model`). |
| `transition` | `'fade' \| 'fade-up' \| 'fade-down' \| 'fade-left' \| 'fade-right' \| 'slide-up' \| 'slide-down' \| 'slide-left' \| 'slide-right' \| 'zoom-in' \| 'zoom-out'` | `''` | no | Animation name; empty derives one from `position`. |
| `closable` | `boolean` | `false` | no | Show the close button in the panel's top-right corner. |
| `position` | `'center' \| 'top' \| 'right' \| 'bottom' \| 'left'` | `'center'` | no | Panel anchor. |
| `closeOnClickModal` | `boolean` | `true` | no | Scrim tap closes the popup (`click-modal` fires regardless). |
| `duration` | `number \| boolean \| Record<string, number>` | `300` | no | Animation duration; `false` disables, a record sets enter / leave separately. |
| `modal` | `boolean` | `true` | no | Render the scrim. |
| `zIndex` | `number` | `10` | no | Stacking level of the root node. |
| `hideWhenClose` | `boolean` | `true` | no | Remove the node once the leave animation finished. |
| `modalStyle` | `string` | `''` | no | Inline style for the scrim. |
| `safeAreaInsetBottom` | `boolean` | `false` | no | Pad the bottom sheet for the device safe area. |
| `lazyRender` | `boolean` | `true` | no | Defer panel content rendering until the first open. |
| `lockScroll` | `boolean` | `true` | no | Intercept `touchmove` on the scrim so the page behind cannot scroll. |
| `round` | `boolean` | `false` | no | Rounded corners, adapted to `position`. |
| `customClass` | `string` | `''` | no | Custom class for the root node. |
| `customStyle` | `string` | `''` | no | Custom inline style for the panel. |

**Not implemented (documented divergence):** `root-portal` — uni-app
miniprogram has no portal host, so a popup inside a transformed ancestor
cannot be reparented to the page root.

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Fired when the component closes itself (close button / scrim tap). |
| `close` | — | Popup closed by the user. |
| `click-modal` | — | Scrim tapped (fires even when `closeOnClickModal` is `false`). |
| `before-enter` | — | Enter animation about to start. |
| `enter` | — | Enter animation started. |
| `after-enter` | — | Enter animation finished. |
| `before-leave` | — | Leave animation about to start. |
| `leave` | — | Leave animation started. |
| `after-leave` | — | Leave animation finished (node removed when `hideWhenClose`). |

## Slots

| Name | Description |
|---|---|
| `default` | Panel content. Rendered lazily when `lazyRender` is on. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Scrim | `--sn-mp-color-background-overlay` | Scrim background (dark-mode aware) |
| Elevated surface | `--sn-mp-color-background-elevated` | Panel background |
| Text primary | `--sn-mp-color-text-primary` | Panel text |
| Text secondary | `--sn-mp-color-text-secondary` | Close button glyph |
| Radius XL | `--sn-mp-radius-xl` | Round corners |
| Line height normal | `--sn-mp-font-line-height-normal` | Panel line height |

## Accessibility

- Panel carries `role="dialog"` + `aria-modal="true"`
- Scrim is `aria-hidden="true"` (decorative; the tap target is described by the dialog)
- Close button carries `role="button"` + `aria-label="close"`
- Mobile tap (`@tap`), no keyboard focus trap — miniprogram has no tab order

## Disposal

The only disposable resource is the animation timer; it is cleared in
`onBeforeUnmount` (AGENTS.md §41). Scroll lock uses an inline `touchmove`
interceptor, not a global listener, so nothing else can leak.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M1 feedback-category uni
components (popup / overlay / loading / progress / empty).
