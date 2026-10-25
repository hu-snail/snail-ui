# sn-paging List Container (uni)

`sn-paging` is a pull-to-refresh + load-more list container. The gesture work
is delegated to the native `scroll-view` refresher and the native
scroll-to-bottom event — there is no JS touch simulation inside the component,
which keeps it light with zero extra cost on the scroll layer. The host
fetches data in `@query`, reports back through `complete*`, and the component
aggregates pages and pushes them out via `v-model`.

## When to use

- List pages that need pull-to-refresh plus auto load-more on scroll-to-bottom
- Minimal paging protocol (`@query` + `complete`) with unified empty / loading
  / no-more / fail-retry states
- Customizable empty view, refresher texts, or disabling either gesture

## Demos

### Basic usage

Bind the aggregated list with `v-model`, request inside `@query`, and report
with `completeByTotal`. The sequence stops when the last page is shorter than
the page size or the total is reached.

<Demo name="paging-mp-basic" description="Pull-to-refresh, auto load-more, completeByTotal stopping." />

### Empty and fail-retry states

<Demo name="paging-mp-states" description="Empty data renders the empty slot; complete(false) simulates a failure with a tappable retry footer; reload() restarts." />

### Pure scroll container and gesture switches

<Demo name="paging-mp-scroll" description="Two switches toggle pull-to-refresh / load-more live; both off degrades to a plain scroll container." />

### App case: channel tabs + detail page

<Demo name="paging-mp-app" description="#top search bar and tabs, #bottom fixed action bar (safe-area padded); tapping a row opens a detail page with its own paged reply list." />

## Protocol

```ts
// 1. bind the list with v-model; 2. request in @query; 3. report via complete*
function query(pageNo: number, pageSize: number): void {
  fetchPage(pageNo, pageSize)
    .then(({ rows, total }) => paging.value.completeByTotal(rows, total))
    .catch(() => paging.value.complete(false))
}
```

- **Stopping rule**: `completeByTotal` stops once the aggregated length
  reaches `total`; `completeByNoMore` follows the explicit flag; plain
  `complete` stops when the returned page is shorter than `defaultPageSize`.
- **Failure semantics**: `complete(false)` (or a non-array payload) marks a
  failure — a failed first load shows a tappable retry footer; a failed
  load-more keeps the loaded rows, the footer enters the fail state, and
  tapping retries the same page.
- **Height contract**: the root fills its parent (`height: 100%`); the parent
  must provide a definite height.
- **Pure scroll container**: with `refresher-enabled=false` and
  `load-more-enabled=false` the component issues no queries, renders no
  footer, and acts as a plain scroll container; both switches are independent
  and take effect live.
- **Gesture hosts**: uni runtimes (MP / App / uni H5) use the native refresher
  and bottom events; plain browser hosts (the docs preview) automatically
  enable a built-in touch fallback, so both gestures work there too.

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` | `unknown[]` | `[]` | Aggregated list, rendered through the default slot |
| `auto` | `boolean` | `true` | Fire the first `query` after mount |
| `defaultPageNo` | `number` | `1` | First page number |
| `defaultPageSize` | `number` | `10` | Page size; a shorter returned page stops the sequence |
| `refresherEnabled` | `boolean` | `true` | Enable the pull-to-refresh gesture |
| `refresherThreshold` | `number` | `45` | Arming pull distance (px, scroll-view contract) |
| `refresherDefaultText` | `string` | `继续下拉刷新` | Refresher text below the threshold |
| `refresherPullingText` | `string` | `松开立即刷新` | Refresher text past the threshold |
| `refresherRefreshingText` | `string` | `正在刷新...` | Text while the refresh query is in flight |
| `refresherCompleteText` | `string` | `刷新成功` | Text held after a successful refresh |
| `refresherCompleteDuration` | `number` | `500` | Success-text hold in ms; `0` skips the hold |
| `loadMoreEnabled` | `boolean` | `true` | Enable auto load-more on scroll-to-bottom |
| `lowerThreshold` | `number` | `50` | Distance from the bottom that fires load-more (px) |
| `loadMoreDefaultText` | `string` | `点击加载更多` | Idle footer text; tap loads the next page |
| `loadMoreLoadingText` | `string` | `正在加载中...` | Footer text while loading |
| `loadMoreNoMoreText` | `string` | `没有更多了` | Footer text once everything is loaded |
| `loadMoreFailText` | `string` | `加载失败，点击重试` | Footer text after a failure |
| `emptyText` | `string` | `暂无数据` | Built-in empty view text |
| `safeAreaInsetBottom` | `boolean` | `false` | Pad the container bottom for the device safe area |
| `customClass` | `string` | `''` | Root class forwarding |
| `customStyle` | `string` | `''` | Root style forwarding |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `query` | `(pageNo: number, pageSize: number)` | Every query (first load / pull / bottom / retry); the host must answer via `complete*` |
| `update:modelValue` | `(list: unknown[])` | v-model update with the aggregated list |
| `scroll` | `event` | scroll-view scroll passthrough (pairs with sn-backtop's `scroll-top`) |

### Slots

| Name | Description |
| --- | --- |
| — | List rows; render the bound v-model array here |
| `top` | Fixed above the scroll area; does not scroll with the list |
| `bottom` | Fixed below the scroll area; does not scroll with the list |
| `empty` | Custom empty view |
| `refresher` | Custom refresher content (icon + text by default) |

### Methods

Called through a `ref`:

| Name | Type | Description |
| --- | --- | --- |
| `refresh` | `() => void` | Refresh with the refresher animation (page resets to the first) |
| `reload` | `() => void` | Refresh without the animation |
| `complete` | `(data, success?) => void` | Report a page; non-array `data` or `success=false` fails it |
| `completeByTotal` | `(data, total) => void` | Stop by total count |
| `completeByNoMore` | `(data, noMore) => void` | Stop by explicit flag |

## Dark mode

Refresher / footer / empty colors all come from `--sn-mp-color-*` semantic
tokens and flip automatically in dark mode — verify by wrapping the page in
`<sn-config-provider theme="dark">`; there are no hardcoded color fallbacks.
