# SnAffix — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end affix component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Pin an element to the viewport (or a custom scroll container) while the page
scrolls, then release it when the scroll position returns past the point at
which it stuck. Typical uses: sticky table headers, sticky sidebars, sticky
action bars, "save" toolbars on long forms.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-affix` (https://www.naiveui.com/zh-CN/light/components/affix).

## Import

```ts
import { SnAffix } from '@snui/vue-web';
```

## Props

| Name            | Type                                                                 | Default     | Description                                                           |
| --------------- | -------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `listenTo`      | `string \| Window \| Document \| HTMLElement \| (() => HTMLElement)` | `document`  | Scroll container to observe.                                          |
| `top`           | `number`                                                             | `undefined` | Offset from the viewport top while stuck.                             |
| `bottom`        | `number`                                                             | `undefined` | Offset from the viewport bottom while stuck.                          |
| `triggerTop`    | `number`                                                             | `undefined` | Scroll threshold that starts top-sticking. Falls back to `top`.       |
| `triggerBottom` | `number`                                                             | `undefined` | Scroll threshold that starts bottom-sticking. Falls back to `bottom`. |
| `position`      | `'fixed' \| 'absolute'`                                              | `'fixed'`   | `fixed` removes the element from flow; `absolute` keeps it in flow.   |
| `offsetTop`     | `number`                                                             | `undefined` | **@deprecated** — use `triggerTop`.                                   |
| `offsetBottom`  | `number`                                                             | `undefined` | **@deprecated** — use `triggerBottom`.                                |
| `target`        | `() => HTMLElement`                                                  | `undefined` | **@deprecated** — use `listenTo`.                                     |

`triggerTop` vs `top`: the former is _when_ sticking begins, the latter is
_where_ the element sits while stuck. Providing only one makes the other
fall back to it, which is the common case (stick at the same offset you
trigger at).

## Slots

| Name      | Description           |
| --------- | --------------------- |
| `default` | The element to affix. |

## Exposed

| Name      | Type                   | Description                             |
| --------- | ---------------------- | --------------------------------------- |
| `affixed` | `ComputedRef<boolean>` | Whether the element is currently stuck. |

## Behaviour

- Scroll events are coalesced into one measurement per animation frame, so
  a fast scroll does not trigger a measurement per event.
- Release is hysteretic: once affixed, the element stays affixed until the
  scroll position crosses back over the _recorded trigger scroll position_
  (captured when sticking began), not merely until the rect leaves the
  threshold. This prevents jitter at the boundary.
- Both a top and a bottom condition may be active at once; the element is
  considered affixed if either is.

## §112 future markers

- The stuck element's `z-index` is a fixed `10`. naive-ui exposes this
  through `NTooltip`-style theme tokens (`boxShadow`, `color`, `width`…)
  that SnConfigProvider does not model yet.
- `n-affix` reads `position` per instance only; no global default from
  `n-config-provider` is modelled.

## Tokens Consumed (end: web)

This component is purely positional; it consumes no colour or size tokens.
Its CSS uses only literals that are layout values (`position`, `z-index`),
which is permitted because they are not design tokens.

## Accessibility

- The wrapper is layout-only and adds no semantics; it renders no role and
  no `aria-*` attributes, so the slot content's own semantics are preserved.
- Wrapping an interactive element (e.g. a button) keeps it focusable and
  operable while stuck — the element is repositioned, not re-created.
- Because the element stays in the DOM while affixed, focus is never lost
  during scroll.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-NAV-006 (M1 navigation
Web components).
