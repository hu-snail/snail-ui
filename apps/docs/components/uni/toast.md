# Toast 轻提示（uni 端 / 移动端）

`sn-toast` 是 `@snui/uni`（移动端 / 小程序 / H5）的轻提示：一条短暂展示后自动消失的文案，可带状态图标或加载动画，支持四个位置与可选遮罩。基于 easycom 自动注册（`components/sn-toast/sn-toast.vue` → `<sn-toast>`），样式几何值走 `rpx`。

> **未实现**
>
> - **函数式 API**（`useToast()` 及其 `success` / `error` / `warning` / `info` / `loading` / `close`）本轮未实现 —— uni-app 各端没有可靠的编程式挂载点。请用 `v-model` 的组件写法。
> - `selector` 仅为 API 对齐保留，组件式下无效果。
> - `class-prefix` / `css-icon` 仅为 API 对齐保留：uni 端图标是 `IconData` 对象，iconfont class 路径不生效。

## 基础用法

默认居中、横向排版，`duration` 毫秒后自动关闭；`duration=0` 表示不自动关闭（点提示可触发 `click`）。

<Demo name="toast-mp-basic" description="纯文案 / 成功图标（顶部）/ 加载图标纵向排版（底部，不自动关闭）。" />

## 图标与加载形态

`iconName` 取 `success` / `error` / `warning` / `info` / `loading`；`loading` 时用 `loadingType` 切换 `circular` / `spinner` / `dots` / `wave`。

<Demo name="toast-mp-icon" description="四种状态图标与四种加载形态。" />

## 图标尺寸与颜色、遮罩与层级

- `iconSize` / `iconColor` 调整状态图标；`loadingSize` / `loadingColor` 调整加载图标
- `cover` 渲染透明全屏遮罩，阻挡页面点击
- `zIndex` 控制层级，`customStyle` 写在提示框上
- `selector` / `classPrefix` / `cssIcon` / `iconClass` 仅为 wot-ui 对齐声明，uni 端无效果

<Demo name="toast-mp-style" description="图标与加载器尺寸颜色 / cover 遮罩 / zIndex + custom-style。" />

## Props

| 属性         | 类型                                                           | 默认值       | 说明                               |
| ------------ | -------------------------------------------------------------- | ------------ | ---------------------------------- |
| modelValue   | boolean                                                        | false        | 是否显示（`v-model`）              |
| msg          | string                                                         | ''           | 提示文案                           |
| duration     | number                                                         | 2000         | 持续时间（ms）；`0` 表示不自动关闭 |
| direction    | 'horizontal' \| 'vertical'                                     | 'horizontal' | 排版方向                           |
| iconName     | '' \| 'success' \| 'error' \| 'warning' \| 'loading' \| 'info' | ''           | 图标类型                           |
| iconSize     | number \| string                                               | —            | 图标大小（数字按 rpx）             |
| loadingType  | 'circular' \| 'spinner' \| 'dots' \| 'wave'                    | 'circular'   | `iconName="loading"` 时的加载形态  |
| loadingColor | string                                                         | ''           | 加载图标颜色                       |
| loadingSize  | number \| string                                               | —            | 加载图标大小（数字按 rpx）         |
| iconColor    | string                                                         | ''           | 状态图标颜色                       |
| position     | 'top' \| 'middle-top' \| 'middle' \| 'bottom'                  | 'middle'     | 提示位置                           |
| zIndex       | number                                                         | 100          | 层级                               |
| cover        | boolean                                                        | false        | 是否显示阻断式透明遮罩             |
| iconClass    | string                                                         | ''           | 图标节点自定义类名（对齐用）       |
| classPrefix  | string                                                         | 'wd-icon'    | 图标类名前缀（对齐用，无效果）     |
| cssIcon      | boolean \| string                                              | false        | CSS 图标模式（对齐用，无效果）     |
| selector     | string                                                         | ''           | 唯一标识（对齐用）                 |
| customClass  | string                                                         | ''           | 根节点自定义类名                   |
| customStyle  | string                                                         | ''           | 提示框自定义样式                   |

## Events

| 事件名            | 说明                                 | 参数    |
| ----------------- | ------------------------------------ | ------- |
| update:modelValue | `v-model` 同步（自动关闭时也会触发） | boolean |
| opened            | 完全展示后                           | —       |
| closed            | 完全关闭后（淡出结束）               | —       |
| click             | 点击提示框                           | —       |

## Slots

| 插槽名  | 说明                         |
| ------- | ---------------------------- |
| default | 自定义文案内容（替代 `msg`） |
| icon    | 自定义图标区域               |

## 主题变量

| 变量                                                      | 用途             |
| --------------------------------------------------------- | ---------------- |
| --sn-mp-color-text-on-primary                             | 提示文案         |
| --sn-mp-color-background-sunken                           | 提示框背景       |
| --sn-mp-color-background-overlay                          | `cover` 遮罩     |
| --sn-mp-font-size-md                                      | 文案字号         |
| --sn-mp-font-line-height-normal                           | 文案行高         |
| --sn-mp-spacing-3`/`--sn-mp-spacing-5`/`--sn-mp-spacing-6 | 内边距与图标间距 |
| --sn-mp-radius-lg                                         | 提示框圆角       |

## 无障碍

- 提示框：`role="alert"` + `aria-live="assertive"`
- 遮罩：`aria-hidden="true"`，默认透明
- 无键盘交互（自动消失）

## 暗色模式

提示框背景走 `--sn-mp-color-background-sunken`、文案走 `--sn-mp-color-text-on-primary`，两者都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 顶部条幅通知：[`sn-notify`](/components/uni/notify)
- 带按钮的确认框：[`sn-dialog`](/components/uni/dialog)
