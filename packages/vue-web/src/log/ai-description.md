# SnLog — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end log component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A fixed-height scrolling viewer for streaming text logs, with reach /
require-more events for incremental loading and a built-in loading pill.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui `n-log`
(https://www.naiveui.com/zh-CN/light/components/log).

## Import

```ts
import SnLog from '@snui/vue-web/src/log/SnLog.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `log` | `string` | `undefined` | no | Log content; split into lines on `\n`. Takes precedence over `lines`. |
| `lines` | `string[]` | `[]` | no | Log lines; ignored when `log` is a non-empty string. |
| `trim` | `boolean` | `false` | no | Trim each displayed line. |
| `loading` | `boolean` | `false` | no | Show the loading indicator pill. |
| `fontSize` | `number` | `14` | no | Text size in px. |
| `lineHeight` | `number` | `1.25` | no | Unitless line-height. |
| `rows` | `number` | `15` | no | Visible row count; height = round(rows × line-height × font-size) px. |
| `offsetTop` | `number` | `0` | no | Top reach tolerance in px. |
| `offsetBottom` | `number` | `0` | no | Bottom reach tolerance in px. |

## Events

| Name | Parameters | Description |
|---|---|---|
| `reach-top` | — | Scrolled to the top (within `offset-top`). |
| `reach-bottom` | — | Scrolled to the bottom (within `offset-bottom`). |
| `require-more` | `'top' \| 'bottom'` | Scrolled past a tolerance; fires repeatedly while scrolling at the edge. |

## Methods

| Name | Signature | Description |
|---|---|---|
| `scrollTo` | `(options: { top?: number, position?: 'top' \| 'bottom', silent?: boolean }) => void` | Programmatic scroll; `silent` suppresses reach / require-more events for the triggered scroll. |

## Divergences from the reference API

- `language` / `hljs` highlighting is not implemented (no new dependency) —
  future marker.
- `spin-props` is not implemented; the loading pill uses an internal
  inline-SVG spinner — future marker.
- Scrolling uses a native overflow container instead of a custom scrollbar;
  the event / scrollTo geometry behaves identically.

## Behavior notes

- An empty `log` string falls through to `lines` (reference semantics).
- `require-more` keeps firing while the user keeps scrolling at an edge;
  `reach-top` / `reach-bottom` fire once per arrival.
- Lines render inside `pre` elements (`white-space: pre-wrap;
  word-break: break-word`), so long lines soft-wrap.

## Accessibility

- The loading pill carries `role="status"` so screen readers announce it.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-web-color-text-primary` | Log text + loader label |
| Action primary | `--sn-web-color-action-primary` | Loader spinner color |
| Background overlay | `--sn-web-color-background-overlay` | Loader pill background |
| Border default | `--sn-web-color-border-default` | Loader pill border |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-013.
