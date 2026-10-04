<script setup lang="ts">
/** Demo: SnForm — form-wide disabled cascades into every FormItem. */
import { reactive, ref } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/vue-web'
import type { FormRule } from '@snui/vue-web'

const form = reactive({ email: '', password: '' })
const disabled = ref(true)

const rules: Record<string, FormRule[]> = {
  email: [{ required: true, message: 'Email required' }],
  password: [{ minLength: 8, message: 'Min 8' }],
}
</script>

<template>
  <div class="sn-form-demo">
    <SnButton @click="disabled = !disabled">
      {{ disabled ? 'Enable' : 'Disable' }} form
    </SnButton>
    <SnForm :model="form" :rules="rules" :disabled="disabled" label-position="left" label-width="100">
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" />
      </SnFormItem>
      <SnFormItem prop="password" label="Password" required>
        <SnInput v-model="form.password" type="password" />
      </SnFormItem>
    </SnForm>
  </div>
</template>

<style scoped>
.sn-form-demo { max-width: 480px; display: flex; flex-direction: column; gap: 12px; }
</style>