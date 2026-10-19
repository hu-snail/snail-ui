# SnPagination — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end pagination component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A pagination bar: page buttons with ellipsis collapsing, prev / next
arrows, an optional total line, a quick page-jumper input, and a
per-page-size picker. Controlled and uncontrolled page / pageSize modes.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-pagination` (https://www.naiveui.com/zh-CN/light/components/pagination).
Task ID: AUI-WEB-NAV-009.

## Import

```ts
import SnPagination from '@snui/vue-web/src/pagination/SnPagination.vue'
// or, once registered by the package entry:
import { SnPagination } from '@snui/vue-web'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `page` | `number \| undefined` | `undefined` | no | Current page (controlled). Falls back to internal state when undefined. |
| `itemCount` | `number` | `0` | no | Total item count used to derive the page count. |
| `pageSize` | `number \| null \| undefined` | `undefined` | no | Page size (controlled); `undefined` / `null` → internal state. |
| `defaultPage` | `number` | `1` | no | Initial page for uncontrolled mode. |
| `defaultPageSize` | `number` | `10` | no | Initial page size for uncontrolled mode. |
| `pageCount` | `number \| undefined` | `undefined` | no | Explicit page count; takes precedence over `itemCount / pageSize`. |
| `pageSizes` | `Array<number \| { label: string; value: number }>` | `[10, 20, 30, 40]` | no | Options for the size picker; plain numbers render as `N / 页`. |
| `showQuickJumper` | `boolean` | `false` | no | Render the jump-to-page input (Enter commits). |
| `showSizePicker` | `boolean` | `false` | no | Render the page-size picker (SnSelect). |
| `pageSlot` | `number` | `9` | no | Max page buttons before collapsing into first / last / neighborhood + `…`. |
| `showTotal` | `boolean` | `false` | no | Show the `共 N 条` total. |
| `simple` | `boolean` | `false` | no | Compact mode: prev / page input / count / next only. |
| `disabled` | `boolean` | `false` | no | Disable every control. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:page` | `(page: number)` | Page committed (button click / jumper / simple input). |
| `update:pageSize` | `(pageSize: number)` | Page size committed via the size picker. |

## Slots

| Name | Params | Description |
|---|---|---|
| `prev` | — | Custom arrow content for the prev button. |
| `next` | — | Custom arrow content for the next button. |
| `prefix` | — | Content rendered before the pager. |
| `suffix` | — | Content rendered after the pager. |
| `label` | `{ page: number }` | Custom page-number label. |

## Divergences from the reference API

- `…` markers are static, aria-hidden indicators (no hover-to-jump
  fast-forward / fast-backward buttons).
- `showQuickJumper` accepts `boolean` only (no `{ goButton }` variant).
- `prefix` / `suffix` are slots (the reference declares render-function
  props; slots are the idiomatic Vue mapping).
- `itemCount` defaults to `0` instead of being required.
- Fixed zh locale strings (共 N 条 / 跳至 / N / 页); no config-provider /
  RTL integration (web-end v3 has no provider yet).
- Theme → web tokens: item height `--sn-web-button-height-small`
  (fallback 28px), active page = action-primary 16% tint + primary text,
  8px item gap.

## Accessibility

- Root: `role="navigation"` + `aria-label="Pagination"`.
- Active page button: `aria-current="page"`; page buttons carry
  `aria-label="第 N 页"`; prev / next carry 上一页 / 下一页.
- All controls are native `<button>` / `<input>` elements — keyboard
  operable; `disabled` sets the native attribute.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text secondary | `--sn-web-color-text-secondary` | Base text / ellipsis |
| Text tertiary | `--sn-web-color-text-tertiary` | Total / jumper label / page count |
| Action primary | `--sn-web-color-action-primary` | Active page tint + text |
| Button height small | `--sn-web-button-height-small` | 28px item height |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-NAV-009.
