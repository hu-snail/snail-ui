# 二维码 QR Code · Web（PC 端）

将文本内容渲染为可扫码识别的二维码，支持纠错等级、配色、尺寸、中心图标与下载。

## 何时使用

- 需要将链接、文本、配置信息生成为二维码供扫码使用
- 需要自定义二维码颜色、尺寸或叠加中心图标
- 需要导出二维码图片（PNG / SVG）

## 代码演示

### 基础用法

<Demo name="qr-code-web-basic" description="value 生成默认尺寸的二维码。" />

### 尺寸

<Demo name="qr-code-web-size" description="size 属性控制整体尺寸（含内边距）。" />

### 颜色

<Demo name="qr-code-web-color" description="color / background-color 自定义深浅模块颜色。" />

### 纠错等级

<Demo name="qr-code-web-error-correction" description="error-correction-level 切换 L/M/Q/H 四档纠错能力。" />

### 中心图标

<Demo name="qr-code-web-icon" description="icon-src 在码中心叠加图标，H 档纠错保证可扫。" />

### 下载

<Demo name="qr-code-web-download" description="悬停出现浮动工具条下载 PNG，也可手动导出。" />

### 渲染类型

<Demo name="qr-code-web-type" description="type 切换 canvas / svg 两种渲染目标。" />

## API

### SnQrCode Props

| 名称                   | 类型                       | 默认值      | 说明                                                   |
| ---------------------- | -------------------------- | ----------- | ------------------------------------------------------ |
| value                  | `string`                   | `''`        | 二维码内容                                             |
| error-correction-level | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'`       | 纠错级别：L 约 7%、M 约 15%、Q 约 25%、H 约 30% 可恢复 |
| size                   | `number`                   | `100`       | 二维码整体尺寸（含 padding，单位 px）                  |
| padding                | `number \| string`         | `12`        | 二维码内边距（数字按 px）                              |
| color                  | `string`                   | `'#000'`    | 深色模块颜色                                           |
| background-color       | `string`                   | `'#FFF'`    | 浅色模块与底色                                         |
| icon-src               | `string`                   | `undefined` | 中心图标地址                                           |
| icon-size              | `number`                   | `40`        | 中心图标尺寸（px）                                     |
| icon-background-color  | `string`                   | `'#FFF'`    | 图标衬底颜色                                           |
| icon-border-radius     | `number`                   | `4`         | 图标衬底圆角（px）                                     |
| type                   | `'canvas' \| 'svg'`        | `'canvas'`  | 渲染目标                                               |
| show-toolbar           | `boolean`                  | `true`      | 悬停/聚焦时显示浮动下载工具条                          |

### 编码说明

- 采用 QR Code Model 2 标准，版本 1-40 自动选择最小可容纳版本
- 文本按 UTF-8 字节模式编码；内容超出版本 40 容量时抛出异常
- 纠错等级在版本不变的前提下自动上调（与扫码器兼容性最佳）
- 掩码图案按标准惩罚规则自动评估选取，可通过测试参数强制指定

### 无障碍

- canvas / svg 携带 `role="img"` 与 `aria-label="二维码：<value>"`
- 下载按钮为真实 `<button>`，`aria-label="下载二维码"`
