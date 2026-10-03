# sn-divider — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-divider component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Visual separator between content blocks on mobile / miniprogram. Pure decoration; not interactive. Mobile-specific variant of the Web SnDivider.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-divider />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnDivider } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | no | Axis of the line. |
| `dashed` | `boolean` | `false` | no | Dashed border instead of solid. |
| `hairline` | `boolean` | `true` | no | Hairline (1rpx) thin border. Mobile common. |
| `color` | `string` | — | no | Inline border color (any CSS color value). |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Vertical margin (only applied for horizontal direction). |

## Slots

| Name | Description |
|---|---|
| `default` | Optional text rendered on the horizontal line. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Border default | `--sn-mp-color-border-default` | Line color |
| Text secondary | `--sn-mp-color-text-secondary` | Slot text color |
| Background surface | `--sn-mp-color-background-surface` | Slot text background |

## Accessibility

- `role="separator"`
- `aria-orientation` follows `direction` prop
- Pure decoration: no keyboard interaction (mobile tap does not focus)

## Versioning

`@snui/uni@0.1.0` — initial release. Part of AUI-MP-005 (M1 basic uni components).