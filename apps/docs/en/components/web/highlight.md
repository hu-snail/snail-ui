# Highlight · Web

Highlights matched keywords inside plain text with a configurable element.

## Basic

<Demo name="highlight-web-basic" description="Multiple patterns rendered as marks." />

## Custom style

<Demo name="highlight-web-style" description="highlight-style with design tokens." />

## Case sensitive

<Demo name="highlight-web-case-sensitive" description="case-sensitive on vs. off." />

## Custom tag

<Demo name="highlight-web-component" description="highlight-tag=span + underline style." />

## API

### SnHighlight Props

| Prop            | Type               | Default     | Notes                                   |
| --------------- | ------------------ | ----------- | --------------------------------------- |
| text            | `string`           | `undefined` | Full text                               |
| patterns        | `string[]`         | `[]`        | Substrings to highlight                 |
| highlight-tag   | `string`           | `'mark'`    | Element for matched fragments           |
| case-sensitive  | `boolean`          | `false`     | Case-sensitive matching                 |
| auto-escape     | `boolean`          | `true`      | Escape regex metacharacters in patterns |
| highlight-class | `string`           | `undefined` | Class merged onto matches               |
| highlight-style | `object \| string` | `undefined` | Inline style merged onto matches        |

See the component `ai-description.md` for the full contract.
