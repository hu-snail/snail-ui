# SnDivider — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnDivider component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Visual separator between content blocks. Pure decoration; not interactive.

## Import

```ts
import { SnDivider } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | no | Axis of the line. |
| `dashed` | `boolean` | `false` | no | Dashed border instead of solid. |
| `color` | `string` | — | no | Inline border color (any CSS color value). Token-driven overrides should use CSS in the consuming app, not this prop. |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Vertical margin (only applied for horizontal direction). |

## Slots

| Name | Description |
|---|---|
| `default` | Optional text rendered on the line. Only rendered for horizontal direction. |

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Border default | `--sn-web-color-border-default` | Line color |
| Text secondary | `--sn-web-color-text-secondary` | Slot text color |
| Background surface | `--sn-web-color-background-surface` | Slot text background |

## Accessibility

- `role="separator"`
- `aria-orientation` follows `direction` prop
- Pure decoration: no keyboard interaction

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-006 (M1 basic Web components).