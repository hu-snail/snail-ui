<script setup lang="ts">
/**
 * Demo: sn-form — label 位置与列宽：labelPosition 取 left / right / top，
 * labelWidth 控制左侧或右侧布局的标签列宽（top 布局不使用列宽）。
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
      <text class="sn-demo__title">labelPosition="right"（默认）+ labelWidth=160</text>
      <SnForm :model="rightForm" label-position="right" label-width="160">
        <SnFormItem prop="email" label="邮箱">
          <SnInput v-model="rightForm.email" type="email" placeholder="请输入邮箱" clearable />
        </SnFormItem>
        <SnFormItem prop="password" label="密码">
          <SnInput
            v-model="rightForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">labelPosition="left" + labelWidth=200</text>
      <SnForm :model="leftForm" label-position="left" label-width="200">
        <SnFormItem prop="email" label="邮箱">
          <SnInput v-model="leftForm.email" type="email" placeholder="请输入邮箱" clearable />
        </SnFormItem>
        <SnFormItem prop="password" label="密码">
          <SnInput
            v-model="leftForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </SnFormItem>
      </SnForm>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__title">labelPosition="top"（标签叠在控件上方）</text>
      <SnForm :model="topForm" label-position="top">
        <SnFormItem prop="email" label="邮箱">
          <SnInput v-model="topForm.email" type="email" placeholder="请输入邮箱" clearable />
        </SnFormItem>
        <SnFormItem prop="password" label="密码">
          <SnInput
            v-model="topForm.password"
            type="password"
            placeholder="请输入密码"
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
