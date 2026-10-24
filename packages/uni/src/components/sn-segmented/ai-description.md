# sn-segmented — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-segmented component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-segmented`, prop surface mirrored 1:1.

## Purpose

Two-to-five option segmented control. `options` accepts `string[]`,
`number[]` or object entries and is normalised once, so the emitted payload is
always a `SegmentedOption`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-segmented v-model="period" :options="['day', 'week']" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSegmented } from '@snui/uni/components/sn-segmented/sn-segmented.vue'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| number` | `undefined` | Selected value. |
| `disabled` | `boolean` | `false` | Disable the whole control. |
| `options` | `string[] \| number[] \| SegmentedOption[]` | `[]` | Option list. |
| `theme` | `'card' \| 'outline'` | `'card'` | Visual theme. |
| `vibrateShort` | `boolean` | `false` | Short vibration on switch. |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `string \| number` | Selected value changed. |
| `change` | `SegmentedOption` | Option switched. |
| `click` | `SegmentedOption` | Option tapped (including the active one). |

## Slots

| Name | Description |
|---|---|
| `label` | Custom option label; scope `{ option }`. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Track / slider | `--sn-mp-color-background-subtle`, `--sn-mp-color-background-surface` | Card track and slider |
| Border | `--sn-mp-color-border-default` | Outline theme border |
| Text | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-disabled` | Inactive / disabled labels |
| Action primary | `--sn-mp-color-action-primary` | Active label and outline fill |
| Text on primary | `--sn-mp-color-text-on-primary` | Outline active label |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-radius-md`, `--sn-mp-spacing-1` | Label typography and track geometry |

## Accessibility

- Root is `role="group"`; every option is `role="button"`.
- `aria-pressed` reflects selection; `aria-disabled` merges option + control flags.
- `vibrateShort` calls `uni.vibrateShort`; hosts without it skip silently.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-004).
