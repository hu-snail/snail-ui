<script setup lang="ts">
/** Demo: sn-form — resetFields / clearValidate / programmatic validate() (uni-end). */
import { reactive, ref } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/uni'
import type { FormRule } from '@snui/uni'

const form = reactive({ email: '', password: '' })
const formRef = ref<InstanceType<typeof SnForm> | null>(null)

const rules: Record<string, FormRule[]> = {
  email: [{ required: true, message: 'Email is required' }],
  password: [{ required: true, minLength: 6, message: 'Min 6 chars' }],
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
  <view class="sn-form-demo">
    <SnForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="200"
    >
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" />
      </SnFormItem>
      <SnFormItem prop="password" label="Password" required>
        <SnInput v-model="form.password" type="password" />
      </SnFormItem>

      <view class="sn-form-demo__actions">
        <SnButton type="primary" @click="runValidate">Validate all</SnButton>
        <SnButton @click="runValidateEmail">Validate email</SnButton>
        <SnButton @click="runReset">Reset fields</SnButton>
        <SnButton @click="runClear">Clear validate</SnButton>
      </view>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 600rpx; }
.sn-form-demo__actions { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; }
</style>