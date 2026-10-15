# SnBackTop — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end back-top component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A floating button that appears once the user has scrolled past a threshold and
smooth-scrolls the container back to the top when clicked. Typical use: long
article or catalogue pages.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-back-top` (https://www.naiveui.com/zh-CN/light/components/back-top).

## Import

```ts
import { SnBackTop } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `show` | `boolean` | `undefined` | Controlled visibility (`v-model:show`). When omitted the component drives visibility from the scroll position. |
| `right` | `string \| number` | `40` | Distance from the viewport right edge. |
| `bottom` | `string \| number` | `40` | Distance from the viewport bottom edge. |
| `to` | `HTMLElement \| string` | `'body'` | Element to render the button into. Accepted for API parity. |
| `visibilityHeight` | `number` | `180` | Scroll distance after which the button appears. |
| `listenTo` | `string \| HTMLElement \| Document \| (() => HTMLElement \| Document)` | `undefined` | Scroll container; auto-detected from the nearest scrollable ancestor when omitted. |
| `target` | `() => HTMLElement` | `undefined` | **@deprecated** — use `listenTo`. |
| `onUpdateShow` | `(value: boolean) => void` | `undefined` | Fired on visibility change (`update:show`). |
| `onShow` | `() => void` | `undefined` | **@deprecated** — use `onUpdate:show`. |
| `onHide` | `() => void` | `undefined` | **@deprecated** — use `onUpdate:show`. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:show` | `boolean` | Visibility changed while uncontrolled. |

## Slots

| Name | Description |
|---|---|
| `default` | Custom button content — replaces the built-in arrow icon. |

## Exposed

| Name | Type | Description |
|---|---|---|
| `scrollToTop` | `() => void` | Programmatically scroll the container back to the top. |

## Behaviour

- The button appears once the scroll offset reaches `visibilityHeight`
  (inclusive) and hides again when the offset drops back below it.
- Visibility is uncontrolled by default; passing `show` makes it controlled
  and stops the scroll position from driving it.
- `update:show` does not fire for the initial measurement — only for changes
  that happen after the first geometry pass.
- Clicking scrolls the container to `top: 0` with `behavior: 'smooth'`.
- The scroll listener is always removed on unmount (AGENTS.md §41 / §82).

## Notes on divergence

- Uses the `ChevronsUp` lucide icon rather than naive-ui's inlined
  `BackTopIcon` SVG, matching this library's icon policy (the same choice
  SnAlert makes for its type icons).
- Rendered inline; naive-ui teleports to `to` through `VLazyTeleport` in
  production builds. The `to` prop is accepted for API parity.
- The container is recognised as a document via `nodeName === '#document'`
  rather than `instanceof Document`, so the component behaves correctly when
  mounted in a different realm (iframe, test DOM).

## §112 future markers

- The button geometry (`width` / `height` 44px, `border-radius` 22px) and its
  `box-shadow` are hard-coded rather than driven by theme tokens; naive-ui
  exposes them through `BackTopTheme` (`self.width`, `self.height`,
  `self.borderRadius`, `self.boxShadow`…), which SnConfigProvider does not
  model yet.
- naive-ui compensates for a locked `<html>` scrollbar width through
  `lockHtmlScrollRightCompensationRef` (used in its `right` calc). This
  component does not model scrollbar-lock compensation yet.
- The `fade-in-scale-up-transition` and the
  `--transition-disabled` first-paint guard are not reproduced; a plain fade
  is used instead.

## Tokens Consumed (end: web)

| Token | Use |
|---|---|
| `--sn-web-color-background-surface` | Button background. |
| `--sn-web-color-text-secondary` | Default icon colour. |
| `--sn-web-color-action-primary-hover` | Icon colour on hover. |
| `--sn-web-color-action-primary` | Icon colour on press. |
| `--sn-web-focus-ring` | Keyboard focus outline. |

## Accessibility

- Renders a real `<button type="button">` with `aria-label="回到顶部"`, so it
  is reachable by keyboard and announced by screen readers.
- `:focus-visible` draws a visible focus ring.
- The invisible placeholder used for scroll-container detection is
  `display: none` + `aria-hidden="true"`, so it is never exposed.
- The icon-only content is decorative; the accessible name comes from
  `aria-label`, so a custom `default` slot does not need its own label.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-NAV-008 (M1 navigation
Web components).
