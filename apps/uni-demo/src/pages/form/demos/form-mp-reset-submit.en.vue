<script setup lang="ts">
/**
 * Demo: sn-form — the difference between resetting and clearing validation.
 *
 * resetFields(): field values return to the snapshot taken when they mounted,
 * and the errors are cleared with them.
 * clearValidate(): clears the errors only, keeping the current input.
 * validate(): runs a full-form validation and returns a boolean.
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
const log = ref('Nothing done yet');

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

async function runValidate(): Promise<void> {
  const ok = await formRef.value?.validate();
  log.value = ok === true ? 'validate(): all fields passed' : 'validate(): failed — see the fields';
}

function runReset(): void {
  formRef.value?.resetFields();
  log.value = 'resetFields(): values returned to the initial snapshot, errors cleared too';
}

function runClear(): void {
  formRef.value?.clearValidate();
  log.value = 'clearValidate(): errors cleared, current input kept';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" label-position="left" label-width="200">
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
      <SnButton type="primary" @click="runValidate">Validate</SnButton>
      <SnButton @click="runReset">Reset to initial values</SnButton>
      <SnButton @click="runClear">Clear validation</SnButton>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__meta">{{ log }}</text>
      <text class="sn-demo__meta">Current: {{ JSON.stringify(form) }}</text>
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
