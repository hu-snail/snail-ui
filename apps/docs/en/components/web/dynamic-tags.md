# DynamicTags · Web

Dynamic tags. Tag list + inline add input; Enter commits / Esc cancels / blur submits.

## Basic

<Demo name="dynamic-tags-web-basic" description="Add / remove tags with array v-model." />

## Add flow (keyboard)

<Demo name="dynamic-tags-web-flow" description="Enter commits and keeps typing; Esc cancels; blur submits." />

## max / closable

<Demo name="dynamic-tags-web-bounds" description="max hides the add button; closable=false hides removal." />

## Custom rendering (slots)

<Demo name="dynamic-tags-web-slots" description="tag / trigger / empty customization." />

## Disabled / readonly

<Demo name="dynamic-tags-web-states" description="disabled blocks interaction; readonly hides the add button." />

## API

### SnDynamicTags Props

| Prop                | Type                         | Default    | Notes                        |
| ------------------- | ---------------------------- | ---------- | ---------------------------- |
| modelValue          | `Array<string \| number>`    | `[]`       | v-model; emits a fresh array |
| closable            | `boolean`                    | `true`     | Tags removable               |
| disabled / readonly | `boolean`                    | `false`    | Disabled / read-only         |
| size                | `'small'\|'medium'\|'large'` | `'medium'` | Size                         |
| max                 | `number`                     | —          | Cap (hides add at limit)     |
| trigger             | `'click'\|'focus'`           | `'click'`  | How the input opens          |
| placeholder         | `string`                     | —          | Inline input placeholder     |

Events: `update:modelValue` / `change` / `add` / `remove` / `click` (on tag); Slots: `input` / `tag` (scoped `{ label, index }`) / `trigger` / `empty`.

See the component `ai-description.md` for the full contract.
