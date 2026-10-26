# SnAnchor / SnAnchorLink — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end anchor components.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

In-page navigation that highlights the link for the section currently in view
and scrolls to a section when its link is clicked. Typical use: documentation
sidebars, long-form article outlines, settings pages with grouped sections.

## Reference Library

Per AGENTS.md §112, these components' API surface mirrors naive-ui `n-anchor`
and `n-anchor-link`
(https://www.naiveui.com/zh-CN/light/components/anchor).

## Import

```ts
import { SnAnchor, SnAnchorLink } from '@snui/vue-web'
```

## SnAnchor Props

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `'block' \| 'rail'` | `'rail'` | `rail` renders the vertical rail with a sliding bar; `block` is a plain list. |
| `showRail` | `boolean` | `true` | Show the rail. Ignored when `type` is `block`. |
| `showBackground` | `boolean` | `true` | Draw the highlight behind the active link. |
| `bound` | `number` | `12` | Distance from the scroll-target top at which a section becomes active. |
| `internalScrollable` | `boolean` | `false` | Accepted for API parity; content renders in normal flow (see future markers). |
| `ignoreGap` | `boolean` | `false` | Keep the previous link active while a section is scrolled out of view. |
| `offsetTarget` | `string \| Window \| Document \| HTMLElement \| (() => HTMLElement)` | `document` | Element used to measure section offsets. |
| `affix` | `boolean` | `false` | Wrap the anchor in `SnAffix` so it stays in view. |
| `listenTo` | `string \| HTMLElement \| Document \| (() => HTMLElement \| Document)` | `undefined` | Forwarded to `SnAffix` when `affix` is true. |
| `top` / `bottom` | `number` | `undefined` | Forwarded to `SnAffix` when `affix` is true. |
| `triggerTop` / `triggerBottom` | `number` | `undefined` | Forwarded to `SnAffix` when `affix` is true. |
| `offsetTop` / `offsetBottom` | `number` | `undefined` | **@deprecated** — forwarded to `SnAffix`. |

## SnAnchorLink Props

| Name | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Link label. |
| `href` | `string` | `undefined` | Target section id, e.g. `#intro`. |

## SnAnchor Slots

| Name | Description |
|---|---|
| `default` | `SnAnchorLink` children. |

## SnAnchorLink Slots

| Name | Description |
|---|---|
| `title` | Link label — overrides the `title` prop. |
| `default` | Nested `SnAnchorLink` children (sub-sections). |

## Exposed

| Component | Name | Type | Description |
|---|---|---|---|
| `SnAnchor` | `scrollTo` | `(href: string) => void` | Scroll to and activate the link matching `href`. |

## Behaviour

- The active link is the last link whose section top has reached `bound`,
  measured against `offsetTarget`.
- `ignoreGap` extends activation to a section scrolled entirely past the top;
  without it, the previous link stays active instead.
- The scroll listener is registered on `document` in the **capture** phase so
  it also observes scrolls originating in nested containers.
- Scroll handling is trailing-edge throttled at 128ms.
- Clicking a link scrolls its section into view, activates it, and suppresses
  the scroll handler for one tick so the jump does not flicker the rail.
- On mount the anchor also runs a measurement against `window.location.hash`
  when the page opens on a deep link.
- A measurement re-runs once `document.fonts.ready` resolves, since web fonts
  can reflow sections after first paint.
- Both the listener and any pending throttle timer are released on unmount
  (AGENTS.md §41 / §82).

## §112 future markers

- `internalScrollable` does not wrap the content in an `NScrollbar`: this
  library has no scrollbar component yet, so the prop is accepted for API
  parity and content renders in normal flow.
- `n-anchor` runs its post-font measurement through vooks' `onFontsReady`.
  This component uses `document.fonts.ready` when available, with a no-op
  fallback, so older engines may skip the re-measure.
- Rail colour, rail width, link font size, link padding and link border radius
  are hard-coded rather than driven by `AnchorTheme`
  (`railColor`, `linkColor`, `linkFontSize`, `linkPadding`…), which
  SnConfigProvider does not model yet.
- The rail bar and highlight use `transition: 0.2s ease` rather than
  `cubicBezierEaseInOut` from the theme.

## Tokens Consumed (end: web)

| Token | Use |
|---|---|
| `--sn-web-color-border-default` | Rail track. |
| `--sn-web-color-action-primary` | Active rail bar, active/hovered link text. |
| `--sn-web-color-action-primary-hover` | Link text on hover. |
| `--sn-web-color-text-secondary` | Inactive link text. |
| `--sn-web-color-background-surface-hover` | Active-link highlight. |
| `--sn-web-focus-ring` | Keyboard focus outline. |

## Accessibility

- Each link renders a real `<a href="#section">`, so it is keyboard-operable
  and is announced as a link with the section as its target.
- `title` is mirrored onto the anchor's `title` attribute for a hover tooltip.
- Active state is exposed only visually (colour + weight); the section anchor
  itself remains the source of truth for assistive technology.
- `:focus-visible` draws a visible focus ring.
- The rail and highlight are decorative, non-interactive elements.
- No `aria-current` is set on the active link yet — noted as a follow-up.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-NAV-007 (M1 navigation
Web components).
