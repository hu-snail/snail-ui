# SnLink — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end link component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A themed text link: renders an `<a>` (or a custom tag) with semantic
status colors, hover underline, disabled state, and an optional leading
icon.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-a` (https://www.naiveui.com/zh-CN/light/components/a).

## Import

```ts
import SnLink from '@snui/vue-web/src/link/SnLink.vue';
```

## Props

| Name        | Type                                                                    | Default     | Required | Description                                                      |
| ----------- | ----------------------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------- |
| `href`      | `string`                                                                | `undefined` | no       | Navigation target (only rendered on `tag='a'`).                  |
| `target`    | `string`                                                                | `undefined` | no       | Browsing context (`_blank`, …).                                  |
| `rel`       | `string`                                                                | `undefined` | no       | Relationship metadata for the target.                            |
| `type`      | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | no       | Visual type — drives the text color.                             |
| `disabled`  | `boolean`                                                               | `false`     | no       | Blocks clicks + navigation, sets `aria-disabled="true"`.         |
| `underline` | `boolean`                                                               | `false`     | no       | `true` underlines permanently; `false` underlines on hover only. |
| `tag`       | `string`                                                                | `'a'`       | no       | Element to render as the root.                                   |

## Events

| Name    | Payload               | Description                                       |
| ------- | --------------------- | ------------------------------------------------- |
| `click` | `(event: MouseEvent)` | Fired on activation; suppressed while `disabled`. |

## Slots

| Name      | Description   |
| --------- | ------------- |
| `default` | Link text.    |
| `icon`    | Leading icon. |

## Divergences from the reference API

- The reference exposes `size`; not implemented here (font size is
  inherited from the surrounding text).
- Type colors map to web tokens: primary → action-primary, info /
  success / warning → feedback-*, error → feedback-danger, default →
  text-primary. Hover darkening uses the two `-hover` tokens where they
  exist (primary, error) and an opacity step otherwise.
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- `disabled` sets `aria-disabled="true"`, suppresses `click`, and drops
  `href` so the link leaves the navigation order semantics.
- Non-anchor tags (`tag='span'`) keep click semantics but lose link
  semantics — provide an explicit role upstream when it acts as a link.
- Focus styling follows the browser default on anchors; wrap with a
  focus-visible style in the consuming app if needed.

## Tokens Consumed (end: web)

| Token                             | CSS Variable                             | Purpose              |
| --------------------------------- | ---------------------------------------- | -------------------- |
| Text primary                      | `--sn-web-color-text-primary`            | Default type color   |
| Action primary (+ hover)          | `--sn-web-color-action-primary(-hover)`  | Primary type color   |
| Feedback info / success / warning | `--sn-web-color-feedback-*`              | Matching type colors |
| Feedback danger (+ hover)         | `--sn-web-color-feedback-danger(-hover)` | Error type color     |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-028.
