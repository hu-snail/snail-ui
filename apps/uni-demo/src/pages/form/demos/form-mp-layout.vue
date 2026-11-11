<script setup lang="ts">
/** Demo: sn-form — 排布（layout / center）：layout="vertical" 标签叠在控件上方；center 让控件列垂直居中。 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const verticalForm = reactive({ name: '', phone: '' });
const centerForm = reactive({ name: '', phone: '' });

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请填写姓名' }],
  phone: [{ pattern: /^1\d{10}$/, message: '请输入 11 位手机号' }],
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">layout="vertical"（标签叠在控件上方）</text>
      <SnForm :model="verticalForm" :rules="rules" layout="vertical" :title-width="200">
        <SnFormItem prop="name" label="姓名">
          <SnInput v-model="verticalForm.name" placeholder="请输入姓名" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="手机号">
          <SnInput
            v-model="verticalForm.phone"
            type="number"
            placeholder="请输入手机号"
            clearable
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">center（控件列垂直居中：带描述的行更明显）</text>
      <SnForm :model="centerForm" :rules="rules" center :title-width="160">
        <SnFormItem prop="name" label="姓名" description="描述占一行，控件列与标签列垂直居中">
          <SnInput v-model="centerForm.name" placeholder="请输入姓名" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="手机号">
          <SnInput v-model="centerForm.phone" type="number" placeholder="请输入手机号" clearable />
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
