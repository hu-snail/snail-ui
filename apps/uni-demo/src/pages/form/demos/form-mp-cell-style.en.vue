<script setup lang="ts">
/**
 * Demo: sn-form — form-level defaults: `size` / `valueAlign` /
 * `asteriskPosition` / `hideAsterisk` set once on the form and inherited by
 * every FormItem.
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
        <text class="sn-demo__title">Default (medium, asterisk on the left)</text>
        <SnForm :model="defaultForm">
          <SnFormItem prop="email" label="Email" required>
            <SnInput v-model="defaultForm.email" placeholder="Enter an email" clearable />
          </SnFormItem>
          <SnFormItem prop="nickname" label="Nickname" required>
            <SnInput v-model="defaultForm.nickname" placeholder="Enter a nickname" clearable />
          </SnFormItem>
        </SnForm>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">size="small"</text>
        <SnForm :model="smallForm" size="small">
          <SnFormItem prop="email" label="Email" required>
            <SnInput
              v-model="smallForm.email"
              size="small"
              placeholder="Enter an email"
              clearable
            />
          </SnFormItem>
          <SnFormItem prop="nickname" label="Nickname" required>
            <SnInput
              v-model="smallForm.nickname"
              size="small"
              placeholder="Enter a nickname"
              clearable
            />
          </SnFormItem>
        </SnForm>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">valueAlign="right" (numeric fields)</text>
        <SnForm :model="alignForm" value-align="right">
          <SnFormItem prop="amount" label="Amount" required>
            <SnInput
              v-model="alignForm.amount"
              type="digit"
              align-right
              placeholder="Enter an amount"
              clearable
            />
          </SnFormItem>
          <SnFormItem prop="quantity" label="Quantity" required>
            <SnInput
              v-model="alignForm.quantity"
              type="digit"
              align-right
              placeholder="Enter a quantity"
              clearable
            />
          </SnFormItem>
        </SnForm>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">asteriskPosition="right" + hideAsterisk</text>
        <SnForm :model="asteriskForm" asterisk-position="right" hide-asterisk>
          <SnFormItem prop="email" label="Email" required>
            <SnInput v-model="asteriskForm.email" placeholder="Enter an email" clearable />
          </SnFormItem>
          <SnFormItem prop="nickname" label="Nickname" required>
            <SnInput v-model="asteriskForm.nickname" placeholder="Enter a nickname" clearable />
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
