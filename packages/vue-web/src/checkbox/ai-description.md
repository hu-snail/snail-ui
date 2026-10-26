# SnCheckbox / SnCheckboxGroup (Web)

Web-end checkbox components for `@snui/vue-web`. Mirrors naive-ui
`n-checkbox` / `n-checkbox-group` 1:1.

## When to use

Use SnCheckbox for binary (or indeterminate tri-state) choices, and
SnCheckboxGroup when several checkboxes share one selection array.

## SnCheckbox Props

| Prop           | Type                                                 | Default     | Notes                                                     |
| -------------- | ---------------------------------------------------- | ----------- | --------------------------------------------------------- |
| modelValue     | `boolean \| string \| number \| Array`               | `false`     | `v-model`. Standalone: `checkedValue` / `uncheckedValue`. |
| defaultChecked | `boolean`                                            | `false`     | Uncontrolled initial state (naive `default-checked`).     |
| label          | `string`                                             | `''`        | Label text; default slot wins for rich content.           |
| value          | `string \| number \| boolean`                        | —           | Value inside a group (naive `value`).                     |
| disabled       | `boolean`                                            | `false`     | Group `disabled` ORs with this.                           |
| readonly       | `boolean`                                            | `false`     | Visible but not toggleable.                               |
| indeterminate  | `boolean`                                            | `false`     | Renders `aria-checked="mixed"` + dash mark.               |
| size           | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'`  | Box size + font size. Group size wins.                    |
| checkedValue   | `string \| number \| boolean`                        | `true`      | Emitted value when checked (naive `checked-value`).       |
| uncheckedValue | `string \| number \| boolean`                        | `false`     | Emitted value when unchecked (naive `unchecked-value`).   |
| status         | `'default' \| 'error' \| 'warning'`                  | `'default'` | Box border color + `aria-invalid`.                        |
| focusable      | `boolean`                                            | `true`      | `tabindex="-1"` when `false` (naive `focusable`).         |
| ariaLabel      | `string`                                             | `''`        | Accessible name when no label.                            |

## SnCheckbox Events

| Event               | Payload              | When                               |
| ------------------- | -------------------- | ---------------------------------- |
| `update:modelValue` | `(value)`            | Toggle committed (click / Space).  |
| `update:checked`    | `(checked: boolean)` | Toggle committed.                  |
| `checkedChange`     | `(checked: boolean)` | Toggle committed (naive spelling). |

## SnCheckbox Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Rich label content (over `label`). |
| `icon`    | Custom checkmark.                  |

## SnCheckboxGroup Props

| Prop                      | Type                                                 | Default    | Notes                           |
| ------------------------- | ---------------------------------------------------- | ---------- | ------------------------------- |
| modelValue                | `(string \| number \| boolean)[]`                    | `[]`       | `v-model` selection array.      |
| defaultValue              | `(string \| number \| boolean)[]`                    | `[]`       | Uncontrolled initial selection. |
| options                   | `{ label, value, disabled }[]`                       | `[]`       | Renders children from a list.   |
| disabled                  | `boolean`                                            | `false`    | Disables every child.           |
| size                      | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Applied to children.            |
| customClass / customStyle | `string` / `string \| object`                        | —          | Root wrapper passthrough.       |

SnCheckboxGroup Events: `update:modelValue`, `update:value` — both carry the
full next selection array.

## Tokens

Both components resolve through `--sn-web-checkbox-*` aliases:

| Token                                    | Default                             | Purpose              |
| ---------------------------------------- | ----------------------------------- | -------------------- |
| `--sn-web-checkbox-size`                 | `14px` (per size preset)            | Box size             |
| `--sn-web-checkbox-radius`               | `3px`                               | Corner radius        |
| `--sn-web-checkbox-border-color`         | `--sn-web-color-border-default`     | Border (idle)        |
| `--sn-web-checkbox-border-color-hover`   | `--sn-web-color-action-primary`     | Border (hover)       |
| `--sn-web-checkbox-border-color-checked` | `--sn-web-color-action-primary`     | Border (checked)     |
| `--sn-web-checkbox-bg`                   | `--sn-web-color-background-surface` | Background           |
| `--sn-web-checkbox-bg-checked`           | `--sn-web-color-action-primary`     | Background (checked) |
| `--sn-web-checkbox-check-color`          | `--sn-web-color-text-on-primary`    | Checkmark color      |
| `--sn-web-checkbox-text-color`           | `--sn-web-color-text-primary`       | Label text           |
| `--sn-web-checkbox-group-gap`            | `16px`                              | Child spacing        |
| `--sn-web-focus-ring`                    | action-primary-soft                 | Focus halo           |

## Accessibility

- Native `<input type="checkbox">` (visually hidden, focusable) — free
  keyboard (Space) + screen-reader semantics.
- `aria-checked` is tristate: `true` / `false` / `mixed` (indeterminate).
- `aria-invalid` mirrors `status="error"`; `aria-disabled` mirrors disabled.
- Group root carries `role="group"`.

## When NOT to use

- Single submit / immediate action — use SnButton.
- Mutually exclusive choice — use a radio group.
