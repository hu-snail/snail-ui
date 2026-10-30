<script setup lang="ts">
/**
 * Demo: sn-form — submit interception: `@submit` reports `valid`, the handler
 * decides whether to let the data through.
 *
 * A failed validation keeps the data out (counted as blocked); fixing the
 * field and submitting again lets it pass.
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
    { required: true, message: 'Handle is required' },
    { minLength: 3, maxLength: 20, message: '3-20 characters' },
    { pattern: /^[a-z0-9_]+$/, message: 'Lowercase letters, digits and underscore only' },
  ],
};

function trySubmit(): void {
  attempts.value += 1;
  formRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  if (payload.valid) {
    passed.value += 1;
    lastSubmit.value = `Passed: submitted ${form.handle}`;
    return;
  }
  blocked.value += 1;
  lastSubmit.value = 'Blocked: validation failed, no data submitted';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @submit="onSubmit">
      <SnFormItem prop="handle" label="Handle" required>
        <SnInput v-model="form.handle" placeholder="3+ characters, e.g. aui_dev" clearable />
      </SnFormItem>
      <SnButton type="primary" block @click="trySubmit">Submit</SnButton>
    </SnForm>

    <view class="sn-demo__panel">
      <text class="sn-demo__row">Attempts: {{ attempts }}</text>
      <text class="sn-demo__row sn-demo__row--blocked">Blocked: {{ blocked }}</text>
      <text class="sn-demo__row sn-demo__row--passed">Passed: {{ passed }}</text>
      <text class="sn-demo__meta">{{ lastSubmit || 'Waiting for the first submit' }}</text>
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
