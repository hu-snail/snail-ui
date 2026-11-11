<script setup lang="ts">
/** Demo: sn-select-picker — field mapping: valueKey / labelKey point the component at custom field names. */
import { ref } from 'vue';
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';

/** Options use id / name; valueKey / labelKey map them. */
const cities = [
  { id: 'sh', name: 'Shanghai' },
  { id: 'bj', name: 'Beijing' },
  { id: 'gz', name: 'Guangzhou' },
];

const mapped = ref<Array<string | number | boolean>>(['sh']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">valueKey="id" + labelKey="name"</text>
    <view class="sn-demo__button" @tap="open = true">Field mapping</view>
    <text class="sn-demo__meta">Selected: {{ mapped.join(' / ') || '(not selected)' }}</text>
    <SnSelectPicker
      v-model="mapped"
      v-model:visible="open"
      :columns="cities"
      value-key="id"
      label-key="name"
      title="Field mapping"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
