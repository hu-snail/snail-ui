<script setup lang="ts">
/** Demo: sn-button — formType 'submit' | 'reset' (MP 表单提交). */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { reactive, ref } from 'vue'

const form = reactive({ email: '' })
const submitted = ref('')

function onSubmit(): void {
  submitted.value = JSON.stringify(form)
}
function onReset(): void {
  form.email = ''
  submitted.value = '(reset)'
}
</script>

<template>
  <view class="sn-form-demo">
    <SnForm :model="form" label-position="left" label-width="120">
      <SnFormItem prop="email" label="Email">
        <SnInput v-model="form.email" placeholder="you@example.com" />
      </SnFormItem>
      <view class="sn-form-demo__actions">
        <SnButton type="primary" form-type="submit" @click="onSubmit">formType=submit</SnButton>
        <SnButton form-type="reset" @click="onReset">formType=reset</SnButton>
      </view>
      <view class="sn-form-demo__result">submitted: {{ submitted || '—' }}</view>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 700rpx; }
.sn-form-demo__actions { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; }
.sn-form-demo__result { margin-top: 16rpx; font-size: 24rpx; color: var(--vp-c-text-2); }
</style>