# SnText / SnTitle / SnParagraph — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end typography family.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Inline text with semantic color / emphasis variants (`SnText`), section
headings on the h1-h6 scale (`SnTitle`), and body paragraphs with a
line-height scale (`SnParagraph`). Pure display; no interaction.

## Reference Library

Per AGENTS.md §112, this family's API surface mirrors naive-ui `n-text` /
`n-title` / `n-paragraph`
(https://www.naiveui.com/zh-CN/light/components/typography).

## Import

```ts
import { SnText } from '@snui/vue-web/src/text/SnText.vue';
import SnTitle from '@snui/vue-web/src/text/SnTitle.vue';
import SnParagraph from '@snui/vue-web/src/text/SnParagraph.vue';
```

## SnText Props

| Name          | Type                                                                    | Default     | Required | Description                                          |
| ------------- | ----------------------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------- |
| `type`        | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | no       | Semantic type — drives the text color.               |
| `depth`       | `'1' \| '2' \| '3'`                                                     | —           | no       | Gray scale; only applied for `type="default"`.       |
| `strong`      | `boolean`                                                               | `false`     | no       | Bolder text.                                         |
| `italic`      | `boolean`                                                               | `false`     | no       | Italic text.                                         |
| `underline`   | `boolean`                                                               | `false`     | no       | Underlined text.                                     |
| `delete`      | `boolean`                                                               | `false`     | no       | Strike-through text. Combines with `underline`.      |
| `code`        | `boolean`                                                               | `false`     | no       | Inline-code styling (mono font + subtle background). |
| `disabled`    | `boolean`                                                               | `false`     | no       | Greyed-out text with a not-allowed cursor.           |
| `tag`         | `'h1'…'h6' \| 'p' \| 'span' \| 'blockquote'`                            | `'span'`    | no       | Rendered element.                                    |
| `customClass` | `string`                                                                | `''`        | no       | Extra class merged onto the rendered element.        |
| `customStyle` | `string \| CSSProperties`                                               | —           | no       | Inline style merged onto the rendered element.       |

## SnTitle Props

| Name                                                            | Type           | Default | Required | Description                                                              |
| --------------------------------------------------------------- | -------------- | ------- | -------- | ------------------------------------------------------------------------ |
| `level`                                                         | `1…6`          | `1`     | no       | Heading level — renders `<h1>…<h6>` at 30/22/18/16/16/16 px, weight 500. |
| `type` / `depth` / `strong` / `italic` / `underline` / `delete` | same as SnText | —       | no       | Forwarded to SnText.                                                     |

## SnParagraph Props

| Name                                                            | Type                           | Default  | Required | Description                         |
| --------------------------------------------------------------- | ------------------------------ | -------- | -------- | ----------------------------------- |
| `spacing`                                                       | `'tight' \| 'base' \| 'loose'` | `'base'` | no       | Line-height scale: 1.4 / 1.6 / 1.8. |
| `type` / `depth` / `strong` / `italic` / `underline` / `delete` | same as SnText                 | —        | no       | Forwarded to SnText.                |

## Slots

| Name      | Description                          |
| --------- | ------------------------------------ |
| `default` | Text content (all three components). |

## Divergences from the reference API

- No outer margins: vertical rhythm is owned by the page layout.
- `disabled` / `customClass` / `customStyle` are added per the component
  task spec.
- Emphasis styling is applied to a single root element (the reference nests
  semantic `<strong>` / `<del>` wrappers).
- `keyboard` and the deprecated `as` alias are not implemented.

## Tokens Consumed (end: web)

| Token                                          | CSS Variable                       | Purpose                           |
| ---------------------------------------------- | ---------------------------------- | --------------------------------- |
| Text primary / secondary / tertiary / disabled | `--sn-web-color-text-*`            | Default + depth + disabled colors |
| Action primary                                 | `--sn-web-color-action-primary`    | `type="primary"` color            |
| Feedback info / success / warning / danger     | `--sn-web-color-feedback-*`        | Typed colors                      |
| Background subtle                              | `--sn-web-color-background-subtle` | `code` background                 |

## Accessibility

- Semantic elements via `tag` (`<h1>`-`<h6>`, `<p>`, `<blockquote>`) keep
  the document outline intact.
- `disabled` is visual-only (plain text carries no interactive role).

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of the web typography family
(AUI-WEB-TY-001/002/003).
