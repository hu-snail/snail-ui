# SnCard — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnCard component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Container with optional cover / header / content / footer / action regions.
Token-driven padding + radius + shadow; consumer-friendly `variant` /
`padding` aliases map to canonical naive-ui-aligned props.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-card`
(https://www.naiveui.com/zh-CN/light/components/card). New props added
here MUST also be added to the n-card parity list.

## Import

```ts
import { SnCard } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `title` | `string \| (() => VNodeChild)` | — | Title text or render fn. Rendered inside header when `header` slot is not provided. |
| `contentClass` | `string` | — | Class applied to the content (body) region. |
| `contentStyle` | `string \| CSSProperties` | — | Inline style applied to the content region. |
| `contentScrollable` | `boolean` | `false` | When true, content region gets a max-height + overflow:auto shell. |
| `headerClass` | `string` | — | Class applied to the header region. |
| `headerStyle` | `string \| CSSProperties` | — | Inline style applied to the header region. |
| `headerExtraClass` | `string` | — | Class applied to the header-extra region. |
| `headerExtraStyle` | `string \| CSSProperties` | — | Inline style applied to the header-extra region. |
| `footerClass` | `string` | — | Class applied to the footer region. |
| `footerStyle` | `string \| CSSProperties` | — | Inline style applied to the footer region. |
| `embedded` | `boolean` | `false` | Strips outer border + shadow for nested cards. |
| `segmented` | `boolean \| { content?: boolean \| 'soft'; footer?: boolean \| 'soft'; action?: boolean \| 'soft' }` | `false` | Per-region divider lines. |
| `size` | `'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'` | Padding + font-size preset. |
| `bordered` | `boolean` | `true` | Show 1px outer border. |
| `closable` | `boolean` | `false` | Show close button in header. |
| `hoverable` | `boolean` | `false` | Apply hover-lift visual cue. |
| `role` | `string` | `'region'` | Accessible role attribute. |
| `tag` | `keyof HTMLElementTagNameMap` | `'div'` | Root tag. |
| `cover` | `() => VNodeChild` | — | Render fn for cover (above header). |
| `content` | `string \| (() => VNodeChild)` | — | Content text or render fn. Rendered when `default` slot is not provided. |
| `footer` | `() => VNodeChild` | — | Render fn for footer region. |
| `action` | `() => VNodeChild` | — | Render fn for action region (below footer). |
| `headerExtra` | `() => VNodeChild` | — | Render fn for header-extra region. |
| `closeFocusable` | `boolean` | `true` | Close button keyboard-focusable. |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | — | Convenience alias mapping to `(bordered, shadow)` combinations. |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | — | Convenience alias mapping to `size`. |
| `shadow` | `boolean` | `false` | Show drop shadow via `--sn-web-card-shadow`. |
| `ariaLabel` | `string` | — | Forwarded to the root element. |

## Events

| Event | Payload | When |
|---|---|---|
| `close` | `()` | Close button clicked (only when `closable` is true). |

## Slots

| Name | Slot | Description |
|---|---|---|
| `default` | Card body content. |
| `cover` | Cover region (above header). |
| `header` | Header region. Overrides the `title` prop. |
| `header-extra` | Header-extra region (right side of header). |
| `footer` | Footer region. |
| `action` | Action region (below footer). |

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Card padding | `--sn-web-card-padding` | Default inner padding (medium size) |
| Card radius | `--sn-web-card-radius` | Border radius |
| Card shadow | `--sn-web-card-shadow` | Drop shadow token (drives `box-shadow`) |
| Border default | `--sn-web-color-border-default` | Header/content/footer/action divider lines + outer border |
| Text primary | `--sn-web-color-text-primary` | Title + body text color |
| Text secondary | `--sn-web-color-text-secondary` | Header-extra + close button color |
| Background surface | `--sn-web-color-background-surface` | Card background |

## Accessibility

- Default `role="region"` (configurable via `role` prop)
- `aria-label` forwarded when `ariaLabel` is set
- Close button receives `aria-label` derived from `ariaLabel + " close"` or `'Close'` default
- Header rendered with `role="heading"`
- Keyboard focus on close button honors `closeFocusable`

## Versioning

`@snui/vue-web@0.3.0` — initial release. Part of AUI-WEB-LAYOUT-001
(M1 layout Web components).