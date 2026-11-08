<script setup lang="ts">
/**
 * Demo: sn-form — form-level configuration: titleWidth / layout / center / schema.
 *
 * `titleWidth` shares one inheritance chain with `labelWidth` (titleWidth wins);
 * `layout` takes horizontal / vertical for label-vs-control placement; `center`
 * vertically centers the control column inside each row; `schema` describes the
 * fields and is stored on the form context, while validation still runs on
 * `rules`.
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const titleForm = reactive({ name: '', phone: '' });
const verticalForm = reactive({ name: '', phone: '' });
const centerForm = reactive({ name: '', phone: '' });
const schemaForm = reactive({ name: '', phone: '' });

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: 'Name is required' }],
  phone: [{ pattern: /^1\d{10}$/, message: 'Enter an 11-digit phone number' }],
};

/** Form-level schema: field name + label + required flag, stored on the context. */
const schema = {
  name: { label: 'Name', required: true },
  phone: { label: 'Phone', required: false },
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">titleWidth=160 (label column width)</text>
      <SnForm :model="titleForm" :rules="rules" :title-width="160">
        <SnFormItem prop="name" label="Name">
          <SnInput v-model="titleForm.name" placeholder="Enter a name" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="Phone">
          <SnInput
            v-model="titleForm.phone"
            type="number"
            placeholder="Enter a phone number"
            clearable
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">layout="vertical" (label above the control)</text>
      <SnForm :model="verticalForm" :rules="rules" layout="vertical" :title-width="200">
        <SnFormItem prop="name" label="Name">
          <SnInput v-model="verticalForm.name" placeholder="Enter a name" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="Phone">
          <SnInput
            v-model="verticalForm.phone"
            type="number"
            placeholder="Enter a phone number"
            clearable
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">center (vertically centered control column)</text>
      <SnForm :model="centerForm" center :title-width="160">
        <SnFormItem
          prop="name"
          label="Name"
          description="The description takes a row, so centering shows"
        >
          <SnInput v-model="centerForm.name" placeholder="Enter a name" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="Phone">
          <SnInput
            v-model="centerForm.phone"
            type="number"
            placeholder="Enter a phone number"
            clearable
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">schema (form-level validation description)</text>
      <SnForm :model="schemaForm" :rules="rules" :schema="schema" :title-width="160">
        <SnFormItem prop="name" label="Name">
          <SnInput v-model="schemaForm.name" placeholder="Enter a name" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="Phone">
          <SnInput
            v-model="schemaForm.phone"
            type="number"
            placeholder="Enter a phone number"
            clearable
          />
        </SnFormItem>
      </SnForm>
      <text class="sn-demo__meta"
        >schema lands on the context and does not validate; messages come from rules</text
      >
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
