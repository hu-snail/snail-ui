# SnSwitch (Web)

Web-end switch component for `@snui/vue-web`. Mirrors naive-ui `n-switch`
1:1 on the value model, sizes, states and slots.

## When to use

Use SnSwitch for binary on/off toggles. Custom `checkedValue` /
`uncheckedValue` payloads support string / number bindings (e.g. `'on'` /
`'off'`, `1` / `0`).

## Props

| Prop           | Type                                    | Default  | Notes                                             |
| -------------- | --------------------------------------- | -------- | ------------------------------------------------- |
| modelValue     | `boolean \| string \| number`           | `false`  | Bound via `v-model`.                              |
| checkedValue   | `boolean \| string \| number`           | `true`   | Value emitted when on. Compared by `===`.         |
| uncheckedValue | `boolean \| string \| number`           | `false`  | Value emitted when off.                           |
| size           | `'small' \| 'medium' \| 'large'`        | `'medium'` | Drives rail + knob dimensions.                  |
| disabled       | `boolean`                               | `false`  | Blocks toggling, dims the rail, `aria-disabled`.  |
| readonly       | `boolean`                               | `false`  | Blocks toggling, normal appearance, `aria-readonly`. |
| loading        | `boolean`                               | `false`  | Shows a spinner in the knob, blocks toggling, `aria-busy`. |
| ariaLabel      | `string`                                | `''`     | Accessible name.                                  |
| railStyle      | `(info: { checked: boolean }) => Record<string, string>` | — | Custom inline style merged onto the rail. |
| customClass    | `string`                                | `''`     | Class on the root wrapper.                        |

## Events

| Event                | Payload                                 | When                          |
| -------------------- | --------------------------------------- | ----------------------------- |
| `update:modelValue`  | `(value: boolean \| string \| number)`  | Toggle activated (v-model).   |
| `change`             | `(value: boolean \| string \| number)`  | Toggle activated.             |

## Slots

| Slot            | Description                                        |
| --------------- | -------------------------------------------------- |
| `checked`       | Rail content shown while checked.                  |
| `unchecked`     | Rail content shown while unchecked.                |
| `loading-icon`  | Replaces the default loading spinner in the knob.  |

## Tokens

Visual properties resolve through `var(--sn-web-switch-*)` aliases with
fallbacks to generic tokens. Override per-instance by setting them on a
parent selector.

| Token                                  | Default                              | Purpose            |
| -------------------------------------- | ------------------------------------ | ------------------ |
| `--sn-web-switch-bg`                   | dark soft fill                       | Rail (unchecked)   |
| `--sn-web-switch-bg-checked`           | `--sn-web-color-action-primary`      | Rail (checked)     |
| `--sn-web-switch-knob-bg`              | `--sn-web-color-background-surface`  | Knob fill          |
| `--sn-web-switch-knob-shadow`          | rgba shadow                          | Knob elevation     |
| `--sn-web-switch-rail-width(-sm/-lg)`  | `40px` / `34px` / `52px`             | Rail width         |
| `--sn-web-switch-rail-height(-sm/-lg)` | `22px` / `18px` / `28px`             | Rail height        |
| `--sn-web-switch-knob-size(-sm/-lg)`   | `18px` / `14px` / `24px`             | Knob diameter      |
| `--sn-web-switch-label-color`          | `--sn-web-color-text-on-primary`     | Slot label text    |
| `--sn-web-switch-loading-color`        | `--sn-web-color-action-primary`      | Spinner arc        |
| `--sn-web-switch-disabled-opacity`     | `0.4`                                | Disabled dimming   |
| `--sn-web-focus-ring`                  | rgba brand                           | Focus halo         |

## Accessibility

- `role="switch"` + `aria-checked` on the focusable root button.
- Enter and Space activate the switch (WAI-ARIA authoring pattern).
- `aria-disabled` / `aria-readonly` / `aria-busy` mirror the props.
- Focus halo painted via `--sn-web-focus-ring` on `:focus-visible`.

## Tree-shakeability

SnSwitch ships as a named ESM export with no runtime dependencies on other
Sn components; apps that do not import it get no SnSwitch code.

## When NOT to use

- Use a checkbox (SnInput-like) when the user needs to see both states
  explicitly or multiple options are selectable.
- Use a pair of buttons for mutually exclusive multi-way choices.
