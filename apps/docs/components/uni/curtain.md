# Curtain 幕帘（uni 端 / 移动端）

`sn-curtain` 是 `@snui/uni`（移动端 / 小程序 / H5）的图片幕帘：全屏遮罩 + 居中图片 + 可配置位置的关闭按钮，常用于活动弹窗、节日提示。基于 easycom 自动注册（`components/sn-curtain/sn-curtain.vue` → `<sn-curtain>`），样式几何值走 `rpx`。

> **与 wot-ui 的差异**
>
> - 不声明已废弃的 `value` 属性，`v-model` 是唯一数据源。
> - `root-portal` 已声明但**未实现**（小程序没有 portal 宿主）。
> - `show-menu-by-longpress` 透传到 `<image>` 的同名属性，仅微信小程序生效。
> - `to` 通过 `globalThis.uni.navigateTo` 跳转（带存在性守卫），跳转失败时静默吞掉，`click` 仍会触发，由宿主决定后续路由。

## 基础用法

`v-model` 控制显隐，`src` 是图片地址，`width` 是图片宽度（设计稿 px，不传则铺满屏宽）。默认 `close-position="inset"`，关闭按钮压在图片底部中间。

<Demo name="curtain-mp-basic" description="默认 inset 关闭按钮，点击图片即关闭。" />

## 关闭按钮位置

`close-position` 支持 `inset` / `top` / `bottom` / `top-left` / `top-right` / `bottom-left` / `bottom-right`。`custom-close-class` / `custom-close-style` 可进一步定制按钮。

<Demo name="curtain-mp-close-position" description="top 与 bottom-right 两种位置，右下角带自定义阴影。" />

## 关闭行为

- `closeOnClick`（默认 `true`）控制点击图片是否关闭
- `closeOnClickModal`（默认 `false`）控制点击遮罩是否关闭
- `hideWhenClose=false` 关闭后保留节点；`zIndex` 控制层级；`rootPortal` 仅为对齐声明

<Demo name="curtain-mp-behavior" description="点图片不关闭 / 点遮罩关闭 / 关闭后保留节点 + zIndex=150。" />

## 自定义样式

`customCloseStyle` 写在关闭按钮上，`customStyle` 写在根节点上；`showMenuByLongpress` 透传给 `image`，仅微信小程序生效。

<Demo name="curtain-mp-custom" description="关闭按钮内联样式 + 根节点内联样式 + 长按识别菜单。" />

## Props

| 属性                  | 类型                                                                                           | 默认值    | 说明                                 |
| --------------------- | ---------------------------------------------------------------------------------------------- | --------- | ------------------------------------ |
| `modelValue`          | `boolean`                                                                                      | `false`   | 是否显示（`v-model`）                |
| `src`                 | `string`                                                                                       | `''`      | 幕帘图片地址（网络地址 / 包内路径）  |
| `width`               | `number`                                                                                       | `0`       | 图片宽度（设计稿 px）；`0` 铺满屏宽  |
| `to`                  | `string`                                                                                       | `''`      | 点击图片跳转的页面路径               |
| `closePosition`       | `'inset' \| 'top' \| 'bottom' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'inset'` | 关闭按钮位置                         |
| `closeOnClickModal`   | `boolean`                                                                                      | `false`   | 点击遮罩是否关闭                     |
| `closeOnClick`        | `boolean`                                                                                      | `true`    | 点击图片是否关闭                     |
| `hideWhenClose`       | `boolean`                                                                                      | `true`    | 关闭后是否移除节点                   |
| `zIndex`              | `number`                                                                                       | `10`      | 层级                                 |
| `customCloseClass`    | `string`                                                                                       | `''`      | 关闭按钮自定义类名                   |
| `customCloseStyle`    | `string`                                                                                       | `''`      | 关闭按钮自定义样式                   |
| `showMenuByLongpress` | `boolean`                                                                                      | `false`   | 长按图片显示识别菜单（仅微信小程序） |
| `customClass`         | `string`                                                                                       | `''`      | 根节点自定义类名                     |
| `customStyle`         | `string`                                                                                       | `''`      | 根节点自定义样式                     |
| `rootPortal`          | `boolean`                                                                                      | `false`   | **未实现**（小程序无 portal 宿主）   |

## Events

| 事件名                                   | 说明                               | 参数               |
| ---------------------------------------- | ---------------------------------- | ------------------ |
| `update:modelValue`                      | 显隐变化                           | `(value: boolean)` |
| `click`                                  | 点击幕帘图片                       | —                  |
| `close`                                  | 请求关闭（图片 / 遮罩 / 关闭按钮） | —                  |
| `closed`                                 | 离开动画结束                       | —                  |
| `click-modal`                            | 点击遮罩                           | —                  |
| `before-enter` / `enter` / `after-enter` | 进入动画三阶段                     | —                  |
| `before-leave` / `leave` / `after-leave` | 离开动画三阶段                     | —                  |
| `load`                                   | 图片加载完成                       | `(event: Event)`   |
| `error`                                  | 图片加载失败（幕帘自动隐藏）       | —                  |

## Slots

| 插槽名  | 说明                         |
| ------- | ---------------------------- |
| `close` | 自定义关闭按钮，替换内置图标 |

## 主题变量

| 变量                                        | 用途                    |
| ------------------------------------------- | ----------------------- |
| `--sn-mp-color-background-overlay`          | 全屏遮罩                |
| `--sn-mp-color-background-elevated`         | 关闭按钮底色            |
| `--sn-mp-color-text-secondary`              | 关闭按钮图标            |
| `--sn-mp-color-border-default`              | 关闭按钮描边            |
| `--sn-mp-radius-md` / `--sn-mp-radius-full` | 图片圆角 / 关闭按钮圆形 |

## 无障碍

- 根节点带 `role="dialog"` + `aria-modal="true"`
- 遮罩 `aria-hidden="true"`
- 关闭按钮带 `role="button"` + `aria-label="close"`
- 交互统一用 `@tap`；移动端无键盘焦点陷阱

## 暗色模式

遮罩走 `--sn-mp-color-background-overlay`，关闭按钮底色 / 描边 / 图标分别走 `--sn-mp-color-background-elevated` / `--sn-mp-color-border-default` / `--sn-mp-color-text-secondary`，全部在 `@snui/tokens-mp/styles` 的 `.sn-theme-dark` 块里覆盖，因此暗色下自动适配。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 通用弹出层：[`sn-popup`](/components/uni/popup)
- 图片预览 / 缩放：`sn-img`
