<script setup lang="ts">
/** Demo: sn-picker-view — cascade 模式下 columns 传树形结构，组件按已选路径推导后续列；disabled 整列不可交互。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const fruits = ['苹果', '香蕉', '樱桃'];
const tree = [
  {
    value: 'zj',
    label: '浙江',
    children: [
      { value: 'hz', label: '杭州' },
      { value: 'nb', label: '宁波' },
    ],
  },
  { value: 'js', label: '江苏', children: [{ value: 'nj', label: '南京' }] },
];
const region = ref<Array<string | number>>(['zj', 'hz']);
const locked = ref<Array<string | number>>(['香蕉']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView v-model="region" :columns="tree" cascade />
    <text class="sn-demo__meta">已选：{{ region.join(' / ') }}</text>
    <SnPickerView v-model="locked" :columns="[fruits]" disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
