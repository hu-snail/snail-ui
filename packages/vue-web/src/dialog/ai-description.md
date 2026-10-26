# SnDialog — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end dialog panel.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A modal **panel**: a titled card with an optional type icon, a body and a
row of dialog buttons. Renders a confirmation / alert / info card that is
meant to be placed inside an overlay.

## Scope — panel, not overlay

SnDialog is the **card only**. Upstream naive-ui splits the same feature in
two: `n-dialog` (this card) and `useDialog()` → `DialogProvider` (the modal
mask + `VLazyTeleport` + focus trap that hosts the card).

This version implements the **card**, so it can be dropped inside any
overlay. The provider is a separate WBS item. Consequences of that
boundary:

- Root is `aria-modal="false"` — claiming modality here would be false,
  because SnDialog does not own the mask or the focus trap.
- No `width`, no `max-height`, no scroll container: upstream puts those on
  the provider/overlay wrapper.
- No `show` / `onUpdate:show` prop: visibility belongs to the host overlay,
  matching upstream where `show` lives on the dialog *reference*.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-dialog` (https://www.naiveui.com/zh-CN/light/components/dialog).

## Import

```ts
import { SnDialog } from '@snui/vue-web'
import type { SnDialogType, SnDialogIconPlacement } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `'info' \| 'success' \| 'warning' \| 'error' \| 'default'` | `'default'` | Semantic type — drives the default icon and its colour. |
| `icon` | `IconComponent` | `undefined` | Custom icon component, replacing the per-`type` default. |
| `title` | `string` | `undefined` | Panel title. |
| `content` | `string` | `undefined` | Body text. |
| `closable` | `boolean` | `true` | Render the close button. |
| `negativeText` | `string` | `undefined` | Cancel button label. Omit to hide the button. |
| `positiveText` | `string` | `undefined` | Confirm button label. Omit to hide the button. |
| `positiveButtonProps` | `Record<string, unknown>` | `undefined` | Extra props forwarded to the confirm button. |
| `negativeButtonProps` | `Record<string, unknown>` | `undefined` | Extra props forwarded to the cancel button. |
| `showIcon` | `boolean` | `true` | Render the type icon. |
| `loading` | `boolean` | `false` | Confirm button enters its loading state. |
| `bordered` | `boolean` | `false` | Draw a border around the panel. |
| `iconPlacement` | `'left' \| 'top'` | `'left'` | Icon inline before the title, or centred above it. |
| `titleClass` | `string \| Array<string \| undefined>` | `undefined` | Extra class on the title row. |
| `titleStyle` | `string \| CSSProperties` | `undefined` | Extra style on the title row. |
| `contentClass` | `string \| Array<string \| undefined>` | `undefined` | Extra class on the body. |
| `contentStyle` | `string \| CSSProperties` | `undefined` | Extra style on the body. |
| `actionClass` | `string \| Array<string \| undefined>` | `undefined` | Extra class on the action row. |
| `actionStyle` | `string \| CSSProperties` | `undefined` | Extra style on the action row. |
| `closeFocusable` | `boolean` | `false` | Make the close button keyboard-focusable (`tabindex="0"` instead of `-1`). |

## Events

| Event | Payload | When |
|---|---|---|
| `positive-click` | `MouseEvent` | Confirm button clicked. |
| `negative-click` | `MouseEvent` | Cancel button clicked. |
| `close` | `()` | Close button clicked. |

## Slots

| Name | Description |
|---|---|
| `default` | Body content — replaces `content`. |
| `header` | Title row — replaces `title`. |
| `icon` | Type icon — replaces the built-in per-type glyph. **Still gated by `showIcon`.** |
| `action` | Action row — replaces the built-in buttons entirely. |
| `close` | Close button — replaces the built-in close glyph. |

## Behaviour notes

- **Action-row presence.** The row only renders when there is something to
  put in it: the `action` slot, or `positiveText`, or `negativeText`. When
  it is skipped, the body gains `sn-dialog__content--last` and loses its
  bottom margin.
- **Button order.** Negative (cancel) first, positive (confirm) second.
- **Positive button type.** Inherits the dialog `type`; `'default'` falls
  back to `'primary'`. The negative button is never tinted by `type`
  (upstream passes it no `type`), so it stays ghost.
- **`loading` scopes to the positive button** — it both loads *and*
  disables confirm, and leaves cancel alone.
- **Icon colour follows `type`** via upstream's `createKey('iconColor', type)`:
  `info`/`success`/`warning`/`error` map to their per-type token, while
  `'default'` maps to the **base** `icon-color` token (primary) — not to
  the info token.
- **`iconPlacement`** defaults to `'left'`. `'top'` hoists the icon into
  its own centred row and switches the icon/close margins to their
  `*IconTop` variants; title, content and action all centre.

## §112 future markers

- The `DialogProvider` / `useDialog()` layer (modal mask, `VLazyTeleport`,
  focus trap, scroll lock, `width`, `transform-origin`) is **not**
  implemented here — it is a separate WBS item. This component is the card
  that provider hosts.
- Upstream `rtl` handling is not modelled (SnConfigProvider does not expose
  Dialog-level `iconPlacement` defaults yet).
- Transitions use a plain CSS `0.3s ease` rather than upstream's
  `cubicBezierEaseInOut` token: the tokens package has no motion/easing
  alias to consume.
- `closeFocusable` maps to `tabindex` on a native `<button>`; upstream
  swaps between a focusable and a non-focusable internal close component.

## Tokens Consumed (end: web)

| Token | Purpose |
|---|---|
| `--sn-web-dialog-color` | Panel background. |
| `--sn-web-dialog-text-color` | Body text. |
| `--sn-web-dialog-title-text-color` | Title text. |
| `--sn-web-dialog-border` | `bordered` outline. |
| `--sn-web-dialog-radius` | Corner radius. |
| `--sn-web-dialog-padding` | Panel padding. |
| `--sn-web-dialog-title-font-size` | Title size. |
| `--sn-web-dialog-title-font-weight` | Title weight. |
| `--sn-web-dialog-font-size` | Body size. |
| `--sn-web-dialog-line-height` | Panel line height. |
| `--sn-web-dialog-icon-size` | Icon size. |
| `--sn-web-dialog-icon-margin` | Icon margin (`iconPlacement="left"`). |
| `--sn-web-dialog-icon-margin-icon-top` | Icon margin (`iconPlacement="top"`). |
| `--sn-web-dialog-icon-color` | Icon colour for `type="default"`. |
| `--sn-web-dialog-icon-color-info` | Icon colour for `type="info"`. |
| `--sn-web-dialog-icon-color-success` | Icon colour for `type="success"`. |
| `--sn-web-dialog-icon-color-warning` | Icon colour for `type="warning"`. |
| `--sn-web-dialog-icon-color-error` | Icon colour for `type="error"`. |
| `--sn-web-dialog-content-margin` | Body margin. |
| `--sn-web-dialog-action-space` | Gap between action buttons. |
| `--sn-web-dialog-close-size` | Close button box size. |
| `--sn-web-dialog-close-icon-size` | Close glyph size. |
| `--sn-web-dialog-close-margin` | Close offset (`iconPlacement="left"`). |
| `--sn-web-dialog-close-margin-icon-top` | Close offset (`iconPlacement="top"`). |
| `--sn-web-dialog-close-color` | Close background. |
| `--sn-web-dialog-close-color-hover` | Close background on hover. |
| `--sn-web-dialog-close-icon-color` | Close glyph colour. |
| `--sn-web-dialog-close-icon-color-hover` | Close glyph colour on hover. |
| `--sn-web-focus-ring` | Close button `:focus-visible` ring. |

The whole token surface lives in the stylesheet, so the component emits **no
inline theme style** — theming is done by overriding tokens. The one inline
style is the icon colour, which necessarily follows `type` at runtime.

## Accessibility

- Root `role="dialog"` with an explicit `aria-modal="false"` (see *Scope*).
- Close button is a real `<button type="button">` with `aria-label="关闭"`
  and a `:focus-visible` ring; `tabindex` follows `closeFocusable`.
- Icons are decorative — the meaning is carried by the title and body text.
- Not implemented here (belongs to the provider item): focus trap, initial
  focus, `Escape` to close, focus restore on dismiss, `aria-labelledby`
  wiring to the title element, background `aria-hidden`.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-FB-001 (M1 feedback
Web components).
