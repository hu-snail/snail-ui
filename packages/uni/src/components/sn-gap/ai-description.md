# sn-gap — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-gap component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-gap`, prop surface mirrored 1:1.

## Purpose

Vertical spacer between content blocks. On mobile, layout rhythm is often
produced by an explicit spacer element rather than a container margin, because
miniprogram WXSS support for gap / margin-collapse is uneven. `sn-gap` is that
element, plus an opt-in bottom safe-area inset for pages that scroll to the
gesture bar.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-gap />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnGap } from '@snui/uni/components/sn-gap/sn-gap.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `height` | `string \| number` | `14` | no | Spacer height. A number is px; a string is used verbatim (`'40rpx'`). |
| `bgColor` | `string` | `'transparent'` | no | Background colour. `transparent` writes no inline background at all. |
| `safeAreaBottom` | `boolean` | `false` | no | Add `env(safe-area-inset-bottom)` as bottom padding on top of `height`. |
| `customClass` | `string` | `''` | no | Extra class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style appended to the root node. |

## Events

None. The spacer is decoration.

## Slots

None. Content passed to the default slot is not rendered — a spacer with
children would be a layout container, which is a different component.

## Tokens Consumed (end: mp)

None. The spacer's geometry comes from `height` and the optional safe-area
inset, and its background defaults to `transparent`, so there is no colour or
spacing token to consume. This is deliberate: a spacer must inherit the page
surface, otherwise it would paint a visible band in dark mode.

## Accessibility

- `aria-hidden="true"` + `role="presentation"` — the element carries no
  information and must not appear in the accessibility tree.
- No interaction, so no keyboard contract.

## Versioning

`@snui/uni@0.1.0` — initial release. Display-family component (AUI-MP-DS-004).
