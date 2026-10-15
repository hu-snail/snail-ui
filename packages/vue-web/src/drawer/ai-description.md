# SnDrawer / SnDrawerContent — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end drawer pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A **slide-in overlay**: a mask plus a panel that slides in from one of the
four edges (`left` / `right` / `top` / `bottom`). It hosts arbitrary content
and is usually used for forms, settings and detail views.

`SnDrawer` is the **overlay shell** (teleport + mask + placement + scroll
lock). The panel's header/body/footer live in the companion
[`SnDrawerContent`](./ai-description.md) — upstream naive-ui splits the same
feature across `n-drawer` and `n-drawer-content`, and this pair mirrors that
division exactly.

## Scope — drawer vs. content

- `SnDrawer` owns: teleport, the mask, the four-direction positioning and
  slide transition, `<html>` scroll lock, Escape handling, `z-index`, and
  the slot that receives the panel.
- `SnDrawerContent` owns: the header (title + close button), body and
  footer rows.

Giving `SnDrawer` no slot renders a bare `SnDrawerContent` built from the
`title` / `closable` convenience props, so the one-line case stays short.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-drawer` (https://www.naiveui.com/zh-CN/light/components/drawer).

## Import

```ts
import { SnDrawer, SnDrawerContent } from '@snui/vue-web'
```

## SnDrawer Props

| Name | Type | Default | Description |
|---|---|---|---|
| `show` | `boolean` | `false` | Whether the drawer is open. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | Edge the panel slides in from. |
| `width` | `number \| string` | `undefined` | Panel width. **Only applies to `left` / `right`.** |
| `height` | `number \| string` | `undefined` | Panel height. **Only applies to `top` / `bottom`.** |
| `maskClosable` | `boolean` | `true` | Clicking the mask requests a close. |
| `showMask` | `boolean \| 'transparent'` | `true` | Mask visibility. `'transparent'` keeps the mask mounted (still swallowing clicks) without painting it. |
| `to` | `string \| HTMLElement` | `undefined` | Teleport target. `undefined` disables teleport (renders in place). |
| `displayDirective` | `'if' \| 'show'` | `'if'` | `'if'` unmounts the panel when closed; `'show'` keeps it mounted and toggles `display`. |
| `nativeScrollbar` | `boolean` | `true` | `false` adds the `--native-scrollbar` class hook for a custom scrollbar. See §112 markers. |
| `zIndex` | `number` | `undefined` | Stacking order of the overlay. |
| `blockScroll` | `boolean` | `true` | Lock `<html>` scroll while open. |
| `closeOnEsc` | `boolean` | `true` | Escape requests a close. |
| `contentClass` | `string` | `undefined` | Extra class on the content wrapper. |
| `contentStyle` | `string \| CSSProperties` | `undefined` | Extra style on the content wrapper. |
| `title` | `string` | `undefined` | Title, passed to the default `<SnDrawerContent>`. |
| `closable` | `boolean` | `undefined` | Show the header close button on the default content. |

## SnDrawer Callback Props

| Name | Type | Description |
|---|---|---|
| `onMaskClick` | `(e: MouseEvent) => void` | Mask clicked. Fires before any close, and regardless of `maskClosable`. |
| `onEsc` | `() => void` | Escape pressed. Fires before any close, and regardless of `closeOnEsc`. |
| `onAfterEnter` | `() => void` | Enter transition finished. |
| `onAfterLeave` | `() => void` | Leave transition finished. |

These four mirror their events 1:1 — Vue routes `mask-click` onto
`onMaskClick` (and `esc` onto `onEsc`), so the emitter must not also invoke
the prop by hand, or the caller's handler runs twice.

## SnDrawer Events

| Event | Payload | When |
|---|---|---|
| `update:show` | `boolean` | The drawer asks to open/close. |
| `after-enter` | `()` | Enter transition finished. |
| `after-leave` | `()` | Leave transition finished. |
| `mask-click` | `MouseEvent` | Mask clicked. |
| `esc` | `()` | Escape pressed. |

## SnDrawer Slots

| Name | Description |
|---|---|
| `default` | The panel body — normally a `<SnDrawerContent>`. Falls back to a bare `SnDrawerContent` built from `title` / `closable`. |

## Behaviour notes

- **`width` / `height` are placement-scoped.** Upstream computes them from
  `placement`: `left`/`right` read `width`, `top`/`bottom` read `height`,
  and the other dimension is left to the stylesheet. A number becomes
  `px`; a string is used verbatim. With neither set, the component emits an
  **empty string** rather than an inline value, so a stylesheet default is
  not clobbered by an empty declaration.
- **Mask has three states.** `true` paints and swallows clicks;
  `'transparent'` stays mounted and still swallows clicks but paints
  nothing; `false` does not render at all. `mask-click` fires in the first
  two regardless of `maskClosable` — `maskClosable` only decides whether a
  close is *requested*.
- **Escape respects IME.** `closeOnEsc` gates the close, but an Escape
  pressed while `event.isComposing` is true (cancelling Chinese/Japanese
  composition) never closes — the same guard as upstream's
  `useIsComposing`.
- **Scroll lock restores, not resets.** The pre-existing inline
  `overflow` on `<html>` is memoized on lock and restored on release, so a
  host that had its own value is not clobbered. `onBeforeUnmount` restores
  as a backstop if the drawer is torn down while open.
- **Children can close the drawer.** `SnDrawer` provides itself under
  `SN_DRAWER_INJECTION_KEY`; a descendant `SnDrawerContent` injects it and
  its close button asks the drawer to hide — the equivalent of upstream's
  `drawerInjectionKey`.
- **`displayDirective`.** `'if'` (default) unmounts the panel when closed.
  `'show'` keeps it mounted for the lifetime of the transition and toggles
  `display`, which is what a parent needs when it wants to animate out.

## SnDrawerContent

The panel's three rows: header (title + close), body and optional footer.

## SnDrawerContent Props

| Name | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `undefined` | Header title. |
| `closable` | `boolean` | `true` | Render the header close button. |
| `nativeScrollbar` | `boolean` | `true` | Adds the `--native-scrollbar` class hook to the body. |
| `headerClass` / `headerStyle` | `string` / `string \| CSSProperties` | `undefined` | Extra class / style on the header. |
| `bodyClass` / `bodyStyle` | `string` / `string \| CSSProperties` | `undefined` | Extra class / style on the body. |
| `bodyContentClass` / `bodyContentStyle` | `string` / `string \| CSSProperties` | `undefined` | Extra class / style on the inner body content element. |
| `footerClass` / `footerStyle` | `string` / `string \| CSSProperties` | `undefined` | Extra class / style on the footer. |

## SnDrawerContent Events

| Event | Payload | When |
|---|---|---|
| `close` | `()` | The close button was clicked. |

## SnDrawerContent Slots

| Name | Description |
|---|---|
| `default` | Body content. |
| `header` | Header row — replaces `title`. |
| `footer` | Footer row. Omitted ⇒ no footer element at all. |
| `close` | Close button — replaces the built-in glyph. |

## SnDrawerContent Behaviour notes

- **Header presence.** The header renders when there is a `header` slot, a
  `title`, or `closable` is on — otherwise it is omitted and the body
  becomes the first row.
- **Footer presence.** The footer only renders when the `footer` slot
  exists; there is no fallback content for it.
- **Closing.** The close button emits `close` **and**, when a parent
  `SnDrawer` was injected, asks that drawer to hide. Inside a drawer,
  binding `@close` is therefore optional.
- The title element is `role="heading"` with `aria-level="1"`.

## §112 future markers

- **Focus trap.** Upstream wraps the panel in `vueuc`'s `VFocusTrap`; this
  version does not trap focus yet (same gap as `SnDialog`).
- **`nativeScrollbar` is API-alignment only.** Upstream switches to
  `NScrollbar`'s virtual scrollbar when `false`; both branches render the
  native scroll container here, keeping the `--native-scrollbar` class as
  the customisation hook. A real virtual scrollbar is not implemented.
- **`resizable` / `maxWidth` / `maxHeight` / `minWidth` / `minHeight` /
  `scrollbarProps`** are upstream props that are **not** accepted yet.
  Adding them (notably `resizable`, which upstream drives with a pointer
  drag and three resize triggers) is a follow-up.
- Transitions use hard-coded `0.2s` / `0.3s` durations rather than
  upstream's easing tokens: the tokens package exposes no motion/duration
  alias to consume.
- The drag-resize affordance (3px edge triggers) and the per-placement
  corner rounding rules from upstream's `drawer-cssr` are applied to
  corners only, not to the resize handles.

## Tokens Consumed (end: web)

| Token | Purpose |
|---|---|
| `--sn-web-drawer-color` | Panel background. |
| `--sn-web-drawer-text-color` | Panel text. |
| `--sn-web-drawer-title-text-color` | Header title text. |
| `--sn-web-drawer-box-shadow` | Panel elevation. |
| `--sn-web-drawer-line-height` | Panel line height. |
| `--sn-web-drawer-radius` | Corner radius (applied to the sliding edge). |
| `--sn-web-drawer-mask-color` | Mask fill. |
| `--sn-web-drawer-header-padding` | Header padding. |
| `--sn-web-drawer-body-padding` | Body padding. |
| `--sn-web-drawer-footer-padding` | Footer padding. |
| `--sn-web-drawer-title-font-size` | Title size. |
| `--sn-web-drawer-title-font-weight` | Title weight. |
| `--sn-web-drawer-header-border-bottom` | Header divider. |
| `--sn-web-drawer-footer-border-top` | Footer divider. |
| `--sn-web-drawer-close-size` | Close button box size. |
| `--sn-web-drawer-close-icon-size` | Close glyph size. |
| `--sn-web-drawer-close-icon-color` | Close glyph colour. |
| `--sn-web-drawer-close-icon-color-hover` | Close glyph colour on hover. |
| `--sn-web-drawer-close-color` | Close button background. |
| `--sn-web-drawer-close-color-hover` | Close button background on hover. |
| `--sn-web-focus-ring` | Close button `:focus-visible` ring. |

The whole token surface lives in the stylesheets of both components, so
neither emits **any** inline theme style — theming is done by overriding
tokens. The only inline styles are the placement-scoped `width` / `height`
and the caller's own `contentStyle` / `headerStyle` / … pass-throughs.

## Accessibility

- Panel root is `role="dialog"` with `aria-modal="true"`; the mask is
  `aria-hidden="true"`.
- The close button is a real `<button type="button">` with
  `aria-label="关闭"` and a `:focus-visible` ring.
- The header title is exposed as a level-1 heading.
- Not implemented yet: focus trap, initial focus, focus restore on
  dismiss, and `aria-labelledby` wiring from the panel to its title
  element (see §112 markers).

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-FB-003 (M1 feedback
Web components).
