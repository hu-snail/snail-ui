<script setup lang="ts">
/**
 * Demo: sn-form — validation flow: item-level rules run before the merged
 * form-level rules, async rules are observable while pending, and the final
 * result is reported through the `@validate` error map.
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

type FormRef = InstanceType<typeof SnForm>;

const form = reactive({ handle: '', email: '' });
const formRef = ref<FormRef | null>(null);
const checking = ref(false);
const log = ref('Not validated yet');
const errors = ref('(none)');

/** Form-level rules: constraints shared by every field. */
const formRules: Record<string, FormRule[]> = {
  handle: [
    { pattern: /^[a-z0-9_]+$/, message: 'Lowercase, digits and underscore only (form level)' },
  ],
  email: [{ type: 'email', message: 'Invalid email address (form level)' }],
};

/** Item-level rules: these run before the form-level ones. */
const handleRules: FormRule[] = [
  { required: true, message: 'Handle is required (item level runs first)' },
  {
    asyncValidator: async (value) => {
      checking.value = true;
      await sleep(600);
      checking.value = false;
      return value !== 'taken' || 'That handle is taken (async rule)';
    },
    message: 'Handle unavailable',
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runValidate(): Promise<void> {
  await formRef.value?.validate();
  log.value = 'Validation finished (item level → form level → result reported)';
}

function onValidate(payload: { valid: boolean; errors: Record<string, string> }): void {
  const keys = Object.keys(payload.errors);
  errors.value = keys.length === 0 ? '(none)' : JSON.stringify(payload.errors);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="formRules" @validate="onValidate">
      <SnFormItem prop="handle" label="Handle" :rules="handleRules" required>
        <SnInput
          v-model="form.handle"
          placeholder="Type taken to see the async rule fire"
          clearable
        />
      </SnFormItem>
      <SnFormItem prop="email" label="Email">
        <SnInput v-model="form.email" type="email" placeholder="Enter an email" clearable />
      </SnFormItem>
      <SnButton type="primary" block :disabled="checking" @click="runValidate">
        {{ checking ? 'Async rule running…' : 'Validate' }}
      </SnButton>
    </SnForm>

    <view class="sn-demo__panel">
      <text class="sn-demo__meta">{{ log }}</text>
      <text class="sn-demo__meta">@validate errors: {{ errors }}</text>
      <text class="sn-demo__meta">
        Item-level rules run first (required → async), then the form-level rules (pattern / type)
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
