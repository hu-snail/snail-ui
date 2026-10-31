# Fab 悬浮按钮（uni 端 / 移动端）

`sn-fab` 是 `@snui/uni`（移动端 / 小程序 / H5）的悬浮按钮：8 个位置预设、4 个展开方向、2 种展开形态（直线堆叠 / 扇形）、5 种主题色，可选拖动。基于 easycom 自动注册（`components/sn-fab/sn-fab.vue` → `<sn-fab>`），样式几何值走 `rpx`。

> **行为说明**
>
> - 拖动**不吸边**：松手后保留用户松手时的位置（仅在视口内做钳制）。
> - `direction` 严格决定展开轴向：即使锚点在屏幕左右边缘中点，也会按方向纵向 / 横向展开。
> - 扇形模式（`mode="fan"`）按锚点自动定形：角部锚点 = 朝屏幕内侧的 90° 斜扇形，边中锚点 = 120° 对称扇形（`bottom-center` 即正中间扇形）。

## 何时使用

- 页面内需要一组常驻的快捷操作（新建、分享、客服等），以悬浮按钮聚合。
- 操作项超过一个时，用可展开的动作菜单收纳；单项操作直接用 `expandable=false` 的单动作形态。

## 基础用法

`v-model:active` 控制展开；`default` 插槽放动作项（「图标 + 文字」胶囊或图标气泡均可），`trigger` 插槽可完全自定义触发按钮。

<Demo name="fab-mp-basic" description="右下角悬浮按钮，向上滑出三个「图标 + 文字」胶囊动作项，点选后展示反馈并收起。" />

## 弹出方向

`direction` 决定动作项展开的轴线和顺序：`up` / `down` 沿纵轴、`left` / `right` 沿横轴。`up` / `down` 是新增词汇（默认 `up`），旧值 `top` / `bottom` 继续可用，语义等价。

<Demo name="fab-mp-direction" description="up（右下）/ down（左上）/ left（右中）/ right（左中）四个方向各自展开图标动作项，点选记录方向反馈。" />

## 扇形展开（`mode="fan"`）

`mode="fan"` 让动作项沿圆弧从触发按钮中心绽放：45° 步进、back-out 弹性缓动、逐项 40ms 错峰，收起时缩回按钮中心。动作项来自结构化 `actions`（`{ icon, text?, color?, disabled? }`）——有 `text` 渲染为胶囊、否则为图标气泡；点选后发 `action` 事件并自动收起。`fanRadius`（默认 96px）调整展开半径。

<Demo name="fab-mp-fan" description="底部居中的正中间扇形（胶囊动作项）+ 右下 / 左上的斜扇形（图标气泡），点动作项自动收起并记录反馈。" />

## 拖动（`draggable`）

`draggable` 打开后按住触发按钮即可拖动，松手后按 `gap` 收进屏幕安全区（`uni.getSystemInfoSync()` 可用时做视口钳制）；拖动与展开互不干扰。

<Demo name="fab-mp-drag" description="按住右下角按钮拖动，松手自动收进屏幕安全区，拖完仍可展开动作项。" />

## 位置与主题

`position` 取 8 个预设（四角 + 四边中点）；`gap` 设置四边默认间距，`top` / `bottom` / `left` / `right` 可单独覆盖某一侧；`direction` 与锚点配合决定展开轴向。

<Demo name="fab-mp-position" description="左上 / 右上 / 左下 / 底部居中四个锚点各配一组胶囊动作项，方向与锚点联动。" />

## 禁用与只点击

`disabled` 拦截所有交互；`expandable=false` 时不展开、改为抛 `click`（拖动手势见上方「拖动」一节）。

<Demo name="fab-mp-disabled" description="expandable=false 只抛 click（计数反馈）、disabled 半透明拦截、draggable 拖动后仍可展开菜单。" />

## 触发图标与主题切换（`inactive-icon` / `active-icon` / `type`）

触发图标有两条轨道：`inactive-icon` / `active-icon` 传注册名（`plus` / `close` 内置，其余经 `registerSnIcons()` 注册）；或用 `trigger` 插槽直接渲染图标对象。触发按钮内的图标尺寸跟随 `--sn-mp-icon-size-*` 档位缩放。`type` 提供 5 档主题色。

<Demo name="fab-mp-icons" description="左下 icon-name 轨道（Edit ↔ X）、右下 trigger 插槽图标对象（Sparkles ↔ X）+ 色板实时切换 5 档主题色。" />

## Props

| 属性         | 类型                                                          | 默认值                                         | 说明                                      |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| active       | boolean                                                       | false                                          | 是否激活（`v-model:active`）              |
| type         | 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'     | 'primary'                                      | 悬浮按钮类型                              |
| position     | FabPosition                                                   | 'right-bottom'                                 | 悬浮按钮位置（8 个预设）                  |
| draggable    | boolean                                                       | false                                          | 按钮能否拖动                              |
| direction    | 'up' \| 'down' \| 'left' \| 'right'（兼容 'top' \| 'bottom'） | 'up'                                           | 菜单弹出方向；up/down 等价旧值 top/bottom |
| mode         | 'line' \| 'fan'                                               | 'line'                                         | 展开形态：直线堆叠 / 扇形（additive）     |
| actions      | SnFabAction[]                                                 | []                                             | 扇形模式动作项（fan 模式下忽略插槽）      |
| fanRadius    | number                                                        | 96                                             | 扇形半径 px（按钮中心到动作项中心）       |
| disabled     | boolean                                                       | false                                          | 是否禁用                                  |
| inactiveIcon | string                                                        | 'plus'                                         | 未展开时的图标（注册名）                  |
| activeIcon   | string                                                        | 'close'                                        | 展开时的图标（注册名）                    |
| zIndex       | number                                                        | 99                                             | 自定义悬浮按钮层级                        |
| gap          | SnFabGap                                                      | `{ top: 16, right: 16, bottom: 16, left: 16 }` | 与可视区域边缘的间距                      |
| expandable   | boolean                                                       | true                                           | 点击时是否展开菜单；`false` 时抛 `click`  |
| top          | number                                                        | —                                              | 距顶部间距（覆盖 `gap.top`）              |
| bottom       | number                                                        | —                                              | 距底部间距（覆盖 `gap.bottom`）           |
| left         | number                                                        | —                                              | 距左边间距（覆盖 `gap.left`）             |
| right        | number                                                        | —                                              | 距右边间距（覆盖 `gap.right`）            |
| customClass  | string                                                        | ''                                             | 根节点自定义类名                          |
| customStyle  | string                                                        | ''                                             | 根节点自定义样式                          |

`SnFabGap` = `{ top?, right?, bottom?, left? }`（px）；`SnFabAction` = `{ icon: string \| IconData, text?, color?, disabled? }`（`text` 有值渲染胶囊，`color` 着色图标，优先 `var(--sn-mp-color-*)`）；`FabPosition` = `"left-top" | "right-top" | "left-bottom" | "right-bottom" | "left-center" | "right-center" | "top-center" | "bottom-center"`。

## Events

| 事件名        | 说明                          | 参数               |
| ------------- | ----------------------------- | ------------------ |
| update:active | 菜单展开 / 收起               | boolean            |
| click         | `expandable=false` 时点击触发 | —                  |
| action        | 扇形动作项点选（自动收起）    | SnFabAction, index |

## Slots

| 插槽名  | 说明                                 |
| ------- | ------------------------------------ |
| default | 直线模式的动作项内容（fan 模式忽略） |
| trigger | 触发器插槽，完全自定义点击锚点内容   |

## 主题变量

| 变量                                                        | 用途                           |
| ----------------------------------------------------------- | ------------------------------ |
| --sn-mp-color-action-primary                                | `type="primary"` 填充          |
| --sn-mp-color-feedback-success`/`-info`/`-warning`/`-danger | 其余类型填充                   |
| --sn-mp-color-text-on-primary                               | 触发按钮图标色                 |
| --sn-mp-icon-size-large                                     | 触发按钮图标尺寸（40rpx）      |
| --sn-mp-shadow-lg                                           | 触发按钮投影                   |
| --sn-mp-radius-full                                         | 触发按钮形状                   |
| --sn-mp-spacing-3`/`--sn-mp-spacing-4                       | 菜单间距、根容器间距与展开位移 |

## 无障碍

- 触发按钮：`role="button"` + `aria-expanded` + `aria-disabled`
- 菜单容器：`aria-hidden` 跟随展开状态

## AI Patch Boundary

- AI 可通过 Patch 修改 `type` / `position` / `direction` / `gap` / `zIndex` / `inactiveIcon` / `activeIcon` / `disabled` / `expandable` 等展示配置。
- 动作项内容属于业务数据（`default` 插槽），Patch 只应调整容器配置，不应改写插槽内部结构。
- `active` 是受控状态（`v-model:active`），应通过事件回写，而非直接改写内部状态。
- 拖动偏移是运行时手势结果，Patch 不应试图直接写入。

完整契约见组件 `ai-description.md`。

## 暗色模式

五种主题色与图标色全部来自语义色 token（`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-text-on-primary`），都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。用 `sn-config-provider` 的 `theme` 设为 `dark` 包裹即可验证。

## 相关

- 按钮：[`sn-button`](/components/uni/button)
- 弹层：[`sn-popup`](/components/uni/popup)
