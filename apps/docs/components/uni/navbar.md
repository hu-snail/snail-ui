# Navbar 导航栏（uni 端 / 移动端）

`sn-navbar` 是 `@snui/uni`（移动端 / 小程序 / H5）的顶部导航栏，承载页面标题、左侧返回、右侧操作与小程序胶囊位。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

标题、左右文案与返回箭头：

<Demo name="navbar-mp-basic" description="title 标题；left-text / right-text 左右文案；left-arrow 返回箭头；bordered 下边框。" />

## 插槽与固定定位

`left` / `title` / `right` 插槽覆盖同名 prop；`fixed` + `placeholder` 固定到顶部并保留等高占位：

<Demo name="navbar-mp-slots" description="left / right 插槽自定义图标；fixed + placeholder 固定定位并生成占位元素。" />


## 禁用侧按钮 / 安全区 / 胶囊插槽

`left-disabled` / `right-disabled` 让对应侧按钮点击无效；`safe-area-inset-top` 补状态栏高度；`capsule` 插槽占据左侧区；`custom-class` / `custom-style` 落在根节点：

<Demo name="navbar-mp-config" description="left-disabled / right-disabled 拦截点击；safe-area-inset-top 补安全区；capsule 插槽与 custom-class / custom-style。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-navbar title="首页" left-arrow />
```

如需显式 import：

```ts
import { SnNavbar } from '@snui/uni/components/sn-navbar/sn-navbar.vue'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 标题文字 |
| `leftText` | `string` | `''` | 左侧文案 |
| `rightText` | `string` | `''` | 右侧文案 |
| `leftArrow` | `boolean` | `false` | 是否显示左侧返回箭头 |
| `bordered` | `boolean` | `false` | 是否显示下边框 |
| `fixed` | `boolean` | `false` | 是否固定到顶部 |
| `placeholder` | `boolean` | `false` | 固定时是否生成等高占位元素 |
| `zIndex` | `number` | `10` | 导航栏层级（仅在 `fixed` 时写入） |
| `safeAreaInsetTop` | `boolean` | `false` | 是否开启顶部安全区适配 |
| `leftDisabled` | `boolean` | `false` | 是否禁用左侧按钮 |
| `rightDisabled` | `boolean` | `false` | 是否禁用右侧按钮 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click-left` | 点击左侧按钮时触发（`leftDisabled` 时不触发） | `(event: Event)` |
| `click-right` | 点击右侧按钮时触发（`rightDisabled` 时不触发） | `(event: Event)` |
| `back` | `leftArrow` 开启时，点击左侧同时触发 | `(event: Event)` |
| `back-home` | 点击胶囊区域时触发 | `(event: Event)` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `capsule` | 自定义胶囊（存在时左侧区域不生效） |
| `left` | 左侧内容，覆盖 `leftArrow` / `leftText` |
| `title` | 标题内容，覆盖 `title` |
| `right` | 右侧内容，覆盖 `rightText` |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-background-surface` | 导航栏背景 |
| `--sn-mp-color-text-primary` | 标题文字色 |
| `--sn-mp-color-border-subtle` | 下边框 |
| `--sn-mp-color-action-primary` | 左右按钮文字色 |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-lg` | 按钮 / 标题字号 |
| `--sn-mp-font-weight-medium` | 标题字重 |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3` | 图标间距 / 左右内边距 |

## 无障碍

- 根节点 `role="navigation"`，并以 `title` 作为 `aria-label`。
- 左右区域 `role="button"`，`aria-disabled` 与 prop 同步。
- `fixed` 模式下的占位元素为 `aria-hidden="true"`，纯几何用途。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-navbar` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：背景切换为暗色表面，标题与按钮文字切到暗色文本色，下边框使用暗色边框令牌。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：


## 相关

- 底部标签栏：[`sn-tabbar`](/components/uni/tabbar)
- 侧边导航：[`sn-sidebar`](/components/uni/sidebar)
