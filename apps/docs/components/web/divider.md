# Divider 分割线（Web 端）

`SnDivider` 是 `@snui/vue-web`（PC 桌面端）的视觉分隔组件。所有视觉属性通过 `--sn-web-*` Token 别名层驱动。

> **v3.1 端独立**：`SnDivider` (`@snui/vue-web`) 与 `sn-divider` (`@snui/uni`) 是**两个独立组件**。Web 端 CSS 只用 `var(--sn-web-*)`（px）；uni 端 CSS 只用 `var(--sn-mp-*)`（rpx）。**两端 0 行源代码复用**。

---

## 实时预览

<Demo name="divider-web" />

---

## 基础用法

```vue
<script setup lang="ts">
import { SnDivider } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<template>
  <p>上方文本</p>
  <SnDivider />
  <p>下方文本（horizontal 默认）</p>
</template>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| `dashed` | `boolean` | `false` | 虚线 |
| `color` | `string` | — | 自定义颜色（任意 CSS 颜色值）|
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | 垂直外边距（仅 horizontal 生效）|

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 中间文字（仅 horizontal 方向渲染）|

---

## Token 消费（Web 别名层）

| Logical slot | CSS variable |
| --- | --- |
| `line` | `var(--sn-web-color-border-default)` |
| `slot text` | `var(--sn-web-color-text-secondary)` |
| `slot background` | `var(--sn-web-color-background-surface)` |

> SnDivider 源码 CSS 内部用 `--sn-web-*` 别名层（**不**用 `--aui-*`）。`tokens-web` 包内部映射 `snWebAliasMap` 把 `--sn-web-*` → `--aui-*`。

---

## 无障碍

- `role="separator"`
- `aria-orientation` 跟随 `direction` prop
- 纯装饰，无键盘交互

---

## 端差异对照

| 维度 | Web（`SnDivider`） | uni（`sn-divider`） |
|---|---|---|
| 包 | `@snui/vue-web` | `@snui/uni` |
| 组件名 | `SnDivider`（PascalCase import） | `sn-divider`（kebab-case easycom） |
| Token 别名 | `--sn-web-*`（px） | `--sn-mp-*`（rpx） |
| 端专属 Props | — | `hairline: boolean`（默认 true，1rpx 细线） |
| 容器 | `<div>` + `<span>` | `<view>` + `<text>` |
| 默认 margin | 8 / 16 / 24 px | 16 / 32 / 48 rpx |

---

## 相关

- 源文件：`packages/vue-web/src/divider/SnDivider.vue`
- AI 描述：`packages/vue-web/src/divider/ai-description.md`（标注 `end: web`）
- Token 别名层：`packages/tokens-web/`
- uni 端：[`sn-divider`](/components/uni/divider)