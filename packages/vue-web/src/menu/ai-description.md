# SnMenu — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnMenu component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Hierarchical navigation menu. Horizontal mode for top-bar nav; vertical mode
for sidebar / sidenav with collapsible sub-groups.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-menu`
(https://www.naiveui.com/zh-CN/light/components/menu). New props added
here MUST also be added to the n-menu parity list.

## Import

```ts
import { SnMenu, type SnMenuOption } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction. |
| `options` | `SnMenuOption[]` | `[]` | Menu tree. Each node: `{ key, label, children?, disabled?, href?, icon? }`. |
| `value` | `string \| number \| null` | `null` | Selected key (controlled). |
| `defaultValue` | `string \| number \| null` | `null` | Initial selected key. |
| `expandedKeys` | `Array<string \| number>` | `[]` | Expanded group keys (controlled, vertical mode). |
| `defaultExpandedKeys` | `Array<string \| number>` | `[]` | Initial expanded group keys. |
| `defaultExpandAll` | `boolean` | `false` | Expand every group on first render. |
| `accordion` | `boolean` | `false` | Restrict to a single expanded top-level group. |
| `indent` | `number` | `32` | Indent per level in px (vertical mode). |

## Events

| Event | Payload | When |
|---|---|---|
| `update:value` | `(key: string \| number \| null)` | Leaf item clicked / `v-model:value` sync. |
| `update:expandedKeys` | `(keys: Array<string \| number>)` | Group toggled / `v-model:expanded-keys` sync. |
| `select` | `(key, item: SnMenuOption)` | Mirrors n-menu `onSelect` callback. |

## SnMenuOption

```ts
interface SnMenuOption {
  key: string | number
  label: string
  children?: SnMenuOption[]
  disabled?: boolean
  href?: string      // When set, renders as <a> instead of <button>
  icon?: Component   // Sn* icon component or generic Vue component
}
```

## Slots

None. Use the `icon` field on each option to render inline icons.

## §112 future markers

Not yet implemented (intentional v0.1 scope cut). Documented here so the
n-menu parity list can be updated when a consumer needs them:

- `collapsed` + `collapsedWidth` — sidebar collapse-to-icons
- `rootIndent` — first-level indent override
- `iconSize` / `collapsedIconSize` — per-mode icon sizing
- `inverted` — dark-theme menu color overrides
- `responsive` — overflow ellipsis for narrow viewports
- `dropdownProps` — submenu rendered in popover (mobile-style)
- `renderIcon` / `renderLabel` / `renderExtra` — render function props
- `nodeProps` — per-node attribute injection
- `dropdownPlacement` — submenu popover placement
- `labelField` / `keyField` / `childrenField` / `disabledField` — option field remapping
- `watchProps` — re-init on defaultValue/defaultExpandedKeys change

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-web-color-text-primary` | Default item color |
| Action primary | `--sn-web-color-action-primary` | Active item background |
| Text on primary | `--sn-web-color-text-on-primary` | Active item text color |

## Accessibility

- `role="menubar"` (horizontal) / `role="menu"` (vertical)
- Active leaf: `aria-current="page"`
- Group header: `aria-expanded="true" \| "false"`
- Disabled items: `aria-disabled="true"` / `<button disabled>`
- Leaf items render as `<a>` (with `href`) or `<button>` (without)

## Versioning

`@snui/vue-web@0.5.0` — initial release. Part of AUI-WEB-NAV-001
(M1 nav Web components).