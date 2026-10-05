# Card · Web (PC)

`<div role="region">` container rendering cover → header → content → footer → action in order. Visual styling is driven by `--sn-web-card-*` token aliases (padding / radius / shadow), with full 1:1 prop / slot parity against naive-ui `n-card`.

Reference library: [naive-ui `n-card`](https://www.naiveui.com/zh-CN/light/components/card) (per AGENTS.md §112 hard rule).

## Basic usage

<Demo name="card-web" description="Default variant (bordered) + elevated variant (borderless + shadow). Shows title + header slot + footer slot + body." />

## Props

> Full prop list is 1:1 with [naive-ui `n-card`](https://www.naiveui.com/zh-CN/light/components/card). `§112 aligned` = same-named prop; `convenience alias` = snail-aui-friendly name that maps to aligned props.

| Prop | Type | Default | Category | Description |
| --- | --- | --- | --- | --- |
| `title` | `string \| (() => VNode)` | — | §112 aligned | Header title text or render function |
| `contentClass` | `string` | — | §112 aligned | Class for content region |
| `contentStyle` | `string \| CSSProperties` | — | §112 aligned | Inline style for content region |
| `contentScrollable` | `boolean` | `false` | §112 aligned | Make content scrollable when overflowed (max-height + overflow:auto) |
| `headerClass` | `string` | — | §112 aligned | Class for header region |
| `headerStyle` | `string \| CSSProperties` | — | §112 aligned | Inline style for header region |
| `headerExtraClass` | `string` | — | §112 aligned | Class for header-extra region |
| `headerExtraStyle` | `string \| CSSProperties` | — | §112 aligned | Inline style for header-extra region |
| `footerClass` | `string` | — | §112 aligned | Class for footer region |
| `footerStyle` | `string \| CSSProperties` | — | §112 aligned | Inline style for footer region |
| `embedded` | `boolean` | `false` | §112 aligned | Nested-card mode (strips border + shadow) |
| `segmented` | `boolean \| { content?: boolean \| 'soft'; footer?: boolean \| 'soft'; action?: boolean \| 'soft' }` | `false` | §112 aligned | Divider lines between regions |
| `size` | `'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'` | §112 aligned | Padding + font-size preset |
| `bordered` | `boolean` | `true` | §112 aligned | Show 1px outer border |
| `closable` | `boolean` | `false` | §112 aligned | Show close button in header (needs `onClose`) |
| `hoverable` | `boolean` | `false` | §112 aligned | Apply hover-lift visual cue |
| `role` | `string` | `'region'` | §112 aligned | Accessible role |
| `tag` | `keyof HTMLElementTagNameMap` | `'div'` | §112 aligned | Root element tag |
| `cover` | `() => VNode` | — | §112 aligned | Render fn for top cover region |
| `content` | `string \| (() => VNode)` | — | §112 aligned | Content text or render fn (when `default` slot absent) |
| `footer` | `() => VNode` | — | §112 aligned | Render fn for footer region |
| `action` | `() => VNode` | — | §112 aligned | Render fn for action region (below footer) |
| `headerExtra` | `() => VNode` | — | §112 aligned | Render fn for header-extra region |
| `closeFocusable` | `boolean` | `true` | §112 aligned | Close button keyboard-focusable |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | convenience alias | Maps to `(bordered, shadow)` combination |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | convenience alias | Maps to `size` |
| `shadow` | `boolean` | `false` | convenience alias | Show shadow (consumes `--sn-web-card-shadow`) |
| `ariaLabel` | `string` | — | convenience | Forwarded to root `aria-label` |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `close` | `()` | Close button clicked (only when `closable` is true) |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content region (mutually exclusive with `content` prop) |
| `cover` | Top cover region (mutually exclusive with `cover` prop) |
| `header` | Header region (overrides `title` prop) |
| `header-extra` | Header-extra region (mutually exclusive with `headerExtra` prop) |
| `footer` | Footer region (mutually exclusive with `footer` prop) |
| `action` | Action region (mutually exclusive with `action` prop) |

## Region omission rules

- `header` renders only if `title` / `header` slot / `headerExtra` / `closable` exists
- `content` renders only if default slot / `content` prop exists
- `footer` renders only if `footer` slot / `footer` prop exists
- `action` renders only if `action` slot / `action` prop exists
- `cover` renders only if `cover` slot / `cover` prop exists

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `'region'` (overridable via `role` prop) |
| `aria-label` | forwarded from `ariaLabel` prop |
| `role="heading"` | Header region |
| close button | `aria-label` from `ariaLabel + ' close'` or default `'Close'` |

## Tokens (end: web)

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| Card padding | `--sn-web-card-padding` | Default inner padding (medium) |
| Card radius | `--sn-web-card-radius` | Border radius |
| Card shadow | `--sn-web-card-shadow` | Shadow (only when `shadow=true` or `variant='elevated'`) |
| Border default | `--sn-web-color-border-default` | Outer border + region dividers |
| Text primary | `--sn-web-color-text-primary` | Title + body text |
| Text secondary | `--sn-web-color-text-secondary` | Header-extra + close button |
| Background surface | `--sn-web-color-background-surface` | Card background |