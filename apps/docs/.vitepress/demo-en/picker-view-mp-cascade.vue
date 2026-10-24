<script setup lang="ts">
/** Demo: sn-picker-view — With `cascade`, `columns` is a tree and the following columns are derived from the path; `disabled` freezes every column. */
import { ref } from 'vue'
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue'

const fruits = ['Apple', 'Banana', 'Cherry']
const tree = [
  { value: 'zj', label: 'Zhejiang', children: [{ value: 'hz', label: 'Hangzhou' }, { value: 'nb', label: 'Ningbo' }] },
  { value: 'js', label: 'Jiangsu', children: [{ value: 'nj', label: 'Nanjing' }] },
]
const region = ref<Array<string | number>>(['zj', 'hz'])
const locked = ref<Array<string | number>>(['Banana'])
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView v-model="region" :columns="tree" cascade />
    <text class="sn-demo__meta">Selected: {{ region.join(' / ') }}</text>
    <SnPickerView v-model="locked" :columns="[fruits]" disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
