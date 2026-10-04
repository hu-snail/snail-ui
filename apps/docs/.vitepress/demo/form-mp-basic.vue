<script setup lang="ts">
/** Demo: sn-form — basic model + reactive submit (uni-end). */
import { reactive, ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const form = reactive({ name: '', email: '' })
const last = ref<string | null>(null)

function onSubmit(payload: { valid: boolean }): void {
  if (payload.valid) last.value = JSON.stringify(form, null, 2)
}
</script>

<template>
  <view class="sn-form-demo">
    <SnForm :model="form" @submit="onSubmit">
      <SnFormItem prop="name" label="Name">
        <SnInput v-model="form.name" placeholder="Your name" />
      </SnFormItem>
      <SnFormItem prop="email" label="Email">
        <SnInput v-model="form.email" type="email" placeholder="you@aui.dev" />
      </SnFormItem>
      <SnButton type="primary">Save</SnButton>
    </SnForm>
    <view v-if="last" class="sn-form-demo__log">{{ last }}</view>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 480rpx; display: flex; flex-direction: column; gap: 32rpx; }
.sn-form-demo__log {
  padding: 24rpx;
  background: var(--vp-c-bg-soft);
  border-radius: 12rpx;
  font-size: 24rpx; color: var(--vp-c-text-2);
}
</style>