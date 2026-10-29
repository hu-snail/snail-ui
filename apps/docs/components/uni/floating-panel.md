# FloatingPanel 浮动面板（uni 端 / 移动端）

`sn-floating-panel` 是 `@snui/uni`（移动端 / 小程序 / H5）的可拖拽底部面板：拖动把手（或内容区）改变高度，松手吸附到最近的锚点。常用于地图门店详情、播放器、编辑器等场景。基于 easycom 自动注册（`components/sn-floating-panel/sn-floating-panel.vue` → `<sn-floating-panel>`），样式几何值走 `rpx`。

> **高度单位**
>
> `v-model:height` 与 `anchors` 都用**设计稿 px**（与 rpx 的换算由组件内部完成）。`height=0` 时从第一个锚点开始。

## 基础用法

`anchors` 设置吸附点；拖动时 `update:height` 连续回报，松手吸附后触发 `heightChange`。

<Demo name="floating-panel-mp-basic" description="拖动横条调整高度，两个吸附点 120 / 320，实时显示当前与吸附后高度。" />

## 受控高度 / 无动画 / 内容区不可拖

- 外部改 `height` 会驱动面板（拖动过程中由手指优先）
- `duration=0` 关闭吸附动画
- `content-draggable=false` 只允许拖把手
- `show-scrollbar=false` 隐藏内容区滚动条
- `safeAreaInsetBottom` 适配底部安全区

<Demo name="floating-panel-mp-config" description="按钮控制高度 + duration=0 + 内容区不可拖 + 隐藏滚动条 + 安全区。" />

## 自定义类名与样式

`customStyle` 与组件自身的 `height` / `duration` 自定义属性合并后写在根节点上；`customClass` 追加根节点类名。

<Demo name="floating-panel-mp-custom" description="custom-style 加圆角 / custom-class 加阴影，拖动横条仍可吸附。" />

## Props

| 属性                  | 类型       | 默认值  | 说明                                                        |
| --------------------- | ---------- | ------- | ----------------------------------------------------------- |
| `height`              | `number`   | `0`     | 面板高度（设计稿 px，`v-model:height`）                     |
| `anchors`             | `number[]` | `[]`    | 吸附点（设计稿 px）；不设置时用默认 `[100, 视口高度 * 0.6]` |
| `duration`            | `number`   | `300`   | 吸附动画时长（ms）；`0` 关闭动画                            |
| `contentDraggable`    | `boolean`  | `true`  | 是否允许拖拽内容区                                          |
| `safeAreaInsetBottom` | `boolean`  | `false` | 是否适配底部安全区                                          |
| `showScrollbar`       | `boolean`  | `true`  | 是否显示内容区滚动条                                        |
| `customClass`         | `string`   | `''`    | 根节点自定义类名                                            |
| `customStyle`         | `string`   | `''`    | 根节点自定义样式                                            |

## Events

| 事件名          | 说明                                         | 参数                 |
| --------------- | -------------------------------------------- | -------------------- |
| `update:height` | 高度变化（拖动中连续触发，吸附时再触发一次） | `(height: number)`   |
| `heightChange`  | 拖动结束且吸附完成时触发（每次手势一次）     | `{ height: number }` |

## Slots

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `default` | 面板内容（在面板内部滚动） |

## 手势与吸附

- `touchstart` / `touchmove` / `touchend` / `touchcancel` 只挂在组件自身节点上，不注册全局监听（小程序没有 `document`）
- 向上拖动增高（`height = 起始高度 - dy`），高度不会小于 0
- 只点一下把手不会改变高度
- `touchcancel` 会按当前高度吸附到最近的锚点
- 新的拖动会立刻打断正在进行的吸附动画

## 锚点

默认锚点来自 wot-ui：`[100, 视口高度 * 0.6]`。小程序没有 `window`，因此默认值通过 `globalThis.uni.getSystemInfoSync()` 取视口高度，取不到时退化为单个 `100` 锚点。显式传入 `anchors` 时永远优先，且会被排序、过滤掉非数值与负数。

## 主题变量

| 变量                                        | 用途                |
| ------------------------------------------- | ------------------- |
| `--sn-mp-color-background-elevated`         | 面板底色            |
| `--sn-mp-color-text-primary`                | 面板文字            |
| `--sn-mp-color-border-default`              | 把手横条（静止）    |
| `--sn-mp-color-action-primary`              | 把手横条（拖动中）  |
| `--sn-mp-shadow-lg`                         | 面板阴影            |
| `--sn-mp-radius-xl` / `--sn-mp-radius-full` | 面板圆角 / 把手圆角 |
| `--sn-mp-spacing-4`                         | 内容区内边距        |

## 无障碍

- 把手带 `role="separator"` + `aria-orientation="horizontal"` + `aria-valuenow`（当前高度）
- 把手横条 `aria-hidden="true"`（纯装饰）
- 交互走触摸事件；移动端无键盘路径

## 暗色模式

面板底色走 `--sn-mp-color-background-elevated`、文字走 `--sn-mp-color-text-primary`、把手与阴影也全部走 token，均在 `@snui/tokens-mp/styles` 的 `.sn-theme-dark` 块里覆盖，因此暗色下自动适配。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 通用弹层 / 遮罩：[`sn-popup`](/components/uni/popup)
- 底部动作面板：[`sn-action-sheet`](/components/uni/action-sheet)
