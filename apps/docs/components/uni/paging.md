# sn-paging 分页列表（uni 端）

`sn-paging` 是下拉刷新 + 上拉加载的分页列表容器：手势由原生 `scroll-view` 承担（原生 refresher + 触底事件），uni 运行时下组件只响应状态切换、没有逐帧 setData，体积极小、滚动层零额外开销；纯浏览器宿主（文档预览）内置增量阻尼手势——越拉越沉、拉距有上限钳制（皮筋效果），渲染走纯 `transform`，拖动不触发布局。宿主只需在 `@query` 里请求数据，再通过 `complete*` 方法汇报结果，翻页聚合由组件经 `v-model` 推回。

## 何时使用

- 列表页需要下拉刷新 + 触底自动加载更多
- 希望用最少的代码接入分页协议（`@query` + `complete`），并统一空态 / 加载中 / 没有更多 / 失败重试的展示
- 需要下拉进入「二楼」（营销活动页、个性化面板等）
- 需要自定义刷新区背景 / 文字 / 图标颜色，或整块替换加载区域

## 代码演示

### 基础用法

`v-model` 绑定聚合列表，`@query` 里发请求，拿到数据后 `completeByTotal` 汇报；末页不足一页（或达到 total）时自动判停。

<Demo name="paging-mp-basic" description="下拉刷新 / 触底自动翻页 / completeByTotal 判停。" />

### 空态与失败重试

<Demo name="paging-mp-states" description="空数据走 empty 插槽；complete(false) 模拟失败，页脚可点击重试；reload() 手动重新加载。" />

### 纯滑动容器与手势开关

<Demo name="paging-mp-scroll" description="两个开关实时控制下拉刷新 / 上拉加载；全部关闭时退化为纯滚动容器。" />

### 下拉进入二楼

<Demo name="paging-mp-second-floor" description="secondFloorEnabled 开启后，下拉越过阈值松手即滑入全屏二楼（secondFloor 插槽，独立滚动）；上滑可拉回列表；胶囊切换器实时切换加载动画类型与下拉背景配色。" />

### 弹窗内下拉刷新加载

<Demo name="paging-mp-popup" description="sn-popup 底部弹层内嵌 sn-paging：弹层内独立完成下拉刷新与触底加载，关闭弹层自动复位。" />

### 应用案例：频道 tabs + 二级页面

<Demo name="paging-mp-app" description="#top 搜索栏与 tabs、#bottom 固定操作栏（安全区适配）；点条目进入二级页面的独立分页评论列表。" />

## 使用协议

```ts
// 1. v-model 绑定列表；2. @query 发请求；3. complete* 汇报
function query(pageNo: number, pageSize: number): void {
  fetchPage(pageNo, pageSize)
    .then(({ rows, total }) => paging.value.completeByTotal(rows, total))
    .catch(() => paging.value.complete(false));
}
```

- **判停规则**：`completeByTotal` 在聚合长度达到 `total` 时判停；`completeByNoMore` 按显式标记判停；普通 `complete` 在返回页短于 `defaultPageSize` 时判停。
- **失败语义**：`complete(false)`（或非数组入参）记为失败——首屏失败显示可重试页脚；翻页失败保留已加载数据、页脚停在失败态，点击重发同一页。
- **高度契约**：组件根节点高度 `100%`，父容器必须给定高度（`height` / flex 布局均可）。
- **纯滑动容器**：`refresher-enabled=false` + `load-more-enabled=false` 时不发请求、无页脚，组件退化为纯滚动容器；两个开关可独立控制、实时生效。
- **手势环境**：uni 运行时（小程序 / App / uni H5）走原生 refresher 与触底事件；纯浏览器宿主（如文档预览）自动启用内置触摸手势模拟，下拉刷新与上拉加载同样可用。

## 下拉手感与性能

刷新区状态机：`idle → pulling → ready →（secondFloor）→ refreshing → complete → idle`。拉动时箭头随手势阻尼旋转，越过阈值翻转 180°，刷新中切换为加载圈，成功停留态显示对勾。

| 手段 | 说明 |
| ---- | ---- |
| 原生手势优先 | uni 端拉动物理交给平台 scroll-view，组件只在 `refresherpulling` 的状态切换点更新一次数据，无逐帧 setData（低端小程序设备不掉帧的关键） |
| 增量阻尼（浏览器宿主） | 阈值内每帧位移按 0.75 缩放，越过阈值再衰减到 0.35，单帧突增封顶——跟手但越拉越沉 |
| 拉距钳制 | 最大拉距 = `refresherThreshold × 3`，猛拽不会一拉到底，松手弹性回弹（皮筋效果） |
| 纯 transform 渲染 | 下拉位移全部走 `transform: translateY`（合成器路径），不修改高度、不触发布局；回弹由 CSS transition 完成 |
| rAF 合帧 | 手势位移经 `requestAnimationFrame` 合并、按整数像素上报，每帧至多一次样式写入 |

## 二楼（下拉进入第二层）

`secondFloorEnabled` 开启后，下拉越过 `secondFloorThreshold`（默认 100px）刷新区提示「松开进入二楼」，此时松手不会触发刷新，而是滑入二楼浮层；浮层内容写在 `#secondFloor` 插槽里，内部自带独立滚动区。

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
  <!-- 列表内容 -->
  <template #secondFloor>
    <view class="floor">
      <view class="floor__close" @click="paging.closeSecondFloor()">收起</view>
      <!-- 二楼内容，懒加载可在 @second-floor-change('go') 里请求 -->
    </view>
  </template>
</sn-paging>
```

- **全屏展开**：默认 `second-floor-fullscreen` 以 `position: fixed` 铺满视口（z-index 可经 `--sn-paging-f2-z-index` 覆盖）；设为 `false` 时浮层限制在组件盒内。
- **上滑拉回**：二楼内容无法滚动（或已滚到底部）时继续上滑，浮层随手势跟手位移，松手超过 80px 即收回列表，否则弹回；内容可滚动时上滑优先滚动内容，滚到底后继续上滑才拉回。
- 事件 `secondFloorChange('go' | 'close')` 在浮层开 / 关时触发，适合懒加载二楼数据。
- 方法 `openSecondFloor()` / `closeSecondFloor()` 可编程控制（如二楼内放返回按钮）。
- 二楼仅在可拉到阈值的平台生效；若目标平台原生刷新拉距有限，可调低 `secondFloorThreshold`。

## 自定义加载区域

- `#refresher`：整块替换刷新区内容（替换后组件不再渲染默认图标与文案）。
- `#footer`：整块替换加载更多页脚，作用域参数 `{ phase }`（`default | loading | noMore | fail`），点击仍由组件接管（自动加载下一页 / 重试）。
- 加载动画：`refresherLoadingType` 切换刷新区加载圈形态（`circular` / `spinner` / `dots` / `wave`，与 sn-loading 的 `type` 一致）；刷新区箭头与加载圈统一 18px 视觉尺寸。
- 配色：`refresherTextColor`（文案）、`refresherIconColor`（箭头 / 加载圈）、`loadMoreTextColor`（页脚文字，加载圈跟随）；背景：`refresherBackground`（下拉区域，uni 端透传原生 `refresher-background`）、`secondFloorBackground`（二楼浮层）。

## API

### Props

| 名称                        | 类型        | 默认值               | 说明                                       |
| --------------------------- | ----------- | -------------------- | ------------------------------------------ |
| `v-model`                   | `unknown[]` | `[]`                 | 聚合后的列表数据，由默认插槽渲染           |
| `auto`                      | `boolean`   | `true`               | 挂载后自动触发首次 `query`                 |
| `defaultPageNo`             | `number`    | `1`                  | 首页页码                                   |
| `defaultPageSize`           | `number`    | `10`                 | 每页条数；返回页短于它即判停               |
| `refresherEnabled`          | `boolean`   | `true`               | 是否开启下拉刷新手势                       |
| `refresherThreshold`        | `number`    | `45`                 | 下拉触发阈值（px，scroll-view 契约）       |
| `refresherDefaultText`      | `string`    | `继续下拉刷新`       | 未达阈值时的刷新区文案                     |
| `refresherPullingText`      | `string`    | `松开立即刷新`       | 达到阈值后的刷新区文案                     |
| `refresherRefreshingText`   | `string`    | `正在刷新...`        | 刷新请求进行中文案                         |
| `refresherCompleteText`     | `string`    | `刷新成功`           | 刷新成功后的停留文案                       |
| `refresherCompleteDuration` | `number`    | `500`                | 成功文案停留时长（ms），`0` 表示不停留     |
| `refresherBackground`       | `string`    | `''`                 | 下拉区域背景色（uni 端透传原生 `refresher-background`） |
| `refresherTextColor`        | `string`    | `''`                 | 刷新区文案颜色                             |
| `refresherIconColor`        | `string`    | `''`                 | 刷新区箭头 / 加载圈颜色                    |
| `refresherLoadingType`      | `string`    | `circular`           | 刷新区加载圈形态（`circular` / `spinner` / `dots` / `wave`） |
| `secondFloorEnabled`        | `boolean`   | `false`              | 是否开启下拉进入二楼                       |
| `secondFloorThreshold`      | `number`    | `100`                | 进入二楼的松手距离（px）                   |
| `secondFloorDuration`       | `number`    | `200`                | 二楼滑入 / 滑出时长（ms）                  |
| `secondFloorFullscreen`     | `boolean`   | `true`               | 二楼是否铺满视口（`false` 限制在组件盒内） |
| `refresherSecondFloorText`  | `string`    | `松开进入二楼`       | 二楼区间内刷新区文案                       |
| `secondFloorBackground`     | `string`    | `''`                 | 二楼浮层背景色                             |
| `loadMoreEnabled`           | `boolean`   | `true`               | 是否开启触底自动加载                       |
| `lowerThreshold`            | `number`    | `50`                 | 距底部多远触发加载（px）                   |
| `loadMoreDefaultText`       | `string`    | `点击加载更多`       | 空闲页脚文案，点击可手动加载下一页         |
| `loadMoreLoadingText`       | `string`    | `正在加载中...`      | 加载中页脚文案                             |
| `loadMoreNoMoreText`        | `string`    | `没有更多了`         | 全部加载完的页脚文案                       |
| `loadMoreFailText`          | `string`    | `加载失败，点击重试` | 失败页脚文案                               |
| `loadMoreTextColor`         | `string`    | `''`                 | 页脚文字颜色（加载圈跟随）                 |
| `emptyText`                 | `string`    | `暂无数据`           | 内置空态文案                               |
| `safeAreaInsetBottom`       | `boolean`   | `false`              | 容器底部适配设备安全区（iPhone X+ 刘海屏） |
| `customClass`               | `string`    | `''`                 | 根节点自定义类名                           |
| `customStyle`               | `string`    | `''`                 | 根节点自定义样式                           |

### Events

| 名称                | 参数                                 | 说明                                                                   |
| ------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `query`             | `(pageNo: number, pageSize: number)` | 每次查询（首载 / 下拉 / 触底 / 重试）触发，宿主必须以 `complete*` 应答 |
| `update:modelValue` | `(list: unknown[])`                  | v-model 更新（聚合后的列表）                                           |
| `scroll`            | `event`                              | scroll-view 滚动事件透传（可配合 sn-backtop 的 `scroll-top`）          |
| `secondFloorChange` | `('go' \| 'close')`                  | 二楼浮层打开 / 关闭时触发（下拉松手或方法调用）                        |

### Slots

| 名称          | 说明                                                   |
| ------------- | ------------------------------------------------------ |
| —             | 列表内容；渲染 v-model 绑定的数组                      |
| `top`         | 固定在滚动区上方，不随列表滚动（如搜索栏 / tabs）      |
| `bottom`      | 固定在滚动区下方，不随列表滚动（如操作栏）             |
| `empty`       | 自定义空态内容                                         |
| `refresher`   | 自定义下拉刷新区内容（默认箭头 / 加载圈 + 文案）       |
| `footer`      | 自定义加载更多页脚，作用域 `{ phase }`                 |
| `secondFloor` | 二楼浮层内容（内部独立滚动）                           |

### Methods

通过 `ref` 调用：

| 名称               | 类型                       | 说明                                                    |
| ------------------ | -------------------------- | ------------------------------------------------------- |
| `refresh`          | `() => void`               | 带下拉动画重新加载（页码重置为首页）                    |
| `reload`           | `() => void`               | 不带动画重新加载                                        |
| `complete`         | `(data, success?) => void` | 汇报本页结果；非数组 `data` 或 `success=false` 记为失败 |
| `completeByTotal`  | `(data, total) => void`    | 按总条数判停                                            |
| `completeByNoMore` | `(data, noMore) => void`   | 按显式标记判停                                          |
| `openSecondFloor`  | `() => void`               | 打开二楼浮层                                            |
| `closeSecondFloor` | `() => void`               | 关闭二楼浮层                                            |

## 暗色模式

刷新区 / 页脚 / 空态颜色全部来自 `--sn-mp-color-*` 语义 token，暗色下自动反转；可用 `<sn-config-provider theme="dark">` 包裹页面验证，无硬编码色值兜底。通过 `refresherBackground` / `secondFloorBackground` 等自定义的配色需宿主自行适配两种模式。
