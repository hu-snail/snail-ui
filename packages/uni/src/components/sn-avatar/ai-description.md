# sn-avatar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-avatar component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-avatar`, single-avatar prop
> surface mirrored 1:1. The group-only props (`max-count` / `cascading` /
> `collapse-avatar` / `vertical`) belong to the sibling group component and are
> intentionally absent here.

## Purpose

Identity thumbnail for a person or an entity. Three content layers — image,
initials, icon — with a documented fallback chain so a broken image URL
degrades instead of leaving a hole in the layout.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-avatar src="/static/a.png" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnAvatar } from '@snui/uni/components/sn-avatar/sn-avatar.vue';
```

## Props

| Name          | Type                          | Default        | Required | Description                                                                          |
| ------------- | ----------------------------- | -------------- | -------- | ------------------------------------------------------------------------------------ |
| `src`         | `string`                      | `''`           | no       | Image URL. Failure falls back to `alt` → `text` → `icon`.                            |
| `text`        | `string`                      | `''`           | no       | Initials / short label.                                                              |
| `icon`        | `string`                      | `''`           | no       | Icon name, resolved through `registerSnIcons()`.                                     |
| `iconPrefix`  | `string`                      | `''`           | no       | Iconfont class prefix used when `cssIcon` is on.                                     |
| `cssIcon`     | `boolean \| string`           | `false`        | no       | Render a font icon instead of an SVG one.                                            |
| `size`        | `string \| number`            | `'normal'`     | no       | Preset (`large` / `medium` / `normal` / `small`) or a custom length. A number is px. |
| `shape`       | `'round' \| 'square'`         | `'round'`      | no       | Outline.                                                                             |
| `bgColor`     | `string`                      | `''`           | no       | Inline background override.                                                          |
| `color`       | `string`                      | `''`           | no       | Inline text / icon colour override.                                                  |
| `alt`         | `string`                      | `''`           | no       | Placeholder label used when the image fails.                                         |
| `mode`        | `string`                      | `'aspectFill'` | no       | uni-app `<image>` fill mode, forwarded verbatim.                                     |
| `status`      | `'online' \| 'offline' \| ''` | `''`           | no       | AUI-additive presence dot (§112.3a); announced through `aria-label`.                 |
| `customClass` | `string`                      | `''`           | no       | Extra class on the root node.                                                        |
| `customStyle` | `string`                      | `''`           | no       | Inline style appended to the root node.                                              |

## Size presets

| Preset   | Diameter |
| -------- | -------- |
| `small`  | 48rpx    |
| `normal` | 72rpx    |
| `medium` | 96rpx    |
| `large`  | 112rpx   |

A non-preset string is used as-is (`'20%'`, `'64rpx'`); a number is read as px.

## Events

| Name    | Payload | Description                                                         |
| ------- | ------- | ------------------------------------------------------------------- |
| `click` | `Event` | Tapped anywhere on the avatar.                                      |
| `error` | `Event` | The image failed to load (the fallback layer is already rendering). |

## Slots

| Name      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | Fully custom content; overrides every built-in layer. |

## Fallback chain

```
src (image) → alt (on image error) → text → icon (SVG) → iconfont (cssIcon) → default slot
```

The error state is per-`src`: assigning a new `src` resets it, so a recycled
instance gets a fresh load attempt instead of staying stuck on the fallback.

## Presence status (AUI-additive)

`status: 'online' | 'offline'` paints a presence dot on the bottom-right corner
(green / grey, ringed with the surface colour). The dot is decorative in the
DOM; the state is announced by appending it to the root `aria-label` ("AU
online"). Registered in AGENTS.md §112.3a — wd-avatar has no presence concept.

## Inside sn-avatar-group

When rendered inside `sn-avatar-group`, the group's `size` / `shape` win over
this component's own props (the reference's "统一设置组内头像尺寸 / 形状"
contract), and the group hands down the stacking variables the stylesheet
applies. See `sn-avatar-group/ai-description.md`.

## Tokens Consumed (end: mp)

| Token             | CSS Variable                          | Purpose                    |
| ----------------- | ------------------------------------- | -------------------------- |
| Background subtle | `--sn-mp-color-background-subtle`     | Default placeholder fill   |
| Feedback success  | `--sn-mp-color-feedback-success`      | Presence dot (`online`)    |
| Text tertiary     | `--sn-mp-color-text-tertiary`         | Presence dot (`offline`)   |
| Text secondary    | `--sn-mp-color-text-secondary`        | Default initials colour    |
| Text primary      | `--sn-mp-color-text-primary`          | Doodle skin outline        |
| Font size         | `--sn-mp-font-size-{xs,md,lg,xl}`     | Initials, scaled by preset |
| Font weight       | `--sn-mp-font-weight-{semibold,bold}` | Initials weight            |
| Radius            | `--sn-mp-radius-{md,full}`            | `square` vs `round`        |

## Accessibility

- Root carries `role="img"` with `aria-label` set to the visible label, so a
  text avatar announces its initials instead of reading them as body copy.
- `@tap` is the only interaction; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — initial release. Display-family component (AUI-MP-DS-003).
