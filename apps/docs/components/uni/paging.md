# sn-paging 分页列表（uni 端）

`sn-paging` 是下拉刷新 + 上拉加载的分页列表容器：手势由原生 `scroll-view` 承担（原生 refresher + 触底事件），组件内没有任何 JS 手势模拟，因此体积极小、滚动层零额外开销；宿主只需在 `@query` 里请求数据，再通过 `complete*` 方法汇报结果，翻页聚合由组件经 `v-model` 推回。

## 何时使用

- 列表页需要下拉刷新 + 触底自动加载更多
- 希望用最少的代码接入分页协议（`@query` + `complete`），并统一空态 / 加载中 / 没有更多 / 失败重试的展示
- 需要自定义空态、刷新区文案或关闭某一侧手势

## 代码演示

### 基础用法

`v-model` 绑定聚合列表，`@query` 里发请求，拿到数据后 `completeByTotal` 汇报；末页不足一页（或达到 total）时自动判停。

<Demo name="paging-mp-basic" description="下拉刷新 / 触底自动翻页 / completeByTotal 判停。" />

### 空态与失败重试

<Demo name="paging-mp-states" description="空数据走 empty 插槽；complete(false) 模拟失败，页脚可点击重试；reload() 手动重新加载。" />

### 纯滑动容器与手势开关

<Demo name="paging-mp-scroll" description="两个开关实时控制下拉刷新 / 上拉加载；全部关闭时退化为纯滚动容器。" />

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

## 性能与模式

sn-paging 在不同运行模式下使用不同的滚动与渲染方案：

|      | 内置 scroll-view 滚动                                 | 页面滚动                                                   | uni-app x 原生渲染                                            |
| ---- | ----------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| 说明 | 组件自带滚动容器，页面结构最简单，默认模式            | 列表跟随页面滚动（use-page-scroll 思路），适合长内容图文流 | App 端由 `@snui/uni-x` 转换为 uvue 产物，运行在原生渲染引擎上 |
| 手势 | 原生 refresher + 触底事件，浏览器预览自动回退触摸模拟 | 页面级下拉刷新由宿主页面承担                               | 原生 refresher，事件由 uts 层派发                             |
| 适用 | 绝大多数列表页（默认推荐）                            | 需要与页面其它内容共享滚动的场景                           | 追求极致性能的 App 端列表                                     |
| 状态 | 已支持                                                | 规划中                                                     | 已支持（真机验证清单见 uni-app x 指南）                       |

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
| `loadMoreEnabled`           | `boolean`   | `true`               | 是否开启触底自动加载                       |
| `lowerThreshold`            | `number`    | `50`                 | 距底部多远触发加载（px）                   |
| `loadMoreDefaultText`       | `string`    | `点击加载更多`       | 空闲页脚文案，点击可手动加载下一页         |
| `loadMoreLoadingText`       | `string`    | `正在加载中...`      | 加载中页脚文案                             |
| `loadMoreNoMoreText`        | `string`    | `没有更多了`         | 全部加载完的页脚文案                       |
| `loadMoreFailText`          | `string`    | `加载失败，点击重试` | 失败页脚文案                               |
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

### Slots

| 名称        | 说明                                              |
| ----------- | ------------------------------------------------- |
| —           | 列表内容；渲染 v-model 绑定的数组                 |
| `top`       | 固定在滚动区上方，不随列表滚动（如搜索栏 / tabs） |
| `bottom`    | 固定在滚动区下方，不随列表滚动（如操作栏）        |
| `empty`     | 自定义空态内容                                    |
| `refresher` | 自定义下拉刷新区内容（默认图标 + 文案）           |

### Methods

通过 `ref` 调用：

| 名称               | 类型                       | 说明                                                    |
| ------------------ | -------------------------- | ------------------------------------------------------- |
| `refresh`          | `() => void`               | 带下拉动画重新加载（页码重置为首页）                    |
| `reload`           | `() => void`               | 不带动画重新加载                                        |
| `complete`         | `(data, success?) => void` | 汇报本页结果；非数组 `data` 或 `success=false` 记为失败 |
| `completeByTotal`  | `(data, total) => void`    | 按总条数判停                                            |
| `completeByNoMore` | `(data, noMore) => void`   | 按显式标记判停                                          |

## 暗色模式

刷新区 / 页脚 / 空态颜色全部来自 `--sn-mp-color-*` 语义 token，暗色下自动反转；可用 `<sn-config-provider theme="dark">` 包裹页面验证，无硬编码色值兜底。
