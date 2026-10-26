# sn-skeleton — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-skeleton component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Loading placeholder screen: a set of shimmering text / rect / circle / image blocks, replaced by the real content once loading finishes.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-skeleton`
(https://wot-ui.cn/component/skeleton.html). New props added here MUST also be
added to the wd-skeleton parity list.

## `rowCol` grammar

Each `rowCol` entry is either a number (that many default columns in the row) or
an array of column descriptors:

```vue
<sn-skeleton :row-col="[1, [{ size: '50%', type: 'rect' }, { size: '30%' }], 2]" />
```

A column descriptor accepts `type` (`text` / `rect` / `circle` / `image`),
`size` / `width` / `height` (bare number = rpx), `margin`, `borderRadius` and
`backgroundColor`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-skeleton :loading="loading" theme="paragraph">
  <text>真实内容</text>
</sn-skeleton>
```

```ts
import { SnSkeleton } from '@snui/uni';
```

## Props

| Name          | Type    | Default            | Required                | Description                                          |
| ------------- | ------- | ------------------ | ----------------------- | ---------------------------------------------------- |
| `theme`       | 'text'  | 'avatar'           | 'paragraph'             | 'image'                                              | 'text'          | no                              | Preset layout when `rowCol` is empty. |
| `rowCol`      | (number | SnSkeletonCol[])[] | []                      | no                                                   | Per-row layout. |
| `loading`     | boolean | true               | no                      | Show the skeleton; `false` renders the default slot. |
| `animation`   | ''      | 'gradient'         | 'flashed'               | ''                                                   | no              | Shimmer kind.                   |
| `customClass` | string  | string[]           | Record<string, boolean> | ''                                                   | no              | Custom class for the root node. |
| `customStyle` | string  | ''                 | no                      | Custom inline style for the root node.               |

`SnSkeletonCol` = `{ type?, size?, width?, height?, margin?, borderRadius?, backgroundColor? }`.

## Events

None — the component is presentational.

## Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | Real content, rendered once `loading` is false. |

## Tokens Consumed (end: mp)

| Token                      | CSS Variable                        | Purpose                          |
| -------------------------- | ----------------------------------- | -------------------------------- |
| Background subtle          | `--sn-mp-color-background-subtle`   | Placeholder fill + gradient base |
| Background elevated        | `--sn-mp-color-background-elevated` | Gradient highlight               |
| Border default             | `--sn-mp-color-border-default`      | Doodle skin outline              |
| Radius SM / MD / LG / full | `--sn-mp-radius-sm …`               | Placeholder corners              |
| Spacing 3                  | `--sn-mp-spacing-3`                 | Row + column gap                 |

## Accessibility

- Root: `role="status"` + `aria-live="polite"` + `aria-busy="true"` + `aria-label="loading"`.
- Each placeholder block: `aria-hidden="true"`.

## Dispose

The shimmer is a CSS animation — no timer, no listener.

## Versioning

`@snui/uni@0.5.0` — initial release.
