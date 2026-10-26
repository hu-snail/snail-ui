# SnComment — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end comment
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A comment block showing an avatar, author, datetime, body and an actions
row, with nested replies. Used for comment threads, Q&A replies, review
and changelog entries.

## Reference Library

**Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO
Comment component (verified against naive-ui `src/components.ts`). Per
the data-display batch plan, this component mirrors Arco Design Vue
`a-comment`
(https://www.arco.design/vue/component/comment — source
`arco-design-vue packages/web-vue/components/comment/comment.vue` +
`style/index.less`) instead.

## Import

```ts
import SnComment from '@snui/vue-web/src/comment/SnComment.vue';
```

## Props

| Name       | Type                                                                                 | Default     | Required | Description                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `author`   | `string`                                                                             | `undefined` | no       | Author name; the `author` slot overrides it.                                                                                                                       |
| `avatar`   | `string`                                                                             | `undefined` | no       | Avatar image URL (rendered 32px circle); the `avatar` slot overrides it.                                                                                           |
| `content`  | `string`                                                                             | `undefined` | no       | Comment body; the `content` slot overrides it.                                                                                                                     |
| `datetime` | `string`                                                                             | `undefined` | no       | Datetime text; the `datetime` slot overrides it.                                                                                                                   |
| `align`    | `'left' \| 'right' \| { datetime?: 'left' \| 'right'; actions?: 'left' \| 'right' }` | `'left'`    | no       | Row alignment. The string form applies to both the datetime row and the actions row; the object form overrides them separately (missing keys fall back to `left`). |

## Slots

| Name       | Params | Description                                 |
| ---------- | ------ | ------------------------------------------- |
| `avatar`   | `()`   | Avatar column content (overrides `avatar`). |
| `author`   | `()`   | Author name (overrides `author`).           |
| `datetime` | `()`   | Datetime text (overrides `datetime`).       |
| `content`  | `()`   | Comment body (overrides `content`).         |
| `actions`  | `()`   | Actions row (usually plain spans).          |
| `default`  | `()`   | Nested `<SnComment>` replies.               |

## Events

None — pure display component.

## Divergences from the reference API

- **Slot-wins precedence**: slots override same-name props. The Arco
  source renders the prop text when both are given; this repo's
  convention (SnThing and friends) is slot-wins, mandated by the batch
  brief.
- **Author typography**: Arco's less sets the author to
  `@font-size-body-3` (14px, no weight bump). Followed as-is (the batch
  brief's "16px 500" note does not match the verified Arco source).
- The reference `editor` demo requires Input / Button (not yet in this
  library) — registered as future work, no demo shipped.

## Layout contract

- Root is a nowrap flex row: avatar column + main column. Without an
  avatar prop/slot the avatar column is not rendered and the main column
  takes the full width.
- Main column = body (title row → content → actions) + nested container.
- Nested replies (`default` slot) render inside the main column, which
  indents them past the parent avatar. Sibling comments and the nested
  container get a 20px top margin (arco `@comment-margin-bottom`).
- `align.right` makes the title row `display: flex; justify-content:
space-between` (author left, datetime right) and the actions row
  `justify-content: flex-end`.
- An empty-string prop counts as absent (arco `hasPropOrSlot`
  truthiness), so it renders no area.

## Tokens Consumed (end: web)

| Token          | CSS Variable                    | Purpose          |
| -------------- | ------------------------------- | ---------------- |
| Text primary   | `--sn-web-color-text-primary`   | Comment body     |
| Text secondary | `--sn-web-color-text-secondary` | Author + actions |
| Text tertiary  | `--sn-web-color-text-tertiary`  | Datetime         |

Metrics (px, mirroring arco `comment/style/index.less` + design tokens):
avatar 32px circle, avatar margin-right 12px, author margin-right 8px,
actions margin-top 8px, action gap 8px, base font 14px / body-3,
datetime 12px / body-1, line-height 1.5715, sibling/nested rhythm 20px.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Data-display batch (Comment).
