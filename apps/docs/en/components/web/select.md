# Select · Web

Teleport dropdown with viewport flipping; single / multiple / filterable / grouped / remote search.

## Basic

<Demo name="select-web-basic" description="options + v-model single select." />

## Multiple

<Demo name="select-web-multiple" description="Array v-model + tag removal + maxTagCount." />

## Filterable

<Demo name="select-web-filterable" description="Type to filter; custom filter supported." />

## Groups (children)

<Demo name="select-web-group" description="children render as group titles." />

## Custom fields (labelField / valueField)

<Demo name="select-web-fields" description="Non-label/value field mapping." />

## Clearable / disabled / loading

<Demo name="select-web-states" description="clearable, disabled, loading." />

## API

### SnSelect Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `SnSelectValue \| SnSelectValue[] \| null` | `null` | v-model (array when multiple) |
| multiple | `boolean` | `false` | Multi-select |
| options | `Array<SnSelectOptionInput>` | `[]` | Options (bare values or objects; children group) |
| labelField / valueField | `string` | `'label'` / `'value'` | Field mapping |
| placeholder | `string` | — | Placeholder |
| clearable | `boolean` | `false` | Clear button |
| filterable | `boolean` | `false` | Type-to-filter |
| filter | `(pattern, option) => boolean` | built-in contains | Custom filter |
| disabled / readonly | `boolean` | `false` | Disabled / read-only |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | Size |
| status | `'default'\|'error'\|'warning'` | `'default'` | Status |
| maxTagCount | `number` | — | Multi-select tag cap |
| tag | `boolean` | `false` | Pill-style tags |
| loading | `boolean` | `false` | Dropdown loading |
| remote | `boolean` | `false` | Remote search (with loading + search event) |

Events: `update:modelValue` / `change` / `search` / `clear` / `focus` / `blur`; Slots: `action` / `empty` / `header`. Keyboard: Enter / Space / ArrowUp / ArrowDown / Esc / Backspace (remove last in multiple). ARIA: listbox + aria-expanded + aria-activedescendant.

See the component `ai-description.md` for the full contract.
