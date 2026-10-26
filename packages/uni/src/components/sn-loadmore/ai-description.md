# sn-loadmore — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-loadmore component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

List footer that reports the paging state: loading, finished or failed (with a retry tap).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-loadmore`
(https://wot-ui.cn/component/loadmore.html). New props added here MUST also be
added to the wd-loadmore parity list.

## Not implemented (documented divergences)

- The reference's i18n default texts are hardcoded to Simplified Chinese (the uni
  end has no locale provider yet). Pass the `*-text` props to localize.
- `loading-props` forwards the honoured `sn-loading` subset (`type` / `color` /
  `size` / `direction` / `inheritColor`).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-loadmore state="loading" />
```

```ts
import { SnLoadmore } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `state` | '' | 'loading' | 'finished' | 'error' | '' | no | Current load state; empty renders nothing. |
| `loadingText` | string | '正在努力加载中...' | no | Loading text. |
| `finishedText` | string | '已加载完毕' | no | Finished text. |
| `errorText` | string | '加载失败' | no | Error text. |
| `loadingProps` | Record<string, unknown> | {} | no | Props forwarded to the inner sn-loading. |
| `customClass` | string | '' | no | Custom class for the root node. |
| `customStyle` | string | '' | no | Custom inline style for the root node. |

## Events

| Event | Payload | Description |
|---|---|---|
| `reload` | — | Error state tapped (host should retry the request). |

## Slots

| Slot | Description |
|---|---|
| `loading` | Custom loading content. |
| `finished` | Custom finished content. |
| `error` | Custom error content. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text secondary | `--sn-mp-color-text-secondary` | Loading text |
| Text tertiary | `--sn-mp-color-text-tertiary` | Finished text |
| Feedback danger | `--sn-mp-color-feedback-danger` | Error text |
| Action primary | `--sn-mp-color-action-primary` | Retry hint |
| Font size SM | `--sn-mp-font-size-sm` | Footer text size |
| Line height normal | `--sn-mp-font-line-height-normal` | Footer line height |
| Spacing 2 / 4 / 5 | `--sn-mp-spacing-2 …` | Padding + gap |

## Accessibility

- Root: `role="status"` + `aria-live="polite"` + `aria-busy` mirroring `state === "loading"`.
- The error state is tappable; the retry hint is a visible text label.

## Dispose

State-driven by design: no timer, no intersection observer, no scroll listener.
The host page owns the paging request (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
