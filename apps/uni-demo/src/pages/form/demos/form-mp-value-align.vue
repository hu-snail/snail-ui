<script setup lang="ts">
/** Demo: sn-form — 值对齐（valueAlign）：valueAlign="right" 让数值列右对齐。 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const alignForm = reactive({ amount: '', quantity: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
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
