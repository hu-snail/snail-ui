# SnTag — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end tag component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A compact label for status / classification, with six semantic tints,
optional close button, and an optional selectable state.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-tag`
(https://www.naiveui.com/zh-CN/light/components/tag).

## Import

```ts
import SnTag from '@snui/vue-web/src/tag/SnTag.vue';
```

## Props

| Name        | Type                                                                    | Default     | Required | Description                                             |
| ----------- | ----------------------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------- |
| `type`      | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | no       | Semantic type — drives colors.                          |
| `size`      | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  | no       | Tag scale (22/28/34 px heights).                        |
| `round`     | `boolean`                                                               | `false`     | no       | Pill-shaped corners.                                    |
| `closable`  | `boolean`                                                               | `false`     | no       | Render the close button (inline SVG glyph).             |
| `disabled`  | `boolean`                                                               | `false`     | no       | Disabled interactions (no toggle, no close).            |
| `bordered`  | `boolean`                                                               | `true`      | no       | Draw the surrounding border.                            |
| `color`     | `string`                                                                | —           | no       | Custom background color; overrides the type background. |
| `checkable` | `boolean`                                                               | `false`     | no       | Click toggles the checked state.                        |
| `checked`   | `boolean`                                                               | `false`     | no       | Checked state (v-model:checked).                        |

## Events

| Name             | Parameters | Description                                            |
| ---------------- | ---------- | ------------------------------------------------------ |
| `close`          | —          | Close button clicked; the tag hides itself afterwards. |
| `update:checked` | `boolean`  | Checkable toggle — supports `v-model:checked`.         |

## Slots

| Name      | Description |
| --------- | ----------- |
| `default` | Tag label.  |

## Divergences from the reference API

- `color` is a plain background color string (the reference takes a
  `{ color, borderColor, textColor }` object).
- A close click hides the tag internally before emitting `close`.
- `size` has no `tiny` step; slots `avatar` / `close-icon` are not
  implemented.

## Accessibility

- Checkable tags expose `role="button"`, `aria-pressed`, `tabindex="0"` and
  toggle via Enter / Space.
- The close button is a real `<button>` with `aria-label="关闭"` and an
  inline SVG glyph.
- Disabled checkable tags are unfocusable and marked `aria-disabled`.

## Tokens Consumed (end: web)

| Token                                      | CSS Variable                                                       | Purpose                             |
| ------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------- |
| Text secondary / on-primary                | `--sn-web-color-text-secondary` / `--sn-web-color-text-on-primary` | Label colors                        |
| Action primary                             | `--sn-web-color-action-primary`                                    | `primary` tint + checked background |
| Feedback info / success / warning / danger | `--sn-web-color-feedback-*`                                        | Typed tints                         |
| Background surface / subtle                | `--sn-web-color-background-*`                                      | Tint base + default background      |
| Border default                             | `--sn-web-color-border-default`                                    | Default border                      |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DS-002.
