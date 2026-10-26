# sn-tabs / sn-tab — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tabs / sn-tab component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-tabs / wd-tab`, prop surface mirrored 1:1.

## Purpose

Horizontal tab navigation container plus per-pane panels. The container
renders the nav strip only; each `sn-tab` renders its own panel and registers a
small entry so the strip stays reactive to title / disabled changes.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-tabs v-model="active">
  <sn-tab title="全部" :name="0">内容</sn-tab>
</sn-tabs>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnTabs } from '@snui/uni/components/sn-tabs/sn-tabs.vue';
import { SnTab } from '@snui/uni/components/sn-tabs/sn-tab.vue';
```

## Props — sn-tabs

| Name            | Type                                         | Default     | Description                                                                     |
| --------------- | -------------------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `modelValue`    | `number \| string`                           | `0`         | Active index or name.                                                           |
| `slidableNum`   | `number`                                     | `6`         | Tab count that turns on scrolling.                                              |
| `mapNum`        | `number`                                     | `10`        | Navigation-map overlay — **not implemented** (needs per-tab width measurement). |
| `mapTitle`      | `string`                                     | `''`        | Navigation-map overlay — **not implemented** (needs per-tab width measurement). |
| `sticky`        | `boolean`                                    | `false`     | Pin the strip.                                                                  |
| `offsetTop`     | `number`                                     | `0`         | Sticky offset in px.                                                            |
| `swipeable`     | `boolean`                                    | `false`     | Enable swipe-to-switch.                                                         |
| `lineTheme`     | `'normal' \| 'text' \| 'underline' \| 'dot'` | `'normal'`  | Active-bar style.                                                               |
| `lineWidth`     | `number \| string`                           | `undefined` | Bar size; numbers are px.                                                       |
| `lineHeight`    | `number \| string`                           | `undefined` | Bar size; numbers are px.                                                       |
| `color`         | `string`                                     | `''`        | Label colour overrides.                                                         |
| `inactiveColor` | `string`                                     | `''`        | Label colour overrides.                                                         |
| `animated`      | `boolean`                                    | `false`     | Switch animation and its duration.                                              |
| `duration`      | `number`                                     | `300`       | Switch animation and its duration.                                              |
| `slidable`      | `'auto' \| 'always'`                         | `'auto'`    | Scroll-navigation mode.                                                         |
| `showScrollbar` | `boolean`                                    | `false`     | Show the scrollbar while scrolling.                                             |
| `customClass`   | `string`                                     | `''`        | Root forwarding.                                                                |
| `customStyle`   | `string`                                     | `''`        | Root forwarding.                                                                |

## Props — sn-tab

| Name          | Type               | Default     | Description                            |
| ------------- | ------------------ | ----------- | -------------------------------------- |
| `name`        | `number \| string` | `undefined` | Unique value; falls back to the index. |
| `title`       | `string`           | `''`        | Tab title.                             |
| `disabled`    | `boolean`          | `false`     | Disable the tab.                       |
| `lazy`        | `boolean`          | `true`      | Defer content until first activation.  |
| `customClass` | `string`           | `''`        | Pane root forwarding.                  |
| `customStyle` | `string`           | `''`        | Pane root forwarding.                  |

## Events

| Name                | Payload            | Description                                  |
| ------------------- | ------------------ | -------------------------------------------- |
| `update:modelValue` | `number \| string` | Active item changed.                         |
| `change`            | `{ index, name }`  | Active item changed.                         |
| `click`             | `{ index, name }`  | Tab title tapped (including the active one). |
| `disabled`          | `{ index, name }`  | Disabled tab tapped.                         |

## Slots

| Name             | Description                   |
| ---------------- | ----------------------------- |
| `default (tabs)` | Tab list (`sn-tab` children). |
| `default (tab)`  | Panel content.                |

## Tokens Consumed (end: mp)

| Token                     | CSS Variable                                                    | Purpose                    |
| ------------------------- | --------------------------------------------------------------- | -------------------------- |
| Background surface        | `--sn-mp-color-background-surface`                              | Strip and panel surface    |
| Text secondary / disabled | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-disabled`   | Inactive / disabled labels |
| Action primary            | `--sn-mp-color-action-primary`                                  | Active label and bar       |
| Text primary              | `--sn-mp-color-text-primary`                                    | Panel body text            |
| Font size / weight        | `--sn-mp-font-size-md`, `--sn-mp-font-weight-medium`            | Label typography           |
| Spacing / radius          | `--sn-mp-spacing-2`, `--sn-mp-spacing-4`, `--sn-mp-radius-full` | Strip padding, dot bar     |

## Accessibility

- The strip is `role="tablist"`; every tab is `role="tab"` with
  `aria-selected`, `aria-disabled` and `aria-label` from `title`.
- Panels are `role="tabpanel"` with `aria-hidden="true"` while inactive.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-003).
