# Swiper 轮播（uni 端 / 移动端）

`sn-swiper` 是 `@snui/uni`（移动端 / 小程序 / H5）的轮播：基于 uni 原生 `<swiper>` 元素实现，支持自动播放、循环、同时显示多张、圆点 / 条形 / 分式指示器与文案。基于 easycom 自动注册（`components/sn-swiper/sn-swiper.vue` → `<sn-swiper>`），样式几何值走 `rpx`。

> **声明但无渲染效果（对齐参考 API）**
>
> - **视频项不播放**：`<video>` 无法在跨端轮播里可靠驱动。`type: "video"` 的项会退化成渲染 `poster` 图片，因此 `autoplay-video` / `muted` / `video-loop` / `stop-previous-video` / `stop-autoplay-when-video-play` 虽然声明了，但不改变画面。
> - `adjust-height` / `adjust-vertical-height` 在参考库里仅支付宝小程序支持：值会透传给原生 `<swiper>`，其他端忽略。
> - `custom-prev-class` / `custom-next-class` / `custom-prev-image-class` / `custom-next-image-class` 声明了，但本实现不渲染前后露出的 peek 滑块，暂无人消费。
> - `easing-function` 会透传给原生 swiper，但它只认自己的固定缓动集合。

## 基础用法

`list` 支持字符串数组与对象数组（`valueKey` / `textKey` 指定字段名）；`height` 控制容器高度，`v-model:current` 双向绑定当前索引。

<Demo name="swiper-mp-basic" description="三张图自动播放，含文案与当前索引。" />

## 播放控制

`autoplay` / `interval` / `duration` / `loop` 全部透传给原生 `<swiper>`：轮播间隔、动画时长与循环都由平台驱动，组件不持有定时器。`easing-function` 同样透传，但平台只认自己的缓动集合（默认 `default`）。

<Demo name="swiper-mp-playback" description="开关 autoplay / loop，切换 interval / duration / easing。" />

## 多图与边距

`display-multiple-items` 让同屏显示多张；`previous-margin` / `next-margin` 让相邻张露出边角；`snap-to-edge` 把边距也对齐到首尾张。

<Demo name="swiper-mp-multiple" description="同屏两张、左右边距露出邻张、snap-to-edge 首尾对齐。" />

## 竖向轮播

`direction="vertical"` 切换滚动轴；`height` 可传字符串（如 `360rpx`）或数字（按 rpx）。

<Demo name="swiper-mp-vertical" description="竖向滑动；字符串高度 + 支付宝专属的 adjust-height / adjust-vertical-height。" />

## 指示器位置

`indicator-position` 取 `left` / `top-left` / `top` / `top-right` / `bottom-left` / `bottom` / `bottom-right` / `right`；`minShowNum` 控制低于多少张时整体隐藏指示器。

<Demo name="swiper-mp-indicator-position" description="四个角落的指示器位置，以及 minShowNum 阈值隐藏。" />

## 指示器

`indicator` 传 `false` 隐藏；传对象时支持 `type`（`dots` / `dots-bar` / `fraction`）、`minShowNum`、`showControls`。

<Demo name="swiper-mp-indicator" description="圆点 / 条形 / 分式 / 带左右控制按钮。" />

## 视频项

`type: "video"` 的项在 uni 端退化成渲染 `poster` 图片（见上方「声明但无渲染效果」）。下面这个 demo 同时演示了五个视频类 props 的写法与降级后的实际画面。

<Demo name="swiper-mp-video" description="视频项渲染 poster；五个视频类 props 已声明但不改变画面。" />

## 圆角与自定义类名

`radius` 控制容器圆角；`customClass` / `customStyle` 作用于根节点，`customItemClass` 作用于每个 `swiper-item`，`customImageClass` 透传给 `sn-img`，`customTextClass` / `customTextStyle` 作用于文案，`customIndicatorClass` 作用于指示器节点。

<Demo name="swiper-mp-custom" description="圆角 + 根 / 项 / 图片 / 文案 / 指示器的自定义类名与样式。" />

## 数据字段与事件

`valueKey` / `textKey` 适配自己的字段名；`current`（`v-model:current`）受控切换；`imageMode` 透传给 `sn-img`；`showMenuByLongpress` 长按弹出识别小程序码菜单（仅微信小程序）。`click` / `change` / `animationfinish` 三个事件在 demo 中回传。

<Demo name="swiper-mp-data" description="自定义字段名、受控 current、aspectFit 裁剪、三个事件回传。" />

## Props

| 属性                      | 类型                                    | 默认值       | 说明                                                      |
| ------------------------- | --------------------------------------- | ------------ | --------------------------------------------------------- |
| autoplay                  | boolean                                 | true         | 是否自动播放                                              |
| current                   | number                                  | 0            | 当前轮播项索引（`v-model:current`）                       |
| direction                 | 'horizontal' \| 'vertical'              | 'horizontal' | 轮播方向                                                  |
| displayMultipleItems      | number                                  | 1            | 同时显示的滑块数量                                        |
| duration                  | number                                  | 300          | 滑动动画时长（ms）                                        |
| easingFunction            | string                                  | 'default'    | 切换缓动动画类型（透传给原生 swiper）                     |
| height                    | string \| number                        | 192          | 轮播高度（数字按 rpx）                                    |
| interval                  | number                                  | 5000         | 自动轮播间隔（ms）                                        |
| list                      | (string \| SnSwiperItem)[]              | []           | 轮播数据列表                                              |
| loop                      | boolean                                 | true         | 是否循环播放                                              |
| nextMargin                | string \| number                        | 0            | 后边距（数字按 rpx）                                      |
| indicatorPosition         | SwiperIndicatorPosition                 | 'bottom'     | 指示器位置                                                |
| previousMargin            | string \| number                        | 0            | 前边距（数字按 rpx）                                      |
| radius                    | string \| number                        | ''           | 轮播圆角（数字按 rpx）                                    |
| snapToEdge                | boolean                                 | false        | 是否将边距应用到首尾元素                                  |
| indicator                 | boolean \| SnSwiperIndicator            | true         | 指示器配置；`false` 隐藏                                  |
| imageMode                 | SwiperImageMode                         | 'aspectFill' | 图片裁剪模式（透传给 `sn-img`）                           |
| showMenuByLongpress       | boolean                                 | false        | 长按显示识别小程序码菜单                                  |
| adjustHeight              | 'first' \| 'current' \| 'highest' \| '' | ''           | 自动按内容高度撑开（仅支付宝小程序生效）                  |
| adjustVerticalHeight      | boolean                                 | false        | 竖向模式下也应用 `adjustHeight`（仅支付宝小程序生效）     |
| autoplayVideo             | boolean                                 | false        | 自动播放视频项（已声明，视频项降级为 poster，不改变画面） |
| muted                     | boolean                                 | false        | 静音视频项（同上，不改变画面）                            |
| videoLoop                 | boolean                                 | false        | 视频项循环（同上，不改变画面）                            |
| stopPreviousVideo         | boolean                                 | false        | 切张时停止上一张的视频（同上，不改变画面）                |
| stopAutoplayWhenVideoPlay | boolean                                 | false        | 视频播放时暂停自动轮播（同上，不改变画面）                |
| valueKey                  | string                                  | 'value'      | 选项对象中图片地址字段名                                  |
| textKey                   | string                                  | 'text'       | 选项对象中标题字段名                                      |
| customIndicatorClass      | string                                  | ''           | 自定义指示器类名                                          |
| customImageClass          | string                                  | ''           | 自定义图片类名                                            |
| customItemClass           | string                                  | ''           | 自定义轮播项类名                                          |
| customTextClass           | string                                  | ''           | 自定义标题类名                                            |
| customTextStyle           | string                                  | ''           | 自定义标题样式                                            |
| customClass               | string                                  | ''           | 根节点自定义类名                                          |
| customStyle               | string                                  | ''           | 根节点自定义样式                                          |

`SnSwiperItem` = `{ value?, poster?, text?, type?: "image" | "video" }`；`SnSwiperIndicator` = `{ type?: "dots" | "dots-bar" | "fraction"; minShowNum?; showControls? }`。

## Events

| 事件名          | 说明           | 参数                  |
| --------------- | -------------- | --------------------- |
| click           | 点击轮播项     | `{ index, item }`     |
| change          | 轮播切换时     | `{ current, source }` |
| animationfinish | 轮播动画结束时 | `{ current, source }` |
| update:current  | 当前索引更新   | number                |

## Slots

无。

## 主题变量

| 变量                              | 用途                       |
| --------------------------------- | -------------------------- |
| --sn-mp-color-background-subtle   | 轮播底盘                   |
| --sn-mp-color-background-elevated | 未激活圆点                 |
| --sn-mp-color-background-overlay  | 文案条 / 分式底板          |
| --sn-mp-color-action-primary      | 激活圆点                   |
| --sn-mp-color-text-on-primary     | 文案与分式文字             |
| --sn-mp-font-size-xs`/`-md`/`-lg  | 分式 / 文案 / 控制按钮字号 |
| --sn-mp-font-line-height-normal   | 文字行高                   |
| --sn-mp-spacing-1`…`-4            | 指示器内边距与文案内边距   |
| --sn-mp-radius-xs`/`-full`/`-lg   | 圆点 / 控制按钮 / 容器圆角 |

## 无障碍

- 指示器节点 `aria-hidden="true"`，语义由滑块内容承担
- 手势滑动由原生 `<swiper>` 在各端处理

## 暗色模式

轮播底盘、圆点、文案条与文字颜色全部来自语义色 token（`--sn-mp-color-background-*` / `--sn-mp-color-action-primary` / `--sn-mp-color-text-on-primary`），都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 单图：[`sn-img`](/components/uni/img)
- 纵向滚动容器：用原生 `<scroll-view>`
