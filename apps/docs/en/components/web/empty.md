# Empty · Web

Centered empty-state placeholder: glyph + description + optional extra
action area.

## When to use

- No-data placeholders for tables and lists
- Empty search / filter results
- Empty states with a retry or guidance action

## Examples

### Basic

<Demo name="empty-web-basic" description="Default inline SVG glyph + no-data description." />

### Custom icon & action

<Demo name="empty-web-icon" description="icon slot replaces the glyph; extra slot holds actions." />

### Size

<Demo name="empty-web-size" description="size: tiny / small / medium / large / huge." />

## API

### SnEmpty Props

| Name             | Type                                                 | Default     | Notes                                                                  |
| ---------------- | ---------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| description      | `string`                                             | `undefined` | Description text; falls back to no-data copy; `default` slot overrides |
| show-description | `boolean`                                            | `true`      | Render the description line                                            |
| show-icon        | `boolean`                                            | `true`      | Render the glyph                                                       |
| size             | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'`  | Glyph scale (28 / 34 / 40 / 46 / 52px)                                 |

### SnEmpty Slots

| Name    | Params | Notes                                         |
| ------- | ------ | --------------------------------------------- |
| default | `()`   | Replaces the description                      |
| extra   | `()`   | Content below the description                 |
| icon    | `()`   | Custom glyph, replaces the default inline SVG |

See the component `ai-description.md` for the full contract.
