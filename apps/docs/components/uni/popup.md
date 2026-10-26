# Popup 弹出层（uni 端 / 移动端）

`sn-popup` 是 `@snui/uni`（移动端 / 小程序 / H5）的弹出层组件：一层遮罩加一块按 `position` 定位的面板，带进出场动画和「点遮罩关闭」契约。基于 easycom 自动注册（`components/sn-popup/sn-popup.vue` → `<sn-popup>`），样式几何值走 `rpx`，跨设备自动缩放。

## 基础用法

`v-model` 控制显隐，`position="bottom"` 是最常见的底部弹层，`round` 会自动按方向加圆角（底部 → 上圆角）。

<Demo name="popup-mp-basic" description="底部弹层（bottom + round）与居中弹层（center + closable 关闭按钮）。" />

## 弹出位置

`position` 支持 `center` / `top` / `right` / `bottom` / `left`。不传 `transition` 时，默认动画跟随方向：bottom → `slide-up`、top → `slide-down`、left → `slide-right`、right → `slide-left`、center → `fade`。

<Demo name="popup-mp-position" description="5 个方位 + 自动匹配的进出场动画。" />

## 遮罩与关闭行为

- `modal=false` 不渲染遮罩（面板仍会定位在屏幕内）
- `closeOnClickModal=false` 点遮罩仍触发 `click-modal`，但不会关闭
- `closable` 在面板右上角渲染关闭按钮
- `hideWhenClose=false` 关闭后保留节点（仅加 `sn-popup--hidden`）

<Demo name="popup-mp-config" description="modal / closeOnClickModal / transition + duration，以及动画事件。" />

## 锁定背景滚动

`lockScroll`（默认 `true`）在遮罩上拦截 `touchmove` 手势并 `preventDefault()`，效果等同 uni-app 的 `catchtouchmove` —— 小程序没有 `document`，所以不使用全局监听器，也不存在需要手动解绑的 listener（AGENTS.md §41）。

## 样式、懒渲染与安全区

- `modalStyle` 写遮罩内联样式，`customStyle` 写面板内联样式
- `lazyRender`（默认 `true`）：首次打开前不渲染面板内容；`false` 则挂载即渲染
- `safeAreaInsetBottom`：底部弹层为 `env(safe-area-inset-bottom)` 留白
- `rootPortal` 仅为对齐声明，小程序无 portal 宿主
- `lockScroll`（默认 `true`）拦截遮罩上的 `touchmove`；`hideWhenClose`（默认 `true`）关闭后移除节点
- `zIndex` 控制层级

<Demo name="popup-mp-surface" description="遮罩内联样式 / 面板内联样式 + 安全区 / lazy-render=false。" />

<Demo name="popup-mp-scroll" description="lock-scroll=false / hide-when-close=false / zIndex=200 与离场事件。" />

## Props

| 属性                  | 类型                                                                                                                                                          | 默认值     | 说明                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------- |
| `modelValue`          | `boolean`                                                                                                                                                     | `false`    | 是否显示（`v-model`）                                    |
| `transition`          | `'fade' \| 'fade-up' \| 'fade-down' \| 'fade-left' \| 'fade-right' \| 'slide-up' \| 'slide-down' \| 'slide-left' \| 'slide-right' \| 'zoom-in' \| 'zoom-out'` | `''`       | 动画类型，空则按 `position` 推导                         |
| `closable`            | `boolean`                                                                                                                                                     | `false`    | 是否显示关闭按钮                                         |
| `position`            | `'center' \| 'top' \| 'right' \| 'bottom' \| 'left'`                                                                                                          | `'center'` | 弹出位置                                                 |
| `closeOnClickModal`   | `boolean`                                                                                                                                                     | `true`     | 点击遮罩是否关闭                                         |
| `duration`            | `number \| boolean \| Record<string, number>`                                                                                                                 | `300`      | 动画时长；`false` 关闭动画，对象可分别设置 enter / leave |
| `modal`               | `boolean`                                                                                                                                                     | `true`     | 是否显示遮罩                                             |
| `zIndex`              | `number`                                                                                                                                                      | `10`       | 弹层层级                                                 |
| `hideWhenClose`       | `boolean`                                                                                                                                                     | `true`     | 关闭时是否移除节点                                       |
| `modalStyle`          | `string`                                                                                                                                                      | `''`       | 自定义遮罩样式                                           |
| `safeAreaInsetBottom` | `boolean`                                                                                                                                                     | `false`    | 底部弹层是否适配底部安全区                               |
| `lazyRender`          | `boolean`                                                                                                                                                     | `true`     | 弹层内容是否懒渲染                                       |
| `lockScroll`          | `boolean`                                                                                                                                                     | `true`     | 是否锁定背景滚动                                         |
| `round`               | `boolean`                                                                                                                                                     | `false`    | 是否开启圆角（按位置自动适配）                           |
| `customClass`         | `string`                                                                                                                                                      | `''`       | 根节点自定义类名                                         |
| `customStyle`         | `string`                                                                                                                                                      | `''`       | 弹层自定义样式                                           |

> **未实现**：`root-portal`（从页面结构中脱离以解决 fixed 失效）。uni-app 小程序没有 portal 宿主，无法把弹层重新挂到页面根节点；需要避免在带 `transform` 的祖先内使用 `sn-popup`。

## Events

| 事件名              | 说明                                                 | 参数               |
| ------------------- | ---------------------------------------------------- | ------------------ |
| `update:modelValue` | 组件内部关闭时触发（关闭按钮 / 点遮罩）              | `(value: boolean)` |
| `close`             | 用户关闭弹出层                                       | —                  |
| `click-modal`       | 点击遮罩时触发（`closeOnClickModal=false` 也会触发） | —                  |
| `before-enter`      | 进入前触发                                           | —                  |
| `enter`             | 进入时触发                                           | —                  |
| `after-enter`       | 进入后触发                                           | —                  |
| `before-leave`      | 离开前触发                                           | —                  |
| `leave`             | 离开时触发                                           | —                  |
| `after-leave`       | 离开后触发                                           | —                  |

## Slots

| 插槽名    | 说明                                            |
| --------- | ----------------------------------------------- |
| `default` | 弹层内容（`lazyRender` 开启时首次打开后才渲染） |

## 主题变量

| 变量                                | 用途              |
| ----------------------------------- | ----------------- |
| `--sn-mp-color-background-overlay`  | 遮罩底色（scrim） |
| `--sn-mp-color-background-elevated` | 面板底色          |
| `--sn-mp-color-text-primary`        | 面板文字色        |
| `--sn-mp-color-text-secondary`      | 关闭按钮图标色    |
| `--sn-mp-radius-xl`                 | `round` 圆角      |
| `--sn-mp-font-line-height-normal`   | 面板行高          |

## 无障碍

- 面板挂 `role="dialog"` + `aria-modal="true"`
- 遮罩 `aria-hidden="true"`（纯装饰，语义由面板承担）
- 关闭按钮挂 `role="button"` + `aria-label="close"`
- 交互统一用 `@tap`（小程序没有 `click`）；移动端无键盘焦点陷阱

## 暗色模式

组件的遮罩与面板分别走 `--sn-mp-color-background-overlay` / `--sn-mp-color-background-elevated`，两者都在 `@snui/tokens-mp/styles` 的 `page.sn-theme-dark, .sn-theme-dark` 块里覆盖过，因此暗色下自动适配，无需额外配置。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 纯遮罩：[`sn-overlay`](/components/uni/overlay)
- 居中确认框 / 对话框：`sn-dialog`（规划中）
