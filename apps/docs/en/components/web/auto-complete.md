# AutoComplete · Web

Autocomplete input. Candidates on typing, keyboard selection, per-segment highlight.

## Basic

<Demo name="auto-complete-web-basic" description="options + v-model." />

## Highlight (nested label)

<Demo name="auto-complete-web-highlight" description="label arrays render with matched segments highlighted." />

## Keyboard selection

<Demo name="auto-complete-web-keyboard" description="ArrowUp/Down + Enter + Esc." />

## Dynamic candidates (getShow)

<Demo name="auto-complete-web-getshow" description="Compute candidates from input." />

## blurAfterSelect / clearable / disabled

<Demo name="auto-complete-web-states" description="Blur after select, clear, disabled." />

## API

### SnAutoComplete Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `string` | `''` | v-model |
| options | `Array<string \| SnAutoCompleteOption>` | `[]` | Candidates (label may be an array for highlight) |
| placeholder | `string` | — | Placeholder |
| clearable | `boolean` | `false` | Clear button |
| disabled / readonly | `boolean` | `false` | Disabled / read-only |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | Size |
| status | `'default'\|'error'\|'warning'` | `'default'` | Status |
| blurAfterSelect | `boolean` | `false` | Blur after selecting |
| getShow | `(value: string) => SnAutoCompleteRawOption[]` | — | Dynamic candidates |

Events: `update:modelValue` / `change` / `select` / `focus` / `blur` / `search`; Slot: `empty`. ARIA: combobox + listbox + aria-activedescendant.

See the component `ai-description.md` for the full contract.
