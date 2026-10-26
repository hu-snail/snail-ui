# Layout 布局（uni 端 / 移动端）

`sn-layout` 是 `@snui/uni`（移动端 / 小程序 / H5）的 24 栅格行容器，`sn-col` 是列。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`span` 按 24 栅格计算列宽，行内所有列之和通常为 24：

<Demo name="layout-mp-basic" description="span 为 24 栅格中的列数；24 / 12+12 / 8+8+8 三种常见组合。" />

## 间距、偏移与对齐

`gutter` 设置列间距，`offset` 设置左侧偏移列数，`justify` / `align` 控制对齐：

<Demo name="layout-mp-gutter" description="gutter=16 列间距；offset=8 左侧偏移；justify=space-between + align=middle 对齐。" />

## 对齐全档位与自定义样式

`justify` 六档、`align` 三档都可以单独使用；`custom-class` / `custom-style` 落在行与列的根节点上：

<Demo name="layout-mp-align" description="justify 的 center / end / space-around / space-evenly；align 的 middle / bottom；行级与列级 customClass / customStyle。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-layout :gutter="16">
  <sn-col :span="12">左</sn-col>
  <sn-col :span="12">右</sn-col>
</sn-layout>
```

如需显式 import：

```ts
import { SnLayout } from '@snui/uni/components/sn-layout/sn-layout.vue'
import { SnCol } from '@snui/uni/components/sn-layout/sn-col.vue'
```

## Props

### sn-layout

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `gutter` | `number` | `0` | 列元素之间的间距（px） |
| `justify` | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'start'` | 主轴对齐方式 |
| `align` | `'top' \| 'middle' \| 'bottom'` | `'top'` | 交叉轴对齐方式 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

### sn-col

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `span` | `number` | `24` | 列元素宽度（24 栅格中的列数） |
| `offset` | `number` | `0` | 列元素左侧偏移列数 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Events

无。`sn-layout` / `sn-col` 是纯布局组件，不承载交互（AGENTS.md §32）。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default`（layout） | 行内容（`sn-col` 集合） |
| `default`（col） | 列内容 |

## 主题变量

`sn-layout` / `sn-col` 不消费任何颜色令牌：它们只产出几何（`flex-basis` / `margin` / `padding`），颜色完全由列内内容决定。这是刻意的 —— 布局组件不应该有自己的视觉。

## 无障碍

- 组件不添加 role 或 aria 属性：它是纯布局容器，语义由列内内容承担。
- 不使用键盘交互，因此不设置 `tabindex`。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-layout` / `sn-col` 不声明任何颜色，因此暗色模式无需适配：底色与文字色都来自列内内容自己的 `--sn-mp-color-*` 令牌，在 `.sn-theme-dark` 下随内容自动切换。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：


## 相关

- 宫格：[`sn-grid`](/components/uni/grid)
- 单元格：[`sn-cell`](/components/uni/cell)
- 间距：[`sn-gap`](/components/uni/gap)
