<script setup lang="ts">
/** Demo: sn-cascader — field mapping and tips: valueKey / textKey / childrenKey / tipKey. */
import { ref } from 'vue'
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue'

/** Custom key names — id / name / items, mapped through the *-key props; tips come from tipKey. */
const tree = [
  {
    id: 'zj',
    name: 'Zhejiang',
    items: [
      { id: 'hz', name: 'Hangzhou', tips: 'Capital' },
      { id: 'nb', name: 'Ningbo', tips: 'Port' },
    ],
  },
  {
    id: 'js',
    name: 'Jiangsu',
    items: [{ id: 'nj', name: 'Nanjing', tips: 'Capital' }],
  },
]

const value = ref<string | number>('hz')
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">valueKey="id" / textKey="name" / childrenKey="items" / tipKey="tips"</text>
    <view class="sn-demo__button" @tap="open = true">Field mapping</view>
    <text class="sn-demo__meta">Selected: {{ value || '(not selected)' }}</text>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      value-key="id"
      text-key="name"
      children-key="items"
      tip-key="tips"
      title="Field mapping"
      check-strictly
      confirm-text="Use it"
      line-width="6"
      line-height="40"
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
