# sn-sticky — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-sticky component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-sticky`, prop surface mirrored 1:1.

## Purpose

Pins content to the top of its scroll container. Implemented with CSS
`position: sticky`, so there is no scroll listener, no bounding-box
measurement and nothing to dispose.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-sticky :offset-top="0">
  <view>吸顶内容</view>
</sn-sticky>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSticky } from '@snui/uni/components/sn-sticky/sn-sticky.vue';
```

## Props

| Name          | Type     | Default | Description          |
| ------------- | -------- | ------- | -------------------- |
| `zIndex`      | `number` | `1`     | Stacking level.      |
| `offsetTop`   | `number` | `0`     | Sticky offset in px. |
| `customClass` | `string` | `''`    | Root forwarding.     |
| `customStyle` | `string` | `''`    | Root forwarding.     |

## Events

None. The state is driven entirely by props (AGENTS.md §18 — the runtime
renders state, it does not own business transitions).

## Slots

| Name      | Description     |
| --------- | --------------- |
| `default` | Content to pin. |

## Tokens Consumed (end: mp)

| Token   | CSS Variable                       | Purpose                     |
| ------- | ---------------------------------- | --------------------------- |
| Surface | `--sn-mp-color-background-surface` | Keeps pinned content opaque |

## Accessibility

- The component adds no role or aria attributes: it is a pure layout container.
- It registers no scroll listener, so no focus / announcement state changes.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — layout (AUI-MP-LAY-001).
