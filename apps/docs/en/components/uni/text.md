# Text · uni-app (Mobile)

`sn-text` is the semantic text component of `@snui/uni` (mobile / miniprogram / H5). Beyond colour and decoration it offers five **display-layer** formatting modes — phone / name masking, price grouping, date normalisation — so a schema author writes `mode="price"` instead of shipping a formatter into the binding layer. Auto-registered via easycom.

## Basic usage

Five semantic colours, bold, three decorations:

<Demo name="text-mp-basic" description="Five types (default / primary / success / warning / error); bold; underline / line-through / overline decorations." />

## Mode transforms

`mode` turns the raw value into the string the user should read:

<Demo name="text-mp-mode" description="phone / name masking, price grouping, date normalisation, call dialling." />

| Mode    | Input → Output                                                     |
| ------- | ------------------------------------------------------------------ |
| `text`  | `'raw'` → `'raw'`                                                  |
| `phone` | `'13800138000'` → `'13800138000'`; with `format` → `'138****8000'` |
| `name`  | `'张三丰'` → `'张三丰'`; with `format` → `'张**'`                  |
| `price` | `'1288.5'` → `'1,288.50'`; `'-99'` → `'-99.00'`                    |
| `date`  | `'2024-03-05T10:00:00'` → `'2024-03-05'`                           |

Unparsable `date` input passes through untouched — a display component must not throw on data it does not recognise.

**Masking contract**: `format` replaces the hidden run with `*` **before** the value reaches the DOM. The raw phone number / full name never appears in rendered markup, so a copy, a screenshot helper or an inspection tool cannot recover it.

## Line clamp and typography overrides

`lines` controls how many lines render; `size` / `lineHeight` / `color` override the typography directly:

<Demo name="text-mp-lines" description="lines=1/2/3 multi-line clamp; size / lineHeight / color overrides; prefix / suffix affixes." />

## Custom styles and slots

`custom-class` / `custom-style` land on the root node; the content layer extends through slots — `default` overrides `text`, `prefix` / `suffix` override their props, and a slot can hold any cross-end node:

<Demo name="text-mp-custom" description="customClass / customStyle on the root; the prefix / suffix / default slots render nodes rather than strings." />

## Auto registration (easycom)

```vue
<sn-text text="Plain text" />
<sn-text text="13800138000" mode="phone" format />
<sn-text text="1288.5" mode="price" prefix="$" />
```

For an explicit import:

```ts
import { SnText } from '@snui/uni/components/sn-text/sn-text.vue';
```

## Props

| Prop          | Type                                                          | Default     | Description                                                   |
| ------------- | ------------------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `type`        | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | Semantic colour                                               |
| `text`        | `string \| number`                                            | `''`        | Text content; the default slot wins                           |
| `size`        | `string`                                                      | `''`        | Font size, used verbatim (`'28rpx'` / `'14px'`)               |
| `mode`        | `'text' \| 'date' \| 'phone' \| 'name' \| 'price'`            | `'text'`    | Display transform                                             |
| `decoration`  | `'none' \| 'underline' \| 'line-through' \| 'overline'`       | `'none'`    | Text decoration                                               |
| `call`        | `boolean`                                                     | `false`     | Dial on tap (`mode="phone"` only)                             |
| `bold`        | `boolean`                                                     | `false`     | Bold weight                                                   |
| `format`      | `boolean`                                                     | `false`     | Mask the value (only meaningful for phone / name)             |
| `color`       | `string`                                                      | `''`        | Inline colour override                                        |
| `prefix`      | `string`                                                      | `''`        | Content before the text (the `prefix` slot wins)              |
| `suffix`      | `string`                                                      | `''`        | Content after the text (the `suffix` slot wins)               |
| `lines`       | `number`                                                      | `0`         | Max rendered lines; overflow gets an ellipsis. `0` = no clamp |
| `lineHeight`  | `string`                                                      | `''`        | Line height, used verbatim                                    |
| `customClass` | `string`                                                      | `''`        | Extra class on the root node                                  |
| `customStyle` | `string`                                                      | `''`        | Inline style on the root node                                 |

## Events

| Event   | Description                                                 | Payload          |
| ------- | ----------------------------------------------------------- | ---------------- |
| `click` | Tapped; emitted alongside the dial action when `call` is on | `(event: Event)` |

## Slots

| Slot      | Description                                 |
| --------- | ------------------------------------------- |
| `default` | Text content; overrides `text`              |
| `prefix`  | Content before the text; overrides `prefix` |
| `suffix`  | Content after the text; overrides `suffix`  |

## `call` contract

`call` is opt-in and feature-detected: when the uni-app runtime exposes `makePhoneCall`, a tap dials the digits (whitespace stripped); when it does not (H5 / SSR / a test), the tap degrades to a plain `click` emit instead of throwing. The root gains `role="link"` only while dialling is actually available.

## Theme variables

| Variable                          | Purpose                         |
| --------------------------------- | ------------------------------- |
| `--sn-mp-color-text-primary`      | `default` type colour           |
| `--sn-mp-color-action-primary`    | `primary` type                  |
| `--sn-mp-color-feedback-success`  | `success` type                  |
| `--sn-mp-color-feedback-warning`  | `warning` type                  |
| `--sn-mp-color-feedback-danger`   | `error` type                    |
| `--sn-mp-font-size-md`            | Default body size               |
| `--sn-mp-font-line-height-normal` | Default line height             |
| `--sn-mp-font-weight-bold`        | `bold` and Doodle skin emphasis |

## Accessibility

- The root is a `<view>` with the text in a nested `<text>`, so miniprogram line-clamping (`display: -webkit-box`) can apply to the wrapper box.
- `role="link"` is added only when a tap will actually dial — a non-dialable phone number stays plain text.
- No keyboard contract on miniprogram; on H5 the tap handler is the same.

## Dark mode

Every colour in `sn-text` comes from `--sn-mp-color-*` with no light fallback:

- The five `type` values each flip to their dark-theme value: `default` moves from near-black to near-white, while `primary` / `success` / `warning` / `error` keep their brand hue.
- Decorations use `currentColor`, so they follow `type` / `color` automatically with no extra dark-mode rule.
- `color` overrides apply verbatim; use `var(--sn-mp-*)` when the value should track the theme.

Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Web end: [`SnText`](/en/components/web/text)
- Separator: [`sn-divider`](/en/components/uni/divider)
- Label: [`sn-tag`](/en/components/uni/tag)
