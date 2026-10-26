# Switch · Web

`role="switch"` + aria-checked; Enter / Space activation; checked / unchecked label slots.

## Basic

<Demo name="switch-web-basic" description="v-model binding." />

## Value mapping (checkedValue / uncheckedValue)

<Demo name="switch-web-values" description="Non-boolean values: 'on' / 'off', 1 / 0." />

## Sizes

<Demo name="switch-web-sizes" description="small / medium / large." />

## Disabled / readonly / loading

<Demo name="switch-web-states" description="disabled / readonly / loading spinner." />

## Rail slots (checked / unchecked)

<Demo name="switch-web-slots" description="Inline rail text per state." />

## API

### SnSwitch Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `boolean \| string \| number` | `false` | v-model |
| checkedValue | `boolean \| string \| number` | `true` | Checked value |
| uncheckedValue | `boolean \| string \| number` | `false` | Unchecked value |
| size | `'small'\|'medium'\|'large'` | `'medium'` | Size |
| disabled | `boolean` | `false` | Disabled |
| readonly | `boolean` | `false` | Read-only |
| loading | `boolean` | `false` | Loading (blocks toggling) |
| railStyle | `(info: { checked: boolean }) => StyleValue` | — | Rail style function |

### Slots

`checked` / `unchecked` (state-conditional) / `loading-icon`.

See the component `ai-description.md` for the full contract.
