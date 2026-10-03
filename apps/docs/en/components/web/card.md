# Card · Web (PC)

`<section role="region">` container with `title` / `description` header, Token alias-driven shadow & border, optional body & footer slots.

---

## Basic usage

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
| `title` | `string` | — | Header title |
| `description` | `string` | — | Header subtitle |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Visual variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner padding axis |
| `bordered` | `boolean` | `true` | Show border |
| `shadow` | `boolean` | `false` | Show shadow |

---

---

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `region` |
| `aria-labelledby` | points to `<h3>` title id (when `title` exists) |
| `aria-describedby` | points to description id (when `description` exists) |

---

---

---

## Source

Contract shared across ends, Web renderer in `@snui/vue-web`.

---

## Nesting & children

Card accepts arbitrary subtrees via UINode children (buttons, inputs, other Cards). When both `title` and `description` are empty, header is auto-omitted; when `footer` slot is empty, footer is auto-omitted.