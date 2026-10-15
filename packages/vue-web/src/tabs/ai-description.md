# SnTabs / SnTabPane — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end tabs pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Tabbed panels. `SnTabs` renders a tab strip; each `SnTabPane` child
contributes one tab and its panel content. Used for detail-page section
switching, settings panes, dashboard views.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-tabs` + `n-tab-pane`
(https://www.naiveui.com/zh-CN/light/components/tabs).

## Import

```ts
import { SnTabs, SnTabPane } from '@snui/vue-web'
```

## SnTabs Props

| Name | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| number` | `undefined` | Active pane name (controlled, `v-model:value`). |
| `defaultValue` | `string \| number` | `undefined` | Initial active pane name (uncontrolled). |
| `trigger` | `'click' \| 'hover'` | `'click'` | Whether tabs activate on click or hover. |
| `type` | `'line' \| 'card' \| 'bar' \| 'segment'` | `'bar'` | Tab strip visual style. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tab strip size. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left' \| 'start' \| 'end'` | `'top'` | Strip position. `start`/`end` are deprecated aliases for `left`/`right`. |
| `closable` | `boolean` | `false` | Show a close button on every tab. |
| `addable` | `boolean \| { disabled?: boolean }` | `false` | Show a trailing "+" tab. |
| `animated` | `boolean` | `false` | Animate the pane area on switch (class hook only). |
| `justifyContent` | `'space-between' \| 'space-around' \| 'space-evenly' \| 'center' \| 'start' \| 'end'` | `undefined` | Distribute tab strip items along the main axis. |
| `tabsPadding` | `number` | `0` | Extra padding (px) around the whole tabs container. |
| `showScrollButton` | `boolean` | `false` | Declared for parity; the strip clips instead of scrolling. |
| `tabStyle` | `string \| CSSProperties` | `undefined` | Inline style applied to every tab. |
| `tabClass` | `string` | `undefined` | Class applied to every tab. |
| `addTabStyle` | `string \| CSSProperties` | `undefined` | Inline style for the add tab. |
| `addTabClass` | `string` | `undefined` | Class for the add tab. |
| `paneClass` | `string` | `undefined` | Class applied to every pane. |
| `paneStyle` | `string \| CSSProperties` | `undefined` | Inline style applied to every pane. |
| `onBeforeLeave` | `(name, oldName) => boolean \| Promise<boolean>` | `undefined` | Guard fired before switching; falsy blocks the switch. |

## SnTabPane Props

| Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string \| number` | — | Unique identifier within the parent SnTabs. Required. |
| `tab` | `string \| number` | `undefined` | Tab label. Falls back to `name`. |
| `disabled` | `boolean` | `false` | Disable activation of this pane. |
| `displayDirective` | `'if' \| 'show' \| 'show:lazy'` | `'if'` | Hidden-pane handling: unmount, keep-DOM, or keep-after-first-show. |
| `closable` | `boolean` | `undefined` | Per-pane closable override. |

## Events

| Event | Payload | When |
|---|---|---|
| `update:value` | `(value: string \| number)` | Active pane changed (`v-model:value`). |
| `close` | `(name: string \| number)` | Close button clicked on a tab. |
| `add` | `()` | Add tab clicked. |

## Slots

| Component | Slot | Description |
|---|---|---|
| `SnTabs` | `default` | Sequence of `<SnTabPane>` children. |
| `SnTabs` | `prefix` | Content before the tab strip. |
| `SnTabs` | `suffix` | Content after the tab strip. |
| `SnTabPane` | `default` | Pane body content. |

## §112 future markers

- `centerActiveTab` / `barWidth` — require strip layout measurement
  (ResizeObserver); cosmetic only, deferred.
- `SnTabPane` `tab` / `prefix` / `suffix` slots for rich (vnode) labels —
  the strip currently renders the `tab` prop as plain text.
- `syncBarPosition` / `scrollToCurrentTab` instance methods.
- `TabsButton` scroll arrows (`showScrollButton` is a declared no-op).

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Active/action color | `--sn-web-color-action-primary` | Active tab text + indicator |
| Surface | `--sn-web-color-background-surface` | Active card/segment background |
| Soft background | `--sn-web-color-background-soft` | Segment track, hover states |
| Border | `--sn-web-color-border-default` | Line/card underline + dividers |
| Text secondary | `--sn-web-color-text-secondary` | Inactive tab text |
| Text tertiary | `--sn-web-color-text-tertiary` | Disabled tab, close icon |
| Focus ring | `--sn-web-focus-ring` | `:focus-visible` outline |

## Accessibility

- `role="tablist"` on the strip, `aria-orientation` reflects placement
- `role="tab"` + `aria-selected` on each tab
- `aria-disabled` on disabled tabs
- `role="tabpanel"` + `aria-hidden` on inactive panes
- Roving tabindex: only the active tab is tabbable (`tabindex=0`, others `-1`)
- `:focus-visible` ring on the focused tab

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-NAV-002 (M1 navigation
Web components, header nav row).
