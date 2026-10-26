# SnRadio / SnRadioButton / SnRadioGroup (Web)

Web-end radio components for `@snui/vue-web` (AUI-WEB-RADIO-001).
Naive-ui `n-radio` / `n-radio-button` / `n-radio-group` 1:1 surface,
implemented on native `<input type="radio">`.

## When to use

Use SnRadio when the user picks exactly one option from a small set (2–5).
Group them with SnRadioGroup for shared state / name / size / status, or
use SnRadioButton for the segmented "button" form. Use SnCheckbox /
checkbox group for multi-select.

## Architecture

- Native `<input type="radio">` is visually hidden but remains focusable
  and in the DOM — browser arrow-key navigation and ARIA radiogroup
  semantics come free (no custom roving tabindex).
- The group `provide`s `snRadioGroupInjectionKey`; each child radio
  `inject`s it and derives checked / disabled / size / status from the
  group (own props win where set). This lives in `sn-radio-types.ts` to
  avoid parent↔child circular imports.

## Props — SnRadio / SnRadioButton

| Prop           | Type                              | Default     | Notes                                                     |
| -------------- | --------------------------------- | ----------- | --------------------------------------------------------- |
| checkedValue   | `string \| number \| boolean`     | `null`      | naive-ui's `value`. Radio is checked when model equals it. |
| modelValue     | `string \| number \| boolean \| null` | `null` | Standalone v-model (group's value wins inside a group).   |
| label          | `string`                          | `''`        | Label text. `label` slot overrides.                       |
| name           | `string`                          | —           | Native radio name. Group-provided name wins.              |
| disabled       | `boolean`                         | `false`     | OR-ed with group's `disabled`.                            |
| readonly       | `boolean`                         | `false`     | Visual only — does not block the native input.            |
| size           | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Falls back to group size.                    |
| status         | `'default' \| 'error' \| 'warning'` | `'default'` | Falls back to group status. Drives aria-invalid.        |
| ariaLabel      | `string`                          | —           | Accessible name override.                                 |
| customClass    | `string`                          | `''`        | Class on the root.                                        |
| customStyle    | `string \| Record<string,string>` | `''`        | Inline style on the root.                                 |

## Props — SnRadioGroup

| Prop           | Type                              | Default     | Notes                                          |
| -------------- | --------------------------------- | ----------- | ---------------------------------------------- |
| modelValue     | `string \| number \| boolean \| null` | `null` | v-model.                                       |
| options        | `Array<SnRadioOption \| value>`   | `[]`        | `{ label, value, disabled, readonly, size, status }` or plain values. Default slot wins. |
| name           | `string`                          | —           | Shared native name (arrow-key navigation).     |
| disabled       | `boolean`                         | `false`     | Disables every child.                          |
| size           | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Group size.                       |
| status         | `'default' \| 'error' \| 'warning'` | `'default'` | Group status.                                 |
| button         | `boolean`                         | `false`     | Render `options` as SnRadioButton children.    |
| customClass / customStyle | `string` / `string \| Record<string,string>` | `''` | Root hooks.                        |

## Events

| Event                | Payload                                | When                                   |
| -------------------- | -------------------------------------- | -------------------------------------- |
| `update:modelValue`  | `(value)`                              | Radio activated (v-model sync).        |
| `change`             | `(value, event?: Event)`               | Radio activated (group re-emits).      |
| `checked`            | `(value)`                              | Radio flipped to checked (children).   |
| `update`             | `(value \| null, event: Event)`        | Native input event (children).         |
| `focus` / `blur`     | `(event: FocusEvent)`                  | Native focus / blur (children).         |

## Slots

- `default` (group) — custom SnRadio / SnRadioButton children; wins over `options`.
- `label` (radio children) — custom label content, scoped `{ checked, disabled }`.

## Tokens

All visuals resolve through `--sn-web-radio-*` / `--sn-web-radio-button-*`
aliases with fallbacks to the generic `--sn-web-color-*` scale:

| Token                                            | Purpose                       |
| ------------------------------------------------ | ----------------------------- |
| `--sn-web-radio-text-color`                      | Label text                    |
| `--sn-web-radio-text-color-disabled`             | Disabled label text           |
| `--sn-web-radio-border-color` / `-active` / `-focus` / `-disabled` | Dot border   |
| `--sn-web-radio-dot-color` / `-disabled`         | Inner dot fill                |
| `--sn-web-radio-bg` / `-disabled`                | Dot background                |
| `--sn-web-radio-radius`                          | Dot radius                    |
| `--sn-web-radio-group-gap`                       | Spacing between radios        |
| `--sn-web-radio-button-bg` / `-active` / `-disabled` | Button background         |
| `--sn-web-radio-button-text-color` / `-active` / `-disabled` | Button text   |
| `--sn-web-radio-button-border-color` / `-active` / `-disabled` | Button border |
| `--sn-web-radio-button-padding-x` / `-radius` / `-gap` | Button metrics         |
| `--sn-web-focus-ring`                            | Focus halo                    |

## Accessibility

- Native `role=radiogroup` on the group root; each child is a real
  `<input type="radio">` with `aria-checked` / `aria-disabled` /
  `aria-invalid` mirrored.
- Shared `name` gives browser arrow-key roving + Space activation.
- `:focus-visible` paints a focus ring on the dot (radio) / label
  (button) via the `--sn-web-focus-ring` token.

## Tree-shakeability

All three components ship as independent named ESM exports with no
cross-component runtime dependency beyond the tiny injection contract.

## When NOT to use

- Multi-select → SnCheckboxGroup.
- Large option sets (5+) → SnSelect (a dropdown scales better).
- Toggle on/off (single option) → SnSwitch.
