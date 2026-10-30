<script setup lang="ts">
/**
 * Demo: sn-form — 提交拦截：用 @submit 的 valid 决定是否放行。
 *
 * 校验失败时数据不提交（计入拦截次数），修正字段后再次提交即放行。
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({ handle: '' });
const formRef = ref<InstanceType<typeof SnForm> | null>(null);
const attempts = ref(0);
const blocked = ref(0);
const passed = ref(0);
const lastSubmit = ref('');

const rules: Record<string, FormRule[]> = {
  handle: [
    { required: true, message: '请填写用户名' },
    { minLength: 3, maxLength: 20, message: '用户名需 3-20 个字符' },
    { pattern: /^[a-z0-9_]+$/, message: '只能使用小写字母、数字与下划线' },
  ],
};

function trySubmit(): void {
  attempts.value += 1;
  formRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  if (payload.valid) {
    passed.value += 1;
    lastSubmit.value = `放行：已提交 ${form.handle}`;
    return;
  }
  blocked.value += 1;
  lastSubmit.value = '拦截：字段未通过校验，数据未提交';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @submit="onSubmit">
      <SnFormItem prop="handle" label="用户名" required>
        <SnInput v-model="form.handle" placeholder="至少 3 个字符，如 aui_dev" clearable />
      </SnFormItem>
      <SnButton type="primary" block @click="trySubmit">提交</SnButton>
    </SnForm>

    <view class="sn-demo__panel">
      <text class="sn-demo__row">尝试提交 {{ attempts }} 次</text>
      <text class="sn-demo__row sn-demo__row--blocked">被拦截 {{ blocked }} 次</text>
      <text class="sn-demo__row sn-demo__row--passed">放行 {{ passed }} 次</text>
      <text class="sn-demo__meta">{{ lastSubmit || '等待第一次提交' }}</text>
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
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__row {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__row--blocked {
  color: var(--sn-mp-color-feedback-danger);
}

.sn-demo__row--passed {
  color: var(--sn-mp-color-feedback-success);
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
