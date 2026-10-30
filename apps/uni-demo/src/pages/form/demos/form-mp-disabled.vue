<script setup lang="ts">
/**
 * Demo: sn-form — 整体禁用：disabled 级联到每个 FormItem，
 * 字段只读、提交按钮一并禁用，字段值保持原样。
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const form = reactive({ email: 'mia@example.com', password: 'secret123', city: '杭州' });
const disabled = ref(true);
const submitted = ref('');

const rules: Record<string, FormRule[]> = {
  email: [{ type: 'email', message: '邮箱格式不正确' }],
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
      {{ disabled ? '启用表单' : '禁用表单' }}
    </SnButton>

    <SnForm
      :model="form"
      :rules="rules"
      :disabled="disabled"
      label-position="left"
      label-width="200"
    >
      <SnFormItem prop="email" label="邮箱" required>
        <SnInput v-model="form.email" type="email" placeholder="请输入邮箱" clearable />
      </SnFormItem>
      <SnFormItem prop="password" label="密码">
        <SnInput v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </SnFormItem>
      <SnFormItem prop="city" label="常住城市">
        <SnInput v-model="form.city" placeholder="请输入常住城市" clearable />
      </SnFormItem>
      <SnButton type="primary" block :disabled="disabled" @click="handleSubmit">提交</SnButton>
    </SnForm>

    <text class="sn-demo__meta">
      {{ disabled ? '整表禁用中：字段不可编辑、提交按钮不响应' : '表单可用' }}｜提交结果：{{
        submitted || '尚未提交'
      }}
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
