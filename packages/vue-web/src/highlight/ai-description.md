# SnHighlight — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end highlight component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Renders a text string with matched substrings wrapped in a configurable
element (default `<mark>`), for search-result or keyword emphasis inside
plain text.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-highlight` (https://www.naiveui.com/zh-CN/light/components/highlight).

## Import

```ts
import SnHighlight from '@snui/vue-web/src/highlight/SnHighlight.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `text` | `string` | `undefined` | no | Full text to render. |
| `patterns` | `string[]` | `[]` | no | Substrings to highlight. |
| `highlightTag` | `string` | `'mark'` | no | HTML element used for matched fragments. |
| `caseSensitive` | `boolean` | `false` | no | Case-sensitive matching. |
| `autoEscape` | `boolean` | `true` | no | Escape regex metacharacters in `patterns` so they match literally. |
| `highlightClass` | `string` | `undefined` | no | Extra class merged onto matched fragments. |
| `highlightStyle` | `CSSProperties \| string` | `undefined` | no | Inline style merged onto matched fragments. |

## Divergences from the reference API

- None functional. The split-and-mark algorithm mirrors the reference util
  exactly: one `matchAll` pass over `('p1|p2|…')` with `g`/`gi` flags, so
  matches are left-to-right and non-overlapping; an empty `patterns` array
  or empty `text` renders the plain text only.

## Behavior notes

- Matching is case-insensitive unless `case-sensitive` is set.
- With `auto-escape: false`, patterns are treated as regex fragments (the
  reference docs warn: don't change this unless you understand it).
- Matched fragments carry the `sn-highlight__mark` class plus
  `highlight-class`; unmatched text renders as plain text nodes.

## Accessibility

- Renders inline text content only; matched fragments use the author-provided
  element (default `<mark>`, which assistive tech reads as highlighted text).

## Tokens Consumed (end: web)

None by default — the mark keeps the browser default `<mark>` appearance
(parity with the reference, which ships no mark styles). Consumers theme the
mark via `highlight-style` / `highlight-class`; use `--sn-web-*` variables in
those overrides.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-009.
