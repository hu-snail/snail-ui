# Radio · Web

Radio built on a native `input[type=radio]` (arrow-key roaming via shared name), plus `SnRadioButton` and `SnRadioGroup`.

## Basic

<Demo name="radio-web-basic" description="v-model + checkedValue match." />

## Group (RadioGroup)

<Demo name="radio-web-group" description="Declarative options / slot children; shared name." />

## Button style (RadioButton)

<Demo name="radio-web-button" description="Border-merged segmented buttons." />

## Sizes

<Demo name="radio-web-sizes" description="mini / tiny / small / medium / large." />

## Disabled / readonly

<Demo name="radio-web-states" description="Group-level OR item-level disabled; readonly visual." />

## API

### SnRadio / SnRadioButton Props

| Prop         | Type                                         | Default     | Notes                                               |
| ------------ | -------------------------------------------- | ----------- | --------------------------------------------------- |
| checkedValue | `SnRadioValue \| null`                       | `null`      | Value this item represents (naive's `value`)        |
| modelValue   | `SnRadioValue \| null`                       | `null`      | Standalone binding; group value wins inside a group |
| label        | `string`                                     | `''`        | Label text (label slot wins)                        |
| name         | `string`                                     | —           | Native radio name (provided by group)               |
| disabled     | `boolean`                                    | `false`     | Disabled (ORs with group)                           |
| readonly     | `boolean`                                    | `false`     | Read-only visual                                    |
| size         | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | Size                                                |
| status       | `'default'\|'error'\|'warning'`              | `'default'` | Status                                              |

### SnRadioGroup Props

| Prop                     | Type                                   | Default | Notes                      |
| ------------------------ | -------------------------------------- | ------- | -------------------------- |
| modelValue               | `SnRadioValue \| null`                 | `null`  | v-model                    |
| options                  | `Array<SnRadioOption \| SnRadioValue>` | `[]`    | Declarative options        |
| name                     | `string`                               | —       | Shared native name         |
| button                   | `boolean`                              | `false` | Render children as buttons |
| disabled / size / status | —                                      | —       | Group-level cascade        |

See the component `ai-description.md` for the full contract.
