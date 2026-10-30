<script setup lang="ts">
/** Demo: sn-form — basic usage: model + v-model + validation on submit. */
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
  name: [{ required: true, message: 'Name is required' }],
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email address' },
  ],
  phone: [{ pattern: /^1\d{10}$/, message: 'Enter an 11-digit phone number' }],
};

/** The form validates every field, then reports back through `submit`. */
function handleSubmit(): void {
  formRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  submitted.value = payload.valid ? JSON.stringify(form) : 'Validation failed — check the fields';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @submit="onSubmit">
      <SnFormItem prop="name" label="Name" required>
        <SnInput v-model="form.name" placeholder="Enter your name" clearable />
      </SnFormItem>
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" placeholder="you@example.com" clearable />
      </SnFormItem>
      <SnFormItem prop="phone" label="Phone">
        <SnInput
          v-model="form.phone"
          type="number"
          :maxlength="11"
          placeholder="Enter an 11-digit phone number"
          clearable
        />
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

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
