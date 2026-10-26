# Fab 悬浮按钮（uni 端 / 移动端）

`sn-fab` 是 `@snui/uni`（移动端 / 小程序 / H5）的悬浮按钮：8 个位置预设、4 个展开方向、5 种主题色，可选拖动。基于 easycom 自动注册（`components/sn-fab/sn-fab.vue` → `<sn-fab>`），样式几何值走 `rpx`。

> **未实现**
>
> - 拖动**不吸边**：参考库松手后会吸附到边缘，本轮保留用户松手时的位置（仅在视口内做钳制）。

## 基础用法

`v-model:active` 控制展开；`default` 插槽放菜单项，`trigger` 插槽可完全自定义触发按钮。

<Demo name="fab-mp-basic" description="右下角悬浮按钮，向上展开三个动作。" />

## 位置与主题

`position` 取 8 个预设（四角 + 四边中点）；`gap` 设置四边默认间距，`top` / `bottom` / `left` / `right` 可单独覆盖某一侧；`direction` 决定菜单展开方向。

<Demo name="fab-mp-position" description="四个位置预设 + 不同主题色与展开方向。" />

## 禁用、只点击与拖动

`disabled` 拦截所有交互；`expandable=false` 时不展开、改为抛 `click`；`draggable` 打开后可用手势拖动（`uni.getSystemInfoSync()` 可用时做视口钳制）。

<Demo name="fab-mp-disabled" description="expandable=false 只抛 click、disabled、draggable 三个变体。" />

## 触发图标与层级（`inactive-icon` / `active-icon` / `z-index`）

`inactive-icon` / `active-icon` 指定收起 / 展开时的图标名：`plus` 与 `close` 是内置的两个默认名，其余名字经 `registerSnIcons()` 注册后解析。`z-index` 设根节点层级，`custom-style` 追加到根节点 inline style（在 `z-index` 之后写入，可覆盖它）。

<Demo name="fab-mp-icons" description="内置图标名 plus / close 与注册图标名 Heart / Star 切换；z-index 两档对比；customStyle 追加阴影。" />

## Props

| 属性         | 类型                                                      | 默认值                                         | 说明                                     |
| ------------ | --------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| active       | boolean                                                   | false                                          | 是否激活（`v-model:active`）             |
| type         | 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' | 'primary'                                      | 悬浮按钮类型                             |
| position     | FabPosition                                               | 'right-bottom'                                 | 悬浮按钮位置（8 个预设）                 |
| draggable    | boolean                                                   | false                                          | 按钮能否拖动                             |
| direction    | 'top' \| 'right' \| 'bottom' \| 'left'                    | 'top'                                          | 菜单弹出方向                             |
| disabled     | boolean                                                   | false                                          | 是否禁用                                 |
| inactiveIcon | string                                                    | 'plus'                                         | 未展开时的图标                           |
| activeIcon   | string                                                    | 'close'                                        | 展开时的图标                             |
| zIndex       | number                                                    | 99                                             | 自定义悬浮按钮层级                       |
| gap          | SnFabGap                                                  | `{ top: 16, right: 16, bottom: 16, left: 16 }` | 与可视区域边缘的间距                     |
| expandable   | boolean                                                   | true                                           | 点击时是否展开菜单；`false` 时抛 `click` |
| top          | number                                                    | —                                              | 距顶部间距（覆盖 `gap.top`）             |
| bottom       | number                                                    | —                                              | 距底部间距（覆盖 `gap.bottom`）          |
| left         | number                                                    | —                                              | 距左边间距（覆盖 `gap.left`）            |
| right        | number                                                    | —                                              | 距右边间距（覆盖 `gap.right`）           |
| customClass  | string                                                    | ''                                             | 根节点自定义类名                         |
| customStyle  | string                                                    | ''                                             | 根节点自定义样式                         |

`SnFabGap` = `{ top?, right?, bottom?, left? }`（px）；`FabPosition` = `"left-top" | "right-top" | "left-bottom" | "right-bottom" | "left-center" | "right-center" | "top-center" | "bottom-center"`。

## Events

| 事件名        | 说明                          | 参数    |
| ------------- | ----------------------------- | ------- |
| update:active | 菜单展开 / 收起               | boolean |
| click         | `expandable=false` 时点击触发 | —       |

## Slots

| 插槽名  | 说明                               |
| ------- | ---------------------------------- |
| default | 动作按钮区域内容（展开后的菜单项） |
| trigger | 触发器插槽，完全自定义点击锚点     |

## 主题变量

| 变量                                                        | 用途                  |
| ----------------------------------------------------------- | --------------------- |
| --sn-mp-color-action-primary                                | `type="primary"` 填充 |
| --sn-mp-color-feedback-success`/`-info`/`-warning`/`-danger | 其余类型填充          |
| --sn-mp-color-text-on-primary                               | 触发按钮图标色        |
| --sn-mp-shadow-lg                                           | 触发按钮投影          |
| --sn-mp-radius-full                                         | 触发按钮形状          |
| --sn-mp-spacing-2`/`--sn-mp-spacing-3                       | 菜单间距与根容器间距  |

## 无障碍

- 触发按钮：`role="button"` + `aria-expanded` + `aria-disabled`
- 菜单容器：`aria-hidden` 跟随展开状态

## 暗色模式

五种主题色与图标色全部来自语义色 token（`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-text-on-primary`），都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。用 `sn-config-provider` 的 `theme` 设为 `dark` 包裹即可验证。

## 相关

- 按钮：[`sn-button`](/components/uni/button)
- 弹层：[`sn-popup`](/components/uni/popup)
