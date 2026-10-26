# SnSteps / SnStep — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end steps pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Step / progress indicator for multi-stage flows: wizards, checkout,
onboarding, approval pipelines. `SnSteps` owns the shared flow state;
each `SnStep` child renders one indicator + its title/description.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-steps` + `n-step`
(https://www.naiveui.com/zh-CN/light/components/steps).

## Import

```ts
import { SnSteps, SnStep } from '@snui/vue-web';
```

## SnSteps Props

| Name               | Type                                         | Default     | Description                                                 |
| ------------------ | -------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `current`          | `number`                                     | `undefined` | Active step index (1-based, `v-model:current`).             |
| `status`           | `'process' \| 'finish' \| 'error' \| 'wait'` | `'process'` | Status applied to the step at `current`.                    |
| `size`             | `'small' \| 'medium'`                        | `'medium'`  | Indicator size.                                             |
| `vertical`         | `boolean`                                    | `false`     | Stack steps vertically.                                     |
| `contentPlacement` | `'right' \| 'bottom'`                        | `'right'`   | Title position relative to the indicator (horizontal only). |

## SnStep Props

| Name          | Type                                         | Default     | Description                                           |
| ------------- | -------------------------------------------- | ----------- | ----------------------------------------------------- |
| `status`      | `'process' \| 'finish' \| 'error' \| 'wait'` | `undefined` | Explicit status; wins over derivation from `current`. |
| `title`       | `string`                                     | `''`        | Step title.                                           |
| `description` | `string`                                     | `''`        | Step description.                                     |
| `disabled`    | `boolean`                                    | `false`     | Disable click + dim the step.                         |

## Events

| Event            | Payload             | When                                              |
| ---------------- | ------------------- | ------------------------------------------------- |
| `update:current` | `(current: number)` | A clickable step was clicked (`v-model:current`). |

## Slots

| Component | Slot          | Description                                                       |
| --------- | ------------- | ----------------------------------------------------------------- |
| `SnSteps` | `default`     | Sequence of `<SnStep>` children.                                  |
| `SnSteps` | `finish-icon` | Custom icon for finished steps (replaces the default check mark). |
| `SnSteps` | `error-icon`  | Custom icon for errored steps (replaces the default cross).       |
| `SnStep`  | `default`     | Step body — overrides the `description` prop.                     |
| `SnStep`  | `icon`        | Indicator content — overrides index / status icon.                |
| `SnStep`  | `title`       | Step title — overrides the `title` prop.                          |

## Status derivation

`SnStep` resolves its status in this order (mirrors n-step):

1. explicit `status` prop, else
2. derived from the parent `current`: `index < current` → `finish`,
   `index === current` → parent `status`, `index > current` → `wait`,
   else (no `current`) → `process`.

## §112 future markers

- `SnSteps` `finish-icon` / `error-icon` slots are **declared** but the
  default check / cross icons are rendered by `SnStep` directly — the
  parent-level slot override is not yet threaded down through injection.
- `n-step` `internalIndex` as a public prop is intentionally **not**
  exposed: the ordinal is assigned by the parent so ordinals cannot drift
  out of sync with slot order.
- No `StepsButton` / step-transition animation (`NIconSwitchTransition`
  in n-step) — status icon swaps without cross-fade.

## Tokens Consumed (end: web)

| Token           | CSS Variable                     | Purpose                              |
| --------------- | -------------------------------- | ------------------------------------ |
| Action color    | `--sn-web-color-action-primary`  | Process/finish indicator + connector |
| Danger color    | `--sn-web-color-feedback-danger` | Error indicator + title              |
| Border          | `--sn-web-color-border-default`  | Wait indicator + inactive connector  |
| Text primary    | `--sn-web-color-text-primary`    | Default title text                   |
| Text secondary  | `--sn-web-color-text-secondary`  | Wait title, descriptions, index      |
| Text on primary | `--sn-web-color-text-on-primary` | Index / icon on filled indicators    |

## Accessibility

- Indicator index is rendered as text content (screen readers read the
  ordinal); status is conveyed visually via color + icon.
- `cursor: not-allowed` + `opacity: 0.6` on disabled steps.
- Clicking is a pointer convenience only: `SnSteps` does **not** replace
  the surrounding form's own submit/navigation buttons, so the flow
  remains keyboard- and assistive-tech-operable without a step click.

> **A11y gap (tracked):** the current version does not emit
> `aria-current="step"` on the active step, nor wrap the group in a
> `role="list"` / `aria-label`. Task AUI-WEB-NAV-004 follow-up.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-NAV-004 (M1 navigation
Web components).
