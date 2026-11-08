<script setup lang="ts">
/**
 * Demo: sn-form-item — 自定义插槽：label / default / description。
 *
 * label 插槽承载非纯文本的标签行；default 插槽里放的不是输入框，
 * 而是自定义的优先级点选控件；description 插槽提供自定义副文案。
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({ amount: '', priority: '' });
const formRef = ref<InstanceType<typeof SnForm> | null>(null);
const submitted = ref('');

const priorities = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];

const rules: Record<string, FormRule[]> = {
  amount: [
    { required: true, message: '请填写投保金额' },
    { pattern: /^\d+$/, message: '金额只能是整数' },
  ],
  priority: [{ required: true, message: '请选择优先级' }],
};

/** 自定义控件改动后主动重校验该字段，错误提示随即刷新。 */
async function pickPriority(value: string): Promise<void> {
  form.priority = value;
  await formRef.value?.validateField('priority');
}

async function handleSubmit(): Promise<void> {
  const ok = await formRef.value?.validate();
  submitted.value = ok === true ? JSON.stringify(form) : '校验未通过：金额或优先级未填写';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" label-width="200">
      <SnFormItem prop="amount" required>
        <template #label>
          <text class="sn-demo__label">投保金额</text>
          <text class="sn-demo__label-note">（元 / 整数）</text>
        </template>
        <SnInput
          v-model="form.amount"
          type="digit"
          align-right
          placeholder="请输入投保金额"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="priority" label="优先级" required>
        <template #description>点选一项，控件由 default 插槽自定义</template>
        <view class="sn-demo__chips">
          <view
            v-for="item in priorities"
            :key="item.value"
            class="sn-demo__chip"
            :class="{ 'sn-demo__chip--active': form.priority === item.value }"
            @tap="pickPriority(item.value)"
          >
            <text class="sn-demo__chip-text">{{ item.label }}</text>
          </view>
        </view>
      </SnFormItem>

      <SnButton type="primary" block @click="handleSubmit">提交</SnButton>
    </SnForm>

    <text class="sn-demo__meta">提交结果：{{ submitted || '尚未提交' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__label-note {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-demo__chips {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
}

.sn-demo__chip {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__chip--active {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary-soft);
}

.sn-demo__chip-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__chip--active .sn-demo__chip-text {
  color: var(--sn-mp-color-action-primary);
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
