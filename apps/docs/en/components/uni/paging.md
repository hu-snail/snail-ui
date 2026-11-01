# sn-paging List Container (uni)

`sn-paging` is a pull-to-refresh + load-more list container. On uni runtimes
the gesture work is delegated to the native `scroll-view` refresher and the
native scroll-to-bottom event, and the component only reacts to state
transitions — no per-frame setData, light footprint, zero extra cost on the
scroll layer. Plain browser hosts (the docs preview) get a built-in damped
gesture instead: the pull resists the deeper it goes and is clamped (rubber
band), rendered with `transform` only so dragging never triggers layout. The
host fetches data in `@query`, reports back through `complete*`, and the
component aggregates pages and pushes them out via `v-model`.

## When to use

- List pages that need pull-to-refresh plus auto load-more on scroll-to-bottom
- Minimal paging protocol (`@query` + `complete`) with unified empty / loading
  / no-more / fail-retry states
- A pull-down "second floor" (campaign page, personal panel, …)
- Customizable refresh-area background / text / icon colors, or fully
  replacing either loading area

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

### Pull down to the second floor

<Demo name="paging-mp-second-floor" description="With secondFloorEnabled, releasing past the threshold slides in the second-floor overlay (secondFloor slot, own scroll area); closeSecondFloor() slides back to the list." />

### App case: channel tabs + detail page

<Demo name="paging-mp-app" description="#top search bar and tabs, #bottom fixed action bar (safe-area padded); tapping a row opens a detail page with its own paged reply list." />

## Protocol

```ts
// 1. bind the list with v-model; 2. request in @query; 3. report via complete*
function query(pageNo: number, pageSize: number): void {
  fetchPage(pageNo, pageSize)
    .then(({ rows, total }) => paging.value.completeByTotal(rows, total))
    .catch(() => paging.value.complete(false));
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

## Pull feel and performance

Refresher state machine:
`idle → pulling → ready → (secondFloor) → refreshing → complete → idle`.
The arrow rotates with the damped pull, flips 180° past the threshold, swaps
to a spinner while refreshing and to a check glyph on the success hold.

| Technique | Description |
| --------- | ----------- |
| Native gesture first | On uni hosts the pull physics belong to the platform scroll-view; the component updates state only at `refresherpulling` transitions — no per-move setData, which is what keeps low-end MP devices smooth |
| Incremental damping (browser hosts) | Each gesture delta scales by 0.75 below the threshold and by 0.35 past it, with a per-event cap — the pull tracks the finger, then resists |
| Pull clamp | Max pull = `refresherThreshold × 2.4`; a hard yank can never run away, and release springs back (rubber band) |
| Transform-only rendering | Pull offsets go through `transform: translateY` (compositor path) — no height changes, no layout; the spring-back rides a CSS transition |
| rAF coalescing | Gesture deltas coalesce through `requestAnimationFrame` and report whole pixels — at most one style write per frame |

## Second floor

With `secondFloorEnabled`, pulling past `secondFloorThreshold` (default
100px) switches the refresher to its "release to enter" text; releasing there
never fires a refresh — instead the second-floor overlay slides in. Its
content lives in the `#secondFloor` slot, over a dedicated scroll area.

```vue
<sn-paging
  ref="paging"
  v-model="list"
  second-floor-enabled
  second-floor-background="#0b1220"
  refresher-background="#0b1220"
  refresher-text-color="#e2e8f0"
  refresher-icon-color="#38bdf8"
  @second-floor-change="onF2Change"
>
  <!-- list rows -->
  <template #secondFloor>
    <view class="floor">
      <view class="floor__close" @click="paging.closeSecondFloor()">Close</view>
      <!-- lazy-load second-floor data inside @second-floor-change('go') -->
    </view>
  </template>
</sn-paging>
```

- `secondFloorChange('go' | 'close')` fires when the overlay opens / closes —
  the hook for lazy-loading second-floor data.
- `openSecondFloor()` / `closeSecondFloor()` drive the overlay
  programmatically (e.g. a back button inside the floor).
- The overlay expands full-screen at the component root; its scroll gestures
  are locked inside, never leaking to the list behind.
- The second floor only engages on platforms that can pull past the
  threshold; lower `secondFloorThreshold` if the native refresher travel is
  limited on your target.

## Custom loading areas

- `#refresher`: replaces the whole refresher content (the default icon and
  texts are not rendered).
- `#footer`: replaces the whole load-more footer, scoped `{ phase }`
  (`default | loading | noMore | fail`); taps are still handled by the
  component (auto load-next / retry).
- Colors: `refresherTextColor` (texts), `refresherIconColor` (arrow /
  spinner), `loadMoreTextColor` (footer text; the spinner follows it).
- Backgrounds: `refresherBackground` (the pull area; forwards the native
  `refresher-background` on uni hosts), `secondFloorBackground` (the overlay).

## API

### Props

| Name                        | Type        | Default              | Description                                           |
| --------------------------- | ----------- | -------------------- | ----------------------------------------------------- |
| `v-model`                   | `unknown[]` | `[]`                 | Aggregated list, rendered through the default slot    |
| `auto`                      | `boolean`   | `true`               | Fire the first `query` after mount                    |
| `defaultPageNo`             | `number`    | `1`                  | First page number                                     |
| `defaultPageSize`           | `number`    | `10`                 | Page size; a shorter returned page stops the sequence |
| `refresherEnabled`          | `boolean`   | `true`               | Enable the pull-to-refresh gesture                    |
| `refresherThreshold`        | `number`    | `45`                 | Arming pull distance (px, scroll-view contract)       |
| `refresherDefaultText`      | `string`    | `继续下拉刷新`       | Refresher text below the threshold                    |
| `refresherPullingText`      | `string`    | `松开立即刷新`       | Refresher text past the threshold                     |
| `refresherRefreshingText`   | `string`    | `正在刷新...`        | Text while the refresh query is in flight             |
| `refresherCompleteText`     | `string`    | `刷新成功`           | Text held after a successful refresh                  |
| `refresherCompleteDuration` | `number`    | `500`                | Success-text hold in ms; `0` skips the hold           |
| `refresherBackground`       | `string`    | `''`                 | Pull-area background (forwards native `refresher-background`) |
| `refresherTextColor`        | `string`    | `''`                 | Refresher text color                                  |
| `refresherIconColor`        | `string`    | `''`                 | Refresher arrow / spinner color                       |
| `secondFloorEnabled`        | `boolean`   | `false`              | Enable pull-down-to-enter second floor                |
| `secondFloorThreshold`      | `number`    | `100`                | Release distance entering the second floor (px)       |
| `secondFloorDuration`       | `number`    | `200`                | Overlay slide-in/out duration (ms)                    |
| `refresherSecondFloorText`  | `string`    | `松开进入二楼`       | Refresher text inside the second-floor zone           |
| `secondFloorBackground`     | `string`    | `''`                 | Second-floor overlay background                       |
| `loadMoreEnabled`           | `boolean`   | `true`               | Enable auto load-more on scroll-to-bottom             |
| `lowerThreshold`            | `number`    | `50`                 | Distance from the bottom that fires load-more (px)    |
| `loadMoreDefaultText`       | `string`    | `点击加载更多`       | Idle footer text; tap loads the next page             |
| `loadMoreLoadingText`       | `string`    | `正在加载中...`      | Footer text while loading                             |
| `loadMoreNoMoreText`        | `string`    | `没有更多了`         | Footer text once everything is loaded                 |
| `loadMoreFailText`          | `string`    | `加载失败，点击重试` | Footer text after a failure                           |
| `loadMoreTextColor`         | `string`    | `''`                 | Footer text color (the spinner follows)               |
| `emptyText`                 | `string`    | `暂无数据`           | Built-in empty view text                              |
| `safeAreaInsetBottom`       | `boolean`   | `false`              | Pad the container bottom for the device safe area     |
| `customClass`               | `string`    | `''`                 | Root class forwarding                                 |
| `customStyle`               | `string`    | `''`                 | Root style forwarding                                 |

### Events

| Name                | Payload                              | Description                                                                            |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `query`             | `(pageNo: number, pageSize: number)` | Every query (first load / pull / bottom / retry); the host must answer via `complete*` |
| `update:modelValue` | `(list: unknown[])`                  | v-model update with the aggregated list                                                |
| `scroll`            | `event`                              | scroll-view scroll passthrough (pairs with sn-backtop's `scroll-top`)                  |
| `secondFloorChange` | `('go' \| 'close')`                  | Second-floor overlay opened / closed (pull release or method call)                     |

### Slots

| Name          | Description                                                |
| ------------- | ---------------------------------------------------------- |
| —             | List rows; render the bound v-model array here             |
| `top`         | Fixed above the scroll area; does not scroll with the list |
| `bottom`      | Fixed below the scroll area; does not scroll with the list |
| `empty`       | Custom empty view                                          |
| `refresher`   | Custom refresher content (arrow / spinner + text by default) |
| `footer`      | Custom load-more footer, scoped `{ phase }`                |
| `secondFloor` | Second-floor overlay content (own scroll area)             |

### Methods

Called through a `ref`:

| Name               | Type                       | Description                                                     |
| ------------------ | -------------------------- | --------------------------------------------------------------- |
| `refresh`          | `() => void`               | Refresh with the refresher animation (page resets to the first) |
| `reload`           | `() => void`               | Refresh without the animation                                   |
| `complete`         | `(data, success?) => void` | Report a page; non-array `data` or `success=false` fails it     |
| `completeByTotal`  | `(data, total) => void`    | Stop by total count                                             |
| `completeByNoMore` | `(data, noMore) => void`   | Stop by explicit flag                                           |
| `openSecondFloor`  | `() => void`               | Open the second-floor overlay                                   |
| `closeSecondFloor` | `() => void`               | Close the second-floor overlay                                  |

## Dark mode

Refresher / footer / empty colors all come from `--sn-mp-color-*` semantic
tokens and flip automatically in dark mode — verify by wrapping the page in
`<sn-config-provider theme="dark">`; there are no hardcoded color fallbacks.
Colors customized through `refresherBackground` / `secondFloorBackground` and
friends must be adapted by the host for both modes.
