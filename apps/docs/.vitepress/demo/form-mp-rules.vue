<script setup lang="ts">
/** Demo: sn-form — FormRule union (uni-end). */
import { reactive } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/uni'
import type { FormRule } from '@snui/uni'

const form = reactive({
  email: '',
  age: 18,
  bio: '',
  handle: '',
})

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Must be a valid email' },
  ],
  age: [
    { required: true, min: 18, max: 120, message: 'Must be 18 or older' },
  ],
  bio: [
    { maxLength: 140, message: 'Keep it under 140 chars' },
  ],
  handle: [
    { required: true, pattern: /^[a-z0-9_]+$/, message: 'Lowercase + digits + underscore only' },
    {
      validator: (v: string) => !v.startsWith('admin') || 'Reserved handle',
      message: 'Reserved',
    },
    {
      asyncValidator: async (v: string) => v.length >= 3 || 'Too short',
      message: 'Too short',
    },
  ],
}
</script>

<template>
  <view class="sn-form-demo">
    <SnForm :model="form" :rules="rules" @submit="() => {}">
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" />
      </SnFormItem>
      <SnFormItem prop="age" label="Age">
        <SnInput v-model="form.age" type="number" />
      </SnFormItem>
      <SnFormItem prop="bio" label="Bio" label-position="top">
        <SnInput v-model="form.bio" type="textarea" :rows="2" />
      </SnFormItem>
      <SnFormItem prop="handle" label="Handle" required>
        <SnInput v-model="form.handle" />
      </SnFormItem>
      <SnButton type="primary">Validate</SnButton>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 480rpx; }
</style>