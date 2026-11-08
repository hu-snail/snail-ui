<script setup lang="ts">
/**
 * Demo: sn-form — label position and column width: `labelPosition` takes
 * left / right / top, `labelWidth` sets the label column for the side layouts
 * (the top layout ignores it).
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const rightForm = reactive({ email: '', password: '' });
const leftForm = reactive({ email: '', password: '' });
const topForm = reactive({ email: '', password: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">labelPosition="right" (default) + labelWidth=160</text>
      <SnForm :model="rightForm" label-position="right" label-width="160">
        <SnFormItem prop="email" label="Email">
          <SnInput v-model="rightForm.email" type="email" placeholder="Enter an email" clearable />
        </SnFormItem>
        <SnFormItem prop="password" label="Password">
          <SnInput
            v-model="rightForm.password"
            type="password"
            placeholder="Enter a password"
            show-password
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">labelPosition="left" + labelWidth=200</text>
      <SnForm :model="leftForm" label-position="left" label-width="200">
        <SnFormItem prop="email" label="Email">
          <SnInput v-model="leftForm.email" type="email" placeholder="Enter an email" clearable />
        </SnFormItem>
        <SnFormItem prop="password" label="Password">
          <SnInput
            v-model="leftForm.password"
            type="password"
            placeholder="Enter a password"
            show-password
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">labelPosition="top" (label stacked above the control)</text>
      <SnForm :model="topForm" label-position="top">
        <SnFormItem prop="email" label="Email">
          <SnInput v-model="topForm.email" type="email" placeholder="Enter an email" clearable />
        </SnFormItem>
        <SnFormItem prop="password" label="Password">
          <SnInput
            v-model="topForm.password"
            type="password"
            placeholder="Enter a password"
            show-password
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
