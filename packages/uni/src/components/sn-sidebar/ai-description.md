# sn-sidebar / sn-sidebar-item — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-sidebar / sn-sidebar-item component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-sidebar / wd-sidebar-item`, prop surface mirrored 1:1.
> Scroll linkage (`scroll-spy` / `scroll-top` / `anchor-selector` / `scroll-threshold` /
> `anchor`) is additive — AUI-OPT-08, AGENTS.md §112.3a — and has no upstream counterpart.

## Purpose

Vertical side-navigation container plus entries. The container owns the
single-value `v-model`; entries read it through `provide`/`inject`.

`scroll-spy` additionally links the highlight to the content area: the host
reports its scroll distance through `scroll-top` (a `scroll-view` `@scroll` or
the page's `onPageScroll`), each entry names the section it owns through
`anchor`, and the container measures those sections in one pass through
`anchor-selector` to resolve which entry is on screen. The component neither
listens to `window` nor owns the scroll container.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-sidebar v-model="active">
  <sn-sidebar-item label="全部" :value="0" />
</sn-sidebar>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnSidebar } from '@snui/uni/components/sn-sidebar/sn-sidebar.vue';
import { SnSidebarItem } from '@snui/uni/components/sn-sidebar/sn-sidebar-item.vue';
```

## Props — sn-sidebar

| Name              | Type                                     | Default     | Description                                                                  |
| ----------------- | ---------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `modelValue`      | `string \| number`                       | `0`         | Active value.                                                                |
| `beforeChange`    | `(value) => boolean \| Promise<boolean>` | `undefined` | Veto hook (taps only — scroll-driven switches skip it).                      |
| `customClass`     | `string`                                 | `''`        | Root forwarding.                                                             |
| `customStyle`     | `string`                                 | `''`        | Root forwarding.                                                             |
| `scrollSpy`       | `boolean`                                | `false`     | Linkage on/off (additive — AUI-OPT-08).                                      |
| `scrollTop`       | `number`                                 | `0`         | Content scroll distance in px, reported by the host (linkage only).          |
| `anchorSelector`  | `string`                                 | `''`        | CSS selector of the content sections; each section `id` = an entry `anchor`. |
| `scrollThreshold` | `number`                                 | `0`         | Extra px on the activation line (`line = scrollTop + scrollThreshold`).      |

## Props — sn-sidebar-item

| Name          | Type                | Default     | Description                                                                            |
| ------------- | ------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `label`       | `string`            | `''`        | Entry title.                                                                           |
| `value`       | `string \| number`  | `undefined` | Entry value; falls back to `label`.                                                    |
| `badge`       | `string \| number`  | `undefined` | Badge rendering.                                                                       |
| `isDot`       | `boolean`           | `false`     | Badge rendering.                                                                       |
| `max`         | `number`            | `99`        | Badge rendering.                                                                       |
| `icon`        | `string`            | `''`        | Icon resolution.                                                                       |
| `iconPrefix`  | `string`            | `''`        | Icon resolution.                                                                       |
| `cssIcon`     | `boolean \| string` | `false`     | Icon resolution.                                                                       |
| `disabled`    | `boolean`           | `false`     | Disable this entry.                                                                    |
| `customClass` | `string`            | `''`        | Entry root forwarding.                                                                 |
| `customStyle` | `string`            | `''`        | Entry root forwarding.                                                                 |
| `anchor`      | `string`            | `''`        | Section `id` this entry follows (additive — AUI-OPT-08); `''` opts out of the linkage. |

## Scroll Linkage Contract (additive — AUI-OPT-08, AGENTS.md §112.3a)

- Activation line: `scrollTop + scrollThreshold`; section offsets are measured
  relative to the highest linked section (a single layout snapshot, so the
  differences are scroll-invariant). Content starting at the first linked
  section shares that origin; content above it is cancelled with a negative
  `scrollThreshold`.
- Scroll-driven switches emit `update:modelValue` + `change` and bypass
  `beforeChange` — a tap veto must not desync the highlight from the visible
  section.
- `refresh()` re-measures after the linked content changes; a host without a
  usable `uni.createSelectorQuery()` (or a failed query) is a no-op that keeps
  the previous offsets.
- Offsets come from `uni.createSelectorQuery().selectAll(selector).fields({ id, rect })`
  (page-level: the sections belong to the host page, not to the sidebar).

## Methods

| Name      | Type                              | Description                                                          |
| --------- | --------------------------------- | -------------------------------------------------------------------- |
| `select`  | `(value, label) => Promise<void>` | Switch from code; runs `beforeChange`, scroll switches skip it.      |
| `refresh` | `() => void`                      | Re-measure the content sections (effective while `scrollSpy` is on). |

## Events

| Name                | Payload            | Description                                                         |
| ------------------- | ------------------ | ------------------------------------------------------------------- |
| `update:modelValue` | `string \| number` | Active value changed. Fires for taps and scroll-driven switches.    |
| `change`            | `{ value, label }` | Active entry switched (tap, `select()`, or a scroll-driven switch). |

## Slots

| Name                | Description          |
| ------------------- | -------------------- |
| `default (sidebar)` | SidebarItem list.    |
| `icon (item)`       | Custom icon content. |

## Tokens Consumed (end: mp)

| Token                   | CSS Variable                                                        | Purpose                    |
| ----------------------- | ------------------------------------------------------------------- | -------------------------- |
| Track / active surface  | `--sn-mp-color-background-soft`, `--sn-mp-color-background-surface` | Sidebar and active entry   |
| Text                    | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-disabled`       | Inactive / disabled labels |
| Action primary          | `--sn-mp-color-action-primary`                                      | Active label and indicator |
| Badge                   | `--sn-mp-color-feedback-danger`, `--sn-mp-color-text-on-primary`    | Badge fill and text        |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-radius-xs`, `--sn-mp-spacing-3`    | Label and entry geometry   |

## Accessibility

- Container is `role="tablist"` with `aria-orientation="vertical"`.
- Every entry is `role="tab"` with `aria-selected`, `aria-disabled` and `aria-label`.
- Badges are decorative; the label carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-005).
