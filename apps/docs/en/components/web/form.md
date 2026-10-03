# Form · Web (PC)

Native `<form>` container + FormItem sub-components, with FormData auto-collection, field-level error echoing, and disabled / loading state cascading.

---

## Basic usage

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
    <SnFormItem label="Email" required>
      <SnInput v-model="form.email" type="email" placeholder="you@aui.dev" />
    </SnFormItem>
    <SnFormItem label="Password" required>
      <SnInput v-model="form.password" type="password" placeholder="••••••" />
    </SnFormItem>
    <SnButton type="primary" :loading="loading" html-type="submit">Sign in</SnButton>
  </SnForm>
</template>
```

---

## Form props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `disabled` | `boolean` | `false` | Disable entire form (cascading) |
| `loading` | `boolean` | `false` | Form loading (applies `aria-busy`) |
| `initialValues` | `Record<string, unknown>` | `{}` | Initial values (FormData still auto-collected) |
| `fields` | `FormField[]` | — | Field descriptor array; children tree is more common |
| `formId` | `string` | — | Native `<form>` id |

## FormItem props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | **Required**. Field path for value lookup & error echo |
| `label` | `string` | — | Field label |
| `required` | `boolean` | `false` | Required, adds `*` + `aria-required` |
| `error` | `string` | — | Field error (from parent validate) |

## Validation rules (`fields[].rules`)

| Rule | Behavior |
| --- | --- |
| `required` | Value is non-empty string |
| `minLength` | Min string length |
| `maxLength` | Max string length |
| `pattern` | RegExp source (runtime compiled) |
| `message` | Custom error text |

## Events

| Event id | DOM event | Payload |
| --- | --- | --- |
| `submit` | `submit` | `Record<string, string>` (sanitized values) |
| `validate` | — | `{ valid: boolean; errors: Record<string, string> }` |

---

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `form` (Form) · `group` (FormItem) |
| `keyboard` | `Enter`, `Tab` (Form) · platform-native (FormItem) |
| `aria-busy` | bound to `Form.props.loading` |
| `aria-disabled` | bound to `Form.props.disabled` |
| `aria-required` | bound to `FormItem.props.required` |
| `aria-invalid` | bound to `has-error(error)` |

---

---

---

## Source

Contract shared across ends, Web renderer in `@snui/vue-web`.