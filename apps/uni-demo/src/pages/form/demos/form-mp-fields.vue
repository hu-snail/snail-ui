<script setup lang="ts">
/**
 * Demo: sn-form — 字段类型组合：文本 / 数字 / 密码 / 多行 / 嵌套路径 /
 * 多选 / 开关，一个表单里跑完整校验。
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
  nickname: [{ required: true, message: '请填写昵称' }],
  age: [
    { required: true, message: '请填写年龄' },
    { min: 18, max: 60, message: '年龄需在 18-60 之间' },
  ],
  password: [
    { required: true, message: '请设置密码' },
    { minLength: 8, maxLength: 20, message: '密码需 8-20 位' },
  ],
  'profile.city': [{ required: true, message: '请填写常住城市' }],
  bio: [{ minLength: 0, maxLength: 60, message: '简介最多 60 个字' }],
  interests: [{ required: true, message: '请至少选择一项兴趣' }],
};

function handleSubmit(): void {
  formRef.value?.submit();
}

function onSubmit(payload: { valid: boolean }): void {
  submitted.value = payload.valid
    ? JSON.stringify(form)
    : '校验未通过：请补齐昵称 / 年龄 / 密码 / 城市 / 兴趣';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm ref="formRef" :model="form" :rules="rules" @submit="onSubmit">
      <SnFormItem prop="nickname" label="昵称" required>
        <SnInput v-model="form.nickname" placeholder="请输入昵称" clearable />
      </SnFormItem>

      <SnFormItem prop="age" label="年龄" required>
        <SnInput v-model="form.age" type="digit" placeholder="请输入 18-60 之间的年龄" clearable />
      </SnFormItem>

      <SnFormItem prop="password" label="密码" required>
        <SnInput
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入至少 8 位密码"
        />
      </SnFormItem>

      <SnFormItem prop="profile.city" label="常住城市" required>
        <SnInput v-model="form.profile.city" placeholder="请输入常住城市" clearable />
      </SnFormItem>

      <SnFormItem prop="bio" label="个人简介" description="最多 60 个字">
        <SnInput
          v-model="form.bio"
          type="textarea"
          :rows="3"
          :maxlength="60"
          show-count
          placeholder="一句话介绍自己，例如：前端工程师，喜欢徒步"
        />
      </SnFormItem>

      <SnFormItem prop="interests" label="兴趣" required>
        <SnCheckboxGroup v-model="form.interests">
          <SnCheckbox name="reading">阅读</SnCheckbox>
          <SnCheckbox name="music">音乐</SnCheckbox>
          <SnCheckbox name="sport">运动</SnCheckbox>
        </SnCheckboxGroup>
      </SnFormItem>

      <SnFormItem prop="notify" label="接收通知" center>
        <SnSwitch v-model="form.notify" />
      </SnFormItem>

      <SnButton type="primary" block @click="handleSubmit">校验并提交</SnButton>
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

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
