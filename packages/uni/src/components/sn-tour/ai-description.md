# sn-tour — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tour component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-tour`, prop surface mirrored 1:1.

## Purpose

Step-by-step feature guide with a highlight mask. The mask and panel are
rendered; the highlighted element is **not** measured (see the note below), and
the step data is handed to the host through the default slot.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-tour v-model="visible" v-model:current="current" :steps="steps" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnTour } from '@snui/uni/components/sn-tour/sn-tour.vue'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | Whether the tour is open. |
| `steps` | `TourStep[]` | `[]` | Step list. |
| `current` | `number` | `0` | Current step index. |
| `mask` | `boolean` | `true` | Mask rendering and colour. |
| `maskColor` | `string` | `''` | Mask rendering and colour. |
| `offset` | `number` | `20` | Highlight geometry — **not implemented** (needs synchronous element measurement). |
| `padding` | `number` | `8` | Highlight geometry — **not implemented** (needs synchronous element measurement). |
| `placement` | `TourPlacement` | `'auto'` | Highlight geometry — **not implemented** (needs synchronous element measurement). |
| `highlightStyle` | `Record<string, string>` | `{}` | Highlight geometry — **not implemented** (needs synchronous element measurement). |
| `missingStrategy` | `MissingStrategy` | `'stop'` | Measurement-dependent — **not implemented**. |
| `topSafetyOffset` | `number` | `0` | Measurement-dependent — **not implemented**. |
| `bottomSafetyOffset` | `number` | `100` | Measurement-dependent — **not implemented**. |
| `customNav` | `boolean` | `false` | Measurement-dependent — **not implemented**. |
| `duration` | `number` | `300` | Animation duration and panel radius. |
| `borderRadius` | `number` | `4` | Animation duration and panel radius. |
| `prevText` | `string` | `上一步` | Button labels. |
| `nextText` | `string` | `下一步` | Button labels. |
| `skipText` | `string` | `跳过` | Button labels. |
| `finishText` | `string` | `完成` | Button labels. |
| `clickMaskNext` | `boolean` | `false` | Advance on a mask tap. |
| `zIndex` | `number` | `undefined` | Stacking level and button visibility. |
| `showTourButtons` | `boolean` | `true` | Stacking level and button visibility. |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

> **Not implemented**: `element` / `offset` / `padding` / `placement` /
> `highlightStyle` / `missingStrategy` / `topSafetyOffset` /
> `bottomSafetyOffset` / `customNav` depend on synchronously measuring a target
> DOM node. No uni host offers one uniform synchronous measurement API, and a
> wrong rect produces a cut-out pointing at nothing — worse than none. The props
> stay in the surface for contract parity; the host can position the highlight
> itself through the default slot.

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Visibility changed. |
| `update:current` | `number` | Step changed. |
| `change` | `{ current }` | Step changed. |
| `prev` | `{ prevCurrent, current, total, isElementInTop }` | Step navigation. |
| `next` | `{ prevCurrent, current, total, isElementInTop }` | Step navigation. |
| `finish` | `{ current, total }` | Tour completed / dismissed. |
| `skip` | `{ current, total }` | Tour completed / dismissed. |
| `error` | `{ message, element }` | Target lookup failed. |

## Slots

| Name | Scope | Description |
|---|---|---|
| `default` | `{ step, current, total }` | Custom panel content. |
| `footer` | `{ step, current, total }` | Custom footer actions. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Overlay / panel | `--sn-mp-color-background-overlay`, `--sn-mp-color-background-elevated` | Scrim and panel |
| Button chrome | `--sn-mp-color-background-surface`, `--sn-mp-color-border-default` | Secondary button |
| Text | `--sn-mp-color-text-primary`, `--sn-mp-color-text-secondary`, `--sn-mp-color-text-tertiary` | Body, skip and progress labels |
| Action primary | `--sn-mp-color-action-primary`, `--sn-mp-color-text-on-primary` | Primary button |
| Elevation / radius / spacing | `--sn-mp-shadow-lg`, `--sn-mp-radius-md`, `--sn-mp-spacing-4` | Panel and button geometry |

## Accessibility

- Root is `role="dialog"` with `aria-modal="true"` and `aria-label="Guide"`.
- Buttons are `role="button"` with `aria-label` matching their copy.
- The progress indicator is `aria-hidden="true"`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — feedback (AUI-MP-FB-001).
