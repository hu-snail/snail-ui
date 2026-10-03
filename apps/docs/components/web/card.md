# Card · Web（PC 端）

`<section role="region">` 容器，支持 title / description 头部、Token 别名层驱动的阴影与边框、可选 body 与 footer 插槽。

> **v3.1 端独立**：`SnCard` (`@snui/vue-web`) 与 `sn-card` (`@snui/uni`) 是**两个独立组件**。Web 端 CSS 只用 `var(--sn-web-*)` 别名层。组件 Contract 跨端共享（`packages/protocol/src/card-contract.ts`），但 Vue 渲染器按端独立实现。

---

## Live render · 真实框架挂载

### Default（默认 variant + bordered）

<ComponentPreview name="card" :raw-props="{ title: 'Order #1024', description: 'Placed today · shipping in 2 days' }" :children='JSON.stringify([
  { id: "amount", type: "card", props: { title: "Amount", bordered: false, padding: "sm" } }
])' />

### Outlined

<ComponentPreview name="card" :raw-props="{ variant: 'outlined', title: 'Outlined card', description: 'Stronger border, no shadow' }" />

### Elevated

<ComponentPreview name="card" :raw-props="{ variant: 'elevated', title: 'Elevated card', description: 'Borderless + drop shadow' }" />

### Padding variants

<ComponentPreview name="card" :raw-props="{ title: 'No padding', padding: 'none', bordered: true }" :children='JSON.stringify([
  { id: "i", type: "input", props: { value: "tight content", type: "text" } }
])' />

<ComponentPreview name="card" :raw-props="{ title: 'Large padding', padding: 'lg', bordered: true, shadow: true }" :children='JSON.stringify([
  { id: "b", type: "button", props: { variant: "primary", text: "Click me" } }
])' />

### No header / No border

<ComponentPreview name="card" :raw-props="{ bordered: false }" :children='JSON.stringify([
  { id: "t", type: "button", props: { variant: "ghost", text: "Action" } }
])' />

### On dark surface

<ComponentPreview name="card" dark :raw-props="{ title: 'On dark', description: 'High-contrast card', bordered: true, shadow: true }" :children='JSON.stringify([
  { id: "b", type: "button", props: { variant: "primary", text: "Confirm" } }
])' />

### Order summary（组合 Form + Input + Button）

<ComponentPreview
  name="card"
  :raw-props="{ title: 'Order #1024', description: 'Pending payment', bordered: true, shadow: true }"
  :children='JSON.stringify([
    { id: "f", type: "form-item", props: { prop: "voucher", label: "Voucher" }, children: [
      { id: "i", type: "input", props: { value: "", placeholder: "V-AUI-1024", name: "voucher" } }
    ]},
    { id: "b", type: "button", props: { variant: "primary", text: "Apply", type: "submit" } }
  ])'
/>

---

## 基本用法

```vue
<script setup lang="ts">
import { SnCard, SnForm, SnFormItem, SnInput, SnButton } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<template>
  <SnCard title="Order #1024" description="Pending payment" bordered shadow>
    <SnForm>
      <SnFormItem label="Voucher">
        <SnInput placeholder="V-AUI-1024" />
      </SnFormItem>
      <SnButton type="primary">Apply</SnButton>
    </SnForm>
  </SnCard>
</template>
```

---

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | 头部标题文本 |
| `description` | `string` | — | 头部副标题 |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | 视觉风格变体 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 内部 padding 子轴 |
| `bordered` | `boolean` | `true` | 显示边框 |
| `shadow` | `boolean` | `false` | 显示阴影 |

---

## Token 消费（Web 别名层）

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--sn-web-color-surface)` |
| `borderColor` | `var(--sn-web-color-border-default)` |
| `titleColor` | `var(--sn-web-color-text-primary)` |
| `descriptionColor` | `var(--sn-web-color-text-secondary)` |
| `footerBorderColor` | `var(--sn-web-color-border-soft)` |
| `shadow` | `var(--sn-web-shadow-md)` |
| `radius` | `var(--sn-web-radius-card)` |
| `padding.none` | `0` |
| `padding.sm` | `var(--sn-web-spacing-sm)` |
| `padding.md` | `var(--sn-web-spacing-md)` |
| `padding.lg` | `var(--sn-web-spacing-lg)` |

> v3.1 端独立：SnCard 源码用 `--sn-web-*` 别名层（**不**用 `--aui-*` 原始层）。`tokens-web` 包内建 `snWebAliasMap` 把 `--sn-web-*` 映射到 `--aui-*`。

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `region` |
| `aria-labelledby` | 指向 `<h3>` 标题元素 id（当 `title` 存在时） |
| `aria-describedby` | 指向 description 元素 id（当 `description` 存在时） |

---

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `title`, `description`, `variant`, `padding`, `bordered`, `shadow` |
| `ai.readonly` | `role` |

---

## 端差异对照

| 维度 | Web（`SnCard`） | uni（`sn-card`） |
|---|---|---|
| 包 | `@snui/vue-web` | `@snui/uni` |
| 组件名 | `SnCard`（PascalCase import） | `sn-card`（kebab-case easycom） |
| Token 别名 | `--sn-web-*`（px） | `--sn-mp-*`（rpx） |
| variant | `default` / `outlined` / `elevated` | 同（移动端视觉差异由 rpx 自然产生） |
| 默认 padding | `dense` | `medium` |

---

## Source

`packages/protocol/src/card-contract.ts`（Contract 跨端共享） · `packages/vue-web/src/card/SnCard.vue`（Web 渲染器） · `packages/tokens-web/`（别名层）

---

## 嵌套与子节点

Card 通过 UINode children 接收任意子树（包括按钮、输入、其他 Card）。当 `title` / `description` 都为空时 header 自动省略；当 `footer` slot 为空时 footer 自动省略。