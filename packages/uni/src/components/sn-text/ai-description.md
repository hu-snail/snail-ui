# sn-text — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-text component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-text`, prop surface mirrored 1:1.

## Purpose

Body / label text with a semantic colour, an optional prefix and suffix, and
five display modes that format the raw value for reading: `phone` (masking),
`name` (masking), `price` (thousands + 2 decimals), `date` (YYYY-MM-DD), and
`text` (pass-through). The mode transforms are display-only — no business
logic, no network, no schema access.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-text text="普通文本" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnText } from '@snui/uni/components/sn-text/sn-text.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | no | Semantic colour. |
| `text` | `string \| number` | `''` | no | Text content. The default slot wins when both are present. |
| `size` | `string` | `''` | no | Font size, used verbatim (`'28rpx'` / `'14px'`). |
| `mode` | `'text' \| 'date' \| 'phone' \| 'name' \| 'price'` | `'text'` | no | Display transform applied to `text`. |
| `decoration` | `'none' \| 'underline' \| 'line-through' \| 'overline'` | `'none'` | no | Text decoration. |
| `call` | `boolean` | `false` | no | Dial the number on tap (`mode="phone"` only). |
| `bold` | `boolean` | `false` | no | Bold weight. |
| `format` | `boolean` | `false` | no | Mask the value; only meaningful for `phone` / `name`. |
| `color` | `string` | `''` | no | Inline colour override. |
| `prefix` | `string` | `''` | no | Content before the text (the `prefix` slot wins). |
| `suffix` | `string` | `''` | no | Content after the text (the `suffix` slot wins). |
| `lines` | `number` | `0` | no | Max rendered lines; overflow gets an ellipsis. `0` = no clamp. |
| `lineHeight` | `string` | `''` | no | Line height, used verbatim. |
| `customClass` | `string` | `''` | no | Extra class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style appended to the root node. |

## Mode transforms

| Mode | Input → Output |
|---|---|
| `text` | `'raw'` → `'raw'` |
| `phone` | `'13800138000'` → `'13800138000'`; with `format` → `'138****8000'` |
| `name` | `'张三丰'` → `'张三丰'`; with `format` → `'张**'` |
| `price` | `'1288.5'` → `'1,288.50'`; `'-99'` → `'-99.00'` |
| `date` | `'2024-03-05T10:00:00'` → `'2024-03-05'` |

Unparsable `date` input passes through untouched — a display component must not
throw on data it does not recognise.

## Events

| Name | Payload | Description |
|---|---|---|
| `click` | `Event` | Tapped. Emitted alongside the dial action when `call` is on. |

## Slots

| Name | Description |
|---|---|
| `default` | Text content; overrides `text`. |
| `prefix` | Content before the text; overrides `prefix`. |
| `suffix` | Content after the text; overrides `suffix`. |

## Masking contract

`format` replaces the hidden run with `*` **before** the value reaches the DOM.
The raw phone number / full name never appears in rendered markup, so a copy,
a screenshot helper or an inspection tool cannot recover it (AGENTS.md §66).

## `call` contract

`call` is opt-in and feature-detected. When the uni-app runtime exposes
`makePhoneCall`, a tap dials the digits (whitespace stripped). When it does not
— H5, SSR, a test environment — the tap degrades to a plain `click` emit
instead of throwing. The root gains `role="link"` only while dialing is
actually available.

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-mp-color-text-primary` | `default` type colour |
| Action primary | `--sn-mp-color-action-primary` | `primary` type |
| Feedback success / warning / danger | `--sn-mp-color-feedback-{success,warning,danger}` | `success` / `warning` / `error` types |
| Font size | `--sn-mp-font-size-md` | Default body size |
| Line height | `--sn-mp-font-line-height-normal` | Default line height |
| Font weight | `--sn-mp-font-weight-bold` | `bold` + Doodle skin emphasis |

## Accessibility

- The root is a `<view>`; the text lives in a nested `<text>`, so miniprogram
  line-clamping (`display: -webkit-box`) can apply to the wrapper.
- `role="link"` is added only when a tap will actually dial — a non-dialable
  phone number stays plain text.
- No keyboard contract on miniprogram; on H5 the tap handler is the same.

## Versioning

`@snui/uni@0.1.0` — initial release. Display-family component (AUI-MP-DS-005).
