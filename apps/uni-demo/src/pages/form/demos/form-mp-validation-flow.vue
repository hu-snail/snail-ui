<script setup lang="ts">
/**
 * Demo: sn-form — 校验时序：字段级规则先于表单级规则合并执行，
 * 异步规则执行期间可识别，最终结果由 @validate 回传错误表。
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
const log = ref('尚未校验');
const errors = ref('（无）');

/** 表单级规则：所有字段共享的约束。 */
const formRules: Record<string, FormRule[]> = {
  handle: [{ pattern: /^[a-z0-9_]+$/, message: '只能使用小写字母、数字与下划线（表单级）' }],
  email: [{ type: 'email', message: '邮箱格式不正确（表单级）' }],
};

/** 字段级规则：先于表单级规则执行。 */
const handleRules: FormRule[] = [
  { required: true, message: '请填写用户名（字段级先执行）' },
  {
    asyncValidator: async (value) => {
      checking.value = true;
      await sleep(600);
      checking.value = false;
      return value !== 'taken' || '该用户名已被占用（异步规则）';
    },
    message: '用户名不可用',
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runValidate(): Promise<void> {
  await formRef.value?.validate();
  log.value = '校验流程已结束（字段级 → 表单级 → 结果回传）';
}

function onValidate(payload: { valid: boolean; errors: Record<string, string> }): void {
  const keys = Object.keys(payload.errors);
  errors.value = keys.length === 0 ? '（无）' : JSON.stringify(payload.errors);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="formRules" @validate="onValidate">
      <SnFormItem prop="handle" label="用户名" :rules="handleRules" required>
        <SnInput v-model="form.handle" placeholder="输入 taken 可看到异步占用提示" clearable />
      </SnFormItem>
      <SnFormItem prop="email" label="邮箱">
        <SnInput v-model="form.email" type="email" placeholder="请输入邮箱" clearable />
      </SnFormItem>
      <SnButton type="primary" block :disabled="checking" @click="runValidate">
        {{ checking ? '异步校验中…' : '校验' }}
      </SnButton>
    </SnForm>

    <view class="sn-demo__panel">
      <text class="sn-demo__meta">{{ log }}</text>
      <text class="sn-demo__meta">@validate 回传 errors：{{ errors }}</text>
      <text class="sn-demo__meta"
        >字段级规则先跑（required → 异步占用），再跑表单级规则（pattern / type）</text
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
