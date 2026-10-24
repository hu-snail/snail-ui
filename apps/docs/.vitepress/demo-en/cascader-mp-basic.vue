<script setup lang="ts">
/** Demo: sn-cascader — Static mode: drill level by level; tapping a leaf confirms and closes. */
import { ref } from 'vue'
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue'

const tree = [
  { value: 'zj', text: 'Zhejiang', children: [{ value: 'hz', text: 'Hangzhou' }, { value: 'nb', text: 'Ningbo' }] },
  { value: 'js', text: 'Jiangsu', children: [{ value: 'nj', text: 'Nanjing' }] },
]
const value = ref<string | number>('hz')
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Pick a region</view>
    <text class="sn-demo__meta">Selected: {{ value || '(none)' }}</text>
    <SnCascader v-model="value" v-model:visible="open" :options="tree" title="Pick a region" />
  </view>
</template>

<style scoped>
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
