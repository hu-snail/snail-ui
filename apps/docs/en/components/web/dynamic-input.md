# DynamicInput · Web

Dynamic input rows. Array v-model with per-row editing and + / − controls; slots for object rows.

## Basic

<Demo name="dynamic-input-web-basic" description="String array; per-row input + add/remove." />

## Custom creation (preset / onCreate)

<Demo name="dynamic-input-web-preset" description="preset factory creates new rows; onCreate refines." />

## Object rows (slot)

<Demo name="dynamic-input-web-slot" description="default slot scoped { value, index }." />

## min / max bounds

<Demo name="dynamic-input-web-bounds" description="Buttons hidden at bounds." />

## Disabled / readonly

<Demo name="dynamic-input-web-states" description="disabled blocks interaction; readonly freezes rows." />

## API

### SnDynamicInput Props

| Prop                | Type                                                         | Default      | Notes                        |
| ------------------- | ------------------------------------------------------------ | ------------ | ---------------------------- |
| modelValue          | `Array<string \| number \| Record<string, unknown> \| null>` | `[]`         | v-model; emits a fresh array |
| preset              | `() => unknown`                                              | `() => null` | New-row factory              |
| onCreate            | `(value, index) => unknown`                                  | —            | Refine after preset          |
| min / max           | `number`                                                     | —            | Row-count bounds             |
| disabled / readonly | `boolean`                                                    | `false`      | Disabled / read-only         |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                 | `'medium'`   | Size                         |
| status              | `'default'\|'error'\|'warning'`                              | `'default'`  | Status (cascades to rows)    |

Slot: `default` (scoped `{ value, index }`; required for object rows). Note: rows are keyed by index — focus may not migrate on adjacent-row insertion (naive uses internal ids); see ai-description.md.

See the component `ai-description.md` for the full contract.
