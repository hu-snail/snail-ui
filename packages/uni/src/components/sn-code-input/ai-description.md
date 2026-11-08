# sn-code-input — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Boxed verification-code / PIN field: a hidden native input drives the keyboard while the visible row is a set of token-styled boxes..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Boxed verification-code / PIN field: a hidden native input drives the keyboard while the visible row is a set of token-styled boxes. Renamed from `sn-password-input`（Human 指令 2026-11-01）— same widget, the reference ships it as the code-entry field.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-password-input`
(https://wot-ui.cn/component/password-input.html) except for the registered
deviations (AGENTS.md §112.3a): `shape`（方框 / 下划线）、`background`（格子
背景色）、`border`（'all' | 'none'，无边框格子）为 AUI 追加，`gutter` 默认值
0 → 8. New props added here MUST also be added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-code-input v-model="code" :length="6" :focused="keyboardOpen" info="6-digit code" />
```

```ts
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';
```

## Props

| Name                          | Type                   | Default | Description                                          |
| ----------------------------- | ---------------------- | ------- | ---------------------------------------------------- |
| `modelValue`                  | `string`               | `''`    | Current value.                                       |
| `mask`                        | `boolean`              | `true`  | Render dots instead of characters.                   |
| `info` / `errorInfo`          | `string`               | `''`    | Helper / error text (error wins).                    |
| `gutter`                      | `number \| string`     | `8`     | Gap between boxes (16rpx; `0` = flush).              |
| `border`                      | `'all' \| 'none'`      | `'all'` | `none` strips every cell border (additive, §112.3a). |
| `shape`                       | `'box' \| 'underline'` | `'box'` | Box shape (additive, §112.3a).                       |
| `background`                  | `string`               | `''`    | Cell background color (additive, §112.3a).           |
| `length`                      | `number`               | `6`     | Number of boxes.                                     |
| `focused`                     | `boolean`              | `true`  | Show the caret in the first empty box.               |
| `customClass` / `customStyle` | `string`               | `''`    | Root forwarding.                                     |

## Events

| Name                | Payload           | When                       |
| ------------------- | ----------------- | -------------------------- |
| `update:modelValue` | `(value: string)` | Value changed.             |
| `change`            | `(value: string)` | Value changed (same tick). |
| `focus` / `blur`    | `(event: Event)`  | Native field focus / blur. |

## Behavior

- The typed value is read from the uni-app normalized `event.detail.value`
  (DOM `target.value` fallback) — reading `target.value` alone crashes on MP.
- Tapping the box row re-arms the hidden input: the `:focus` attribute is
  pulsed false → true while the field is not genuinely focused (mobile H5
  blocks gesture-less autofocus; a static attribute can never re-fire).

## Tokens Consumed (end: mp)

| Token                                                            | Purpose                                |
| ---------------------------------------------------------------- | -------------------------------------- |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text` | Box surface, border, focus ring, glyph |
| `--sn-mp-color-feedback-danger`                                  | Error border + message                 |
| `--sn-mp-color-action-primary`                                   | Caret                                  |
| `--sn-mp-color-text-tertiary`                                    | Helper text                            |
| `--sn-mp-radius-md`（hook: `--sn-code-input-radius`）            | Box corners（下划线形状为 0）          |
| `--sn-code-input-gap` / `-box-bg` / `-radius`                    | Component-local hooks（prop 可重指）   |
| `--sn-mp-font-size-xl` / `-sm`                                   | Glyph / message size                   |

## Accessibility

- The box row is `role="group"` with `aria-label` carrying "code, N of M".
- Each box has an `aria-label` ("digit N").
- The native input carries `aria-label="code"` and is the keyboard source only.

## Versioning

`@snui/uni@0.5.0` — initial release.
