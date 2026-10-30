<script setup lang="ts">
/**
 * Demo: sn-form — field type matrix: text / number / password / textarea /
 * nested path / checkbox group / switch in one validated form.
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';
import type { SnCheckboxValue } from '@snui/uni-src/components/sn-checkbox/sn-checkbox-types';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({
  nickname: '',
  age: '',
  password: '',
  bio: '',
  profile: { city: '' },
  interests: [] as SnCheckboxValue[],
  notify: true,
});

const formRef = ref<InstanceType<typeof SnForm> | null>(null);
const submitted = ref('');

const rules: Record<string, FormRule[]> = {
  nickname: [{ required: true, message: 'Nickname is required' }],
  age: [
    { required: true, message: 'Age is required' },
    { min: 18, max: 60, message: 'Age must be between 18 and 60' },
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, maxLength: 20, message: '8-20 characters' },
  ],
  'profile.city': [{ required: true, message: 'City is required' }],
  bio: [{ minLength: 0, maxLength: 60, message: 'Keep the bio under 60 characters' }],
  interests: [{ required: true, message: 'Pick at least one interest' }],
};

function handleSubmit(): void {
  formRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  submitted.value = payload.valid
    ? JSON.stringify(form)
    : 'Validation failed: fill nickname / age / password / city / interests';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @submit="onSubmit">
      <SnFormItem prop="nickname" label="Nickname" required>
        <SnInput v-model="form.nickname" placeholder="Enter a nickname" clearable />
      </SnFormItem>

      <SnFormItem prop="age" label="Age" required>
        <SnInput
          v-model="form.age"
          type="digit"
          placeholder="Enter an age between 18 and 60"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="password" label="Password" required>
        <SnInput
          v-model="form.password"
          type="password"
          show-password
          placeholder="At least 8 characters"
        />
      </SnFormItem>

      <SnFormItem prop="profile.city" label="City" required>
        <SnInput v-model="form.profile.city" placeholder="Enter your current city" clearable />
      </SnFormItem>

      <SnFormItem prop="bio" label="Bio" description="Up to 60 characters">
        <SnInput
          v-model="form.bio"
          type="textarea"
          :rows="3"
          :maxlength="60"
          show-count
          placeholder="One line about yourself, e.g. frontend engineer who loves hiking"
        />
      </SnFormItem>

      <SnFormItem prop="interests" label="Interests" required>
        <SnCheckboxGroup v-model="form.interests">
          <SnCheckbox name="reading">Reading</SnCheckbox>
          <SnCheckbox name="music">Music</SnCheckbox>
          <SnCheckbox name="sport">Sports</SnCheckbox>
        </SnCheckboxGroup>
      </SnFormItem>

      <SnFormItem prop="notify" label="Notifications" center>
        <SnSwitch v-model="form.notify" />
      </SnFormItem>

      <SnButton type="primary" block @click="handleSubmit">Validate &amp; submit</SnButton>
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
