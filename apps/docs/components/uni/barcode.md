# Barcode 条形码（uni 端）

`sn-barcode` 用纯 view 渲染 EAN-13 条形码，无 canvas、无图片，双端可直接使用。

## 何时使用

- 商品码 / 票务码展示（EAN-13）
- 需要离线渲染、不依赖第三方编码库的场景

## 代码演示

### 基础用法

12 位输入自动补算校验位；13 位输入做校验；非法输入走 `error` 事件，绝不输出错误条码。

<Demo name="barcode-mp" description="自动校验位 / 显式 13 位与自定义条色 / 非法输入 error。" />

### 格式支持

当前实现 `format="EAN13"`（内置完整 L/G/R 编码表与首位奇偶模板）。CODE128 等其余格式需要对应编码表，登记为后续任务；未实现格式会触发 `BARCODE_FORMAT_UNSUPPORTED` 错误事件。

## API

### Props

| 名称           | 类型                | 默认值      | 说明                       |
| -------------- | ------------------- | ----------- | -------------------------- |
| `text`         | `string`            | `''`        | 条码内容（12 / 13 位数字） |
| `format`       | `'EAN13'`           | `'EAN13'`   | 条码格式，当前仅 EAN13     |
| `showText`     | `boolean`           | `true`      | 是否显示条码文本           |
| `textPosition` | `'bottom' \| 'top'` | `'bottom'`  | 文本位置                   |
| `lineColor`    | `string`            | `undefined` | 条的颜色，默认文本色 token |
| `moduleWidth`  | `number`            | `2`         | 单模块宽度（px）           |
| `height`       | `string`            | `'120rpx'`  | 条区高度                   |
| `fontSize`     | `string`            | `'22rpx'`   | 文本字号                   |
| `customClass`  | `string`            | `undefined` | 根节点自定义类名           |
| `customStyle`  | `string`            | `undefined` | 根节点自定义样式           |

### Events

| 名称       | 参数                            | 说明                                                                                           |
| ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `error`    | `(error: SnBarcodeEncodeError)` | 编码失败（`BARCODE_TEXT_INVALID` / `BARCODE_CHECKSUM_INVALID` / `BARCODE_FORMAT_UNSUPPORTED`） |
| `rendered` | `(encoded: SnBarcodeEncoded)`   | 编码成功                                                                                       |

### Slots

| 名称 | 参数 | 说明       |
| ---- | ---- | ---------- |
| —    | —    | 组件无插槽 |

### Methods

| 名称 | 类型 | 说明           |
| ---- | ---- | -------------- |
| —    | —    | 组件无对外方法 |

## 暗色模式

条色默认跟随文本色 token，暗色下自动反白；可用 `lineColor` 覆盖。
