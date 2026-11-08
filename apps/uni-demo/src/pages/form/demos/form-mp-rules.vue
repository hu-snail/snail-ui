<script setup lang="ts">
/**
 * Demo: sn-form — FormRule 规则类型：required / type / pattern /
 * minLength+maxLength / min+max / validator / asyncValidator。
 * 每条规则失败时用自身的 message 作为提示，逐字段展示规则类型。
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
const log = ref('尚未校验');

const rules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: '请填写邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  handle: [
    { required: true, message: '请填写用户名' },
    { pattern: /^[a-z0-9_]+$/, message: '只能使用小写字母、数字与下划线' },
  ],
  password: [{ minLength: 8, maxLength: 20, message: '密码长度需在 8-20 位之间' }],
  age: [{ min: 18, max: 60, message: '年龄需在 18-60 之间' }],
  invite: [
    {
      validator: (value) => String(value).startsWith('AUI') || '邀请码需以 AUI 开头',
      message: '邀请码格式不正确',
    },
  ],
  nickname: [
    {
      asyncValidator: async (value) => value !== 'admin' || '该昵称已被占用',
      message: '昵称不可用',
    },
  ],
};

async function runValidate(): Promise<void> {
  const ok = await formRef.value?.validate();
  log.value = ok === true ? '全部字段通过' : '存在未通过字段，提示见各字段下方';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules">
      <SnFormItem prop="email" label="邮箱" description="required + type" required>
        <SnInput v-model="form.email" type="email" placeholder="请输入邮箱" clearable />
      </SnFormItem>

      <SnFormItem prop="handle" label="用户名" description="required + pattern" required>
        <SnInput
          v-model="form.handle"
          placeholder="小写字母 / 数字 / 下划线，如 aui_dev"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="password" label="密码" description="minLength + maxLength">
        <SnInput
          v-model="form.password"
          type="password"
          placeholder="请输入 8-20 位密码"
          show-password
        />
      </SnFormItem>

      <SnFormItem prop="age" label="年龄" description="min + max">
        <SnInput v-model="form.age" type="digit" placeholder="请输入 18-60 之间的年龄" clearable />
      </SnFormItem>

      <SnFormItem prop="invite" label="邀请码" description="validator">
        <SnInput v-model="form.invite" placeholder="请输入以 AUI 开头的邀请码" clearable />
      </SnFormItem>

      <SnFormItem
        prop="nickname"
        label="昵称"
        description="asyncValidator（输入 admin 可看到占用提示）"
      >
        <SnInput v-model="form.nickname" placeholder="请输入昵称，如 admin / mia" clearable />
      </SnFormItem>

      <SnButton type="primary" block @click="runValidate">校验全部规则</SnButton>
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
