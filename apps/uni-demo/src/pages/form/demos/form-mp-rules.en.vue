<script setup lang="ts">
/**
 * Demo: sn-form — the FormRule vocabulary: required / type / pattern /
 * minLength+maxLength / min+max / validator / asyncValidator.
 * The first failing rule contributes its own `message`; each row names its
 * rule kind.
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

type FormRef = InstanceType<typeof SnForm>;

const form = reactive({ email: '', handle: '', password: '', age: '', invite: '', nickname: '' });
const formRef = ref<FormRef | null>(null);
const log = ref('Not validated yet');

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email address' },
  ],
  handle: [
    { required: true, message: 'Handle is required' },
    { pattern: /^[a-z0-9_]+$/, message: 'Lowercase letters, digits and underscore only' },
  ],
  password: [{ minLength: 8, maxLength: 20, message: 'Use 8-20 characters' }],
  age: [{ min: 18, max: 60, message: 'Age must be between 18 and 60' }],
  invite: [
    {
      validator: (value) => String(value).startsWith('AUI') || 'Invite code must start with AUI',
      message: 'Invalid invite code',
    },
  ],
  nickname: [
    {
      asyncValidator: async (value) => value !== 'admin' || 'That nickname is taken',
      message: 'Nickname unavailable',
    },
  ],
};

async function runValidate(): Promise<void> {
  const ok = await formRef.value?.validate();
  log.value = ok === true ? 'Every field passed' : 'Some fields failed — see the messages below';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules">
      <SnFormItem prop="email" label="Email" description="required + type" required>
        <SnInput v-model="form.email" type="email" placeholder="Enter an email" clearable />
      </SnFormItem>

      <SnFormItem prop="handle" label="Handle" description="required + pattern" required>
        <SnInput
          v-model="form.handle"
          placeholder="lowercase / digits / underscore, e.g. aui_dev"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="password" label="Password" description="minLength + maxLength">
        <SnInput
          v-model="form.password"
          type="password"
          placeholder="8-20 characters"
          show-password
        />
      </SnFormItem>

      <SnFormItem prop="age" label="Age" description="min + max">
        <SnInput v-model="form.age" type="digit" placeholder="Age between 18 and 60" clearable />
      </SnFormItem>

      <SnFormItem prop="invite" label="Invite code" description="validator">
        <SnInput v-model="form.invite" placeholder="Code starting with AUI" clearable />
      </SnFormItem>

      <SnFormItem
        prop="nickname"
        label="Nickname"
        description="asyncValidator (type admin to see it fail)"
      >
        <SnInput v-model="form.nickname" placeholder="Nickname, e.g. admin / mia" clearable />
      </SnFormItem>

      <SnButton type="primary" block @click="runValidate">Validate all rules</SnButton>
    </SnForm>

    <text class="sn-demo__meta">{{ log }}</text>
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
