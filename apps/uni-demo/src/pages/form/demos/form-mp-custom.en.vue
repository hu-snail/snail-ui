<script setup lang="ts">
/**
 * Demo: sn-form-item — custom slots: label / default / description.
 *
 * The label slot carries a label row that is not plain text; the default slot
 * holds a custom priority picker instead of an input; the description slot
 * supplies custom helper copy.
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({ amount: '', priority: '' });
const formRef = ref<InstanceType<typeof SnForm> | null>(null);
const submitted = ref('');

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const rules: Record<string, FormRule[]> = {
  amount: [
    { required: true, message: 'Amount is required' },
    { pattern: /^\d+$/, message: 'Digits only' },
  ],
  priority: [{ required: true, message: 'Pick a priority' }],
};

/** A custom control re-validates its own field so the message refreshes. */
async function pickPriority(value: string): Promise<void> {
  form.priority = value;
  await formRef.value?.validateField('priority');
}

async function handleSubmit(): Promise<void> {
  const ok = await formRef.value?.validate();
  submitted.value = ok === true ? JSON.stringify(form) : 'Validation failed: amount or priority';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" label-width="200">
      <SnFormItem prop="amount" required>
        <template #label>
          <text class="sn-demo__label">Amount</text>
          <text class="sn-demo__label-note">(integer)</text>
        </template>
        <SnInput
          v-model="form.amount"
          type="digit"
          align-right
          placeholder="Enter an amount"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="priority" label="Priority" required>
        <template #description>Pick one option — the control comes from the default slot</template>
        <view class="sn-demo__chips">
          <view
            v-for="item in priorities"
            :key="item.value"
            class="sn-demo__chip"
            :class="{ 'sn-demo__chip--active': form.priority === item.value }"
            @tap="pickPriority(item.value)"
          >
            <text class="sn-demo__chip-text">{{ item.label }}</text>
          </view>
        </view>
      </SnFormItem>

      <SnButton type="primary" block @click="handleSubmit">Submit</SnButton>
    </SnForm>

    <text class="sn-demo__meta">Result: {{ submitted || 'not submitted yet' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__label-note {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-demo__chips {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
}

.sn-demo__chip {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__chip--active {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary-soft);
}

.sn-demo__chip-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__chip--active .sn-demo__chip-text {
  color: var(--sn-mp-color-action-primary);
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
