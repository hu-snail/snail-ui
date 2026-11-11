<script setup lang="ts">
/** Demo: sn-form — 表单 schema：字段名 + 标签 + 是否必填，随表单存入上下文；实际校验仍由 rules 执行。 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const schemaForm = reactive({ name: '', phone: '' });

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请填写姓名' }],
  phone: [{ pattern: /^1\d{10}$/, message: '请输入 11 位手机号' }],
};

/** 表单级 schema：字段名 + 标签 + 是否必填，随表单存入上下文。 */
const schema = {
  name: { label: '姓名', required: true },
  phone: { label: '手机号', required: false },
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">schema（表单级校验描述，随上下文下发）</text>
      <SnForm :model="schemaForm" :rules="rules" :schema="schema" :title-width="160">
        <SnFormItem prop="name" label="姓名">
          <SnInput v-model="schemaForm.name" placeholder="请输入姓名" clearable />
        </SnFormItem>
        <SnFormItem prop="phone" label="手机号">
          <SnInput v-model="schemaForm.phone" type="number" placeholder="请输入手机号" clearable />
        </SnFormItem>
      </SnForm>
      <text class="sn-demo__meta">schema 存进上下文，不参与校验；失败提示来自 rules</text>
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
