<script setup lang="ts">
/** Demo: sn-picker — field mapping: valueKey / labelKey / childrenKey point the component at custom field names. */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

/** Custom key names — id / name / sub, mapped through the *-key props. */
const tree = [
  {
    id: 'zj',
    name: 'Zhejiang',
    sub: [
      { id: 'hz', name: 'Hangzhou' },
      { id: 'nb', name: 'Ningbo' },
    ],
  },
  {
    id: 'js',
    name: 'Jiangsu',
    sub: [{ id: 'nj', name: 'Nanjing' }],
  },
];

const region = ref<Array<string | number>>(['zj', 'hz']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">valueKey="id" / labelKey="name" / childrenKey="sub"</text>
    <view class="sn-demo__button" @tap="open = true">Pick a region</view>
    <text class="sn-demo__meta">Selected: {{ region.join(' / ') || '(not selected)' }}</text>
    <SnPicker
      v-model="region"
      v-model:visible="open"
      :columns="tree"
      cascade
      value-key="id"
      label-key="name"
      children-key="sub"
      title="Pick a region"
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
