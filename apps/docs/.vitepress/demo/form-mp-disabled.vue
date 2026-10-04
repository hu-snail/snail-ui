<script setup lang="ts">
/** Demo: sn-form — form-wide disabled cascades into every FormItem (uni-end). */
import { reactive, ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types'

const form = reactive({ email: '', password: '' })
const disabled = ref(true)

const rules: Record<string, FormRule[]> = {
  email: [{ required: true, message: 'Email required' }],
  password: [{ minLength: 8, message: 'Min 8' }],
}
</script>

<template>
  <view class="sn-form-demo">
    <SnButton @click="disabled = !disabled">
      {{ disabled ? 'Enable' : 'Disable' }} form
    </SnButton>
    <SnForm :model="form" :rules="rules" :disabled="disabled" label-position="left" label-width="200">
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" />
      </SnFormItem>
      <SnFormItem prop="password" label="Password" required>
        <SnInput v-model="form.password" type="password" />
      </SnFormItem>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 600rpx; display: flex; flex-direction: column; gap: 24rpx; }
</style>