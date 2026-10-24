# QRCode 二维码（uni 端 / 移动端）

`sn-qr-code` 是 `@snui/uni`（移动端 / 小程序 / H5）的二维码组件：真实编码后画在 `<canvas>` 上。基于 easycom 自动注册（`components/sn-qr-code/sn-qr-code.vue` → `<sn-qr-code>`），样式几何值走 `rpx`。

编码器是本仓库自带的 `sn-qr-core.ts`（ISO/IEC 18004 Model 2）：版本 1-40、四种纠错级别、数字 / 字母数字 / 字节三种分段模式、8 种掩码 + N1-N4 惩罚评分、GF(2^8) 上的 Reed-Solomon 纠错。**不引入任何依赖**，也不使用 `eval` / `new Function`。

## 基础用法

`text` 是编码内容，`size` 是画布边长（设计稿 px，内部按 2 倍换算成 rpx）。`correct-level` 默认 `H`（约 30% 可恢复），内容较长时可用 `M` 让模块更大更好扫。

<Demo name="qr-code-mp-basic" description="默认纠错 H 与纠错 M 的对比。" />

## 码点形状与颜色

`dot-type` 支持 `square`（方块）/ `dots`（圆点）/ `rounded`（圆角方块）/ `liquid`（圆点 + 相邻粘连）。`dot-scale` 控制码点在单元格内的填充比例（0.4-1）。`color-dark` / `color-light` 自定义深浅色；`enable-gradient` 打开渐变，`gradient-color` 单色渐变、`gradient-colors` 多色渐变，`gradient-direction` 取 `diagonal` / `horizontal` / `vertical` 或角度数值。

<Demo name="qr-code-mp-dot-type" description="四种码点形状、自定义深浅色与垂直渐变。" />

## 静区与导出

`margin` 是画布内部的静区（设计稿 px，最大不超过边长的 1/3）。`exportImage()` 通过 `uni.canvasToTempFilePath` 导出临时文件路径；宿主不支持该能力时 reject `{ code: 'CAPABILITY_UNSUPPORTED' }`，平台报错时 reject `{ code: 'EXPORT_FAILED' }`。

<Demo name="qr-code-mp-export" description="带静区的二维码 + exportImage 导出临时路径。" />

## 多色渐变、角度与 canvasId

`gradientColors` 传 2 个以上颜色时覆盖 `gradientColor`；`gradientDirection` 取 `diagonal` / `horizontal` / `vertical`，也可以直接给角度数值。`canvasId` 指定画布 id（默认按实例 uid 生成，保证同页多个二维码不冲突），`customClass` / `customStyle` 作用于根节点。

<Demo name="qr-code-mp-canvas" description="三色渐变、45° 角度渐变、自定义 canvasId 与根节点类名 / 样式。" />

## 绘制路径

1. `uni.createCanvasContext(canvasId, instance)` —— 微信 / 支付宝 / App
2. 退回到 `<canvas>` 元素自身的 `getContext('2d')` —— H5 / 文档预览
3. 两者都不可用（单测 / SSR）—— 网格保持未绘制，渲染不抛错

## 未实现能力

以下 wd-qr-code 属性**未声明**（CONTRIBUTING §2.2：不实现的能力不出现）：

| 属性 | 原因 |
| --- | --- |
| `logo` / `logo-width` / `logo-height` / `logo-background-color` / `logo-radius` / `logo-border-color` / `logo-border-width` | 往 uni canvas 画图片需要 `uni.getImageInfo`（或 `downloadFile`）后再 `drawImage`，能力与异步时序各端不一致；若某端静默失败还会破坏二维码按纠错级别预留的容量预算 |
| `background-image` | 同上（解码 → 绘制 → 导出链路） |

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | `''` | 二维码内容 |
| `size` | `number` | `200` | 画布边长，设计稿 px（钳制 40-1000） |
| `correctLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'H'` | 纠错级别 |
| `colorDark` | `string` | `''` | 深色区域颜色；`''` 表示码自身的深色 |
| `colorLight` | `string` | `''` | 浅色区域 + 静区颜色 |
| `margin` | `number` | `0` | 静区宽度，设计稿 px |
| `dotType` | `'square' \| 'dots' \| 'rounded' \| 'liquid'` | `'square'` | 码点类型 |
| `dotScale` | `number` | `1` | 码点填充比例（钳制 0.4-1） |
| `enableGradient` | `boolean` | `false` | 是否启用渐变 |
| `gradientColor` | `string` | `''` | 渐变结束色；`''` 回落到 `colorDark` |
| `gradientColors` | `string[]` | `[]` | 多色渐变（2 色以上），优先于 `gradientColor` |
| `gradientDirection` | `'diagonal' \| 'horizontal' \| 'vertical' \| number` | `'diagonal'` | 渐变方向；数字为角度 |
| `canvasId` | `string` | `''` | Canvas ID；`''` 时按实例自动生成 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击组件时触发 | `Event` |
| `error` | 编码失败或画布上下文不可用时触发 | `unknown` |

## 方法

| 方法名 | 返回值 | 说明 |
| --- | --- | --- |
| `exportImage` | `Promise<string>` | 导出二维码图片，resolve 为临时文件路径 |

## Slots

无。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-border-subtle` | 二维码外框 |
| `--sn-mp-color-background-elevated` | 根底盘 / 失败面板底色 |
| `--sn-mp-radius-md` | 根节点与失败面板圆角 |
| `--sn-mp-spacing-4` | 失败面板内边距 |
| `--sn-mp-color-feedback-danger` | 编码失败文案颜色 |
| `--sn-mp-font-size-sm` | 编码失败文案字号 |
| `--sn-mp-font-line-height-normal` | 编码失败文案行高 |

## 无障碍

- 根节点挂 `role="img"`，`aria-label` 为 `QR code: <text>`（无内容时为 `QR code`）
- 编码失败浮层挂 `role="alert"`
- 无键盘交互；点击目标是根节点

## 暗色模式

外框、底盘与失败文案都走 `--sn-mp-color-*` 语义色，在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。二维码本体保持「深色模块 + 浅色静区」：反色（浅码深底）的二维码多数扫码器无法识别，所以 `colorDark` / `colorLight` 刻意不跟随主题。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 图片展示与预览：[`sn-img`](/components/uni/img)
- 图片预览层：[`sn-image-preview`](/components/uni/image-preview)
