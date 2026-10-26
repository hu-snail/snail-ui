# sn-tag — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tag component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-tag`, prop surface mirrored 1:1.

## Purpose

Compact label / chip for mobile and miniprogram. Carries a short piece of
metadata — a status word, a category, a filter that was applied. Ten semantic
colours, five visual variants, five sizes, optional close button, optional
inline "new tag" input.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-tag>标签</sn-tag>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnTag } from '@snui/uni/components/sn-tag/sn-tag.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `size` | `'small' \| 'medium' \| 'large' \| 'extra-large' \| 'default'` | `'default'` | no | Tag scale. Drives padding + font size. |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'volcano' \| 'lightblue' \| 'cyan' \| 'pink' \| 'purple'` | `'default'` | no | Semantic colour family. |
| `icon` | `string` | `''` | no | Left icon name, resolved through `registerSnIcons()`. |
| `iconPrefix` | `string` | `''` | no | Iconfont class prefix used when `cssIcon` is on. |
| `cssIcon` | `boolean \| string` | `false` | no | Render a font icon instead of an SVG one; a string is the class prefix. |
| `closable` | `boolean` | `false` | no | Render the close button and emit `close` on tap. |
| `dynamic` | `boolean` | `false` | no | Render an inline input; confirm emits `confirm`. |
| `color` | `string` | `''` | no | Inline text-colour override. |
| `bgColor` | `string` | `''` | no | Inline background + border-colour override. |
| `round` | `boolean` | `false` | no | Pill shape. |
| `mark` | `boolean` | `false` | no | Marker shape (asymmetric corners). |
| `variant` | `'light' \| 'dark' \| 'plain' \| 'dashed' \| 'text'` | `'dark'` | no | Fill / border treatment. |
| `customClass` | `string` | `''` | no | Extra class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style appended to the root node. |

## Events

| Name | Payload | Description |
|---|---|---|
| `click` | `Event` | Tapped anywhere on the tag. |
| `close` | `Event` | Close button tapped. Does not bubble into `click`. |
| `confirm` | `{ value: string }` | Inline input confirmed (`dynamic` mode only). |

## Slots

| Name | Description |
|---|---|
| `default` | Tag label. |
| `icon` | Custom icon; overrides the `icon` prop. |
| `add` | Custom "new tag" content, rendered when `dynamic` is true. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Action primary (+ soft) | `--sn-mp-color-action-primary`, `--sn-mp-color-action-primary-soft` | `primary` type fill / tint |
| Feedback success (+ soft) | `--sn-mp-color-feedback-success`, `--sn-mp-color-feedback-success-soft` | `success` type |
| Feedback warning (+ soft) | `--sn-mp-color-feedback-warning`, `--sn-mp-color-feedback-warning-soft` | `warning` type |
| Feedback danger (+ soft) | `--sn-mp-color-feedback-danger`, `--sn-mp-color-feedback-danger-soft` | `danger` type |
| Feedback info | `--sn-mp-color-feedback-info` | `default` type fill |
| Volcano / lightblue / cyan / pink / purple (+ soft) | `--sn-mp-color-{volcano,lightblue,cyan,pink,purple}` and `-soft` | The five extra type hues |
| Background subtle | `--sn-mp-color-background-subtle` | `default` type tint |
| Text on primary | `--sn-mp-color-text-on-primary` | Filled-variant label |
| Text secondary | `--sn-mp-color-text-secondary` | `default` type accent |
| Font size / weight | `--sn-mp-font-size-{xs,sm,md,lg}`, `--sn-mp-font-weight-bold` | Label typography |
| Radius / spacing | `--sn-mp-radius-{sm,md,lg,full}`, `--sn-mp-spacing-1` | Shape + icon gap |

## Accessibility

- Root carries `role="button"` because the tag is tappable in every variant.
- The close control is its own `role="button"` with `aria-label="Close"`, so
  assistive tech reaches it without triggering the tag action.
- Font icons render inside `aria-hidden="true"` — the label carries the meaning.
- Mobile only: interaction is `tap`; there is no keyboard focus on miniprogram.

## Versioning

`@snui/uni@0.1.0` — initial release. Display-family component (AUI-MP-DS-001).
