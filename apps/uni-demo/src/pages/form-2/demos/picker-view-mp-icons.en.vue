<script setup lang="ts">
/** Demo: sn-picker-view — wheel style + `#option` slot: icon rows, active row gets a dashed icon frame.
 *
 * Icons use the builtin iconfont `name` path (native font rendering,
 * reliable on mp-weixin); the `data` path (SVG data URL + `<image>`) does
 * not render on WeChat mini-programs. */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import type { NormalizedPickerOption } from '@snui/uni-src/components/sn-picker-view/sn-picker-view-types';

const choices = [
  { value: 'notification', label: 'Notification' },
  { value: 'payment', label: 'Payment' },
  { value: 'personal', label: 'Personal' },
];
const iconNames: Record<string, string> = {
  notification: 'bell',
  payment: 'wallet',
  personal: 'user',
};
const value = ref<Array<string | number>>(['notification']);

const iconNameOf = (option: NormalizedPickerOption): string =>
  iconNames[String(option.value)] ?? 'bell';
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
            <SnIcon :name="iconNameOf(option)" :size="28" />
          </view>
          <text class="icon-row__label">{{ option.label }}</text>
        </view>
      </template>
    </SnPickerView>
    <text class="sn-demo__meta">Selected: {{ value[0] }} (#option slot renders icon rows, slide haptic on)</text>
  </view>
</template>

<style scoped>
.icon-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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
