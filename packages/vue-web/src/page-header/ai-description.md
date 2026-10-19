# SnPageHeader — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end page header component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A page-level header bar: back control on the left, title + subtitle in
the middle, extra actions on the right, optional body content and a
footer separated by a top border.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-page-header` (https://www.naiveui.com/zh-CN/light/components/page-header).

## Import

```ts
import SnPageHeader from '@snui/vue-web/src/page-header/SnPageHeader.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `undefined` | no | Page title text; the `title` slot takes precedence. |
| `subtitle` | `string` | `undefined` | no | Subtitle under the title; the `subtitle` slot takes precedence. |
| `extra` | `string` | `undefined` | no | Right-side extra content; the `extra` slot takes precedence. |

## Events

| Name | Payload | Description |
|---|---|---|
| `back` | `(event: MouseEvent)` | Fired when the back control is activated. |

## Slots

| Name | Description |
|---|---|
| `header` | Replaces the whole header row. |
| `back` | Replaces the back control entirely. |
| `icon` | Replaces the back glyph inside the control. |
| `title` | Title content (wins over the `title` prop). |
| `subtitle` | Subtitle content (wins over the `subtitle` prop). |
| `extra` | Extra content (wins over the `extra` prop). |
| `footer` | Bottom area, separated by a top border. |
| `default` | Content between the header and the footer. |

## Divergences from the reference API

- The default back glyph is an inline chevron-left SVG
  (packages/vue-web carries no icon dependency); the `icon` slot
  replaces it.
- The back control is a real `<button aria-label="Back">` for keyboard
  + screen-reader access (the reference renders a plain clickable
  wrapper).
- Theme colors map to web tokens: title → text-primary, subtitle →
  text-tertiary, extra → text-secondary; title 16px / subtitle 12px.
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- Back control: `<button type="button" aria-label="Back">` — reachable
  by keyboard, visible focus ring.
- Title renders as a plain `div`; wrap the component in a heading
  element or add an `aria-level` heading upstream when the title is the
  page's main heading.
- Decorative back glyph is `aria-hidden="true"`.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-web-color-text-primary` | Title color |
| Text secondary | `--sn-web-color-text-secondary` | Back glyph / extra / footer color |
| Text tertiary | `--sn-web-color-text-tertiary` | Subtitle color |
| Background subtle | `--sn-web-color-background-subtle` | Back button hover background |
| Border subtle | `--sn-web-color-border-subtle` | Footer separator |
| Focus ring | `--sn-web-focus-ring` | Back button focus outline |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-027.
