# Text · Web

Typography (n-text / n-title / n-paragraph aligned). Six-color types, depth scale, inline styles, code background.

## Basic

<Demo name="text-web-basic" description="Default text + six-color type." />

## Style modifiers

<Demo name="text-web-styles" description="strong / italic / underline / delete / code / disabled." />

## Depth scale

<Demo name="text-web-depth" description="depth='1'-'3' applies to the default type." />

## Title & paragraph

<Demo name="text-web-title" description="SnTitle levels 1-6; SnParagraph line-height presets." />

## API

### SnText Props

| Prop               | Type                                                          | Default     | Notes                                 |
| ------------------ | ------------------------------------------------------------- | ----------- | ------------------------------------- |
| type               | `'default'\|'primary'\|'info'\|'success'\|'warning'\|'error'` | `'default'` | Color semantics                       |
| depth              | `'1'\|'2'\|'3'`                                               | —           | Secondary scale (default type)        |
| strong / italic    | `boolean`                                                     | `false`     | Bold / italic                         |
| underline / delete | `boolean`                                                     | `false`     | Underline / strikethrough (stackable) |
| code               | `boolean`                                                     | `false`     | Inline code background                |
| disabled           | `boolean`                                                     | `false`     | Disabled color                        |
| tag                | `'span'\|'p'\|'blockquote'`                                   | `'span'`    | Rendered element                      |

### SnTitle / SnParagraph

SnTitle: `level` (1-6, 30/22/18/16/16/16px). SnParagraph: `spacing` ('tight'|'base'|'loose'). Both are thin wrappers of SnText.

See the component `ai-description.md` for the full contract.
