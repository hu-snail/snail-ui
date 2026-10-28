# SnAlert — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end alert component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Inline feedback banner for a page or section: success confirmation,
warning, error, or informational note. Stays in the document flow (unlike
a toast, which is transient and overlaid).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-alert` (https://www.naiveui.com/zh-CN/light/components/alert).

## Import

```ts
import { SnAlert } from '@snui/vue-web';
```

## Props

| Name           | Type                                                       | Default     | Description                                                                                                              |
| -------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `title`        | `string`                                                   | `''`        | Alert heading.                                                                                                           |
| `showIcon`     | `boolean`                                                  | `true`      | Show the leading type icon.                                                                                              |
| `type`         | `'info' \| 'warning' \| 'error' \| 'success' \| 'default'` | `'default'` | Semantic type — drives the tinted background, the icon and the border colour. The copy stays on the neutral text tokens. |
| `bordered`     | `boolean`                                                  | `true`      | Draw the surrounding border overlay.                                                                                     |
| `closable`     | `boolean`                                                  | `false`     | Render the close button.                                                                                                 |
| `onClose`      | `() => unknown`                                            | `undefined` | Called on close click. Return `false` (or a Promise of `false`) to **veto** the dismissal.                               |
| `onAfterLeave` | `() => void`                                               | `undefined` | Called after the leave transition finishes.                                                                              |
| `onAfterHide`  | `() => void`                                               | `undefined` | **@deprecated** — use `onAfterLeave`.                                                                                    |

## Events

| Event        | Payload | When                                                         |
| ------------ | ------- | ------------------------------------------------------------ |
| `closeClick` | `()`    | Close button clicked (fires before the veto check resolves). |
| `leave`      | `()`    | Leave transition finished — the alert has been removed.      |

> Event names are deliberately **not** `close` / `afterLeave`: Vue maps an
> emitted `close` onto an `onClose` prop listener, which would invoke the
> §112-mandated `onClose` callback twice (once via that mapping, once via
> the explicit `props.onClose()` call). Keeping the names distinct makes
> each callback fire exactly once.

## Slots

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| `default` | Alert body content.                                |
| `icon`    | Custom icon — replaces the built-in per-type icon. |
| `header`  | Custom header — replaces the `title` prop.         |

## Close semantics

Mirrors n-alert: `onClose` may be async. The alert unmounts only when the
resolved value is not `false`, so callers can veto the dismissal (e.g.
keep the alert mounted while a save is in flight).

The node is removed after the leave transition completes, at which point
`onAfterLeave` / `onAfterHide` fire and the `leave` event is emitted.

## §112 future markers

- n-alert wraps its body in `NFadeInExpandTransition` (a **height**
  collapse animation). This version uses a plain CSS fade + translate
  transition and does not import naive-ui's internal transition component.
  The `onAfterLeave` timing contract is preserved.
- `mergedBordered` from the surrounding `n-config-provider` is not
  modelled: `bordered` is read per-instance only. (SnConfigProvider does
  not yet expose a global bordered default.)

## Tokens Consumed (end: web)

| Token             | CSS Variable                        | Purpose                           |
| ----------------- | ----------------------------------- | --------------------------------- |
| Subtle background | `--sn-web-color-background-subtle`  | `type="default"` fill             |
| Surface           | `--sn-web-color-background-surface` | Base for `color-mix()` type tints |
| Info              | `--sn-web-color-feedback-info`      | Info icon / border + tint         |
| Success           | `--sn-web-color-feedback-success`   | Success icon / border + tint      |
| Warning           | `--sn-web-color-feedback-warning`   | Warning icon / border + tint      |
| Danger            | `--sn-web-color-feedback-danger`    | Error icon / border + tint        |
| Border default    | `--sn-web-color-border-default`     | `type="default"` border           |
| Text primary      | `--sn-web-color-text-primary`       | Title and title-less body text    |
| Text secondary    | `--sn-web-color-text-secondary`     | Body text under a title           |
| Focus ring        | `--sn-web-focus-ring`               | Close button `:focus-visible`     |

Tinted backgrounds use `color-mix(in srgb, var(--token) 12%, var(--sn-web-color-background-surface))`
— the same pattern SnButton uses for softened fills (AGENTS.md §34: no
literal colors).

The active type hue is exposed internally as `--sn-alert-accent` and consumed
only by the icon column and the border overlay. The copy deliberately stays on
the neutral text tokens: painting the whole banner in the type colour dropped
the contrast between the text and its own tint, which made a coloured alert
read muddy. Overriding the tokens above is all a consumer needs to re-colour
the component.

## Accessibility

- Root `role="alert"` — announced by screen readers when the alert appears.
- Icon container is `aria-hidden="true"` (decorative; the type is conveyed
  by the text and, for screen readers, by the announcement itself).
- Close button is a real `<button type="button">` with `aria-label="关闭"`.
- Close button has a `:focus-visible` ring.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-FB-008 (M1 feedback
Web components).
