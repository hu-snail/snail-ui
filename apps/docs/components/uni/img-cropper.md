# ImgCropper 图片裁剪（uni 端 / 移动端）

`sn-img-cropper` 是 `@snui/uni`（移动端 / 小程序 / H5）的图片裁剪层：固定裁剪框 + 单指拖拽平移 + 双指缩放 + 90° 旋转。基于 easycom 自动注册（`components/sn-img-cropper/sn-img-cropper.vue` → `<sn-img-cropper>`），样式几何值走 `rpx`。

## 基础用法

`v-model` 控制显隐，`img-src` 是源图。`confirm` 返回变换参数与裁剪框覆盖的源图矩形，宿主据此自行栅格化。

<Demo name="img-cropper-mp-basic" description="打开裁剪层、拖拽 / 缩放 / 旋转，确认后展示几何结果。" />

## 比例与旋转

`aspect-ratio` 接受 `"宽:高"` 字符串（默认 `1:1`），非法值回落到 1:1。`disabled-rotate` 隐藏旋转按钮并禁用 `setRotate`。

<Demo name="img-cropper-mp-ratio" description="1:1 / 16:9 / 9:16 三种比例切换，禁止旋转与自定义按钮文案。" />

## 手势

裁剪舞台监听 `@touchstart` / `@touchmove` / `@touchend` / `@touchcancel`：

- 单指拖动 → 平移图片
- 双指张开 / 收拢 → 缩放（钳制在 `0.5` 到 `max-scale` 之间）

没有 `window.addEventListener`，没有定时器，也没有异步测量。

## 声明但对本实现无效的属性

下列 wd-img-cropper 属性**已声明**（对齐参考 API，配置可以原样 type-check），但在本实现里没有渲染效果：

| 属性                                     | 说明                                                                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `export-scale` / `quality` / `file-type` | 只在导出为图片文件时才有意义，需要 `<canvas>` + `uni.canvasToTempFilePath`，不在本包的跨端元素白名单内。宿主用 `confirm` 返回的几何自行栅格化并应用这三项 |
| `img-width` / `img-height`               | 作为**预览框**尺寸生效：数字按设计稿 px（内部 ×2 换 rpx），字符串原样使用（`%` 才有意义）。留空则沿用 `100%` 适配                                         |

<Demo name="img-cropper-mp-export" description="img-width / img-height 预览框、max-scale 上限，以及 export-scale / quality / file-type 代入 confirm 结果。" />

## Props

| 属性                | 类型               | 默认值      | 说明                                        |
| ------------------- | ------------------ | ----------- | ------------------------------------------- |
| `modelValue`        | `boolean`          | `false`     | 是否打开裁剪组件（`v-model`）               |
| `imgSrc`            | `string`           | `''`        | 图片资源链接                                |
| `disabledRotate`    | `boolean`          | `false`     | 禁止图片旋转                                |
| `maxScale`          | `number`           | `3`         | 最大缩放倍数（小于等于 0.5 时回落到 3）     |
| `imgWidth`          | `number \| string` | `undefined` | 预览图宽度：数字按设计稿 px，字符串原样使用 |
| `imgHeight`         | `number \| string` | `undefined` | 预览图高度：同上                            |
| `exportScale`       | `number`           | `1`         | 导出缩放倍数（已声明，本实现不栅格化）      |
| `quality`           | `number`           | `0.92`      | 导出质量 0–1（已声明，本实现不栅格化）      |
| `fileType`          | `'png' \| 'jpg'`   | `'png'`     | 导出格式（已声明，本实现不栅格化）          |
| `cancelButtonText`  | `string`           | `'取消'`    | 取消按钮文案                                |
| `confirmButtonText` | `string`           | `'完成'`    | 确认按钮文案                                |
| `aspectRatio`       | `string`           | `'1:1'`     | 裁剪框宽高比，格式 `宽:高`                  |
| `customClass`       | `string`           | `''`        | 根节点自定义类名                            |
| `customStyle`       | `string`           | `''`        | 根节点自定义样式                            |

## Events

| 事件名              | 说明                     | 参数                 |
| ------------------- | ------------------------ | -------------------- |
| `update:modelValue` | 显隐变化（`v-model`）    | `boolean`            |
| `confirm`           | 完成截图时触发，随后关闭 | `SnImgCropperResult` |
| `cancel`            | 取消截图时触发，随后关闭 | —                    |
| `imgloaded`         | 图片加载完成             | `{ src }`            |
| `imgloaderror`      | 图片加载错误             | `{ error }`          |

### `SnImgCropperResult`

| 字段                  | 类型                      | 含义                             |
| --------------------- | ------------------------- | -------------------------------- |
| `offsetX` / `offsetY` | `number`                  | 实际平移量（rpx）                |
| `scale`               | `number`                  | 实际缩放倍数                     |
| `rotate`              | `number`                  | 实际旋转角度（90 的倍数）        |
| `source`              | `{ x, y, width, height }` | 裁剪框覆盖的源图矩形（源图像素） |
| `frame`               | `{ width, height }`       | 裁剪框尺寸（rpx）                |

## Slots

无。

## 主题变量

| 变量                                                                                  | 用途                               |
| ------------------------------------------------------------------------------------- | ---------------------------------- |
| `--sn-mp-color-background-overlay`                                                    | 层遮罩 / 工具按钮底盘              |
| `--sn-mp-color-background-elevated`                                                   | 裁剪框描边 / 底部操作栏            |
| `--sn-mp-color-background-sunken`                                                     | 裁剪框底盘                         |
| `--sn-mp-color-border-subtle`                                                         | 三分构图线                         |
| `--sn-mp-color-action-primary`                                                        | 裁剪框角标                         |
| `--sn-mp-color-text-on-primary`                                                       | 工具文案 / 图标                    |
| `--sn-mp-font-size-sm`                                                                | 工具文案字号                       |
| `--sn-mp-font-line-height-normal`                                                     | 工具文案行高                       |
| `--sn-mp-radius-full`                                                                 | 圆形工具按钮                       |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-5` / `--sn-mp-spacing-8` | 工具内边距 / 底部内边距 / 工具间距 |

## 无障碍

- 层根节点挂 `role="dialog"`、`aria-modal="true"`、`aria-label="image cropper: <src>"`
- 旋转与重置控件是 `role="button"` 并带 `aria-label`
- 三分线与角标 `aria-hidden="true"`，它们是辅助线不是内容
- 手势为触摸专用，没有键盘平移 / 缩放 —— 与 uni 端仅面向移动设备的定位一致

## 暗色模式

遮罩、裁剪框描边、构图线与角标全部走 `--sn-mp-color-*` 语义色，在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 图片上传：[`sn-upload`](/components/uni/upload)
- 图片展示：[`sn-img`](/components/uni/img)
