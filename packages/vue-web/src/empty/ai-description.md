# SnEmpty — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end empty-state
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

An empty-state placeholder: centered glyph + description + optional
extra action area. Used for no-data tables, empty lists, failed
searches.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-empty` (https://www.naiveui.com/zh-CN/light/components/empty).

## Import

```ts
import SnEmpty from '@snui/vue-web/src/empty/SnEmpty.vue';
```

## Props

| Name               | Type                                                 | Default     | Required | Description                                                          |
| ------------------ | ---------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------- |
| `description`      | `string`                                             | `undefined` | no       | Description text; falls back to `无数据` (`default` slot overrides). |
| `show-description` | `boolean`                                            | `true`      | no       | Render the description line.                                         |
| `show-icon`        | `boolean`                                            | `true`      | no       | Render the glyph (default inline SVG or `icon` slot).                |
| `size`             | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'`  | no       | Glyph + description scale (icon 28/34/40/46/52 px).                  |

## Slots

| Name      | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `default` | Replaces the description line.                                  |
| `extra`   | Additional content below the description (retry button, hint…). |
| `icon`    | Custom glyph — replaces the default inline SVG.                 |

## Events

None — pure display component.

## Divergences from the reference API

- The `render-icon` render-function prop is not implemented; use the
  `icon` slot.
- The description falls back to the fixed zh string `无数据` (the
  reference resolves it through its locale system).

## Accessibility

- The glyph container is `aria-hidden`; the default SVG carries
  `role="img"`.

## Tokens Consumed (end: web)

| Token          | CSS Variable                    | Purpose             |
| -------------- | ------------------------------- | ------------------- |
| Text disabled  | `--sn-web-color-text-disabled`  | Glyph + description |
| Text secondary | `--sn-web-color-text-secondary` | Extra area text     |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-006.
