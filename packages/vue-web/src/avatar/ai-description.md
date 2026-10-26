# SnAvatar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end avatar component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A circular / rounded box for a user or entity: image, text thumbnail, icon,
or custom content — with a deterministic fallback chain.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-avatar` (https://www.naiveui.com/zh-CN/light/components/avatar).

## Import

```ts
import SnAvatar from '@snui/vue-web/src/avatar/SnAvatar.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `size` | `number \| 'small' \| 'medium' \| 'large'` | `'medium'` | no | Pixel size (inline style) or named scale (28/34/40 px). |
| `src` | `string` | — | no | Image URL. |
| `color` | `string` | — | no | Background color (any CSS color value). |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` | no | Image fit inside the box. |
| `round` | `boolean` | `false` | no | Pill-shaped corners. |
| `circle` | `boolean` | `false` | no | Circular. Wins over `round`. |
| `fallbackText` | `string` | — | no | Text thumbnail when there is no image. |
| `icon` | `string` | — | no | SnIcon registry name for the placeholder glyph. |

## Events

| Name | Parameters | Description |
|---|---|---|
| `error` | `Event` | Image failed to load (the fallback chain takes over). |

## Slots

| Name | Description |
|---|---|
| `default` | Custom content — shown when there is no image. |
| `icon` | Placeholder glyph — replaces `icon` / the builtin person SVG. |

## Fallback chain

When no image renders (missing `src`, or a load error):

```text
default slot → fallbackText → icon (slot / prop) → builtin person SVG
```

A new `src` resets a previous load error.

## Divergences from the reference API

- `fallbackText` / `icon` replace `fallbackSrc` + `renderFallback`.
- `lazy` / `imgProps` / intersection-observer options are not implemented.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-web-color-text-primary` | Fallback text / glyph color |
| Background subtle | `--sn-web-color-background-subtle` | Default background |

## Accessibility

- The builtin glyph and SnIcon glyph are `aria-hidden`.
- `fallbackText` renders as real text and is read by screen readers.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DS-001.
