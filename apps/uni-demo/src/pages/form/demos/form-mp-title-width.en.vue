<script setup lang="ts">
/** Demo: sn-form — label column width (titleWidth): shares one inheritance chain with labelWidth (titleWidth wins). */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const titleForm = reactive({ name: '', phone: '' });

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: 'Name is required' }],
  phone: [{ pattern: /^1\d{10}$/, message: 'Enter an 11-digit phone number' }],
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
</style>
