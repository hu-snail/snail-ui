# sn-tabbar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tabbar /
> sn-tabbar-item pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-tabbar` / `wd-tabbar-item`,
> prop surfaces mirrored 1:1.

## Purpose

Bottom tab bar for mobile and miniprogram. The bar owns a single-value
`v-model`; each item renders an icon, a label and an optional badge. Items
without a `name` fall back to their DOM-order index — wd-tabbar's documented
"索引值或者名称" contract.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-tabbar v-model="active">
  <sn-tabbar-item title="首页" icon="Home" />
</sn-tabbar>
```

```ts
import { SnTabbar } from '@snui/uni/components/sn-tabbar/sn-tabbar.vue'
import { SnTabbarItem } from '@snui/uni/components/sn-tabbar/sn-tabbar-item.vue'
```

## Props — sn-tabbar

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `number \| string` | `0` | no | Active index or item name. |
| `fixed` | `boolean` | `false` | no | Pin to the bottom of the viewport. |
| `bordered` | `boolean` | `false` | no | Hairline top border. |
| `safeAreaInsetBottom` | `boolean` | `false` | no | Bottom safe-area padding. |
| `shape` | `'default' \| 'round'` | `'default'` | no | Bar shape. |
| `activeColor` | `string` | `''` | no | Active label colour override. |
| `inactiveColor` | `string` | `''` | no | Inactive label colour override. |
| `placeholder` | `boolean` | `false` | no | Reserve the bar height in flow when `fixed`. |
| `zIndex` | `number` | `10` | no | Stacking level (only written when `fixed`). |
| `beforeChange` | `(value) => boolean \| Promise<boolean>` | `undefined` | no | Veto hook; `false` / reject blocks the switch. |
| `customClass` | `string` | `''` | no | Extra class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style on the root node. |

## Props — sn-tabbar-item

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `''` | no | Tab label. |
| `name` | `number \| string` | `undefined` | no | Unique value; falls back to the item index. |
| `icon` | `string` | `''` | no | Icon name resolved through `registerSnIcons()`. |
| `iconPrefix` | `string` | `''` | no | Iconfont class prefix used when `cssIcon` is on. |
| `cssIcon` | `boolean \| string` | `false` | no | Render a font icon; a string is the class prefix. |
| `value` | `number \| string` | `undefined` | no | Badge value. |
| `isDot` | `boolean` | `false` | no | Render a text-less dot badge. |
| `max` | `number` | `99` | no | Badge ceiling; above it renders `{max}+`. |
| `customClass` | `string` | `''` | no | Extra class on the item root. |
| `customStyle` | `string` | `''` | no | Inline style on the item root. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `number \| string` | Active value changed. |
| `change` | `{ value }` | Active value changed (same commit). |

## Slots

| Name | Description |
|---|---|
| `default` (bar) | TabbarItem list. |
| `default` (item) | Whole item content; scope `{ active }`. |
| `icon` (item) | Icon area; scope `{ active }`. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background surface | `--sn-mp-color-background-surface` | Bar background |
| Border subtle | `--sn-mp-color-border-subtle` | Top hairline |
| Text secondary | `--sn-mp-color-text-secondary` | Inactive label |
| Action primary | `--sn-mp-color-action-primary` | Active label |
| Feedback danger | `--sn-mp-color-feedback-danger` | Badge fill |
| Text on primary | `--sn-mp-color-text-on-primary` | Badge text |
| Icon size | `--sn-mp-icon-size-large` | Font-icon glyph size |
| Font size | `--sn-mp-font-size-xs` | Label / badge text |
| Radius / spacing | `--sn-mp-radius-full`, `--sn-mp-spacing-1` | Pill shape, icon-label gap |
| Shadow | `--sn-mp-shadow-md` | `round` shape elevation |

## Accessibility

- Bar root is `role="tablist"`; every item is `role="tab"` with
  `aria-selected` reflecting the active state and `aria-label` from `title`.
- Badges are decorative text inside the tab; the tab label carries meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation family (AUI-MP-NAV-002).
