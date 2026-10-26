# VideoPreview 视频预览（uni 端 / 移动端）

`sn-video-preview` 是 `@snui/uni`（移动端 / 小程序 / H5）的全屏视频层：遮罩 + 原生 `<video>` 舞台 + 标题栏 + 关闭按钮。基于 easycom 自动注册（`components/sn-video-preview/sn-video-preview.vue` → `<sn-video-preview>`），样式几何值走 `rpx`。

实现由 `sn-popup`（遮罩 / 层级 / 滚动锁 / 进出场动画）包原生 `<video>` 组成，播放与播放器控件都来自厂商运行时。

## 基础用法

wd-video-preview 用 `open` / `close` 方法，并把 `on-open` / `on-close` 声明成 **props**（回调）而不是事件。本组件两种都支持：

```ts
const video = ref();
video.value.open({ src, poster, title });
video.value.close();
```

```vue
<sn-video-preview :on-open="handler" :on-close="handler" />
```

`open()` 同时 emit `open`，所以 `@open` 监听也可用。这个额外事件是增量的，不改变参考 API。注意 Vue 会把 `onOpen` prop 映射到 `open` 事件，因此组件只 emit 一次、不再额外调用 prop，避免宿主回调被触发两遍。

<Demo name="video-preview-mp-basic" description="按钮打开视频层；open / close 事件回传。" />

## 全屏与关闭位置

`full-screen` 让视频铺满视口（默认是居中的 16:9 舞台）。`close-position` 取 `left-top` / `right-top`。

<Demo name="video-preview-mp-fullscreen" description="全屏模式、右上关闭按钮、自动播放，以及 on-open 回调计数。" />

## 层级、样式与回调

`z-index` 透传给内部 `sn-popup`；`customStyle` 追加到层根节点 inline style，`customClass` 追加类名；`selector` 渲染成 `data-selector` 作为实例标识。`on-open` / `on-close` 是 prop 形式的回调，组件只调用一次，不会与同名事件重复触发。

<Demo name="video-preview-mp-config" description="自定义 z-index 与 customStyle、selector 实例标识，以及 on-open / on-close 计数。" />

## Props

| 属性            | 类型                        | 默认值       | 说明                                             |
| --------------- | --------------------------- | ------------ | ------------------------------------------------ |
| `selector`      | `string`                    | `''`         | 实例标识（对齐参考 API；渲染为 `data-selector`） |
| `zIndex`        | `number`                    | `1000`       | 预览层级                                         |
| `fullScreen`    | `boolean`                   | `false`      | 是否全屏预览                                     |
| `closePosition` | `'left-top' \| 'right-top'` | `'left-top'` | 关闭按钮位置                                     |
| `onOpen`        | `() => void`                | `undefined`  | 组件打开时的回调（参考 API 的回调 prop）         |
| `onClose`       | `() => void`                | `undefined`  | 组件关闭时的回调（参考 API 的回调 prop）         |
| `customClass`   | `string`                    | `''`         | 根节点自定义类名                                 |
| `customStyle`   | `string`                    | `''`         | 根节点自定义样式                                 |

## 方法

| 方法名  | 参数                                  | 说明                   |
| ------- | ------------------------------------- | ---------------------- |
| `open`  | `{ src, poster?, title?, autoplay? }` | 载入视频并显示预览层   |
| `close` | —                                     | 关闭预览层并卸载视频源 |

## Events

| 事件名  | 说明                                    | 参数 |
| ------- | --------------------------------------- | ---- |
| `open`  | 打开预览时触发（等价于 `onOpen` prop）  | —    |
| `close` | 关闭预览时触发（等价于 `onClose` prop） | —    |

## Slots

无。

## 主题变量

| 变量                                                             | 用途                             |
| ---------------------------------------------------------------- | -------------------------------- |
| `--sn-mp-color-background-overlay`                               | 预览遮罩 / 标题栏 / 关闭按钮底盘 |
| `--sn-mp-color-text-on-primary`                                  | 标题与关闭图标颜色               |
| `--sn-mp-font-size-md`                                           | 标题字号                         |
| `--sn-mp-font-weight-medium`                                     | 标题字重                         |
| `--sn-mp-font-line-height-normal`                                | 标题行高                         |
| `--sn-mp-radius-full`                                            | 关闭按钮圆角                     |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-12` | 标题栏内边距 / 关闭按钮内缩      |

## 无障碍

- 层根节点挂 `role="dialog"`、`aria-modal="true"`、`aria-label="video preview"`
- 关闭按钮 `role="button"` + `aria-label="close"`
- 播放控件是平台原生控件，键盘与读屏支持取决于宿主运行时

## 暗色模式

遮罩、标题栏与关闭按钮都走 `--sn-mp-color-*` 语义色，在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。视频画面本身不受主题影响。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 图片预览：[`sn-image-preview`](/components/uni/image-preview)
- 弹出层：[`sn-popup`](/components/uni/popup)
