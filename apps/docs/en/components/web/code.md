# Code · Web

Monospace code block with an optional line-number gutter, soft-wrap, inline
mode and built-in JSON token colors.

## Basic

<Demo name="code-web-basic" description="JSON token colors + plain languages." />

## Inline

<Demo name="code-web-inline" description="Inline code inside a sentence." />

## Word wrap

<Demo name="code-web-softwrap" description="Soft-wrap overflowing lines." />

## Line numbers

<Demo name="code-web-line-numbers" description="Gutter aligned with code rows." />

## Reactive code

<Demo name="code-web-loop-debug" description="code prop updates re-render tokens." />

## API

### SnCode Props

| Prop              | Type      | Default     | Notes                                                              |
| ----------------- | --------- | ----------- | ------------------------------------------------------------------ |
| code              | `string`  | `''`        | Source text                                                        |
| language          | `string`  | `undefined` | `json` tokenizes via the built-in highlighter; others render plain |
| trim              | `boolean` | `true`      | Trim whitespace on the highlighted path                            |
| inline            | `boolean` | `false`     | Inline rendering (no pre wrapper)                                  |
| word-wrap         | `boolean` | `false`     | Soft-wrap long lines                                               |
| show-line-numbers | `boolean` | `false`     | Line-number gutter (off when inline / word-wrap)                   |
| uri               | `boolean` | `false`     | Decode `code` as a URI component                                   |

Slots: `default` (custom code content). See the component `ai-description.md`
for the full contract.
