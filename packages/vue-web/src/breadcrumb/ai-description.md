# SnBreadcrumb / SnBreadcrumbItem — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end breadcrumb pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Page breadcrumb trail. Renders a `<nav aria-label="Breadcrumb">` wrapping a
list of `<SnBreadcrumbItem>` children separated by a separator glyph.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-breadcrumb` + `n-breadcrumb-item`
(https://www.naiveui.com/zh-CN/light/components/breadcrumb).

## Import

```ts
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
```

## SnBreadcrumb Props

| Name | Type | Default | Description |
|---|---|---|---|
| `separator` | `string` | `'/'` | Glyph rendered between items. |

## SnBreadcrumb Props

| Name | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | `''` | When set, item renders as `<a href>`. |
| `isLast` | `boolean` | `false` | Hint for styling (parent SnBreadcrumb handles the trailing separator). |

## Slots

| Component | Slot | Description |
|---|---|---|
| `SnBreadcrumb` | `default` | Sequence of `SnBreadcrumbItem` children. |
| `SnBreadcrumbItem` | `default` | Item content (text or inline elements). |

## §112 future markers

- `separator` could accept a Vue render function (n-breadcrumb parity).
- Per-item icon support via an `icon` prop (n-breadcrumb parity).

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text secondary | `--sn-web-color-text-secondary` | Default link color |
| Text primary | `--sn-web-color-text-primary` | Current-page color (last item) |

## Accessibility

- `<nav aria-label="Breadcrumb">` per WAI-ARIA breadcrumb pattern
- `<ol>` semantic structure
- Separator wrapped in `aria-hidden="true"`

## Versioning

`@snui/vue-web@0.6.0` — initial release. Part of AUI-WEB-NAV-003
(M1 nav Web components).