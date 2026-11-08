# sn-steps / sn-step — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-steps / sn-step component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-steps / wd-step`, prop surface
> mirrored 1:1; the connector / node / content / icon surface is additive
> (AUI-OPT-09, AGENTS.md §112.3a).

## Purpose

Step progress indicator in horizontal or vertical layout, with circle or
dot indicators. A step's state is explicit `status` or derived from `active`
(before → finished, at → process, after → wait). Additive capabilities cover
the connector line type, a fully custom node, a node-content slot and a three
source icon configuration.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-steps :active="1">
  <sn-step title="提交订单" description="已提交" />
</sn-steps>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSteps } from '@snui/uni/components/sn-steps/sn-steps.vue';
import { SnStep } from '@snui/uni/components/sn-steps/sn-step.vue';
```

## Props — sn-steps

| Name          | Type                              | Default   | Description                                          |
| ------------- | --------------------------------- | --------- | ---------------------------------------------------- |
| `active`      | `number`                          | `0`       | Active step index.                                   |
| `vertical`    | `boolean`                         | `false`   | Layout and indicator style.                          |
| `dot`         | `boolean`                         | `false`   | Dot indicators; suppresses the connectors.           |
| `space`       | `string`                          | `''`      | Custom step spacing.                                 |
| `alignCenter` | `boolean`                         | `false`   | Centre horizontally (horizontal only).               |
| `customClass` | `string`                          | `''`      | Root forwarding.                                     |
| `customStyle` | `string`                          | `''`      | Root forwarding.                                     |
| `connector`   | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Connector line type shared by every step (additive). |

## Props — sn-step

| Name          | Type                                           | Default     | Description                                                                                                   |
| ------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                                       | `''`        | Step content.                                                                                                 |
| `description` | `string`                                       | `''`        | Step content.                                                                                                 |
| `icon`        | `string`                                       | `''`        | Icon name: registry → built-in catalogue; unresolved falls back to the status glyph / step number.            |
| `status`      | `'finished' \| 'process' \| 'error' \| 'wait'` | `undefined` | Explicit state; derived from `active` when omitted.                                                           |
| `customClass` | `string`                                       | `''`        | Step root forwarding.                                                                                         |
| `customStyle` | `string`                                       | `''`        | Step root forwarding.                                                                                         |
| `iconData`    | `IconData`                                     | `undefined` | Icon data object; highest icon precedence (additive).                                                         |
| `iconUrl`     | `string`                                       | `''`        | Icon image URL, rendered as `<image>` (additive).                                                             |
| `iconSize`    | `string \| number`                             | `undefined` | Icon size: tiers map to `--sn-mp-icon-size-*`, numbers are px; default `--sn-mp-icon-size-medium` (additive). |
| `iconColor`   | `string`                                       | `''`        | Icon colour; default `currentColor` follows the state colour (additive).                                      |

## Icon precedence

`iconData` > `iconUrl` > `icon`. A name that resolves to neither the registry
nor the catalogue falls through to the built-in status glyph (Check for
finished, X for error) and the step number, so the indicator is never blank
(AGENTS.md §85 — explicit, predictable fallback).

## Events

None. The state is driven entirely by props (AGENTS.md §18 — the runtime
renders state, it does not own business transitions).

## Slots

| Name                 | Scope | Description                                                 |
| -------------------- | ----- | ----------------------------------------------------------- |
| `default (steps)`    | —     | Step list.                                                  |
| `icon`               | —     | Custom step glyph, rendered inside the node.                |
| `title`              | —     | Custom step title.                                          |
| `description (step)` | —     | Custom step description.                                    |
| `node`               | —     | Replace the whole default indicator (additive).             |
| `content`            | —     | Replace the content region, title + description (additive). |

## Tokens Consumed (end: mp)

| Token                   | CSS Variable                                                                                                                                                                      | Purpose                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Surface / border        | `--sn-mp-color-background-surface`, `--sn-mp-color-border-default`                                                                                                                | Indicators and connectors     |
| Text                    | `--sn-mp-color-text-secondary`                                                                                                                                                    | Wait / finished labels        |
| Active                  | `--sn-mp-color-action-primary`, `--sn-mp-color-text-on-primary`                                                                                                                   | Process / finished indicators |
| Error                   | `--sn-mp-color-feedback-danger`                                                                                                                                                   | Error indicator and title     |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-font-size-sm`, `--sn-mp-font-size-xs`, `--sn-mp-radius-full`, `--sn-mp-spacing-1`, `--sn-mp-spacing-2`, `--sn-mp-spacing-3`, `--sn-mp-spacing-5` | Label and indicator geometry  |
| Icon size               | `--sn-mp-icon-size-tiny` … `--sn-mp-icon-size-xlarge`                                                                                                                             | `iconSize` tier names         |

## Accessibility

- Container is `role="list"` and every step is `role="listitem"`.
- The in-progress step carries `aria-current="step"`; others do not.
- Connectors and dot indicators are decorative.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — display (AUI-MP-DS-004); additive surface (AUI-OPT-09).
