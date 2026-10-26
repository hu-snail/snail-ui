# Backtop 回到顶部（uni 端 / 移动端）

`sn-backtop` 是 `@snui/uni`（移动端 / 小程序 / H5）的浮动「回到顶部」按钮。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

滚动距离由宿主传入 `scroll-top`（页面 `onPageScroll` 或 `scroll-view` 的 `@scroll`），超过 `top` 阈值后按钮淡入：

<Demo name="backtop-mp-basic" description="scroll-top 由宿主提供；滚动距离超过 top（默认 300px）后按钮显示。" />

## 形状与位置

`shape` 切换圆形 / 方形，`bottom` / `right` 控制贴边距离：

<Demo name="backtop-mp-shape" description="shape=square 方形；bottom / right 控制与屏幕边缘的距离；duration 控制滚动时长。" />

## 显示阈值与图标样式

`top` 是显示阈值（px）；`icon-style` 追加在图标内联样式之后；`z-index` 参与根节点定位样式：

<Demo name="backtop-mp-threshold" description="top=120 显示阈值；icon-style 自定义图标颜色；z-index 层级。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-backtop :scroll-top="scrollTop" text="顶部" />
```

如需显式 import：

```ts
import { SnBacktop } from '@snui/uni/components/sn-backtop/sn-backtop.vue';
```

## Props

| 属性          | 类型                   | 默认值     | 说明                                     |
| ------------- | ---------------------- | ---------- | ---------------------------------------- |
| `scrollTop`   | `number`               | `0`        | 页面滚动距离（由宿主提供）               |
| `text`        | `string`               | `''`       | 按钮文字                                 |
| `top`         | `number`               | `300`      | 显示阈值（px）                           |
| `duration`    | `number`               | `100`      | 返回顶部滚动时长（ms）                   |
| `zIndex`      | `number`               | `10`       | 组件层级                                 |
| `iconStyle`   | `string`               | `''`       | 自定义图标样式（叠加在默认向上旋转之上） |
| `shape`       | `'circle' \| 'square'` | `'circle'` | 按钮形状                                 |
| `bottom`      | `number`               | `100`      | 距屏幕底部距离（px）                     |
| `right`       | `number`               | `20`       | 距屏幕右侧距离（px）                     |
| `customStyle` | `string`               | `''`       | 根节点自定义 inline style                |
| `customClass` | `string`               | `''`       | 根节点自定义类名                         |

## Events

| 事件名  | 说明                                                 | 参数             |
| ------- | ---------------------------------------------------- | ---------------- |
| `click` | 点击按钮时触发（宿主可自行滚动自己的 `scroll-view`） | `(event: Event)` |

## Slots

| 插槽名    | 说明           |
| --------- | -------------- |
| `default` | 自定义按钮内容 |

## 主题变量

| 变量                                        | 用途            |
| ------------------------------------------- | --------------- |
| `--sn-mp-color-background-surface`          | 按钮底色        |
| `--sn-mp-color-border-default`              | 按钮描边        |
| `--sn-mp-color-text-primary`                | 图标与文字色    |
| `--sn-mp-color-text-secondary`              | 按钮文字色      |
| `--sn-mp-shadow-sm`                         | 按钮投影        |
| `--sn-mp-radius-full` / `--sn-mp-radius-md` | 圆形 / 方形圆角 |
| `--sn-mp-font-size-xs`                      | 文字字号        |
| `--sn-mp-spacing-1`                         | 图标与文字间距  |

## 无障碍

- 根节点 `role="button"`，`aria-label` 取 `text`（缺省为 `Back to top`）。
- 隐藏态同时带 `aria-hidden="true"` 且拦掉点击 —— 零尺寸的命中区域不能吞掉触摸。
- 滚动通过 `uni.pageScrollTo` 完成；宿主不提供该 API 时静默跳过，仍会 emit `click`。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-backtop` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：按钮底色切到暗色表面，描边与投影使用暗色令牌，图标与文字转为暗色文本色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 吸顶容器：[`sn-sticky`](/components/uni/sticky)
- 分页：[`sn-pagination`](/components/uni/pagination)
