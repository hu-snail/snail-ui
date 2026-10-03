# SnButton — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnButton component.
> Consumed by `@snui/cli`'s `generateDocs()` and `generateLlmsTxt()` to produce
> machine-readable docs without parsing `.vue` files.

## Purpose

Primary interactive button. Triggers an action when clicked. Most-used
component in any UI; appearance must be unambiguous and accessible.

## Import

```ts
import { SnButton } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `type` | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | no | Visual variant. Drives background / border / text color. |
| `size` | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | no | Height + font size preset. |
| `block` | `boolean` | `false` | no | Full-width block layout. |
| `round` | `boolean` | `false` | no | Pill-shaped (radius: 999px). |
| `disabled` | `boolean` | `false` | no | Disabled state. Skips click. |
| `loading` | `boolean` | `false` | no | Loading state. Shows spinner. Skips click. |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | no | Native button type attribute. |
| `bordered` | `boolean` | `true` | no | Whether to draw border (for `default` type). |
| `ariaLabel` | `string` | — | no | Override accessible label. |

## Events

| Name | Payload | Description |
|---|---|---|
| `click` | `(event: MouseEvent) => void` | Fired on click. Skipped when disabled or loading. |

## Slots

| Name | Description |
|---|---|
| `default` | Button label text. |
| `icon` | Pre-content icon. If provided, replaces loading spinner. |
| `loading` | Custom loading indicator. Replaces default spinner. |

## Tokens Consumed

| Token | CSS Variable | Purpose |
|---|---|---|
| Color action primary | `--sn-color-action-primary` | `primary` background |
| Color feedback success | `--sn-color-feedback-success` | `success` background |
| Color feedback warning | `--sn-color-feedback-warning` | `warning` background |
| Color feedback danger | `--sn-color-feedback-danger` | `danger` background |
| Color background surface | `--sn-color-background-surface` | `default` background |
| Color text primary | `--sn-color-text-primary` | `default` text |
| Color border default | `--sn-color-border-default` | `default` border |
| Radius button | `--sn-radius-button` | Button border radius |

## Accessibility

- Native `<button>` element with `role="button"`
- `aria-disabled` set when disabled
- `aria-busy` set when loading
- `aria-label` override via prop
- Focus-visible ring uses `--sn-color-focus-ring`
- Keyboard: Enter / Space both trigger click natively

## Versioning

`@snui/vue-web@0.1.0` — initial release. Component contract sealed; breaking
changes require major version bump per ADR-0001.
