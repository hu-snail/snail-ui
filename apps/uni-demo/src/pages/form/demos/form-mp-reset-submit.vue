<script setup lang="ts">
/**
 * Demo: sn-form — 重置与清除校验的区别。
 *
 * resetFields()：字段值回到挂载时的初始快照，错误提示一并清空。
 * clearValidate()：只清错误提示，保留字段当前输入。
 * validate()：跑一次全表校验并返回布尔结果。
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

type FormRef = InstanceType<typeof SnForm>;

const form = reactive({ email: 'mia@example.com', password: '' });
const formRef = ref<FormRef | null>(null);
const log = ref('尚未操作');

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

async function runValidate(): Promise<void> {
  const ok = await formRef.value?.validate();
  log.value = ok === true ? 'validate()：全部通过' : 'validate()：未通过，错误见字段提示';
}

function runReset(): void {
  formRef.value?.resetFields();
  log.value = 'resetFields()：字段值回到初始快照，错误提示同时清空';
}

function runClear(): void {
  formRef.value?.clearValidate();
  log.value = 'clearValidate()：只清错误提示，保留当前输入值';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" label-position="left" label-width="200">
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
      <SnButton type="primary" @click="runValidate">校验</SnButton>
      <SnButton @click="runReset">重置为初始值</SnButton>
      <SnButton @click="runClear">清除校验</SnButton>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__meta">{{ log }}</text>
      <text class="sn-demo__meta">当前值：{{ JSON.stringify(form) }}</text>
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
