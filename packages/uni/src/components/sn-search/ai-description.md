# sn-search — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-search component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Search field for mobile / miniprogram: pill input with a left magnifier, an
optional × clear button and a right-hand cancel text. The query itself is run
by the host app behind the `search` event — the component never fetches.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-search`
(https://wot-ui.cn/component/search.html). New props added here MUST also be
added to the wd-search parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-search v-model="query" placeholder="搜索" @search="onSearch" />
```

```ts
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';
```

## Props

| Name               | Type                             | Default   | Required | Description                                          |
| ------------------ | -------------------------------- | --------- | -------- | ---------------------------------------------------- |
| `modelValue`       | `string`                         | `''`      | no       | v-model query text.                                  |
| `customInputClass` | `string`                         | `''`      | no       | Class on the inner `<input>`.                        |
| `placeholder`      | `string`                         | `'搜索'`  | no       | Placeholder text (wd-search default).                |
| `cancelTxt`        | `string`                         | `'取消'`  | no       | Right-hand cancel text.                              |
| `variant`          | `'plain' \| 'filled' \| 'light'` | `'plain'` | no       | Visual variant.                                      |
| `hideCancel`       | `boolean`                        | `false`   | no       | Hide the cancel text.                                |
| `disabled`         | `boolean`                        | `false`   | no       | Blocks input / search / cancel / clear.              |
| `maxlength`        | `number \| string`               | `-1`      | no       | Max length; `-1` = unlimited.                        |
| `placeholderLeft`  | `boolean`                        | `false`   | no       | Left-align the placeholder (default is centered).    |
| `focus`            | `boolean`                        | `false`   | no       | Focus on mount.                                      |
| `focusWhenClear`   | `boolean`                        | `false`   | no       | Declared for parity; re-focus is a no-op on uni-end. |
| `placeholderStyle` | `string`                         | `''`      | no       | Inline style for the placeholder.                    |
| `placeholderClass` | `string`                         | `''`      | no       | Class on the placeholder.                            |
| `customClass`      | `string`                         | `''`      | no       | Class on the root node.                              |
| `customStyle`      | `string`                         | `''`      | no       | Inline style on the root node.                       |

## Events

| Name                | Payload           | When                                                                |
| ------------------- | ----------------- | ------------------------------------------------------------------- |
| `update:modelValue` | `(value: string)` | Every keystroke.                                                    |
| `change`            | `(value: string)` | Value changed (alias of `update:modelValue`).                       |
| `search`            | `(value: string)` | Soft-keyboard confirm / search tapped.                              |
| `cancel`            | `(value: string)` | Right-hand cancel text tapped.                                      |
| `clear`             | `()`              | × button tapped.                                                    |
| `focus` / `blur`    | `(event: Event)`  | Native focus / blur.                                                |
| `click`             | `(event: Event)`  | Root tapped **while disabled** (the only way to observe the block). |

## Slots

| Name           | Description                                   |
| -------------- | --------------------------------------------- |
| `prefix`       | Content before the field.                     |
| `input-suffix` | Content inside the field, right of the input. |
| `suffix`       | Content after the cancel text.                |

## Tokens Consumed (end: mp)

| Token                                       | Purpose                     |
| ------------------------------------------- | --------------------------- |
| `--sn-mp-color-input-bg`                    | Field background (`plain`)  |
| `--sn-mp-color-input-text`                  | Input text                  |
| `--sn-mp-color-input-placeholder`           | Placeholder                 |
| `--sn-mp-color-input-border` / `-focus`     | Field border                |
| `--sn-mp-color-background-soft` / `-subtle` | `filled` / `light` surfaces |
| `--sn-mp-color-action-primary`              | Cancel text + focus ring    |
| `--sn-mp-radius-full`                       | Pill field                  |

## Accessibility

- `role="search"` on the root.
- Native `<input type="text">` with `confirm-type="search"`.
- `aria-label` defaults to the placeholder; `aria-disabled` mirrors the prop.
- The clear button is `aria-hidden` decoration with a `tabindex` that flips to
  `-1` when the field is disabled.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of AUI-MP-007 (M1 录入类 uni components).
