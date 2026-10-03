# Divider 分割线（uni 端 / 移动端）

`sn-divider` 是 `@snui/uni`（移动端 / 小程序 / H5）的视觉分隔组件。基于 easycom 自动注册，rpx 单位跨设备缩放。

> **v3.1 端独立**：`sn-divider` (`@snui/uni`) 与 `SnDivider` (`@snui/vue-web`) 是**两个独立组件**。uni 端 CSS 只用 `var(--sn-mp-*)`（rpx）。**两端 0 行源代码复用**。

---

## 实时预览

<Demo name="divider-mp" />

---

## 自动注册（easycom）

组件位于 `packages/uni/src/components/sn-divider/sn-divider.vue`，符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<template>
  <p>上方文本</p>
  <sn-divider />
  <p>下方文本</p>
</template>
```

如需显式 import：

```ts
import { SnDivider } from '@snui/uni'
```

---

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| `dashed` | `boolean` | `false` | 虚线 |
| `hairline` | `boolean` | `true` | 细线（1rpx）|
| `color` | `string` | — | 自定义颜色 |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | 垂直外边距（仅 horizontal）|

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 中间文字（仅 horizontal 渲染）|

---

## Token 消费（uni 别名层 + rpx）

| Logical slot | CSS variable |
| --- | --- |
| `line` | `var(--sn-mp-color-border-default)` |
| `slot text` | `var(--sn-mp-color-text-secondary)` |
| `slot background` | `var(--sn-mp-color-background-surface)` |

> sn-divider 源码 CSS 内部用 `--sn-mp-*` 别名层（**不**用 `--sn-web-*` / `--aui-*`）。

---

## 端差异对照

| 维度 | uni（`sn-divider`） | Web（`SnDivider`） |
|---|---|---|
| 包 | `@snui/uni` | `@snui/vue-web` |
| 组件名 | `sn-divider`（kebab-case easycom） | `SnDivider`（PascalCase import） |
| Token 别名 | `--sn-mp-*`（rpx） | `--sn-web-*`（px） |
| 端专属 Props | `hairline: boolean`（默认 true） | — |
| 容器 | `<view>` + `<text>` | `<div>` + `<span>` |
| 默认 margin | 16 / 32 / 48 rpx | 8 / 16 / 24 px |

---

## 相关

- 源文件：`packages/uni/src/components/sn-divider/sn-divider.vue`
- AI 描述：`packages/uni/src/components/sn-divider/ai-description.md`（标注 `end: mp`）
- Token 别名层：`packages/tokens-mp/`
- Web 端：[`SnDivider`](/components/web/divider)