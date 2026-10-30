<script setup lang="ts">
/**
 * Demo: sn-form-item — label 内联图标：iconName 走 sn-icon 注册表，
 * iconData 直接传入冻结的 SVG 数据，iconSize 控制图标尺寸。
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Bell, Settings, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ Settings, Bell, User });

/** 内联图标数据：viewBox + path 列表，冻结后按 props 对象传递。 */
const AlertIcon = Object.freeze({
  viewBox: '0 0 24 24',
  paths: [
    'M12 9v4',
    'M12 17h.01',
    'M10.29 3.86 L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3 L13.71 3.86a2 2 0 0 0-3.42 0z',
  ],
});

const form = reactive({ username: '', phone: '', topic: '', notice: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="form" label-position="left" label-width="200">
      <SnFormItem prop="username" label="账号" icon-name="User">
        <SnInput v-model="form.username" placeholder="请输入账号，如 @aui_dev" clearable />
      </SnFormItem>

      <SnFormItem prop="phone" label="手机号" icon-name="Bell" :icon-size="40">
        <SnInput
          v-model="form.phone"
          type="tel"
          placeholder="请输入用于接收通知的手机号"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="topic" label="主题" icon-name="Settings">
        <SnInput v-model="form.topic" placeholder="请输入主题名称" clearable />
      </SnFormItem>

      <SnFormItem prop="notice" label="备注" :icon-data="AlertIcon">
        <SnInput v-model="form.notice" placeholder="内联 iconData 图标，请输入备注" clearable />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__meta">
      前两行用 iconName 从注册表解析，iconSize 可单独放大；末行用 iconData 直接传入 SVG
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
