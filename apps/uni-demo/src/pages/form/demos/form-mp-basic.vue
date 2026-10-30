<script setup lang="ts">
/** Demo: sn-form — 基础用法：model + v-model + 提交时校验。 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({ name: '', email: '', phone: '' });
const formRef = ref<InstanceType<typeof SnForm> | null>(null);
const submitted = ref('');

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请填写姓名' }],
  email: [
    { required: true, message: '请填写邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  phone: [{ pattern: /^1\d{10}$/, message: '请输入 11 位手机号' }],
};

/** 表单先跑全量校验，再经 submit 事件回报结果。 */
function handleSubmit(): void {
  formRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  submitted.value = payload.valid ? JSON.stringify(form) : '校验未通过，请检查字段提示';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @submit="onSubmit">
      <SnFormItem prop="name" label="姓名" required>
        <SnInput v-model="form.name" placeholder="请输入姓名" clearable />
      </SnFormItem>
      <SnFormItem prop="email" label="邮箱" required>
        <SnInput v-model="form.email" type="email" placeholder="you@example.com" clearable />
      </SnFormItem>
      <SnFormItem prop="phone" label="手机号">
        <SnInput
          v-model="form.phone"
          type="number"
          :maxlength="11"
          placeholder="请输入 11 位手机号"
          clearable
        />
      </SnFormItem>
      <SnButton type="primary" block @click="handleSubmit">提交</SnButton>
    </SnForm>

    <text class="sn-demo__meta">提交结果：{{ submitted || '尚未提交' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
