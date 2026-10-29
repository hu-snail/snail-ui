# Checkbox · Web

Checkbox built on a native `input[type=checkbox]` (tri-state aria-checked), usable standalone or inside `SnCheckboxGroup`.

## Basic

<Demo name="checkbox-web-basic" description="v-model binding + label." />

## Group (CheckboxGroup)

<Demo name="checkbox-web-group" description="Declarative options / slot children; array v-model." />

## Indeterminate

<Demo name="checkbox-web-indeterminate" description="aria-checked='mixed' — parent select-all pattern." />

## Sizes

<Demo name="checkbox-web-sizes" description="mini / tiny / small / medium / large." />

## Disabled / readonly

<Demo name="checkbox-web-states" description="disabled blocks interaction; readonly is visual." />

## Custom values (checkedValue / uncheckedValue)

<Demo name="checkbox-web-values" description="Non-boolean mapping: 'on' / 'off', 1 / 0." />

## Custom slots (`indicator` / `icon` / default)

Three slots cover different granularities: `indicator` replaces the whole box
(tag / card styles), `icon` keeps the box and swaps only the tick glyph, and the
default slot renders rich label content. All three are scoped with the current
state.

Selecting and clearing are animated: the tick scales in on a spring curve while
the box fill spreads a soft halo ring (drawn with `box-shadow`, so it never
affects layout size). Animations are disabled under `prefers-reduced-motion`.

<Demo name="checkbox-web-custom" description="indicator tag / card styles + custom tick via icon slot + default slot scope." />
## API

### SnCheckbox Props

| Prop           | Type                                         | Default     | Notes                            |
| -------------- | -------------------------------------------- | ----------- | -------------------------------- |
| modelValue     | `boolean`                                    | `false`     | v-model                          |
| label          | `string`                                     | `''`        | Label text (label slot wins)     |
| value          | `SnCheckboxValue`                            | —           | Value inside a group             |
| disabled       | `boolean`                                    | `false`     | Disabled (ORs with group)        |
| readonly       | `boolean`                                    | `false`     | Read-only                        |
| indeterminate  | `boolean`                                    | `false`     | Mixed state (aria-checked=mixed) |
| size           | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | Size                             |
| checkedValue   | `SnCheckboxValue`                            | `true`      | Value when checked               |
| uncheckedValue | `SnCheckboxValue`                            | `false`     | Value when unchecked             |
| status         | `'default'\|'error'\|'warning'`              | `'default'` | Status                           |

### SnCheckboxGroup Props

| Prop       | Type                                              | Default    | Notes                |
| ---------- | ------------------------------------------------- | ---------- | -------------------- |
| modelValue | `SnCheckboxValue[]`                               | `[]`       | Array v-model        |
| options    | `Array<SnCheckboxGroupOption \| SnCheckboxValue>` | `[]`       | Declarative options  |
| disabled   | `boolean`                                         | `false`    | Group-level disabled |
| size       | same as above                                     | `'medium'` | Group size           |

See the component `ai-description.md` for the full contract.
