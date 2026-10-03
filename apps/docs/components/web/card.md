# Card · Web（PC 端）

`<section role="region">` 容器，支持 title / description 头部、Token 别名层驱动的阴影与边框、可选 body 与 footer 插槽。

---

## 基本用法

<Demo name="card-web" />

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

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `region` |
| `aria-labelledby` | 指向 `<h3>` 标题元素 id（当 `title` 存在时） |
| `aria-describedby` | 指向 description 元素 id（当 `description` 存在时） |

---

---

---

---

## 嵌套与子节点

Card 通过 UINode children 接收任意子树（包括按钮、输入、其他 Card）。当 `title` / `description` 都为空时 header 自动省略；当 `footer` slot 为空时 footer 自动省略。