# sn-sidebar / sn-sidebar-item — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-sidebar / sn-sidebar-item component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-sidebar / wd-sidebar-item`, prop surface mirrored 1:1.

## Purpose

Vertical side-navigation container plus entries. The container owns the
single-value `v-model`; entries read it through `provide`/`inject`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-sidebar v-model="active">
  <sn-sidebar-item label="全部" :value="0" />
</sn-sidebar>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSidebar } from '@snui/uni/components/sn-sidebar/sn-sidebar.vue'
import { SnSidebarItem } from '@snui/uni/components/sn-sidebar/sn-sidebar-item.vue'
```

## Props — sn-sidebar

| Name | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| number` | `0` | Active value. |
| `beforeChange` | `(value) => boolean \| Promise<boolean>` | `undefined` | Veto hook. |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

## Props — sn-sidebar-item

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `''` | Entry title. |
| `value` | `string \| number` | `undefined` | Entry value; falls back to `label`. |
| `badge` | `string \| number` | `undefined` | Badge rendering. |
| `isDot` | `boolean` | `false` | Badge rendering. |
| `max` | `number` | `99` | Badge rendering. |
| `icon` | `string` | `''` | Icon resolution. |
| `iconPrefix` | `string` | `''` | Icon resolution. |
| `cssIcon` | `boolean \| string` | `false` | Icon resolution. |
| `disabled` | `boolean` | `false` | Disable this entry. |
| `customClass` | `string` | `''` | Entry root forwarding. |
| `customStyle` | `string` | `''` | Entry root forwarding. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `string \| number` | Active value changed. |
| `change` | `{ value, label }` | Active entry switched. |

## Slots

| Name | Description |
|---|---|
| `default (sidebar)` | SidebarItem list. |
| `icon (item)` | Custom icon content. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Track / active surface | `--sn-mp-color-background-soft`, `--sn-mp-color-background-surface` | Sidebar and active entry |
| Text | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-disabled` | Inactive / disabled labels |
| Action primary | `--sn-mp-color-action-primary` | Active label and indicator |
| Badge | `--sn-mp-color-feedback-danger`, `--sn-mp-color-text-on-primary` | Badge fill and text |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-radius-xs`, `--sn-mp-spacing-3` | Label and entry geometry |

## Accessibility

- Container is `role="tablist"` with `aria-orientation="vertical"`.
- Every entry is `role="tab"` with `aria-selected`, `aria-disabled` and `aria-label`.
- Badges are decorative; the label carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-005).
