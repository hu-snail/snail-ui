# Img 图片（uni 端 / 移动端）

`sn-img` 是 `@snui/uni`（移动端 / 小程序 / H5）的图片组件：内置加载态与失败态、裁剪模式、圆形 / 圆角、懒加载与点击预览。基于 easycom 自动注册（`components/sn-img/sn-img.vue` → `<sn-img>`），样式几何值走 `rpx`。

## 基础用法

`mode` 沿用 uni `<image>` 的裁剪模式集合；`width` / `height` / `radius` 的数字按 rpx 处理，字符串原样透传；`round` 渲染为圆形。

<Demo name="img-mp-basic" description="三种裁剪模式，以及圆形 / 圆角 / 满宽。" />

## 加载与失败态

`showLoading` / `showError` 控制内置状态；`loading` / `error` 插槽可完全替换；切换 `src` 会重置为加载态。

<Demo name="img-mp-state" description="正常 / 错误地址切换，自定义失败插槽，关闭内置状态。" />

## 点击预览与懒加载

`enablePreview` 在点击时调用 `uni.previewImage`，`previewSrc` 指定实际打开的大图（默认取 `src`）。宿主没有该能力时（文档预览 / 单测 / SSR）点击只 emit `click`。`lazyLoad` 交给原生 `<image lazy-load>`；`showMenuByLongpress` 长按弹出识别小程序码菜单（仅微信小程序）。

<Demo name="img-mp-preview" description="缩略图点击打开大图、preview-src 覆盖、懒加载与长按菜单。" />

## 自定义类名与样式

`customClass` / `customStyle` 作用于根节点（外框、阴影），`customImage` 作用于内部 `<image>`（滤镜、缩放）。

<Demo name="img-mp-custom" description="根节点类名 / inline style 与内部 image 类名分别生效。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | string | '' | 图片链接 |
| previewSrc | string | '' | 预览图片链接（默认取 `src`） |
| width | string \| number | '' | 宽度（数字按 rpx） |
| height | string \| number | '' | 高度（数字按 rpx） |
| mode | ImageMode | 'scaleToFill' | 填充模式（uni `<image mode>` 集合） |
| round | boolean | false | 是否显示为圆形 |
| radius | string \| number | '' | 圆角大小（数字按 rpx） |
| lazyLoad | boolean | false | 是否开启图片懒加载 |
| enablePreview | boolean | false | 是否支持点击预览（调用 `uni.previewImage`） |
| showMenuByLongpress | boolean | false | 长按显示识别小程序码菜单（仅微信小程序） |
| showLoading | boolean | true | 是否展示默认加载态 |
| showError | boolean | true | 是否展示默认失败态 |
| customClass | string | '' | 根节点自定义类名 |
| customStyle | string | '' | 根节点自定义样式 |
| customImage | string | '' | 内部 `<image>` 自定义类名 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| click | 点击图片 | Event |
| load | 图片加载完成 | Event |
| error | 图片加载失败 | Event |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| loading | 自定义加载态 |
| error | 自定义失败态 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| --sn-mp-color-background-subtle | 加载中的占位底盘 |
| --sn-mp-color-border-default | 加载圈轨道 |
| --sn-mp-color-action-primary | 加载圈进度头 |
| --sn-mp-color-text-tertiary | 失败文案 |
| --sn-mp-font-size-sm | 失败文案字号 |
| --sn-mp-font-line-height-normal | 失败文案行高 |
| --sn-mp-radius-full | `round` 圆形 |

## 无障碍

- 可点区域是根 `<view>`，无障碍名称请加在外层链接 / 按钮上
- 加载圈 `aria-hidden="true"`

## 暗色模式

占位底盘、加载圈与失败文案颜色全部来自语义色 token（`--sn-mp-color-background-subtle` / `--sn-mp-color-border-default` / `--sn-mp-color-action-primary` / `--sn-mp-color-text-tertiary`），都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


## 相关

- 轮播：[`sn-swiper`](/components/uni/swiper)
- 头像：[`sn-avatar`](/components/uni/avatar)
