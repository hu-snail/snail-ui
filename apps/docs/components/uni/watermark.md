# Watermark 水印（uni 端 / 移动端）

`sn-watermark` 是 `@snui/uni`（移动端 / 小程序 / H5）的水印层：在指定区域上铺一层旋转的文字 / 图片瓦片。基于 easycom 自动注册（`components/sn-watermark/sn-watermark.vue` → `<sn-watermark>`），样式几何值走 `rpx`。

> **未实现**
>
> - **未使用 canvas**：wot-ui 用 canvas 画瓦片再导出成背景图，但 `uni.createCanvasContext` + `canvasToTempFilePath` 是异步且各端行为不一致，小程序 WXSS 也没有 data-URL 背景通道。因此本轮改为用真实节点铺一层旋转网格。**后果**：水印是视觉标记，不是 canvas 那种防篡改叠加层。
> - `fontStyle` / `fontWeight` / `fontFamily` 会作用在渲染出的 `<text>` 上，字形度量与 canvas 参考实现不同。

## 基础用法

`content` 渲染文字瓦片；`fullScreen` 默认 `true`（`position: fixed`），设为 `false` 则相对父容器（父容器需 `position: relative`）。水印层 `pointer-events: none`，不会拦截点击。

<Demo name="watermark-mp-basic" description="合同预览区域上的文字水印。" />

## 瓦片与布局

`width` / `height` 是瓦片尺寸，`gutterX` / `gutterY` 是瓦片间距（均为 px）；`rotate` 控制旋转角度，`layout="staggered"` 让隔行错位。

<Demo name="watermark-mp-config" description="三种瓦片尺寸 / 间距 / 旋转 / 错位布局组合。" />

## 图片瓦片与字体控制

`image` 优先于 `content`，瓦片尺寸由 `imageWidth` / `imageHeight` 决定；文字瓦片的字形由 `fontFamily` / `fontStyle` / `fontWeight` 控制。`zIndex` 与 `customStyle` 作用于根节点，`customClass` 追加自定义类名。

<Demo name="watermark-mp-image" description="图片瓦片、字体族 / 样式 / 粗细、z-index 与 customClass / customStyle。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| content | string | '' | 水印文字内容 |
| image | string | '' | 水印图片地址 |
| imageHeight | number | 100 | 图片高度（px） |
| imageWidth | number | 100 | 图片宽度（px） |
| gutterX | number | 0 | X 轴间距（px） |
| gutterY | number | 0 | Y 轴间距（px） |
| width | number | 100 | 单个瓦片宽度（px） |
| height | number | 100 | 单个瓦片高度（px） |
| fullScreen | boolean | true | 是否铺满整个视口 |
| color | string | '' | 水印文字颜色 |
| size | number | 14 | 水印文字大小（px） |
| fontStyle | 'normal' \| 'italic' \| 'oblique' | 'normal' | 水印字体样式 |
| fontWeight | string \| number | 'normal' | 水印字体粗细 |
| fontFamily | string | 'PingFang SC' | 水印字体系列 |
| rotate | number | -25 | 水印旋转角度 |
| zIndex | number | 1100 | 水印层级 |
| opacity | number | — | 水印透明度，0–1 |
| layout | 'grid' \| 'staggered' | 'grid' | 水印布局 |
| customStyle | string | '' | 自定义根节点样式 |
| customClass | string | '' | 自定义根节点样式类 |

## Events

无。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义瓦片内容（替代 `content` / `image`） |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| --sn-mp-color-text-disabled | 默认水印墨色 |
| --sn-mp-font-line-height-tight | 瓦片文字行高 |

## 无障碍

- 根节点：`aria-hidden="true"` + `pointer-events: none` —— 水印是装饰层，永远不拦截点击

## 暗色模式

默认墨色走 `--sn-mp-color-text-disabled`，该变量在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


> 若通过 `color` 传了自定义色值，该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式。

## 相关

- 遮罩层：[`sn-overlay`](/components/uni/overlay)
- 图片：[`sn-img`](/components/uni/img)
