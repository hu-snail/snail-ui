# SnEllipsis — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end ellipsis component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Clamps text to one or N lines and optionally reveals the full content in
a tooltip when it overflows. Can expand in place on click.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-ellipsis` (https://www.naiveui.com/zh-CN/light/components/ellipsis).

## Import

```ts
import SnEllipsis from '@snui/vue-web/src/ellipsis/SnEllipsis.vue';
```

## Props

| Name             | Type                                  | Default     | Required | Description                                                                               |
| ---------------- | ------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------- |
| `expandTrigger`  | `'click' \| 'none'`                   | `'none'`    | no       | Clicking the text toggles the expanded state.                                             |
| `lineClamp`      | `number`                              | `1`         | no       | Row count before clamping; `1` = single line.                                             |
| `tooltip`        | `boolean \| SnEllipsisTooltipOptions` | `true`      | no       | Show a tooltip with the full text when overflowing. Object form forwards SnTooltip props. |
| `width`          | `number \| 'screen'`                  | `undefined` | no       | Box width; number = px, `'screen'` = 100vw.                                               |
| `fade`           | `boolean`                             | `false`     | no       | Smoke mask over the clamped edge (bottom for multi-line, right for single line).          |
| `expandPosition` | `'suffix' \| 'bottom' \| 'none'`      | `'none'`    | no       | Dedicated expand / collapse toggle: after the text, its own row, or none.                 |
| `expandText`     | `string`                              | locale 展开 | no       | Toggle label while collapsed.                                                             |
| `collapseText`   | `string`                              | locale 收起 | no       | Toggle label while expanded.                                                              |

`SnEllipsisTooltipOptions` (documented subset of SnTooltip props):
`content`, `placement`, `trigger`, `delay`, `duration`, `arrow`,
`zIndex`, `raw`, `animated`, `keepAliveOnHover`, `overlap`, `width`,
`to`, `displayDirective`, `contentClass`, `contentStyle`.

## Events

None.

## Slots

| Name      | Description                     |
| --------- | ------------------------------- |
| `default` | Text content that gets clamped. |

## Divergences from the reference API

- The tooltip object form accepts a documented subset of SnTooltip
  props; `disabled` is owned by the overflow detection and cannot be
  overridden through it.
- Overflow is re-measured on mount, on window resize, via a
  ResizeObserver on the text box (where available), and on prop /
  expand changes. Slot content swaps that do not change the box size
  are picked up by the next resize pass only.
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- The clamped text stays real text content — screen readers read the
  full string even when visually truncated.
- The tooltip bubble carries `role="tooltip"`.
- With `expandTrigger='click'` the text is clickable but not focusable;
  provide a keyboard-accessible alternative for essential content.

## Tokens Consumed (end: web)

None — the component is purely structural (inherits text tokens from
its surroundings; the tooltip consumes SnTooltip's own tokens).

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-025.
