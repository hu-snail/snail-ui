# SnThing — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end thing component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A structured content block with named areas — avatar, header (+ extra),
description, content, footer, action. Used for detail intros, list-row
bodies, notification cards.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-thing` (https://www.naiveui.com/zh-CN/light/components/thing).

## Import

```ts
import SnThing from '@snui/vue-web/src/thing/SnThing.vue';
```

## Props

| Name                | Type                      | Default     | Required | Description                                              |
| ------------------- | ------------------------- | ----------- | -------- | -------------------------------------------------------- |
| `title`             | `string`                  | `undefined` | no       | Title text (`header` slot overrides).                    |
| `title-extra`       | `string`                  | `undefined` | no       | Header trailing content (`header-extra` slot overrides). |
| `description`       | `string`                  | `undefined` | no       | Description text (`description` slot overrides).         |
| `content`           | `string`                  | `undefined` | no       | Content text (`default` slot overrides).                 |
| `content-indented`  | `boolean`                 | `false`     | no       | Move the avatar out and indent the whole content column. |
| `description-class` | `string`                  | `undefined` | no       | Class on the description block.                          |
| `description-style` | `string \| CSSProperties` | `undefined` | no       | Style on the description block.                          |
| `content-class`     | `string`                  | `undefined` | no       | Class on the content block.                              |
| `content-style`     | `string \| CSSProperties` | `undefined` | no       | Style on the content block.                              |

## Slots

| Name           | Description                                     |
| -------------- | ----------------------------------------------- |
| `default`      | Content body.                                   |
| `avatar`       | Avatar area.                                    |
| `header`       | Header (overrides `title`).                     |
| `header-extra` | Header trailing area (overrides `title-extra`). |
| `description`  | Description (overrides `description`).          |
| `footer`       | Footer area.                                    |
| `action`       | Action area (typically a button row).           |

## Events

None — pure layout component.

## Divergences from the reference API

None — props and slots are 1:1; the structural behavior (avatar beside
the header column by default, outside when `content-indented`) mirrors
the reference.

## Tokens Consumed (end: web)

| Token          | CSS Variable                    | Purpose    |
| -------------- | ------------------------------- | ---------- |
| Text primary   | `--sn-web-color-text-primary`   | Title text |
| Text secondary | `--sn-web-color-text-secondary` | Body text  |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-018.
