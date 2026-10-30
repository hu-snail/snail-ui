# sn-drop-menu — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-drop-menu component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Filter bar with a slide-out option list — the classic "sort by / filter" bar at
the top of a mobile list page. One selection is kept in `v-model`; the bar shows
the selected label (or `title`).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-drop-menu`
(https://wot-ui.cn/component/drop-menu.html). New props added here MUST also be
added to the wd-drop-menu parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-drop-menu v-model="sort" :options="options" @change="onSort" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnDropMenu } from '@snui/uni';
```

## Props

| Name                | Type                                          | Default        | Required | Description                                                                   |
| ------------------- | --------------------------------------------- | -------------- | -------- | ----------------------------------------------------------------------------- |
| `modelValue`        | `string \| number`                            | `''`           | no       | Current selected value (`v-model`).                                           |
| `options`           | `SnDropMenuOption[]`                          | `[]`           | no       | Option rows; field names configurable via `valueKey` / `labelKey` / `tipKey`. |
| `direction`         | `'up' \| 'down'`                              | `'down'`       | no       | Menu expansion direction.                                                     |
| `zIndex`            | `number`                                      | `12`           | no       | Authored stacking level (idle). While the panel is mounted the root is raised to at least the overlay band (90) — see Stacking.                                                      |
| `modal`             | `boolean`                                     | `true`         | no       | Render the scrim behind the panel.                                            |
| `closeOnClickModal` | `boolean`                                     | `true`         | no       | Close the menu when the scrim is tapped.                                      |
| `duration`          | `number`                                      | `200`          | no       | Open / close animation duration in ms.                                        |
| `disabled`          | `boolean`                                     | `false`        | no       | Disable the whole menu — taps are ignored.                                    |
| `iconName`          | `string`                                      | `'check'`      | no       | Icon name of the selected-row check glyph (registry / built-in catalogue).    |
| `title`             | `string`                                      | `''`           | no       | Menu title; when set it replaces the selected label in the bar.               |
| `icon`              | `string`                                      | `'caret-down'` | no       | Icon name of the bar arrow. `caret-down` is direction-relative: it rests on the up chevron for `direction: 'up'`. Any other name / glyph is honoured verbatim. |
| `iconSize`          | `string \| number`                            | `''`           | no       | Glyph scale for the arrow, the selected-row check and every option icon: a tier (`tiny\|small\|medium\|large\|xlarge` → `--sn-mp-icon-size-*`), a px number, or any CSS length. Empty = the `medium` tier. |
| `beforeToggle`      | `({ status }) => boolean \| Promise<boolean>` | —              | no       | Guard before the menu toggles; `false` blocks it.                             |
| `valueKey`          | `string`                                      | `'value'`      | no       | Field name of the option value.                                               |
| `labelKey`          | `string`                                      | `'label'`      | no       | Field name of the option label.                                               |
| `tipKey`            | `string`                                      | `'tip'`        | no       | Field name of the option tip.                                                 |
| `customPopupClass`  | `string`                                      | `''`           | no       | Custom class for the option list panel.                                       |
| `customPopupStyle`  | `string`                                      | `''`           | no       | Custom inline style for the option list panel.                                |
| `popupHeight`       | `string`                                      | `''`           | no       | Panel height; empty = at most 80% of the viewport.                            |
| `customClass`       | `string`                                      | `''`           | no       | Custom class for the root node.                                               |
| `customStyle`       | `string`                                      | `''`           | no       | Custom inline style for the root node.                                        |
| `rootPortal`        | `boolean`                                     | `false`        | no       | **Not implemented** — declared for parity; miniprogram has no portal host.    |

### `SnDropMenuOption`

| Field      | Type               | Description                                             |
| ---------- | ------------------ | ------------------------------------------------------- |
| `label`    | `string`           | Row label (key configurable).                           |
| `value`    | `string \| number` | Value echoed back through `v-model` (key configurable). |
| `tip`      | `string`           | Secondary tip line (key configurable).                  |
| `disabled` | `boolean`          | Disable the row — taps are ignored.                     |
| `iconData` | `IconData`         | Row icon as inline SVG data. **Additive (AUI-OPT-16)** — highest precedence. |
| `iconUrl`  | `string`           | Row icon as an image URL, rendered as `<image>`. **Additive** — wins over `icon`, loses to `iconData`. |
| `icon`     | `string`           | Row icon as a name (registry → built-in catalogue → `prefix:rest` provider). **Additive** — lowest precedence. |

Row-icon precedence: `iconData` > `iconUrl` > `icon`.

## Stacking (occlusion fix — AUI-OPT-16)

The root is a positioned box, so its own `z-index` caps every child; the
reference default (12) sits below the app's transient band, so an open panel was
covered by `sn-fab` / banners. The fix keeps `zIndex` as the authored (idle)
level and adds two local custom properties on the root:

- `--sn-drop-menu-z-index` — the authored level, used while idle.
- `--sn-drop-menu-overlay-z-index` — the same level floored at 90.

While the panel node is mounted (open leg **and** close animation) the root
carries `sn-drop-menu--raised`, switching it to the floored level. 90 clears page
chrome (10) / popups (10) / pickers (15) / `sn-fab` (99−1) while staying under
dialogs (99) and toasts (100). An explicit `zIndex` above the floor passes
through untouched.

## Events

| Name                | Payload                   | Description                                     |
| ------------------- | ------------------------- | ----------------------------------------------- |
| `update:modelValue` | `string \| number`        | Selected value changed.                         |
| `change`            | `{ value, selectedItem }` | A row was picked.                               |
| `open`              | —                         | The menu started expanding.                     |
| `opened`            | —                         | The expansion animation finished.               |
| `close`             | —                         | The menu started closing.                       |
| `closed`            | —                         | The close animation finished (panel unmounted). |

## Slots

| Name      | Description                                  |
| --------- | -------------------------------------------- |
| `default` | Custom panel body; replaces the option list. |

## Exposed Methods

| Name           | Description                               |
| -------------- | ----------------------------------------- |
| `getShowPop()` | Whether the menu is currently open.       |
| `open()`       | Open the menu (respects `beforeToggle`).  |
| `close()`      | Close the menu (respects `beforeToggle`). |
| `toggle()`     | Toggle the menu.                          |

## Tokens Consumed (end: mp)

| Token         | CSS Variable                                            | Purpose                      |
| ------------- | ------------------------------------------------------- | ---------------------------- |
| Surface       | `--sn-mp-color-background-elevated`                     | Bar + panel background       |
| Scrim         | `--sn-mp-color-background-overlay`                      | Scrim                        |
| Text          | `--sn-mp-color-text-primary`                            | Bar label, option label      |
| Muted text    | `--sn-mp-color-text-secondary/tertiary`                 | Placeholder, tip line, arrow, option icons |
| Accent        | `--sn-mp-color-action-primary`                          | Active option + arrow + active icon |
| Disabled text | `--sn-mp-color-text-disabled`                           | Disabled bar / row / option icon |
| Border        | `--sn-mp-color-border-subtle`                           | Panel + row separators       |
| Elevation     | `--sn-mp-shadow-md`                                     | Panel shadow                 |
| Radius        | `--sn-mp-radius-xs` (doodle outline, option image)      | Skin outline / image icon    |
| Spacing       | `--sn-mp-spacing-2/3/4`                                 | Bar / row padding            |
| Typography    | `--sn-mp-font-size-md/xs`, `--sn-mp-font-weight-medium` | Row text                     |
| Icon size     | `--sn-mp-icon-size-tiny/small/medium/large/xlarge`      | Arrow / check / option glyph scale (`iconSize` tiers) |

## Accessibility

- Bar carries `role="button"` + `aria-expanded` + `aria-disabled`
- Option rows carry `role="menuitem"` + `aria-disabled`
- Scrim is `aria-hidden="true"`
- Image option icons are `aria-hidden="true"` (decorative — the row label carries the meaning)
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Documented Divergences

- wot-ui splits the bar and `wd-drop-menu-item` children; uni-app easycom cannot
  require a compound child (and a `v-for` over one would lose the parent/child
  wiring), so the option list lives in `options` on this single component. The
  wd `desc` column documents exactly that array shape (`{ label, value, tip }`).
- `root-portal` is declared but not implemented.
- `custom-popup-class` / `custom-popup-style` target the inline option panel, not
  a `wd-popup` instance.

## Disposal

One transition timer drives the open / closed legs; it is cleared in
`onBeforeUnmount` (AGENTS.md §41). A `beforeToggle` promise that resolves after
unmount is dropped by the same generation token. No global listener.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 overlay / interaction batch.
