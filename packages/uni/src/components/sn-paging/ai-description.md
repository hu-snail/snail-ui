# sn-paging — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-paging component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library **z-paging**, registered as a
> user-directed exception in AGENTS.md §112.4a. The prop surface is a curated
> z-paging subset; the embedded spinner/footer indicators follow
> `wd-loading` / `wd-loadmore`.

## Purpose

Pull-to-refresh + load-more list container. The pull gesture is `scroll-view`'s
native refresher (`refresher-enabled` + custom `refresher` slot) and load-more
is native `@scrolltolower` — no JS touch simulation, so the component stays
light and the gesture runs on the platform scroll layer. The host fetches data
in `@query` and reports back through `complete*`; pages are aggregated and
pushed out via `v-model`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-paging v-model="list" @query="query" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnPaging } from '@snui/uni'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `unknown[]` | `[]` | v-model — aggregated list; render it in the default slot. |
| `auto` | `boolean` | `true` | Fire the first query automatically after mount. |
| `defaultPageNo` | `number` | `1` | First page number emitted by `query`. |
| `defaultPageSize` | `number` | `10` | Page size; a shorter page ends the sequence. |
| `refresherEnabled` | `boolean` | `true` | Enable the native pull-to-refresh gesture. |
| `refresherThreshold` | `number` | `45` | Arming pull distance (px, scroll-view contract). |
| `refresherDefaultText` | `string` | `'继续下拉刷新'` | Text while pulling below the threshold. |
| `refresherPullingText` | `string` | `'松开立即刷新'` | Text once past the threshold. |
| `refresherRefreshingText` | `string` | `'正在刷新...'` | Text while the refresh query is in flight. |
| `refresherCompleteText` | `string` | `'刷新成功'` | Text held after a successful refresh. |
| `refresherCompleteDuration` | `number` | `500` | Success-text hold in ms; `0` skips the hold. |
| `loadMoreEnabled` | `boolean` | `true` | Enable next-page loading on scroll-to-bottom. |
| `lowerThreshold` | `number` | `50` | Distance from bottom firing load-more (px). |
| `loadMoreDefaultText` | `string` | `'点击加载更多'` | Idle footer text; tap loads the next page. |
| `loadMoreLoadingText` | `string` | `'正在加载中...'` | Footer text while a page is loading. |
| `loadMoreNoMoreText` | `string` | `'没有更多了'` | Footer text once every page is loaded. |
| `loadMoreFailText` | `string` | `'加载失败，点击重试'` | Footer text after a failure; tap retries. |
| `emptyText` | `string` | `'暂无数据'` | Built-in empty view text. |
| `customClass` | `string` | `''` | Root scroll-view class forwarding. |
| `customStyle` | `string` | `''` | Root scroll-view style forwarding. |

## Events

| Name | Payload | Description |
|---|---|---|
| `query` | `(pageNo: number, pageSize: number)` | Every query (first load / pull / scroll-bottom / retry); the host must answer via `complete*`. |
| `update:modelValue` | `unknown[]` | v-model update with the aggregated list. |
| `scroll` | `event` | scroll-view `@scroll` passthrough (e.g. feeding sn-backtop). |

## Slots

| Name | Description |
|---|---|
| `default` | List rows; render the bound v-model array here. |
| `empty` | Replaces the built-in empty view. |
| `refresher` | Replaces the built-in refresher content (icon + text). |

## Methods (via ref)

| Name | Signature | Description |
|---|---|---|
| `refresh` | `() => void` | Refresh with the refresher animation; resets to `defaultPageNo`. |
| `reload` | `() => void` | Refresh without the animation. |
| `complete` | `(data: unknown[] \| false \| null, success?: boolean) => void` | Report a finished query; non-array data (or `success=false`) fails it. |
| `completeByTotal` | `(data: unknown[], total: number) => void` | Sequence ends once the aggregated list reaches `total`. |
| `completeByNoMore` | `(data: unknown[], noMore: boolean) => void` | Sequence ends per the explicit flag. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-tertiary` | Refresher / footer / empty texts |
| Feedback | `--sn-mp-color-feedback-danger` | Fail footer text |
| Font / spacing | `--sn-mp-font-size-sm`, `--sn-mp-font-line-height-normal`, `--sn-mp-spacing-2/4/5/10` | Text geometry and paddings |

## Accessibility

- Footer is `role="status"` with `aria-live="polite"` / `aria-busy` while loading.
- The refresher slot is decorative (`aria-hidden`) — the gesture itself is the interaction.
- Empty view text is announced through the footer/empty semantics of the host page.

## Versioning

`@snui/uni@0.1.0` — business/data container (user-directed reference, AGENTS.md §112.4a).
