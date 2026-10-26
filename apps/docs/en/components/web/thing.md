# Thing · Web

Structured content block with avatar / header / extra / description /
content / footer / action areas.

## When to use

- Detail intros and notification cards with fixed info hierarchy
- List row bodies combining avatar + title + description + actions
- Avatar-indented content alignment

## Examples

### Basic

<Demo name="thing-web-basic" description="title / description / body + footer / action slots." />

### Indented content

<Demo name="thing-web-indent" description="content-indented aligns content under the header, with header-extra." />

## API

### SnThing Props

| Name              | Type                      | Default     | Notes                                                  |
| ----------------- | ------------------------- | ----------- | ------------------------------------------------------ |
| title             | `string`                  | `undefined` | Title; `header` slot overrides                         |
| title-extra       | `string`                  | `undefined` | Header trailing content; `header-extra` slot overrides |
| description       | `string`                  | `undefined` | Description; `description` slot overrides              |
| content           | `string`                  | `undefined` | Body; `default` slot overrides                         |
| content-indented  | `boolean`                 | `false`     | Move the avatar out and indent the content column      |
| description-class | `string`                  | `undefined` | Description class                                      |
| description-style | `string \| CSSProperties` | `undefined` | Description style                                      |
| content-class     | `string`                  | `undefined` | Content class                                          |
| content-style     | `string \| CSSProperties` | `undefined` | Content style                                          |

### SnThing Slots

| Name         | Params | Notes                                    |
| ------------ | ------ | ---------------------------------------- |
| default      | `()`   | Content body                             |
| avatar       | `()`   | Avatar area                              |
| header       | `()`   | Header, overrides `title`                |
| header-extra | `()`   | Header trailing, overrides `title-extra` |
| description  | `()`   | Description, overrides `description`     |
| footer       | `()`   | Footer area                              |
| action       | `()`   | Action area (button row)                 |

By default the avatar sits beside the header column; with
`content-indented` it leads the whole block instead.

See the component `ai-description.md` for the full contract.
