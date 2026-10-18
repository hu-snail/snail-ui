# SnCode — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end code component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A monospace code block for displaying source code, with an optional
line-number gutter, soft-wrap, inline mode and URI-decoded input.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-code`
(https://www.naiveui.com/zh-CN/light/components/code).

## Import

```ts
import SnCode from '@snui/vue-web/src/code/SnCode.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `code` | `string` | `''` | no | Source code text. |
| `language` | `string` | `undefined` | no | Highlighter language. Only `json` tokenizes (built-in); other languages render plain monospace. |
| `trim` | `boolean` | `true` | no | Trim the displayed code on the highlighted (json) path. |
| `inline` | `boolean` | `false` | no | Inline (single-line) rendering without the `pre` wrapper. |
| `wordWrap` | `boolean` | `false` | no | Soft-wrap overflowing lines. |
| `showLineNumbers` | `boolean` | `false` | no | Show the line-number gutter (ignored when `inline` or `wordWrap`). |
| `uri` | `boolean` | `false` | no | Decode `code` as a URI component before display. |

## Slots

| Name | Description |
|---|---|
| `default` | Custom code content; replaces the rendered code (the gutter still follows `code`). |

## Divergences from the reference API

- `hljs` is not implemented (no new dependency): `language="json"` uses a
  built-in minimal JSON tokenizer (key / string / number / keyword / punct
  token classes); every other language renders plain. hljs integration is a
  future marker.
- `trim` applies only on the highlighted (json) path, mirroring the
  reference where trimming lives inside the hljs branch; the plain branch
  renders the raw string.
- Line numbers are counted from the displayed text (trim-applied on the
  json path) so gutter and code rows stay strictly aligned; the reference
  counts from the raw `code` prop.
- The `uri` decode falls back to the raw string on malformed input instead
  of throwing.

## Accessibility

- The root is a semantic `<code>` element.
- The line-number gutter is `aria-hidden="true"` and `user-select: none`.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-web-color-text-primary` | Base code color |
| Text tertiary | `--sn-web-color-text-tertiary` | Line-number gutter |
| Action primary | `--sn-web-color-action-primary` | JSON key token |
| Feedback success | `--sn-web-color-feedback-success` | JSON string token |
| Feedback warning | `--sn-web-color-feedback-warning` | JSON number token |
| Feedback info | `--sn-web-color-feedback-info` | JSON keyword token |
| Text secondary (+ color-mix) | `--sn-web-color-text-secondary` | JSON punctuation token |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-002.
