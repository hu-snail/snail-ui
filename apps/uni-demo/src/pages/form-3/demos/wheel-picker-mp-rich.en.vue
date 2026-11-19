<script setup lang="ts">
/** Demo: sn-wheel-picker — content customization: the `#option` slot renders title + subtitle two-line rows. */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const cities = [
  { value: 'hz', label: 'Hangzhou', code: 'ZHS · 0571' },
  { value: 'sh', label: 'Shanghai', code: 'SHA · 021' },
  { value: 'sz', label: 'Shenzhen', code: 'SZX · 0755' },
  { value: 'cd', label: 'Chengdu', code: 'CTU · 028' },
  { value: 'wh', label: 'Wuhan', code: 'WUH · 027' },
];
const value = ref<Array<string | number>>(['sz']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnWheelPicker v-model="value" :columns="[cities]" :visible-item-count="5" :item-height="52">
      <template #option="{ option, active }">
        <view class="rich-row">
          <text class="rich-row__title" :class="{ 'rich-row__title--active': active }">
            {{ option.label }}
          </text>
          <text class="rich-row__code" :class="{ 'rich-row__code--active': active }">
            {{ String(option.raw.code) }}
          </text>
        </view>
      </template>
    </SnWheelPicker>
    <text class="sn-demo__meta">Selected: {{ value[0] }} (title + subtitle, raw carries business fields)</text>
  </view>
</template>

<style scoped>
.rich-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.rich-row__title {
  font-size: 30rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}

.rich-row__title--active {
  color: var(--sn-mp-color-action-primary);
}

.rich-row__code {
  margin-left: 16rpx;
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.rich-row__code--active {
  color: var(--sn-mp-color-action-primary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>