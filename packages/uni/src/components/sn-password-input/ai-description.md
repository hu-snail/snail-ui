# sn-sn-password-input — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Boxed password / PIN field: a hidden native input drives the keyboard while the visible row is a set of token-styled boxes..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Boxed password / PIN field: a hidden native input drives the keyboard while the visible row is a set of token-styled boxes.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-password-input`
(https://wot-ui.cn/component/password-input.html) except for the registered
deviations (AGENTS.md §112.3a): `shape`（方框 / 下划线）、`background`（格子
背景色）为 AUI 追加，`gutter` 默认值 0 → 8. New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-password-input v-model="pin" :length="6" :focused="keyboardOpen" info="6-digit PIN" />
```

```ts
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';
```

## Props

| Name                          | Type                   | Default | Description                                |
| ----------------------------- | ---------------------- | ------- | ------------------------------------------ |
| `modelValue`                  | `string`               | `''`    | Current value.                             |
| `mask`                        | `boolean`              | `true`  | Render dots instead of characters.         |
| `info` / `errorInfo`          | `string`               | `''`    | Helper / error text (error wins).          |
| `gutter`                      | `number \| string`     | `8`     | Gap between boxes (16rpx; `0` = flush).    |
| `shape`                       | `'box' \| 'underline'` | `'box'` | Box shape (additive, §112.3a).             |
| `background`                  | `string`               | `''`    | Cell background color (additive, §112.3a). |
| `length`                      | `number`               | `6`     | Number of boxes.                           |
| `focused`                     | `boolean`              | `true`  | Show the caret in the first empty box.     |
| `customClass` / `customStyle` | `string`               | `''`    | Root forwarding.                           |

## Events

| Name                | Payload           | When                       |
| ------------------- | ----------------- | -------------------------- |
| `update:modelValue` | `(value: string)` | Value changed.             |
| `change`            | `(value: string)` | Value changed (same tick). |
| `focus` / `blur`    | `(event: Event)`  | Native field focus / blur. |

## Tokens Consumed (end: mp)

| Token                                                            | Purpose                                |
| ---------------------------------------------------------------- | -------------------------------------- |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text` | Box surface, border, focus ring, glyph |
| `--sn-mp-color-feedback-danger`                                  | Error border + message                 |
| `--sn-mp-color-action-primary`                                   | Caret                                  |
| `--sn-mp-color-text-tertiary`                                    | Helper text                            |
| `--sn-mp-radius-md`（hook: `--sn-password-input-radius`）        | Box corners（下划线形状为 0）          |
| `--sn-password-input-gap` / `-box-bg` / `-radius`                | Component-local hooks（prop 可重指）   |
| `--sn-mp-font-size-xl` / `-sm`                                   | Glyph / message size                   |

## Accessibility

- The box row is `role="group"` with `aria-label` carrying "password, N of M".
- Each box has an `aria-label` ("digit N").
- The native input carries `aria-label="password"` and is the keyboard source only.

## Versioning

`@snui/uni@0.5.0` — initial release.
