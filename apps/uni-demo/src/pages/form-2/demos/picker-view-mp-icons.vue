<script setup lang="ts">
/** Demo: sn-picker-view — wheel 风格 + `#option` 插槽：图标选项列表，选中行图标与文字转主题色。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Wallet, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import type { NormalizedPickerOption } from '@snui/uni-src/components/sn-picker-view/sn-picker-view-types';

const choices = [
  { value: 'notification', label: 'Notification' },
  { value: 'payment', label: 'Payment' },
  { value: 'personal', label: 'Personal' },
];
const icons: Record<string, unknown> = { notification: Bell, payment: Wallet, personal: User };
const value = ref<Array<string | number>>(['notification']);

const iconOf = (option: NormalizedPickerOption): unknown => icons[String(option.value)];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView
      v-model="value"
      :columns="[choices]"
      wheel
      vibrate-short
      :visible-item-count="3"
      :item-height="52"
    >
      <template #option="{ option, active }">
        <view class="icon-row" :class="{ 'icon-row--active': active }">
          <view class="icon-box" :class="{ 'icon-box--active': active }">
            <SnIcon :data="iconOf(option)" :size="28" />
          </view>
          <text class="icon-row__label">{{ option.label }}</text>
        </view>
      </template>
    </SnPickerView>
    <text class="sn-demo__meta">已选：{{ value[0] }}（#option 插槽渲染图标行，滑动有轻震）</text>
  </view>
</template>

<style scoped>
.icon-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.icon-row__label {
  margin-left: 16rpx;
  font-size: 30rpx;
  color: var(--sn-mp-color-text-secondary);
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border: 2rpx dashed transparent;
  border-radius: 14rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.icon-box--active {
  border-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-action-primary);
}

.icon-row--active .icon-row__label {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
