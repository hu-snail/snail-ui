<script setup lang="ts">
/**
 * Demo: SnForm (Web) — placeholder live render.
 *
 * Full Form requires v1.x protocol (Form / FormItem / Field contract) not yet
 * shipped in @snui/vue-web. This demo shows native <form> + SnInput +
 * SnButton interaction as a forward-compatible preview.
 */

import { reactive, ref } from 'vue'
import SnButton from '@snui/vue-web/src/button/SnButton.vue'

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const submitted = ref<{ email: string; password: string } | null>(null)

async function submit(e: Event): Promise<void> {
  e.preventDefault()
  loading.value = true
  await new Promise((r) => setTimeout(r, 800))
  submitted.value = { email: form.email, password: form.password }
  loading.value = false
}
</script>

<template>
  <form class="sn-form" @submit="submit">
    <div class="sn-form__item">
      <label class="sn-form__label">Email</label>
      <input v-model="form.email" type="email" placeholder="you@aui.dev" class="sn-form__input" />
    </div>
    <div class="sn-form__item">
      <label class="sn-form__label">Password</label>
      <input v-model="form.password" type="password" placeholder="••••••" class="sn-form__input" />
    </div>
    <SnButton type="primary" html-type="submit" :loading="loading">登录</SnButton>

    <p v-if="submitted" class="sn-form__log">
      ✓ 已提交：<code>{{ submitted.email }}</code>
    </p>
  </form>
</template>

<style scoped>
.sn-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 320px;
}
.sn-form__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sn-form__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sn-form__input {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.sn-form__log {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-success-1);
}
.sn-form__log code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>