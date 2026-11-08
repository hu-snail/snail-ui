<script setup lang="ts">
/**
 * Demo: sn-form — form button shapes: submit form / reset form.
 *
 * Submit shape: the button calls formRef.submit(), the form validates first
 * and reports back through `@submit`.
 * Reset shape: the button calls formRef.resetFields(), restoring the values
 * captured when the fields mounted.
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
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email address' },
  ],
};

function runSubmit(): void {
  submitRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  submitResult.value = payload.valid
    ? `Submitted: ${submitForm.email}`
    : 'Blocked — a field failed validation';
}

const resetForm = reactive({ nickname: 'Mia', city: 'Hangzhou' });
const resetRef = ref<InstanceType<typeof SnForm> | null>(null);
const resetCount = ref(0);

function runReset(): void {
  resetRef.value?.resetFields();
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">Submit form</text>
      <SnForm ref="submitRef" :model="submitForm" :rules="submitRules" @submit="onSubmit">
        <SnFormItem prop="email" label="Email" required>
          <SnInput
            v-model="submitForm.email"
            type="email"
            placeholder="you@example.com"
            clearable
          />
        </SnFormItem>
        <SnFormItem prop="contact" label="Contact">
          <SnInput v-model="submitForm.contact" placeholder="Phone or chat handle" clearable />
        </SnFormItem>
        <SnButton type="primary" block @click="runSubmit">Submit</SnButton>
      </SnForm>
      <text class="sn-demo__meta">{{ submitResult || 'not submitted yet' }}</text>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">Reset form</text>
      <SnForm ref="resetRef" :model="resetForm" @reset="resetCount += 1">
        <SnFormItem prop="nickname" label="Nickname">
          <SnInput v-model="resetForm.nickname" placeholder="Enter a nickname" clearable />
        </SnFormItem>
        <SnFormItem prop="city" label="City">
          <SnInput v-model="resetForm.city" placeholder="Enter a city" clearable />
        </SnFormItem>
        <SnButton block @click="runReset">Reset to initial values</SnButton>
      </SnForm>
      <text class="sn-demo__meta">
        Resets: {{ resetCount }} | Current: {{ resetForm.nickname }} / {{ resetForm.city }}
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
