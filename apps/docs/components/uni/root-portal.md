# RootPortal 根节点传送（uni 端 / 移动端）

`sn-root-portal` 把内容渲染到一个铺满视口的固定层里，使其脱离被裁剪或被 transform 影响的祖先（`overflow: hidden`、`position: relative`、`scroll-view` 边界）。基于 easycom 自动注册。

## 基础用法

下方容器设了 `overflow: hidden`，普通内容会被裁掉；包在 `sn-root-portal` 里之后，内容浮在视口层上，不再被裁。

<Demo name="root-portal-mp-basic" description="挂载 / 卸载传送层，观察内容是否被祖先裁剪。" />

## 自定义类名与内联样式

这层是组件唯一可设置样式的节点（没有传送目标）。`custom-class` / `custom-style` 落在固定层上 —— 浮层需要的位置、背景、层级都从这里给：

<Demo name="root-portal-mp-custom" description="customClass 控制固定层（预览里改 absolute 以免盖住手机屏），customStyle 追加内联样式。" />

## 它真正保证什么、不保证什么

web 端用 Vue 的 `<Teleport to="body">`。小程序没有 `body`，原生 App 没有文档树，也没有一套 API 能在所有 uni 端重挂节点 —— 强行造一个会让某些平台的渲染悄悄变化。所以本组件只保证可移植的部分：

| 保证 | 实现方式 |
| --- | --- |
| 内容不被祖先裁剪 | 零 inset 的 `position: fixed` 层 |
| 层不阻挡页面 | 层本身 `pointer-events: none`，其子节点恢复 `auto` |
| 显隐语义明确 | 挂载即显示、卸载即隐藏（没有布尔 prop） |

> **未实现**：真正的 DOM 重挂（teleport）。需要带遮罩、滚动锁定、动画的完整浮层，请用 `sn-popup` / `sn-overlay` —— 那才是本端支持的路径。

## Props

`wd-root-portal` 本身没有 prop。这里追加两个 AUI 钩子，因为没有传送目标时，这层是调用方唯一能设置样式的节点：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `customClass` | `string` | `''` | 固定层类名（追加能力） |
| `customStyle` | `string` | `''` | 固定层内联样式（追加能力） |

## Events

无。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 渲染在固定层内的内容 |

## 主题变量

不消费任何 token。这一层不能画任何东西（背景、边框、阴影都不行），否则它会遮住下面的页面。

## 无障碍

不加 role —— 它是布局层，不是对话框。因为层本身 `pointer-events: none`，它不会抢焦点，也不会拦截本该落到下层页面的点击；只有插槽内容是交互的。

## 暗色模式

层不绘制任何颜色，因此暗色下无需适配。若插槽内容有颜色，由内容自身走 `--sn-mp-color-*` 跟随主题。
