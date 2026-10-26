# SnCollapse / SnCollapseItem — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end collapse pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Collapsible content groups. Each `SnCollapseItem` renders a header (title +
caret) and a body (default slot) toggled by clicking the header. Used for
FAQ sections, sidebar groups, settings panes.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-collapse` + `n-collapse-item`
(https://www.naiveui.com/zh-CN/light/components/collapse).

## Import

```ts
import { SnCollapse, SnCollapseItem } from '@snui/vue-web'
```

## SnCollapse Props

| Name | Type | Default | Description |
|---|---|---|---|
| `expandedNames` | `Array<string \| number>` | `[]` | Expanded names (controlled). |
| `defaultExpandedNames` | `Array<string \| number>` | `[]` | Initial expanded names (uncontrolled). |
| `accordion` | `boolean` | `false` | Restrict to one expanded item at a time. |
| `arrowPlacement` | `'left' \| 'right'` | `'left'` | Caret position. |
| `trigger` | `'click' \| 'hover'` | `'click'` | Header interaction mode. |

## SnCollapseItem Props

| Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string \| number` | `''` | Unique identifier within parent SnCollapse. Required for toggling. |
| `title` | `string` | `''` | Header label. |
| `disabled` | `boolean` | `false` | Disable toggle. |
| `arrow` | `string \| boolean` | `''` | Per-item arrow override (true/false/'left'/'right'). |

## Events

| Event | Payload | When |
|---|---|---|
| `update:expandedNames` | `(names: Array<string \| number>)` | Any item toggled / `v-model:expanded-names` sync. |
| `itemHeaderClick` | `(name: string \| number)` | Header clicked (mirror of n-collapse `onItemHeaderClick`). |

## Slots

| Component | Slot | Description |
|---|---|---|
| `SnCollapse` | `default` | Sequence of `<SnCollapseItem>` children. |
| `SnCollapseItem` | `default` | Body content (revealed when expanded). |

## §112 future markers

- `displayDirective: 'show' \| 'if'` — render body via `v-show` (current default) or `v-if`
- Custom `arrow` slot for non-text arrow icons
- Per-item header icons (`header-extra` slot in n-collapse)

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background surface | `--sn-web-color-background-surface` | Item background |
| Text primary | `--sn-web-color-text-primary` | Header + body text |

## Accessibility

- `role="region"` on outer container
- `role="button"` + `aria-expanded` on item headers
- `aria-disabled="true"` on disabled items
- Keyboard: `Enter` / `Space` triggers toggle (matches n-collapse keyboard contract)

## Versioning

`@snui/vue-web@0.7.0` — initial release. Part of AUI-WEB-LAYOUT-005
(M1 layout Web components).