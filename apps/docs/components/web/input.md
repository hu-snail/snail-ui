# Input · Web（PC 端）

受控输入控件，Token 别名层驱动的样式方案与一组跨浏览器原生 input 事件。映射到真实的 `<input>` DOM 元素，由 `@snui/vue-web` 渲染。

> **v3.1 端独立**：`SnInput` (`@snui/vue-web`) 与 `sn-input` (`@snui/uni`) 是**两个独立组件**。Web 端 CSS 只用 `var(--sn-web-*)` 别名层。组件 Contract 跨端共享，Vue 渲染器按端独立实现。

---

## Live render · 真实框架挂载

下面所有输入框通过 `createVueRenderer().mount()` 挂载，刷新页面即可重新挂载。

### Types（input type）

<ComponentPreview name="input" :raw-props="{ value: 'text input', type: 'text', placeholder: '文本输入' }" />
<ComponentPreview name="input" :raw-props="{ value: 'a@b.dev', type: 'email', placeholder: '邮箱' }" />
<ComponentPreview name="input" :raw-props="{ value: '', type: 'password', placeholder: '密码' }" />
<ComponentPreview name="input" :raw-props="{ value: '13900000000', type: 'tel', placeholder: '手机号' }" />

### Sizes（尺寸）

<ComponentPreview name="input" :raw-props="{ value: 'Small', size: 'small', placeholder: '小号' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Medium', size: 'medium', placeholder: '中号' }" />
<ComponentPreview name="input" :raw-props="{ value: 'Large', size: 'large', placeholder: '大号' }" />

### States（状态）

<ComponentPreview name="input" :raw-props="{ value: '禁用态', disabled: true }" />
<ComponentPreview name="input" :raw-props="{ value: '只读态', readonly: true }" />

### Clearable（可清除）

<ComponentPreview name="input" :raw-props="{ value: '点击右侧 × 清空', clearable: true }" />

### Length constraints（长度约束）

<ComponentPreview name="input" :raw-props="{ value: '', placeholder: '最多 8 字符', maxlength: 8, name: 'username' }" />

### 受控用法示例

<ComponentPreview
  name="input"
  :raw-props="{ value: 'controlled', name: 'email', type: 'email', placeholder: 'you@aui.dev' }"
/>

---

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'
import '@snui/tokens-web/styles'

const email = ref('')
</script>

<template>
  <SnInput v-model="email" type="email" placeholder="you@aui.dev" clearable />
</template>
```

---

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | 受控值。父组件在收到 `input` 后应使用新值重新渲染 |
| `placeholder` | `string` | — | 空值占位符 |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | 原生 input type |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 高度 / 内边距 / 字号子轴 |
| `disabled` | `boolean` | `false` | 禁用并应用 `aria-disabled` |
| `readonly` | `boolean` | `false` | 只读并应用 `aria-readonly` |
| `clearable` | `boolean` | `false` | 值为非空时显示 × 清除按钮 |
| `maxlength` | `number` | — | 最大字符数 |
| `minlength` | `number` | — | 最小字符数 |
| `name` | `string` | — | 原生 name（FormData 收集时使用） |

## Events

| Event id | DOM event | Payload | Notes |
| --- | --- | --- | --- |
| `input` | `input` | `string` | 每次按键触发 |
| `change` | `change` | `string` | 提交时触发（input + blur / Enter） |
| `focus` | `focus` | `FocusEvent` | 获得焦点 |
| `blur` | `blur` | `FocusEvent` | 失去焦点 |
| `clear` | `click`（清除按钮） | — | 用户点击清除按钮（`clearable=true`）；同时 emit 一对 `input`/`change`，值为 `''` |

---

## Token 消费（Web 别名层）

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--sn-web-color-input-bg)` |
| `color` | `var(--sn-web-color-input-text)` |
| `borderColor` | `var(--sn-web-color-input-border)` |
| `placeholderColor` | `var(--sn-web-color-input-placeholder)` |
| `disabledBackground` | `var(--sn-web-color-input-bg-disabled)` |
| `disabledColor` | `var(--sn-web-color-input-text-disabled)` |
| `focusRing` | `var(--sn-web-color-focus-ring)` |
| `size.small.height` | `var(--sn-web-control-height-sm)` |
| `size.medium.height` | `var(--sn-web-control-height-md)` |
| `size.large.height` | `var(--sn-web-control-height-lg)` |

> v3.1 端独立：SnInput 源码 CSS 内部用 `--sn-web-*` 别名层（**不**用 `--aui-*`）。`tokens-web` 包内部映射 `snWebAliasMap` 把 `--sn-web-*` → `--aui-*`。

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `textbox` |
| `keyboard` | `Tab`, `ArrowLeft`, `ArrowRight`, `Backspace`, `Delete` |
| `aria-disabled` | 绑定到 `props.disabled` |
| `aria-readonly` | 绑定到 `props.readonly` |
| `aria-placeholder` | 绑定到 `props.placeholder` |

---

## 端差异对照

| 维度 | Web（`SnInput`） | uni（`sn-input`） |
|---|---|---|
| 包 | `@snui/vue-web` | `@snui/uni` |
| 容器 | `<input type="...">` | `<input>`（小程序编译后） |
| Token 别名 | `--sn-web-*`（px） | `--sn-mp-*`（rpx） |
| clearable | ✓ | ✓ |
| maxlength / minlength | ✓ | ✓（小程序原生） |
| 默认 keyboard | 平台原生 | 平台原生；移动端会触发键盘弹起 |
| 端专属 Props | — | `confirmType`（done / send / search 等） |

---

## AI Patch Boundary

| Status | Field |
| --- | --- |
| `ai.patchable` | `value`, `placeholder`, `disabled`, `readonly`, `type`, `size`, `clearable`, `maxlength`, `minlength`, `name` |
| `ai.readonly` | `role`, `keyboard`, `focus`, `blur` |

---

## 与 Form 联动

通常 Input 嵌入 `SnForm` / `SnFormItem` 容器，FormData 在原生 `<form>` submit 时自动收集带 `name` 的输入：

```vue
<SnForm @submit="onSubmit">
  <SnFormItem label="Email" required>
    <SnInput v-model="email" name="email" type="email" />
  </SnFormItem>
  <SnButton type="primary" html-type="submit">登录</SnButton>
</SnForm>
```

---

## Source

`packages/protocol/src/input-contract.ts`（Contract 跨端共享） · `packages/vue-web/src/input/SnInput.vue`（Web 渲染器） · `packages/tokens-web/`（别名层）