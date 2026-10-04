<script setup lang="ts">
/**
 * Demo: SnForm (Web) — full validation + submit flow with SnForm +
 * SnFormItem + SnInput + SnButton.
 *
 * Demonstrates:
 *   - reactive model + per-field FormRule
 *   - validate() called from submit
 *   - error / warning messages render below each item
 *   - resetFields restores the snapshot
 *   - form-level disabled cascades
 */

import { reactive, ref } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/vue-web'
import type { FormRule } from '@snui/vue-web'

const form = reactive({
  email: '',
  password: '',
  age: 18,
  bio: '',
  agreement: false,
})

const lastSubmit = ref<{ email: string; valid: boolean } | null>(null)
const submitting = ref(false)

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Must be a valid email' },
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, message: 'Use at least 8 characters' },
  ],
  age: [
    { required: true, min: 18, max: 120, message: 'Must be 18+' },
  ],
  bio: [
    { maxLength: 280, message: 'Keep it under 280 chars' },
  ],
}

async function onSubmit(payload: { valid: boolean }): Promise<void> {
  if (!payload.valid) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 600))
  lastSubmit.value = { email: form.email, valid: payload.valid }
  submitting.value = false
}

function onReset(): void {
  lastSubmit.value = null
}
</script>

<template>
  <div class="sn-form-demo">
    <SnForm
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="80"
      @submit="onSubmit"
      @reset="onReset"
    >
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" placeholder="you@aui.dev" />
      </SnFormItem>

      <SnFormItem prop="password" label="Password" required>
        <SnInput v-model="form.password" type="password" placeholder="••••••••" />
      </SnFormItem>

      <SnFormItem prop="age" label="Age">
        <SnInput v-model="form.age" type="number" :min="0" :max="120" />
      </SnFormItem>

      <SnFormItem prop="bio" label="Bio" label-position="top">
        <SnInput v-model="form.bio" type="textarea" :rows="3" placeholder="Optional bio" />
      </SnFormItem>

      <div class="sn-form-demo__actions">
        <SnButton html-type="submit" type="primary" :loading="submitting">Sign up</SnButton>
        <SnButton html-type="reset" @click="$refs.form?.resetFields()">Reset</SnButton>
      </div>
    </SnForm>

    <pre v-if="lastSubmit" class="sn-form-demo__log">Submitted: {{ JSON.stringify(lastSubmit, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.sn-form-demo {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-form-demo__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.sn-form-demo__log {
  margin: 0;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>