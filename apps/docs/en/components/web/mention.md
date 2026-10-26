# Mention · Web

Mention input. Typing `@` (customizable delimiter) opens a candidate panel; selection replaces the trigger word.

## Basic

<Demo name="mention-web-basic" description="@ opens candidates → filter → keyboard/click to replace." />

## textarea

<Demo name="mention-web-textarea" description="type='textarea' multi-line mentions." />

## Custom delimiter

<Demo name="mention-web-delimiter" description="delimiter='#' topic mentions." />

## Disabled / readonly

<Demo name="mention-web-states" description="disabled / readonly." />

## API

### SnMention Props

| Prop                | Type                                         | Default     | Notes                                                                   |
| ------------------- | -------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| modelValue          | `string`                                     | `''`        | v-model                                                                 |
| options             | `SnMentionRawOption[]`                       | `[]`        | Candidates (string or {label, value?, disabled?})                       |
| delimiter           | `string`                                     | `'@'`       | Trigger char (multi-char: last char triggers, full string written back) |
| placeholder         | `string`                                     | —           | Placeholder                                                             |
| disabled / readonly | `boolean`                                    | `false`     | Disabled / read-only                                                    |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | Size                                                                    |
| status              | `'default'\|'error'\|'warning'`              | `'default'` | Status                                                                  |
| type                | `'text'\|'textarea'`                         | `'text'`    | Input variant (textarea with rows)                                      |

Events: `update:modelValue` / `change` / `select({label, value})` / `focus` / `blur`; Slot: `empty`. Keyboard: ArrowUp/Down highlight, Enter/Tab select, Esc close.

See the component `ai-description.md` for the full contract.
