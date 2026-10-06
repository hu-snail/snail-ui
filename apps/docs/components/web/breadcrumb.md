# Breadcrumb 面包屑（Web 端）

`SnBreadcrumb` + `SnBreadcrumbItem` 是 `@snui/vue-web`（PC 桌面端）的层级路径展示。按 [naive-ui `n-breadcrumb`](https://www.naiveui.com/zh-CN/light/components/breadcrumb) 1:1 对齐（AGENTS.md §112）—— 主要是 prop 名义 + slot 形状。n-breadcrumb 高级 prop（`itemCount` / `separator-location` 之类的尺寸 / 位置配置）当前未实现，需要时再加。

## 实时预览

<Demo name="breadcrumb-web-basic" description="默认分隔符 / 自定义分隔符 / 最后一页不可点" />

<Demo name="breadcrumb-web-separator" description="4 种分隔符变体（/ / › / · / →）" />

<Demo name="breadcrumb-web-item-count" description="itemCount 截断 + 「X more」 affordance" />

## 基础用法

```ts
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnBreadcrumb separator="/">
  <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
  <SnBreadcrumbItem href="/components/web">组件 · Web</SnBreadcrumbItem>
  <SnBreadcrumbItem>Card</SnBreadcrumbItem>
</SnBreadcrumb>
```

无 `href` 的 item 渲染为不可点的当前页；带 `href` 的渲染为 `<a>`。

## API

### SnBreadcrumb Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `separator` | `string` | `'/'` | 分隔符文本 |
| `itemCount` | `number` | `Infinity` | 最多显示几项；超出部分中间折叠为「X more」 |

### SnBreadcrumbItem Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `''` | 链接地址（为空则渲染为不可点的 span） |

### SnBreadcrumbItem Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 链接文本（覆盖 `<a>` 内容） |

## 无障碍

- 根 `<nav aria-label="Breadcrumb">`
- 内部 `<ol>` 语义化列表
- 分隔符 `aria-hidden="true"`（屏幕阅读器跳过）
- 链接条末项 `aria-current="page"`（自动判断：当前路径匹配时）

## 相关

- 与 [`SnMenu`](/components/web/menu) 配合：nav 顶层用 Menu 跳转，面包屑展示当前路径