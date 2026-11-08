<script setup lang="ts">
/**
 * Demo: sn-form — 表单按钮形态：提交型 / 重置型。
 *
 * 提交型：按钮调用 formRef.submit()，表单先跑校验，再经 @submit 回报结果。
 * 重置型：按钮调用 formRef.resetFields()，字段值回到挂载时的初始快照。
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const submitForm = reactive({ email: '', contact: '' });
const submitRef = ref<InstanceType<typeof SnForm> | null>(null);
const submitResult = ref('');

const submitRules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: '请填写邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
};

function runSubmit(): void {
  submitRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  submitResult.value = payload.valid ? `已提交：${submitForm.email}` : '提交被拦截：字段未通过校验';
}

const resetForm = reactive({ nickname: '小满', city: '杭州' });
const resetRef = ref<InstanceType<typeof SnForm> | null>(null);
const resetCount = ref(0);

function runReset(): void {
  resetRef.value?.resetFields();
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">提交型表单</text>
      <SnForm ref="submitRef" :model="submitForm" :rules="submitRules" @submit="onSubmit">
        <SnFormItem prop="email" label="邮箱" required>
          <SnInput
            v-model="submitForm.email"
            type="email"
            placeholder="you@example.com"
            clearable
          />
        </SnFormItem>
        <SnFormItem prop="contact" label="联系方式">
          <SnInput v-model="submitForm.contact" placeholder="请输入手机号或微信" clearable />
        </SnFormItem>
        <SnButton type="primary" block @click="runSubmit">提交</SnButton>
      </SnForm>
      <text class="sn-demo__meta">{{ submitResult || '尚未提交' }}</text>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">重置型表单</text>
      <SnForm ref="resetRef" :model="resetForm" @reset="resetCount += 1">
        <SnFormItem prop="nickname" label="昵称">
          <SnInput v-model="resetForm.nickname" placeholder="请输入昵称" clearable />
        </SnFormItem>
        <SnFormItem prop="city" label="城市">
          <SnInput v-model="resetForm.city" placeholder="请输入城市" clearable />
        </SnFormItem>
        <SnButton block @click="runReset">重置为初始值</SnButton>
      </SnForm>
      <text class="sn-demo__meta">
        已重置 {{ resetCount }} 次｜当前值：{{ resetForm.nickname }} / {{ resetForm.city }}
      </text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
