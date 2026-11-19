<script setup lang="ts">
/** Demo: sn-wheel-picker — content customization: the `#option` slot renders icon rows; the active row gets a dashed icon frame. */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const choices = [
  { value: 'notification', label: 'Notification' },
  { value: 'payment', label: 'Payment' },
  { value: 'personal', label: 'Personal' },
];
const iconGlyphs: Record<string, string> = {
  notification: "🔔",
  payment: "💳",
  personal: "👤",
};
const value = ref<Array<string | number>>(['notification']);

const iconGlyphOf = (option: { value: unknown }): string =>
  iconGlyphs[String(option.value)] ?? "🔔";
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <!-- #ifndef MP-WEIXIN -->
    <SnWheelPicker
      v-model="value"
      :columns="[choices]"
      :visible-item-count="3"
      :item-height="52"
    >
      <template #option="{ option, active }">
        <view class="icon-row">
          <view class="icon-box" :class="{ 'icon-box--active': active }">
            <text class="icon-glyph">{{ iconGlyphOf(option) }}</text>
          </view>
          <text class="icon-row__label" :class="{ 'icon-row__label--active': active }">
            {{ option.label }}
          </text>
        </view>
      </template>
    </SnWheelPicker>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <SnPickerView
      v-model="value"
      :columns="[choices]"
      wheel
      vibrate-short
      :visible-item-count="3"
      :item-height="52"
    >
      <template #option="{ option, active }">
        <view class="icon-row">
          <view class="icon-box" :class="{ 'icon-box--active': active }">
            <SnIcon :name="iconNameOf(option)" :size="28" />
          </view>
          <text class="icon-row__label" :class="{ 'icon-row__label--active': active }">
            {{ option.label }}
          </text>
        </view>
      </template>
    </SnPickerView>
    <!-- #endif -->
    <text class="sn-demo__meta">Selected: {{ value[0] }} (#option slot customizes row content)</text>
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

.icon-row__label--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.icon-glyph {
  font-size: 34rpx;
  line-height: 1;
  color: var(--sn-mp-color-text-tertiary);
}

.icon-row--active .icon-glyph {
  color: var(--sn-mp-color-action-primary);
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

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>