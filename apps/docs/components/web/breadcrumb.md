# Breadcrumb 面包屑（Web 端）

`SnBreadcrumb` + `SnBreadcrumbItem` 是 `@snui/vue-web`（PC 桌面端）的层级路径展示。按 [naive-ui `n-breadcrumb`](https://www.naiveui.com/zh-CN/light/components/breadcrumb) 1:1 对齐（AGENTS.md §112）—— prop 名 + slot 形状 + separator 渲染位置（每项自己渲染 trailing separator，与 n-breadcrumb 完全一致）。

新增（非 naive-ui）但符合 AUI 风格的扩展：`icon` prop（SnIcon-wrapped，AGENTS §113 强约束）。

## 实时预览

<Demo name="breadcrumb-web-basic" description="默认分隔符 / 自定义分隔符 / 最后一页不可点" />

<Demo name="breadcrumb-web-separator" description="parent-level / per-item / slot 三种 separator 覆盖方式 + showSeparator=false" />

<Demo name="breadcrumb-web-icon" description="SnBreadcrumbItem icon prop（lucide 图标内嵌）" />

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

无 `href` 的 item 渲染为 `<span>`（当前页）；带 `href` 的渲染为 `<a>`。

## API

### SnBreadcrumb Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `separator` | `string` | `'/'` | 全局分隔符。每项可通过 `separator` prop 或 `<template #separator>` slot 覆盖。 |

### SnBreadcrumbItem Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `''` | 链接地址（为空则渲染为不可点的 `<span>`） |
| `clickable` | `boolean` | `true` | 是否可点 / 可 hover |
| `separator` | `string` | `''` | 当前项的覆盖分隔符（空时回退到 parent） |
| `showSeparator` | `boolean` | `true` | 是否渲染 trailing 分隔符 |
| `icon` | `IconComponent` | `undefined` | 前置图标（SnIcon-wrapped；任意 lucide / ionicons5 / tabler FunctionalComponent） |

### SnBreadcrumbItem Events

| 名称 | 回调签名 | 说明 |
| --- | --- | --- |
| `click` | `(e: MouseEvent) => void` | 链接被点击时触发 |

### SnBreadcrumbItem Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 链接文本 |
| `separator` | 当前项自定义分隔符（覆盖 `separator` prop 和 parent separator） |

## 无障碍

- 根 `<nav aria-label="Breadcrumb">`
- 内部 `<ul>` 语义化列表（`n-breadcrumb` 用 `<ul>`，不用 `<ol>` —— 参考源码）
- 分隔符 `<span role="separator" aria-hidden="true">`
- 当 `window.location.href` 与 `href` 路径匹配时，自动添加 `aria-current="location"`

## 与 naive-ui 的差异

| naive-ui | SnBreadcrumb | 备注 |
| --- | --- | --- |
| `separator` | `separator` | ✓ 1:1 |
| `separator-location-style` | — | naive-ui 2.x 已移除 |
| (item-count) | — | naive-ui 没这 prop；如需截断请用 `<SnMenu>` 子树 + 自定义渲染 |
| n-breadcrumb-item `href` | `href` | ✓ 1:1 |
| n-breadcrumb-item `clickable` | `clickable` | ✓ 1:1 |
| n-breadcrumb-item `separator` | `separator` | ✓ 1:1 |
| n-breadcrumb-item `showSeparator` | `showSeparator` | ✓ 1:1 |
| n-breadcrumb-item `onClick` | `onClick` (+ `click` event) | ✓ 1:1 |
| (icon) | `icon` prop (SnIcon-wrapped) | AUI §113 扩展 |
| (n-breadcrumb-item) slot `separator` | `<template #separator>` | ✓ 1:1 |

## 相关

- 与 [`SnMenu`](/components/web/menu) 配合：nav 顶层用 Menu 跳转，面包屑展示当前路径
- [`SnIcon`](/components/web/icon) — 图标 wrapper，提供 tree-shake-friendly icon API