<script setup lang="ts">
/**
 * Demo: sn-form — 编程式校验 API：validate() / validateField() /
 * clearValidate()，以及 @validate 事件回传的错误表。
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

type FormRef = InstanceType<typeof SnForm>;

const form = reactive({ email: '', password: '' });
const formRef = ref<FormRef | null>(null);
const log = ref('尚未调用');
const errors = ref('（无）');

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: '请填写邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  password: [
    { required: true, message: '请填写密码' },
    { minLength: 8, maxLength: 20, message: '密码需 8-20 位' },
  ],
};

function report(call: string, ok: boolean | undefined): void {
  log.value = `${call} → ${ok === true ? '通过' : '未通过'}`;
}

async function runAll(): Promise<void> {
  report('validate()', await formRef.value?.validate());
}

async function runEmail(): Promise<void> {
  report("validateField('email')", await formRef.value?.validateField('email'));
}

async function runBoth(): Promise<void> {
  report(
    "validateField(['email', 'password'])",
    await formRef.value?.validateField(['email', 'password']),
  );
}

function clearEmail(): void {
  formRef.value?.clearValidate('email');
  log.value = "clearValidate('email') → 只清掉邮箱的错误提示";
}

function onValidate(payload: { valid: boolean; errors: Record<string, string> }): void {
  const keys = Object.keys(payload.errors);
  errors.value = keys.length === 0 ? '（无）' : JSON.stringify(payload.errors);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @validate="onValidate">
      <SnFormItem prop="email" label="邮箱" required>
        <SnInput v-model="form.email" type="email" placeholder="请输入邮箱" clearable />
      </SnFormItem>
      <SnFormItem prop="password" label="密码" required>
        <SnInput
          v-model="form.password"
          type="password"
          placeholder="请输入至少 8 位密码"
          show-password
        />
      </SnFormItem>
    </SnForm>

    <view class="sn-demo__actions">
      <SnButton type="primary" @click="runAll">validate()</SnButton>
      <SnButton @click="runEmail">validateField('email')</SnButton>
      <SnButton @click="runBoth">validateField([email, password])</SnButton>
      <SnButton @click="clearEmail">clearValidate('email')</SnButton>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__meta">{{ log }}</text>
      <text class="sn-demo__meta">@validate 回传 errors：{{ errors }}</text>
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

.sn-demo__actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
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

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
