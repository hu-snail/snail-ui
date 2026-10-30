<script setup lang="ts">
/**
 * Demo: sn-form — form-wide disabled: the flag cascades into every FormItem,
 * the fields turn read-only and the submit button is disabled too, while the
 * field values stay unchanged.
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({ email: 'mia@example.com', password: 'secret123', city: 'Hangzhou' });
const disabled = ref(true);
const submitted = ref('');

const rules: Record<string, FormRule[]> = {
  email: [{ type: 'email', message: 'Invalid email address' }],
};

function toggle(): void {
  disabled.value = !disabled.value;
}

function handleSubmit(): void {
  submitted.value = JSON.stringify(form);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton :type="disabled ? 'primary' : 'default'" block @click="toggle">
      {{ disabled ? 'Enable the form' : 'Disable the form' }}
    </SnButton>

    <SnForm
      :model="form"
      :rules="rules"
      :disabled="disabled"
      label-position="left"
      label-width="200"
    >
      <SnFormItem prop="email" label="Email" required>
        <SnInput v-model="form.email" type="email" placeholder="Enter an email" clearable />
      </SnFormItem>
      <SnFormItem prop="password" label="Password">
        <SnInput
          v-model="form.password"
          type="password"
          placeholder="Enter a password"
          show-password
        />
      </SnFormItem>
      <SnFormItem prop="city" label="City">
        <SnInput v-model="form.city" placeholder="Enter your city" clearable />
      </SnFormItem>
      <SnButton type="primary" block :disabled="disabled" @click="handleSubmit">Submit</SnButton>
    </SnForm>

    <text class="sn-demo__meta">
      {{
        disabled
          ? 'Form disabled: fields are read-only, the submit button is inert'
          : 'Form enabled'
      }}
      | Result: {{ submitted || 'not submitted yet' }}
    </text>
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
