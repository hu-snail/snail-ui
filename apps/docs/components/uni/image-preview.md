# ImagePreview 图片预览（uni 端 / 移动端）

`sn-image-preview` 是 `@snui/uni`（移动端 / 小程序 / H5）的全屏图片预览层：可滑动的图片舞台 + `n / 总数` 页码 + 关闭按钮 + 点击关闭。基于 easycom 自动注册（`components/sn-image-preview/sn-image-preview.vue` → `<sn-image-preview>`），样式几何值走 `rpx`。

实现由 `sn-popup`（遮罩 / 层级 / 滚动锁 / 进出场动画）包 `sn-swiper`（原生 `<swiper>`）组合而成，翻页与循环都交给平台。

## 基础用法

wd-image-preview 用 `open` / `close` / `setActive` 方法而不是 `v-model`，本组件保持同样的指令式接口：

```ts
const preview = ref()
preview.value.open({ images: [...], startPosition: 0 })
preview.value.setActive(2)
preview.value.close()
```

`open(options)` 的 `images` / `startPosition` 会覆盖本次会话的 props 值。

<Demo name="image-preview-mp-basic" description="点击缩略图从对应位置打开；按钮从第一张打开；事件回传。" />

## 配置项

- `close-icon-position` 支持 `top-left` / `top-right`
- `show-index=false` 关闭内置页码，`indicator` 插槽可完全自定义
- `default` 插槽渲染底部内容，参数为 `{ current }`
- `close-on-click` 控制点击图片 / 遮罩是否关闭

<Demo name="image-preview-mp-config" description="左上关闭按钮、关闭页码、底部插槽显示当前张数。" />

## selector 模式

`selector` 会在 `open()` 时通过 `uni.createSelectorQuery` 取所有匹配元素的盒子，并在其上铺透明点击区，因此点页面里的缩略图即可从对应位置打开。查询带守卫：宿主没有该能力（单测 / SSR）时不生成点击区，`open()` 仍然可用。

<Demo name="image-preview-mp-behavior" description="selector 命中区、关闭 loop、隐藏关闭按钮、close-on-click 关闭、自定义 z-index 与长按事件。" />

## loop / closeable / close-on-click / z-index

- `loop=false` 时最后一页不能再往后翻（内部 `sn-swiper` 收到 `circular=false`）
- `closeable=false` 隐藏右上关闭按钮，此时应提供 `default` 插槽里的关闭入口或依赖 `close-on-click`
- `close-on-click=false` 后点图片 / 遮罩不再关闭，避免用户误触退出
- `z-index` 透传给内部 `sn-popup`
- `show-menu-by-longpress` 长按图片 emit `long-press`，参数为 `{ image }`

## Props

| 属性                  | 类型                        | 默认值        | 说明                                             |
| --------------------- | --------------------------- | ------------- | ------------------------------------------------ |
| `selector`            | `string`                    | `''`          | 选择器；匹配的元素点击后打开预览                 |
| `images`              | `string[]`                  | `[]`          | 图片 URL 数组                                    |
| `startPosition`       | `number`                    | `0`           | 起始位置索引                                     |
| `showIndex`           | `boolean`                   | `true`        | 是否显示页码                                     |
| `loop`                | `boolean`                   | `true`        | 是否循环播放                                     |
| `closeable`           | `boolean`                   | `true`        | 是否显示关闭按钮                                 |
| `closeIcon`           | `string`                    | `'close'`     | 关闭图标（sn-icon 注册表名；未命中回落到内置 X） |
| `closeIconPosition`   | `'top-left' \| 'top-right'` | `'top-right'` | 关闭图标位置                                     |
| `closeOnClick`        | `boolean`                   | `true`        | 点击图片或遮罩是否关闭                           |
| `showMenuByLongpress` | `boolean`                   | `true`        | 长按图片显示识别小程序码菜单                     |
| `zIndex`              | `number`                    | `1000`        | 层级                                             |
| `customClass`         | `string`                    | `''`          | 预览根节点自定义类名                             |
| `customStyle`         | `string`                    | `''`          | 预览根节点自定义样式                             |

## 方法

| 方法名      | 参数                                    | 说明                                   |
| ----------- | --------------------------------------- | -------------------------------------- |
| `open`      | `options?: { images?, startPosition? }` | 打开预览；options 覆盖本次会话的 props |
| `close`     | —                                       | 关闭预览                               |
| `setActive` | `index: number`                         | 切换到指定图片（自动钳制到范围内）     |

## Events

| 事件名       | 说明           | 参数        |
| ------------ | -------------- | ----------- |
| `open`       | 打开预览时触发 | —           |
| `close`      | 关闭预览时触发 | —           |
| `change`     | 切换图片时触发 | `{ index }` |
| `long-press` | 长按图片时触发 | `{ image }` |

## Slots

| 插槽名      | 说明                                                           |
| ----------- | -------------------------------------------------------------- |
| `default`   | 底部自定义内容，参数 `{ current }`；图片列表为空时顶替整个舞台 |
| `indicator` | 自定义指示器，参数 `{ current, total }`                        |

## 主题变量

| 变量                                                                                  | 用途                                                  |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `--sn-mp-color-background-overlay`                                                    | 页码胶囊 / 关闭按钮底盘                               |
| `--sn-mp-color-text-on-primary`                                                       | 页码与关闭图标颜色                                    |
| `--sn-mp-font-size-md`                                                                | 页码字号                                              |
| `--sn-mp-font-weight-medium`                                                          | 页码字重                                              |
| `--sn-mp-font-line-height-normal`                                                     | 页码行高                                              |
| `--sn-mp-radius-full`                                                                 | 页码胶囊 / 关闭按钮圆角                               |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-4` / `--sn-mp-spacing-5` / `--sn-mp-spacing-8` | 页码内边距 / 关闭按钮内缩 / 底部插槽内边距 / 页码偏移 |

## 无障碍

- 预览根节点挂 `role="dialog"`、`aria-modal="true"`、`aria-label="image preview"`
- 页码是 `aria-live="polite"` 区域，滑动后会播报新位置
- 关闭按钮 `role="button"` + `aria-label="close"`
- 遮罩点击由 `sn-popup` 承担；翻页是原生 `<swiper>` 的手势，没有键盘分页

## 暗色模式

页码胶囊、关闭按钮与底部插槽颜色都走 `--sn-mp-color-*` 语义色，在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。遮罩本身用的是 `--sn-mp-color-background-overlay`，暗色下仍保持足够对比。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 图片展示与加载态：[`sn-img`](/components/uni/img)
- 视频预览：[`sn-video-preview`](/components/uni/video-preview)
- 弹出层：[`sn-popup`](/components/uni/popup)
