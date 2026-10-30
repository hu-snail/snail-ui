<script setup lang="ts">
/**
 * Demo: sn-form — 表单级默认：size / valueAlign / asteriskPosition / hideAsterisk
 * 四条配置在表单上一次设定，被所有 FormItem 继承。
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const defaultForm = reactive({ email: '', nickname: '' });
const smallForm = reactive({ email: '', nickname: '' });
const alignForm = reactive({ amount: '', quantity: '' });
const asteriskForm = reactive({ email: '', nickname: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__grid">
      <view class="sn-demo__panel">
        <text class="sn-demo__title">默认（medium，星号在左）</text>
        <SnForm :model="defaultForm">
          <SnFormItem prop="email" label="邮箱" required>
            <SnInput v-model="defaultForm.email" placeholder="请输入邮箱" clearable />
          </SnFormItem>
          <SnFormItem prop="nickname" label="昵称" required>
            <SnInput v-model="defaultForm.nickname" placeholder="请输入昵称" clearable />
          </SnFormItem>
        </SnForm>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">size="small"</text>
        <SnForm :model="smallForm" size="small">
          <SnFormItem prop="email" label="邮箱" required>
            <SnInput v-model="smallForm.email" size="small" placeholder="请输入邮箱" clearable />
          </SnFormItem>
          <SnFormItem prop="nickname" label="昵称" required>
            <SnInput v-model="smallForm.nickname" size="small" placeholder="请输入昵称" clearable />
          </SnFormItem>
        </SnForm>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">valueAlign="right"（数值右对齐）</text>
        <SnForm :model="alignForm" value-align="right">
          <SnFormItem prop="amount" label="金额" required>
            <SnInput
              v-model="alignForm.amount"
              type="digit"
              align-right
              placeholder="请输入金额"
              clearable
            />
          </SnFormItem>
          <SnFormItem prop="quantity" label="数量" required>
            <SnInput
              v-model="alignForm.quantity"
              type="digit"
              align-right
              placeholder="请输入数量"
              clearable
            />
          </SnFormItem>
        </SnForm>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">asteriskPosition="right" + hideAsterisk</text>
        <SnForm :model="asteriskForm" asterisk-position="right" hide-asterisk>
          <SnFormItem prop="email" label="邮箱" required>
            <SnInput v-model="asteriskForm.email" placeholder="请输入邮箱" clearable />
          </SnFormItem>
          <SnFormItem prop="nickname" label="昵称" required>
            <SnInput v-model="asteriskForm.nickname" placeholder="请输入昵称" clearable />
          </SnFormItem>
        </SnForm>
      </view>
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

.sn-demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400rpx, 1fr));
  gap: var(--sn-mp-spacing-5);
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
