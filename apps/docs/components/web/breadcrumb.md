# Breadcrumb 面包屑（Web 端）

`SnBreadcrumb` + `SnBreadcrumbItem` 展示当前位置在层级结构中的路径，并提供逐级返回的入口。每项自行渲染尾随分隔符。

在基础能力之外，本库提供 `icon` 前置图标与 `variant` 背景样式两个扩展点。

## 实时预览

<Demo name="breadcrumb-web-basic" description="默认分隔符 / 自定义分隔符 / 最后一页不可点" />

<Demo name="breadcrumb-web-separator" description="parent-level / per-item / slot 三种 separator 覆盖方式 + showSeparator=false" />

<Demo name="breadcrumb-web-icon" description="SnBreadcrumbItem icon prop（lucide 图标内嵌）+ chip variant 居中" />

<Demo name="breadcrumb-web-variant" description="plain / chip / outlined 三种 variant（每项背景可独立设置）" />

<Demo name="breadcrumb-web-max-count" description="maxCount 超出折叠：head(1) + … + tail(maxCount-1)" />

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
| `maxCount` | `number` | `Infinity` | 最多显示几项；超出部分折叠为 `head(1) + ellipsis + tail(maxCount-1)`。 |

### SnBreadcrumbItem Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `''` | 链接地址（为空则渲染为不可点的 `<span>`） |
| `clickable` | `boolean` | `true` | 是否可点 / 可 hover |
| `separator` | `string` | `''` | 当前项的覆盖分隔符（空时回退到 parent） |
| `showSeparator` | `boolean` | `true` | 是否渲染 trailing 分隔符 |
| `icon` | `IconComponent` | `undefined` | 前置图标，通过 `SnIcon` 渲染。 |
| `variant` | `'plain' \| 'chip' \| 'outlined'` | `'plain'` | 背景样式。`plain` 透明，`chip` 填充背景圆角胶囊（适合 dashboard / settings 紧凑路径），`outlined` 透明加边框。可以每项独立设置。 |

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

- 根 `<nav aria-label="Breadcrumb">`（landmark 区域，无障碍读到面包屑就是导航区）
- 内部使用 `<div>` 而不是 `<ul>/<li>`：避免各浏览器对 `<li>` 默认样式（list-style / `padding-inline-start`）的差异干扰 `text-align:center` 居中；可访问性语义已经由外层 `<nav>` landmark 提供，不需要再叠加 list role
- 分隔符 `<span role="separator" aria-hidden="true">`
- 当 `window.location.href` 与 `href` 路径匹配时，自动添加 `aria-current="location"`

## 相关

- 与 [`SnMenu`](/components/web/menu) 配合：nav 顶层用 Menu 跳转，面包屑展示当前路径
- [`SnIcon`](/components/web/icon) — 图标 wrapper，提供 tree-shake-friendly icon API