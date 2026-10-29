# Barcode 条形码（uni 端）

`sn-barcode` 用纯 view 渲染条形码，无 canvas、无图片，双端可直接使用。支持 CODE128 / CODE39 / EAN13 / EAN8 / UPC / CODEBAR / ITF 七种格式（编码表以 JsBarcode (MIT) 源码为准核对）。

## 何时使用

- 商品码 / 票务码 / 库存码展示
- 需要离线渲染、不依赖第三方编码库的场景

## 代码演示

### 基础用法

12 位输入自动补算校验位；13 位输入做校验；非法输入走 `error` 事件，绝不输出错误条码。

<Demo name="barcode-mp" description="自动校验位 / 显式 13 位与自定义条色 / 非法输入 error。" />

### 格式支持

通过 `format` 选择编码格式：

| 格式      | 字符集与说明                                                      |
| --------- | ----------------------------------------------------------------- |
| `CODE128` | 可打印 ASCII（Code Set B），内部计算 Mod 103 校验符               |
| `CODE39`  | `0-9 A-Z - . 空格 $ / + %`（自动转大写），自动包裹 `*` 起始终止符 |
| `EAN13`   | 12 位（自动补校验位）或 13 位（校验），95 模块                    |
| `EAN8`    | 7 位（自动补校验位）或 8 位（校验），67 模块                      |
| `UPC`     | 11 位（自动补校验位）或 12 位（校验），95 模块                    |
| `CODEBAR` | `A-D` 起/终止符 + `0-9 - $ : / . +`，纯数据自动补 `A…A`           |
| `ITF`     | 偶数位数字，两两交错                                              |

### 布局与样式

- `layout="vertical"`：条码旋转 90° 垂直排布
- `lineLength` / `height`：线条长度（`lineLength` 优先）
- `lineColor`：条与文本颜色；`background`：背景色
- `textAlign`：文本对齐；`margin`：整体边距

## API

### Props

| 名称           | 类型                                                                        | 默认值          | 说明                            |
| -------------- | --------------------------------------------------------------------------- | --------------- | ------------------------------- |
| `text`         | `string`                                                                    | `''`            | 条码内容（按格式的字符集要求）  |
| `format`       | `'CODE128' \| 'CODE39' \| 'EAN13' \| 'EAN8' \| 'UPC' \| 'CODEBAR' \| 'ITF'` | `'EAN13'`       | 条码格式                        |
| `showText`     | `boolean`                                                                   | `true`          | 是否显示条码文本                |
| `layout`       | `'horizontal' \| 'vertical'`                                                | `'horizontal'`  | 布局方向                        |
| `textPosition` | `'bottom' \| 'top'`                                                         | `'bottom'`      | 文本位置                        |
| `lineColor`    | `string`                                                                    | `undefined`     | 条的颜色，默认文本色 token      |
| `background`   | `string`                                                                    | `'transparent'` | 背景色                          |
| `moduleWidth`  | `number`                                                                    | `2`             | 单模块宽度（px）                |
| `height`       | `string`                                                                    | `'120rpx'`      | 线条长度（`lineLength` 的别名） |
| `lineLength`   | `string`                                                                    | `''`            | 线条长度，优先于 `height`       |
| `margin`       | `string`                                                                    | `''`            | 整体边距（CSS margin 值）       |
| `textAlign`    | `'left' \| 'center' \| 'right'`                                             | `'center'`      | 文本对齐                        |
| `fontSize`     | `string`                                                                    | `'22rpx'`       | 文本字号                        |
| `customClass`  | `string`                                                                    | `undefined`     | 根节点自定义类名                |
| `customStyle`  | `string`                                                                    | `undefined`     | 根节点自定义样式                |

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
