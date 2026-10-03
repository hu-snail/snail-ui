# Form · Web（PC 端）

原生 `<form>` 容器 + FormItem 子组件，支持 FormData 自动收集、字段级错误回显、disabled / loading 状态级联。

> **v3.1 端独立**：`SnForm` / `SnFormItem` (`@snui/vue-web`) 与 `sn-form` / `sn-form-item` (`@snui/uni`) 是**两个独立组件**。Web 端 CSS 只用 `var(--sn-web-*)` 别名层。组件 Contract 跨端共享，Vue 渲染器按端独立实现。

---

## 基本用法

<Demo name="form-web" />

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SnForm, SnFormItem, SnInput, SnButton } from '@snui/vue-web'
import '@snui/tokens-web/styles'

const form = reactive({ email: '', password: '' })
const loading = ref(false)

async function submit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
}
</script>

<template>
  <SnForm :model="form" layout="vertical" @submit="submit">
    <SnFormItem label="邮箱" required>
      <SnInput v-model="form.email" type="email" placeholder="you@aui.dev" />
    </SnFormItem>
    <SnFormItem label="密码" required>
      <SnInput v-model="form.password" type="password" placeholder="••••••" />
    </SnFormItem>
    <SnButton type="primary" :loading="loading" html-type="submit">登录</SnButton>
  </SnForm>
</template>
```

---

## Form props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | 布局方向 |
| `disabled` | `boolean` | `false` | 禁用整个表单（cascading via FormContext） |
| `loading` | `boolean` | `false` | 表单加载中（应用 `aria-busy`） |
| `initialValues` | `Record<string, unknown>` | `{}` | 初始值（HTML FormData 仍由原生 input 自动收集） |
| `fields` | `FormField[]` | — | 字段描述数组，可选；内嵌 children 树是更常用的方式 |
| `formId` | `string` | — | 原生 `<form>` 元素 id |

## FormItem props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | **必填**。字段路径，用于值查找与错误回显 |
| `label` | `string` | — | 字段标签 |
| `required` | `boolean` | `false` | 必填，附加 `*` 标记 + `aria-required` |
| `error` | `string` | — | 字段级错误信息（来自父级 validate） |

## Validation rules（`fields[].rules`）

| Rule | 行为 |
| --- | --- |
| `required` | 值非空字符串 |
| `minLength` | 字符串长度下限 |
| `maxLength` | 字符串长度上限 |
| `pattern` | RegExp 源码（运行时编译） |
| `message` | 自定义错误文本 |

## Events

| Event id | DOM event | Payload |
| --- | --- | --- |
| `submit` | `submit` | `Record<string, string>`（已清理的 values） |
| `validate` | — | `{ valid: boolean; errors: Record<string, string> }` |

---

## Token 消费（Web 别名层）

| Logical slot | CSS variable |
| --- | --- |
| `background` | `var(--sn-web-color-surface)` |
| `itemGap` | `var(--sn-web-spacing-md)` |
| `labelColor` | `var(--sn-web-color-text-primary)` |
| `errorColor` | `var(--sn-web-color-text-danger)` |
| `requiredColor` | `var(--sn-web-color-text-danger)` |
| `borderColor` | `var(--sn-web-color-border-default)` |

> v3.1 端独立：SnForm 源码 CSS 内部用 `--sn-web-*` 别名层（**不**用 `--aui-*`）。

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `form`（Form） · `group`（FormItem） |
| `keyboard` | `Enter`, `Tab`（Form） · 平台原生（FormItem） |
| `aria-busy` | 绑定到 `Form.props.loading` |
| `aria-disabled` | 绑定到 `Form.props.disabled` |
| `aria-required` | 绑定到 `FormItem.props.required` |
| `aria-invalid` | 绑定到 `has-error(error)` |

---

## 端差异对照

| 维度 | Web（`SnForm`） | uni（`sn-form`） |
|---|---|---|
| 包 | `@snui/vue-web` | `@snui/uni` |
| 容器 | `<form>` | `<form>`（小程序编译后） |
| Token 别名 | `--sn-web-*` | `--sn-mp-*` |
| 提交回调 | `@submit` (Vue emit) | `@submit` + `uni-forms` 表单库 |
| 验证规则 | SnForm 内置（Phase 2 最小集） | uni-forms / async-validator 适配 |

---

## AI Patch Boundary

**Form**

| Status | Field |
| --- | --- |
| `ai.patchable` | `layout`, `disabled`, `loading`, `initialValues`, `fields`, `formId` |
| `ai.readonly` | `role`, `submit`, `reset` |

**FormItem**

| Status | Field |
| --- | --- |
| `ai.patchable` | `prop`, `label`, `required`, `error` |
| `ai.readonly` | `role` |

---

## Source

`packages/protocol/src/form-contract.ts`（Contract 跨端共享） · `packages/vue-web/src/form/SnForm.vue`（Web 渲染器） · `packages/tokens-web/`（别名层）