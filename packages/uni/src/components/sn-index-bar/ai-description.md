# sn-index-bar / sn-index-anchor — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-index-bar / sn-index-anchor component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-index-bar / wd-index-anchor`, prop surface mirrored 1:1.

## Purpose

Alphabetical index list with a jump sidebar. Each anchor registers its DOM
id; the bar's `scroll-view` jumps with `scroll-into-view`, so no layout query
or measured offset is needed on any uni target.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-index-bar sticky>
  <sn-index-anchor index="A">…</sn-index-anchor>
</sn-index-bar>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnIndexBar } from '@snui/uni/components/sn-index-bar/sn-index-bar.vue'
import { SnIndexAnchor } from '@snui/uni/components/sn-index-bar/sn-index-anchor.vue'
```

## Props — sn-index-bar

| Name | Type | Default | Description |
|---|---|---|---|
| `sticky` | `boolean` | `false` | Pin the index bar. |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

## Props — sn-index-anchor

| Name | Type | Default | Description |
|---|---|---|---|
| `index` | `string \| number` | `''` | Index character(s). |
| `customClass` | `string` | `''` | Anchor root forwarding. |
| `customStyle` | `string` | `''` | Anchor root forwarding. |

## Events

| Name | Payload | Description |
|---|---|---|
| `change` | `{ index }` | Active index changed. |

## Slots

| Name | Description |
|---|---|
| `default (index-bar)` | Anchor list. |
| `default (anchor)` | Entries under that index. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Surface | `--sn-mp-color-background-surface`, `--sn-mp-color-background-soft` | List and heading surface |
| Active heading | `--sn-mp-color-action-primary-soft` | Active group heading |
| Text | `--sn-mp-color-text-secondary` | Entries and headings |
| Action primary | `--sn-mp-color-action-primary` | Active entry fill and heading |
| Text on primary | `--sn-mp-color-text-on-primary` | Active entry label |
| Font / radius / spacing | `--sn-mp-font-size-xs`, `--sn-mp-radius-full`, `--sn-mp-spacing-1` | Entry geometry |

## Accessibility

- Sidebar is `role="tablist"` with `aria-orientation="vertical"`.
- Every entry is `role="tab"` with `aria-selected` and `aria-label` set to the index.
- Headings are plain text; the enclosing group carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-007).
