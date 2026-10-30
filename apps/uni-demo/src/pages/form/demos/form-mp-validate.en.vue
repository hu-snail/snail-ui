<script setup lang="ts">
/**
 * Demo: sn-form — programmatic validation API: validate() / validateField() /
 * clearValidate(), plus the error map reported by the `@validate` event.
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
const log = ref('Nothing called yet');
const errors = ref('(none)');

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email address' },
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, maxLength: 20, message: '8-20 characters' },
  ],
};

function report(call: string, ok: boolean | undefined): void {
  log.value = `${call} → ${ok === true ? 'passed' : 'failed'}`;
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
  log.value = "clearValidate('email') → dropped the email error only";
}

function onValidate(payload: { valid: boolean; errors: Record<string, string> }): void {
  const keys = Object.keys(payload.errors);
  errors.value = keys.length === 0 ? '(none)' : JSON.stringify(payload.errors);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @validate="onValidate">
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" placeholder="Enter an email" clearable />
      </SnFormItem>
      <SnFormItem prop="password" label="Password" required>
        <SnInput
          v-model="form.password"
          type="password"
          placeholder="At least 8 characters"
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
      <text class="sn-demo__meta">@validate errors: {{ errors }}</text>
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
