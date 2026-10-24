<script setup lang="ts">
/** Demo: SnForm — resetFields / clearValidate / programmatic
 *  validate() / validateField(). */
import { reactive, ref } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/vue-web'
import type { FormRule } from '@snui/vue-web'

const form = reactive({ email: '', password: '' })
const formRef = ref<InstanceType<typeof SnForm> | null>(null)

const rules: Record<string, FormRule[]> = {
  email: [{ required: true, message: 'Email is required' }],
  password: [{ required: true, minLength: 6, message: 'Min 6 chars' }],
}

async function onSubmit(payload: { valid: boolean }): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('submit', payload)
}

async function runValidate(): Promise<void> {
  await formRef.value?.validate()
}
function runReset(): void {
  formRef.value?.resetFields()
}
function runClear(): void {
  formRef.value?.clearValidate()
}
async function runValidateEmail(): Promise<void> {
  await formRef.value?.validateField('email')
}
</script>

<template>
  <div class="sn-form-demo">
    <SnForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="100"
      @submit="onSubmit"
    >
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" />
      </SnFormItem>
      <SnFormItem prop="password" label="Password" required>
        <SnInput v-model="form.password" type="password" />
      </SnFormItem>

      <div class="sn-form-demo__actions">
        <SnButton type="primary" html-type="submit">Submit</SnButton>
        <SnButton @click="runValidate">Validate all</SnButton>
        <SnButton @click="runValidateEmail">Validate email</SnButton>
        <SnButton @click="runReset">Reset fields</SnButton>
        <SnButton @click="runClear">Clear validate</SnButton>
      </div>
    </SnForm>
  </div>
</template>

<style scoped>
.sn-form-demo { max-width: 480px; }
.sn-form-demo__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
</style>