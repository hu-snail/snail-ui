# sn-button — AI-Friendly Component Description (uni-end)

> Human-readable + AI-parseable description of the uni-end primary button.
> Mirrors the web-end `SnButton` shape but follows uni-app easycom conventions
> (file path → tag name) and mobile-first sizing (rpx units).

## Purpose

Primary interactive button for uni-app. Optimized for mobile interaction
(touch feedback, large tap targets, rpx sizing).

## Auto-registration

The component is auto-registered via uni-app easycom because it lives at:

```text
packages/uni/src/components/sn-button/sn-button.vue
```

→ registered as `<sn-button>` in any `.vue` template without explicit import.

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size preset. |
| `block` | `boolean` | `false` | Full-width layout. |
| `round` | `boolean` | `false` | Pill-shaped. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `loading` | `boolean` | `false` | Loading state with spinner. |
| `hairline` | `boolean` | `true` | Show hairline border (default type only). |
| `feedback` | `boolean` | `true` | Tap feedback (active opacity). |

## Events

| Name | Payload | Description |
|---|---|---|
| `click` | `(event: Event) => void` | Fired on tap. Skipped when disabled or loading. |

## Slots

| Name | Description |
|---|---|
| `default` | Button label. |
| `icon` | Custom icon (replaces loading spinner when present). |
| `loading` | Custom loading indicator. |

## Tokens Consumed

Same `--sn-*` namespace as web-end (see `packages/vue-web/src/button/ai-description.md`).
Unit sizing uses `rpx` for cross-device scaling.

## Cross-end Notes

| Platform | Notes |
|---|---|
| H5 | Renders as `<view>`. Touch handled via `tap`. |
| WeChat MP | Compiles to native `<button>`-like view. |
| App (uni-app x) | Native rendering with touch events. |
| Alipay MP | Mirrors WeChat MP behavior. |

## Versioning

`@snui/uni@0.1.0` — initial release.
