# sn-steps / sn-step — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-steps / sn-step component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-steps / wd-step`, prop surface mirrored 1:1.

## Purpose

Step progress indicator in horizontal or vertical layout, with circle or
dot indicators. A step's state is explicit `status` or derived from `active`
(before → finished, at → process, after → wait).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-steps :active="1">
  <sn-step title="提交订单" description="已提交" />
</sn-steps>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSteps } from '@snui/uni/components/sn-steps/sn-steps.vue'
import { SnStep } from '@snui/uni/components/sn-steps/sn-step.vue'
```

## Props — sn-steps

| Name | Type | Default | Description |
|---|---|---|---|
| `active` | `number` | `0` | Active step index. |
| `vertical` | `boolean` | `false` | Layout and indicator style. |
| `dot` | `boolean` | `false` | Layout and indicator style. |
| `space` | `string` | `''` | Custom step spacing. |
| `alignCenter` | `boolean` | `false` | Centre horizontally (horizontal only). |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

## Props — sn-step

| Name | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Step content. |
| `description` | `string` | `''` | Step content. |
| `icon` | `string` | `''` | Step content. |
| `status` | `'finished' \| 'process' \| 'error' \| 'wait'` | `undefined` | Explicit state; derived from `active` when omitted. |
| `customClass` | `string` | `''` | Step root forwarding. |
| `customStyle` | `string` | `''` | Step root forwarding. |

## Events

None. The state is driven entirely by props (AGENTS.md §18 — the runtime
renders state, it does not own business transitions).

## Slots

| Name | Scope | Description |
|---|---|---|
| `default (steps)` | — | Step list. |
| `icon` | — | Custom step parts. |
| `title` | — | Custom step parts. |
| `description (step)` | — | Custom step parts. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Surface / border | `--sn-mp-color-background-surface`, `--sn-mp-color-border-default`, `--sn-mp-color-border-subtle` | Indicators and connectors |
| Text | `--sn-mp-color-text-secondary` | Wait / finished labels |
| Active | `--sn-mp-color-action-primary`, `--sn-mp-color-text-on-primary` | Process / finished indicators |
| Error | `--sn-mp-color-feedback-danger` | Error indicator and title |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-radius-full`, `--sn-mp-spacing-3` | Label and indicator geometry |

## Accessibility

- Container is `role="list"` and every step is `role="listitem"`.
- The in-progress step carries `aria-current="step"`; others do not.
- Connectors and dot indicators are decorative.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — display (AUI-MP-DS-004).
