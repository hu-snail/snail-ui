# sn-collapse / sn-collapse-item — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-collapse / sn-collapse-item component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-collapse / wd-collapse-item`, prop surface mirrored 1:1.

## Purpose

Collapsible panels in three modes sharing one bound value: `string[]`
(normal), `string` (accordion) and `boolean` (view-more). View-more clamps the
body with a CSS line clamp, so no height measurement is needed.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-collapse v-model="open">
  <sn-collapse-item name="a" title="标题">内容</sn-collapse-item>
</sn-collapse>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnCollapse } from '@snui/uni/components/sn-collapse/sn-collapse.vue';
import { SnCollapseItem } from '@snui/uni/components/sn-collapse/sn-collapse-item.vue';
```

## Props — sn-collapse

| Name                  | Type                            | Default | Description                                     |
| --------------------- | ------------------------------- | ------- | ----------------------------------------------- |
| `modelValue`          | `string \| string[] \| boolean` | `[]`    | Bound value; the shape follows the active mode. |
| `accordion`           | `boolean`                       | `false` | Mode switches.                                  |
| `viewmore`            | `boolean`                       | `false` | Mode switches.                                  |
| `lineNum`             | `number`                        | `2`     | Collapsed line count in view-more mode.         |
| `useMoreSlot`         | `boolean`                       | `false` | More-slot hooks.                                |
| `customMoreSlotClass` | `string`                        | `''`    | More-slot hooks.                                |
| `customClass`         | `string`                        | `''`    | Root forwarding.                                |
| `customStyle`         | `string`                        | `''`    | Root forwarding.                                |
| `card` (additive)     | `boolean`                       | `false` | Every panel becomes its own rounded card.       |
| `iconSize` (additive) | `string \| number`              | `undefined` | Icon length for the family; tiers map to `--sn-mp-icon-size-*`. |
| `iconColor` (additive)| `string`                        | `''`    | Icon colour for the family; a `--sn-mp-color-*` token. |

## Props — sn-collapse-item

| Name                    | Type                                    | Default     | Description                        |
| ----------------------- | --------------------------------------- | ----------- | ---------------------------------- |
| `name`                  | `string`                                | `''`        | Panel identity and heading.        |
| `title`                 | `string`                                | `''`        | Panel identity and heading.        |
| `disabled`              | `boolean`                               | `false`     | Block the toggle.                  |
| `beforeExpend`          | `(name) => boolean \| Promise<boolean>` | `undefined` | Open veto; runs only when opening. |
| `border`                | `boolean`                               | `true`      | Divider and body forwarding.       |
| `customBodyClass`       | `string`                                | `''`        | Divider and body forwarding.       |
| `customBodyStyle`       | `string`                                | `''`        | Divider and body forwarding.       |
| `customClass`           | `string`                                | `''`        | Panel root forwarding.             |
| `customStyle`           | `string`                                | `''`        | Panel root forwarding.             |
| `titleIconData` (additive) | `IconData`                           | `undefined` | Title icon as an object (built-in set); highest priority. |
| `titleIconUrl` (additive)  | `string`                             | `''`        | Title image URL rendered as `<image>`. |
| `titleIcon` (additive)     | `string`                             | `''`        | Title icon name: registry → built-in catalogue → provider. |
| `iconSize` (additive)   | `string \| number`                      | `undefined` | Icon length; inherits the container, then the family default. |
| `iconColor` (additive)  | `string`                                | `''`        | Icon colour; inherits the container. |
| `iconStrokeWidth` (additive) | `number`                           | `2`         | SVG stroke weight, mirrors `--sn-mp-icon-stroke-width`. |
| `card` (additive)       | `boolean`                               | `undefined` | Per-panel card; inherits the container. |

## Events

| Name                | Payload              | Description              |
| ------------------- | -------------------- | ------------------------ |
| `update:modelValue` | bound value          | Bound value changed.     |
| `change`            | `{ value }`          | Bound value changed.     |
| `change (item)`     | `{ name, expanded }` | One panel changed state. |

## Methods

| Name        | Signature                                                    | Description                              |
| ----------- | ------------------------------------------------------------ | ---------------------------------------- |
| `toggleAll` | `(options?: { expanded?: boolean; skipDisabled?: boolean })` | Open all / close all / flip every panel. |

## Slots

| Name                 | Scope                             | Description                       |
| -------------------- | --------------------------------- | --------------------------------- |
| `default (collapse)` | —                                 | Panel list.                       |
| `more (collapse)`    | `{ expanded }`                    | Custom expand / collapse control. |
| `title (item)`       | `{ expanded, disabled, isFirst }` | Custom heading.                   |
| `default (item)`     | —                                 | Panel content.                    |

## Tokens Consumed (end: mp)

| Token              | CSS Variable                                                                   | Purpose                           |
| ------------------ | ------------------------------------------------------------------------------ | --------------------------------- |
| Surface / feedback | `--sn-mp-color-background-surface`, `--sn-mp-color-background-soft`            | Panel surface and header feedback |
| Divider / card     | `--sn-mp-color-border-subtle`                                                  | Panel divider and card outline    |
| Text               | `--sn-mp-color-text-primary`, `--sn-mp-color-text-secondary`, `--sn-mp-color-text-tertiary` | Heading, body and chevron |
| Action             | `--sn-mp-color-action-primary`, `--sn-mp-color-action-primary-soft`            | Open state colour and chevron backing |
| Card chrome        | `--sn-mp-radius-lg`, `--sn-mp-shadow-sm`                                       | Card radius and elevation         |
| Font / spacing     | `--sn-mp-font-size-md`, `--sn-mp-font-size-sm`, `--sn-mp-font-line-height-normal`, `--sn-mp-spacing-1` … `--sn-mp-spacing-4` | Typography, padding and gaps |
| Icon               | `--sn-mp-icon-size-tiny` … `--sn-mp-icon-size-xlarge`, `--sn-mp-icon-stroke-width` | Chevron / title-icon length and stroke |

## Accessibility

- Header is `role="button"` with `aria-expanded`, `aria-disabled` and `aria-label` from `title`.
- Body is `role="region"`; while collapsed it is hidden with `v-show`.
- The expand / collapse control is `role="button"` with `aria-expanded`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — display (AUI-MP-DS-003).
