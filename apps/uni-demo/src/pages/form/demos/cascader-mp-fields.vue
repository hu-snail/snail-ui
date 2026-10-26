<script setup lang="ts">
/** Demo: sn-cascader — 字段映射与提示文案：valueKey / textKey / childrenKey / tipKey。 */
import { ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';

/** 自定义字段名：id / name / items，靠 *-key 映射；tips 用 tipKey。 */
const tree = [
  {
    id: 'zj',
    name: '浙江',
    items: [
      { id: 'hz', name: '杭州', tips: '省会' },
      { id: 'nb', name: '宁波', tips: '港口' },
    ],
  },
  {
    id: 'js',
    name: '江苏',
    items: [{ id: 'nj', name: '南京', tips: '省会' }],
  },
];

const value = ref<string | number>('hz');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title"
      >valueKey="id" / textKey="name" / childrenKey="items" / tipKey="tips"</text
    >
    <view class="sn-demo__button" @tap="open = true">字段映射</view>
    <text class="sn-demo__meta">已选：{{ value || '（未选择）' }}</text>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      value-key="id"
      text-key="name"
      children-key="items"
      tip-key="tips"
      title="字段映射"
      check-strictly
      confirm-text="就它"
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
