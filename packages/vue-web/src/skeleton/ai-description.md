# SnSkeleton — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end skeleton component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Placeholder block shown while content loads. One tag covers the common
shapes:

- **Line** — `text` inlines it at `-0.125em` so it drops into a line of prose.
- **Block** — default `display: block`, filling the given width.
- **Avatar** — `circle` squares the footprint and rounds it to `50%`.
- **Paragraph** — `repeat` renders N sibling blocks.

Decorative by design: every block is `aria-hidden="true"`.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-skeleton` (https://www.naiveui.com/zh-CN/light/components/skeleton).

## Import

```ts
import { SnSkeleton } from '@snui/vue-web';
```

## Usage

```vue
<!-- Single line placeholder -->
<SnSkeleton height="1em" width="60%" />

<!-- Avatar + two text lines -->
<SnSkeleton circle :height="48" />
<SnSkeleton repeat="2" height="1em" />

<!-- Inline inside a heading -->
<h1>标题<SnSkeleton text width="4em" /></h1>

<!-- Squared-off (uses the token radius instead of hard corners) -->
<SnSkeleton :sharp="false" height="32px" />
```

## Props

| Name       | Type                             | Default     | Description                                         |
| ---------- | -------------------------------- | ----------- | --------------------------------------------------- |
| `text`     | `boolean`                        | `false`     | Inline-block with a `-0.125em` baseline shift       |
| `round`    | `boolean`                        | `false`     | Pill ends (`4096px`)                                |
| `circle`   | `boolean`                        | `false`     | Square footprint + `border-radius: 50%`             |
| `height`   | `string \| number`               | `undefined` | Number is px; CSS lengths pass through              |
| `width`    | `string \| number`               | `undefined` | Number is px; CSS lengths pass through              |
| `size`     | `'small' \| 'medium' \| 'large'` | `undefined` | Height tier, used when no explicit size is given    |
| `repeat`   | `number`                         | `1`         | Number of sibling blocks                            |
| `animated` | `boolean`                        | `true`      | Run the shimmer animation                           |
| `sharp`    | `boolean`                        | `true`      | Keep square corners; `false` reads the token radius |

### Size resolution

Applied in this order, first match wins:

1. `circle` squares the footprint — an explicit `width` becomes the height
   too, and vice versa (width wins when both are given).
2. An explicit `width` / `height` is used as given.
3. The `size` tier height fills in whatever is still missing.

With none of the three, no inline size is emitted and the stylesheet's
`1em` height / `100%` width apply.

### Border radius

`circle` → `50%`, else `round` → `4096px`, else `sharp` → leave it to the
stylesheet, else the `--sn-web-skeleton-radius` token.

## Tokens

| Token                                                   | Description                     |
| ------------------------------------------------------- | ------------------------------- |
| `--sn-web-skeleton-color`                               | Base fill colour                |
| `--sn-web-skeleton-color-end`                           | Shimmer peak colour             |
| `--sn-web-skeleton-radius`                              | Radius used when `sharp` is off |
| `--sn-web-skeleton-height-small` / `-medium` / `-large` | Size tier heights               |

## Accessibility

- Blocks carry `aria-hidden="true"` so screen readers skip the placeholder.
- No `role` — a skeleton conveys "not loaded yet" through layout, and the real
  content's own semantics take over once it mounts.
- No `prefers-reduced-motion` guard on the shimmer: the animation is a
  background-colour fade rather than movement, and `animated: false` is the
  explicit opt-out.

## Related

- `SnLoading` — blocking overlay for an in-flight request, rather than a
  placeholder for not-yet-arrived content.
- `SnCard` — commonly the container being skeletonised.
