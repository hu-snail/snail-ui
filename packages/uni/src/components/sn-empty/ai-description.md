# sn-empty — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-empty component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Empty-state placeholder for mobile / miniprogram: a glyph (built-in inline SVG,
registry icon, iconfont class or image URL), an optional tip line and an
optional bottom slot for an action button.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-empty`
(https://wot-ui.cn/component/empty.html). New props added here MUST also be
added to the wd-empty parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-empty tip="暂无数据" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnEmpty } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `icon` | `string` | `'empty'` | no | Icon name / registry key / image URL / CSS class (see resolution order). |
| `iconPrefix` | `string` | `''` | no | Iconfont class prefix applied together with `icon`. |
| `cssIcon` | `boolean \| string` | `false` | no | CSS-icon mode: treat `icon` / `iconPrefix` as class names. |
| `iconSize` | `number \| string` | `''` | no | Glyph / image size; a bare number is rpx, a string passes through. |
| `tip` | `string` | `''` | no | Tip text under the glyph. |
| `customClass` | `string` | `''` | no | Custom class for the root node. |
| `customStyle` | `string` | `''` | no | Custom inline style for the root node. |

### Icon resolution order

1. `icon` looks like a URL / absolute path (`http…`, `//…`, `/…`, `data:`, `./…`)
   → `<image mode="aspectFit">`
2. `cssIcon` truthy (`true` or a non-empty class string) → `<text>` glyph with
   `iconPrefix` + `icon` as classes (iconfont path)
3. `icon` resolves through the sn-icon registry → inline SVG via `<sn-icon>`
4. nothing resolves → the built-in inline "empty box" glyph

## Events

None — `sn-empty` is purely presentational.

## Slots

| Name | Description |
|---|---|
| `image` | Custom glyph area — replaces the icon / image resolution above. |
| `bottom` | Content below the tip (e.g. a retry button). |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text disabled | `--sn-mp-color-text-disabled` | Glyph color |
| Text secondary | `--sn-mp-color-text-secondary` | Tip color |
| Font size MD | `--sn-mp-font-size-md` | Tip size |
| Line height normal | `--sn-mp-font-line-height-normal` | Tip line height |
| Spacing 5 | `--sn-mp-spacing-5` | Glyph → tip / bottom gap |
| Spacing 12 | `--sn-mp-spacing-12` | Bottom padding |
| Border default | `--sn-mp-color-border-default` | Doodle skin outline |
| Radius XL | `--sn-mp-radius-xl` | Doodle skin outline corners |

## Accessibility

- Root carries `role="status"`; `aria-label` is the `tip` text (or `"empty"`)
- The glyph box is `aria-hidden="true"` — decorative, the tip carries meaning
- No keyboard interaction; put interactive elements in the `bottom` slot

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M1 feedback-category uni
components (popup / overlay / loading / progress / empty).
