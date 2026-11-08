# sn-tabs / sn-tab — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-tabs / sn-tab component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-tabs / wd-tab`, prop surface
> mirrored 1:1; the AUI-OPT-10 additions are registered in AGENTS.md §112.3a.

## Purpose

Horizontal tab navigation container plus per-pane panels. The container
renders the nav strip only; each `sn-tab` renders its own panel and registers a
small entry so the strip stays reactive to title / disabled / icon / badge
changes.

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

| Name            | Type                                                                           | Default     | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------- |
| `modelValue`    | `number \| string`                                                             | `0`         | Active index or name.                                                           |
| `slidableNum`   | `number`                                                                       | `6`         | Tab count that turns on scrolling.                                              |
| `mapNum`        | `number`                                                                       | `10`        | Navigation-map overlay — **not implemented** (needs per-tab width measurement). |
| `mapTitle`      | `string`                                                                       | `''`        | Navigation-map overlay — **not implemented** (needs per-tab width measurement). |
| `sticky`        | `boolean`                                                                      | `false`     | Pin the strip.                                                                  |
| `offsetTop`     | `number`                                                                       | `0`         | Sticky offset in px.                                                            |
| `swipeable`     | `boolean`                                                                      | `false`     | Swipe-to-switch; the content area becomes a native `swiper`.                    |
| `lineTheme`     | `'normal' \| 'text' \| 'underline' \| 'dot'`                                   | `'normal'`  | Active-bar style.                                                               |
| `lineWidth`     | `number \| string`                                                             | `undefined` | Bar size; numbers are px.                                                       |
| `lineHeight`    | `number \| string`                                                             | `undefined` | Bar size; numbers are px.                                                       |
| `color`         | `string`                                                                       | `''`        | Label colour overrides.                                                         |
| `inactiveColor` | `string`                                                                       | `''`        | Label colour overrides.                                                         |
| `animated`      | `boolean`                                                                      | `false`     | Switch animation, its duration, and the strip scroll transition.                |
| `duration`      | `number`                                                                       | `300`       | Switch animation / swiper slide duration (ms).                                  |
| `slidable`      | `'auto' \| 'always'`                                                           | `'auto'`    | Scroll-navigation mode.                                                         |
| `showScrollbar` | `boolean`                                                                      | `false`     | Show the scrollbar while scrolling.                                             |
| `type`          | `'line' \| 'card' \| 'tag'`                                                    | `'line'`    | **additive** — strip form: underline / card segment / standalone pills.         |
| `activeTheme`   | `'text' \| 'fill' \| 'pill'`                                                   | `'text'`    | **additive** — active emphasis: text / soft rounded fill / solid pill.          |
| `swiperEasing`  | `'default' \| 'linear' \| 'easeInCubic' \| 'easeOutCubic' \| 'easeInOutCubic'` | `'default'` | **additive** — content swiper easing; `default` leaves it unset.                |
| `swiperHeight`  | `number \| string`                                                             | `''`        | **additive** — content swiper height; numbers are px, strings verbatim.         |
| `customClass`   | `string`                                                                       | `''`        | Root forwarding.                                                                |
| `customStyle`   | `string`                                                                       | `''`        | Root forwarding.                                                                |

## Props — sn-tab

| Name          | Type                 | Default     | Description                                                                  |
| ------------- | -------------------- | ----------- | ---------------------------------------------------------------------------- |
| `name`        | `number \| string`   | `undefined` | Unique value; falls back to the index.                                       |
| `title`       | `string`             | `''`        | Tab title.                                                                   |
| `disabled`    | `boolean`            | `false`     | Disable the tab.                                                             |
| `lazy`        | `boolean`            | `true`      | Defer content until first activation.                                        |
| `icon`        | `IconData \| string` | `undefined` | **additive** — icon left of the title: data or a registered / built-in name. |
| `iconImage`   | `string`             | `''`        | **additive** — icon image address; wins over `icon`.                         |
| `badgeProps`  | `SnTabBadgeProps`    | `undefined` | Badge config forwarded to `sn-badge` (mirrors wd-tab `badge-props`).         |
| `customClass` | `string`             | `''`        | Pane root forwarding.                                                        |
| `customStyle` | `string`             | `''`        | Pane root forwarding.                                                        |

`SnTabBadgeProps`: `value` / `max` / `top` / `right` / `isDot` / `hidden` /
`type` / `bgColor` / `showZero` / `shape` / `border` / `customClass` /
`customStyle` — the same field set `sn-badge` exposes, so a config written for
`wd-tab` keeps working.

## Events

| Name                | Payload            | Description                                  |
| ------------------- | ------------------ | -------------------------------------------- |
| `update:modelValue` | `number \| string` | Active item changed.                         |
| `change`            | `{ index, name }`  | Active item changed.                         |
| `click`             | `{ index, name }`  | Tab title tapped (including the active one). |
| `disabled`          | `{ index, name }`  | Disabled tab tapped.                         |

## Methods

| Name          | Type                                | Description                          |
| ------------- | ----------------------------------- | ------------------------------------ |
| `setActive`   | `(value: number \| string) => void` | Set the active item (emits nothing). |
| `activeIndex` | `number`                            | Index of the active item.            |

## Slots

| Name             | Description                   |
| ---------------- | ----------------------------- |
| `default (tabs)` | Tab list (`sn-tab` children). |
| `default (tab)`  | Panel content.                |

## Behaviour notes

- **Auto scroll-into-view** (additive): every nav item carries a stable DOM id
  and the strip's `scroll-view` points `scroll-into-view` at the active one, so
  a tap and an external `v-model` write both pull the selection into view with
  no width measurement. `animated` turns on `scroll-with-animation`.
- **Native swiper body** (additive): with `swipeable` the body renders as a
  native `<swiper>` and each pane as a `<swiper-item>`. A swipe commits the
  pane it lands on; landing on a disabled pane snaps back to the committed
  index and emits nothing.
- **No bottom bar outside the plain look**: `type !== 'line'` or
  `activeTheme !== 'text'` replaces the bar with the fill / pill emphasis.

## Tokens Consumed (end: mp)

| Token                     | CSS Variable                                                         | Purpose                            |
| ------------------------- | -------------------------------------------------------------------- | ---------------------------------- |
| Background surface        | `--sn-mp-color-background-surface`                                   | Strip and panel surface            |
| Background subtle         | `--sn-mp-color-background-subtle`                                    | Card-segment container             |
| Border default            | `--sn-mp-color-border-default`                                       | Card-segment / pill outline        |
| Text secondary / disabled | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-disabled`        | Inactive / disabled labels         |
| Text on primary           | `--sn-mp-color-text-on-primary`                                      | Inverted label on a solid pill     |
| Action primary            | `--sn-mp-color-action-primary`                                       | Active label and bar               |
| Action primary soft       | `--sn-mp-color-action-primary-soft`                                  | Soft active background (`fill`)    |
| Text primary              | `--sn-mp-color-text-primary`                                         | Panel body text                    |
| Font size / weight        | `--sn-mp-font-size-md`, `--sn-mp-font-weight-medium`                 | Label typography                   |
| Spacing / radius          | `--sn-mp-spacing-1`~`--sn-mp-spacing-4`, `--sn-mp-radius-sm/md/full` | Strip padding, pill / dot geometry |
| Icon size                 | `--sn-mp-icon-size-small`                                            | Nav icon geometry                  |

## Accessibility

- The strip is `role="tablist"`; every tab is `role="tab"` with
  `aria-selected`, `aria-disabled` and `aria-label` from `title`.
- Panels are `role="tabpanel"` with `aria-hidden="true"` while inactive.
- Nav icons and badges are `aria-hidden`, so they stay out of the accessible name.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-003); additive abilities AUI-OPT-10.
