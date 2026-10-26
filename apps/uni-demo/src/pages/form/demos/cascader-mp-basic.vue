<script setup lang="ts">
/** Demo: sn-cascader — 静态模式：逐级 tap 下钻，点中叶子即确认并关闭。 */
import { ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';

const tree = [
  {
    value: 'zj',
    text: '浙江',
    children: [
      { value: 'hz', text: '杭州' },
      { value: 'nb', text: '宁波' },
    ],
  },
  { value: 'js', text: '江苏', children: [{ value: 'nj', text: '南京' }] },
];
const value = ref<string | number>('hz');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择地区</view>
    <text class="sn-demo__meta">已选：{{ value || '（未选择）' }}</text>
    <SnCascader v-model="value" v-model:visible="open" :options="tree" title="选择地区" />
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
