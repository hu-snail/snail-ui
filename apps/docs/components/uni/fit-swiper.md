# FitSwiper 自适应轮播（uni 端 / 移动端）

`sn-fit-swiper` 是 `@snui/uni`（移动端 / 小程序 / H5 / App）的自适应高度轮播：每一页渲染任意插槽内容，容器高度始终贴合**当前页**的内容高度，滑动切换时高度平滑过渡 —— 仿淘宝「金刚区」页面间行数不同、切换时高度重排的体验。基于 easycom 自动注册（`components/sn-fit-swiper/sn-fit-swiper.vue` → `<sn-fit-swiper>`）。

## 何时使用

- 首页金刚区：每页一个图标网格，各页行数不同（2 行 / 1 行…），切换时高度跟着变。
- 内容页高度不可预期的轮播：卡片摘要、榜单、图文混排等，无法也不该写死一个统一高度。
- 需要「滑动切换 + 高度动画 + 指示器」一体的内容分页容器。

固定高度的图片轮播请用 `sn-swiper`。

## 基础用法

页面数据通过 `list` 传入（每行一个对象），页面内容完全由默认作用域插槽决定：插槽作用域为 `{ page, index, active }`。组件在挂载后测量每一页的内容高度，把容器高度设为当前页高度；`v-model:current` 双向绑定当前页。`height` 只作为首次测量完成前的占位高度（裸数字按 rpx），测量落地后被真实高度替换。

<Demo name="fit-swiper-mp-basic" description="两页金刚区网格，行数不同；滑动切换时容器高度自适应过渡。" />

## 指示器

`indicator` 传 `false` 隐藏；传对象时 `type` 选内置样式（`dots` 圆点 / `dots-bar` 活动项拉长为条 / `fraction` 分式页码），`minShowNum` 控制低于多少页时整体隐藏。`indicator-position` 支持 8 个锚点方位。

指示器配色可用 CSS 变量覆盖：`--sn-fit-swiper-dot-color`（非活动点 / 分式底色）、`--sn-fit-swiper-dot-active-color`（活动点），或直接用 `customIndicatorClass` / `customIndicatorStyle`。

<Demo name="fit-swiper-mp-indicator" description="dots / dots-bar / fraction 三种内置指示器样式。" />

## 自定义指示器

`#indicator` 作用域插槽（`{ current, total }`）完全替换内置指示器，任意内容都可以渲染；组件仍负责定位。

<Demo name="fit-swiper-mp-custom" description="用 #indicator 插槽渲染「第 n / N 页」文案的自定义指示器。" />

## 高度适配细节

- 每页内容必须是**固有高度**（不要写 `height: 100%` 链）——组件测量的是内容盒的自然高度。
- 切页（`change`）立即切换高度；滑动结束（`animationfinish`）自动重测一次，兜住「页面在屏幕外时图片加载完撑高」的场景。
- `list` 整体替换会自动重测；仅原地修改某页数据不会触发，通过模板 ref 调 `refit()` 重测。
- `animateHeight="false"` 关闭高度过渡；`heightDuration` 调整过渡时长。
- 无测量环境（SSR / 异形宿主）下保持 `height` 占位高度，不会抛错。
- `heightchange` 事件在容器高度实际变化时抛出（px），可用于滚动位置补偿。

## API

### Props

| 名称                   | 类型                                                                                                | 默认值    | 说明                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------ |
| `list`                 | `SnFitSwiperPage[]`                                                                                  | `[]`      | 页面数据行，逐行交给默认插槽。                                           |
| `current`              | `number`                                                                                             | `0`       | 当前页索引（`v-model:current`），越界值自动收敛。                        |
| `autoplay`             | `boolean`                                                                                            | `true`    | 自动播放。                                                               |
| `interval`             | `number`                                                                                             | `5000`    | 自动播放间隔（ms）。                                                     |
| `duration`             | `number`                                                                                             | `300`     | 滑动动画时长（ms）。                                                     |
| `loop`                 | `boolean`                                                                                            | `true`    | 循环播放。                                                               |
| `height`               | `string \| number`                                                                                   | `320`     | 首次测量前的占位高度（裸数字按 rpx）。                                   |
| `radius`               | `string \| number`                                                                                   | `''`      | 容器圆角（裸数字按 rpx）。                                               |
| `animateHeight`        | `boolean`                                                                                            | `true`    | 切页时是否动画过渡容器高度。                                             |
| `heightDuration`       | `number`                                                                                             | `300`     | 高度过渡时长（ms）。                                                     |
| `indicator`            | `boolean \| { type?: 'dots' \| 'dots-bar' \| 'fraction'; minShowNum?: number }`                      | `true`    | 指示器配置；`false` 隐藏。                                               |
| `indicatorPosition`    | `'left' \| 'top-left' \| 'top' \| 'top-right' \| 'bottom-left' \| 'bottom' \| 'bottom-right' \| 'right'` | `'bottom'` | 指示器锚点方位。                                                    |
| `customClass`          | `string`                                                                                             | `''`      | 根节点类名。                                                             |
| `customStyle`          | `string`                                                                                             | `''`      | 根节点内联样式。                                                         |
| `customPageClass`      | `string`                                                                                             | `''`      | 每个页面项的类名。                                                       |
| `customIndicatorClass` | `string`                                                                                             | `''`      | 指示器节点类名。                                                         |
| `customIndicatorStyle` | `string`                                                                                             | `''`      | 指示器节点内联样式。                                                     |

### Events

| 名称              | 参数                                        | 说明                                     |
| ----------------- | ------------------------------------------- | ---------------------------------------- |
| `update:current`  | `number`                                    | 当前页索引变化（`v-model:current`）。    |
| `change`          | `{ current: number; source: string }`       | 原生滑动切换。                           |
| `animationfinish` | `{ current: number; source: string }`       | 滑动动画结束，随后自动重测一次高度。     |
| `click`           | `{ index: number; page: SnFitSwiperPage }`  | 点击页面内容。                           |
| `heightchange`    | `{ height: number }`                        | 容器高度实际变化（px）。                 |

### Slots

| 名称        | 参数                                                        | 说明                                       |
| ----------- | ----------------------------------------------------------- | ------------------------------------------ |
| `default`   | `{ page: SnFitSwiperPage; index: number; active: boolean }` | 页面内容，作用域提供行数据、索引与激活态。 |
| `indicator` | `{ current: number; total: number }`                        | 自定义指示器，完全替换内置渲染。           |

### Methods

| 名称    | 类型                  | 说明                                                       |
| ------- | --------------------- | ---------------------------------------------------------- |
| `refit` | `() => Promise<void>` | 重新测量全部页面并应用当前页高度（异步内容变化后调用）。   |
