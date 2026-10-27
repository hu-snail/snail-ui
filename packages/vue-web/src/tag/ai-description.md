# SnTag — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end tag component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A compact label for status / classification, with six semantic tints,
special-shape variants, an optional close button, an optional selectable
state, a loading state, and n-tag `color` object support.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-tag`
(https://www.naiveui.com/zh-CN/light/components/tag).

Registered AUI-additive capabilities beyond the reference (AGENTS.md
§112.3a): `loading`, `shape`.

## Import

```ts
import SnTag from '@snui/vue-web/src/tag/SnTag.vue';
```

## Props

| Name        | Type                                                                     | Default     | Required | Description                                                                         |
| ----------- | ------------------------------------------------------------------------ | ----------- | -------- | ----------------------------------------------------------------------------------- |
| `type`      | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'`  | `'default'` | no       | Semantic type — drives colors.                                                      |
| `size`      | `'small' \| 'medium' \| 'large'`                                         | `'medium'`  | no       | Tag scale (22/28/34 px heights).                                                    |
| `shape`     | `'square' \| 'round' \| 'skew' \| 'ribbon' \| 'fold' \| 'ticket'`        | `'square'`  | no       | AUI additive. Special-shape variant; `round` is the capsule.                        |
| `round`     | `boolean`                                                                | `false`     | no       | Pill-shaped corners (sugar for `shape: 'round'`; `shape` wins when both are given). |
| `closable`  | `boolean`                                                                | `false`     | no       | Render the close button (inline SVG glyph, replaceable via `close-icon`).           |
| `loading`   | `boolean`                                                                | `false`     | no       | AUI additive. Inline spinner; blocks close + toggle while active; sets `aria-busy`. |
| `disabled`  | `boolean`                                                                | `false`     | no       | Disabled interactions (no toggle, no close).                                        |
| `bordered`  | `boolean`                                                                | `true`      | no       | Draw the surrounding border.                                                        |
| `color`     | `string \| { color?: string; borderColor?: string; textColor?: string }` | —           | no       | Custom colors; text color is auto-picked for contrast when `textColor` is omitted.  |
| `checkable` | `boolean`                                                                | `false`     | no       | Click toggles the checked state.                                                    |
| `checked`   | `boolean`                                                                | `false`     | no       | Checked state (v-model:checked). The checked background uses the type color.        |

## Events

| Name             | Parameters | Description                                            |
| ---------------- | ---------- | ------------------------------------------------------ |
| `close`          | —          | Close button clicked; the tag hides itself afterwards. |
| `update:checked` | `boolean`  | Checkable toggle — supports `v-model:checked`.         |

## Slots

| Name         | Description                                             |
| ------------ | ------------------------------------------------------- |
| `default`    | Tag label.                                              |
| `icon`       | Leading icon (replaced by the spinner while `loading`). |
| `avatar`     | Leading avatar, before the icon.                        |
| `close-icon` | Custom close glyph (default: inline `×` SVG).           |

## Divergences from the reference API

- A close click hides the tag internally before emitting `close`.
- `size` has no `tiny` step.
- `shape` / `loading` are AUI additions (registered in AGENTS.md §112.3a).

## Accessibility

- Checkable tags expose `role="button"`, `aria-pressed`, `tabindex="0"` and
  toggle via Enter / Space.
- Loading tags set `aria-busy="true"` and are unfocusable while loading.
- The close button is a real `<button>` with `aria-label="关闭"` and an
  inline SVG glyph (disabled while `disabled` or `loading`).
- Disabled checkable tags are unfocusable and marked `aria-disabled`.

## Tokens Consumed (end: web)

| Token                                      | CSS Variable                                                       | Purpose                             |
| ------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------- |
| Text secondary / on-primary                | `--sn-web-color-text-secondary` / `--sn-web-color-text-on-primary` | Label colors + custom-color text    |
| Action primary                             | `--sn-web-color-action-primary`                                    | `primary` tint + checked background |
| Feedback info / success / warning / danger | `--sn-web-color-feedback-*`                                        | Typed tints + checked backgrounds   |
| Background surface / subtle                | `--sn-web-color-background-*`                                      | Tint base + default background      |
| Border default                             | `--sn-web-color-border-default`                                    | Default border                      |

Component-local custom properties (not tokens): `--sn-tag-contrast-text-dark`
(color-mix black 88%), `--sn-tag-notch` (ticket notch radius per size).

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DS-002.
