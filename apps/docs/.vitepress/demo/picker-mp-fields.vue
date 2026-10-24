<script setup lang="ts">
/** Demo: sn-picker — 字段映射与按钮文案：valueKey / labelKey / childrenKey / cancelButtonText。 */
import { ref } from 'vue'
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue'

/** 自定义字段名：id / name / sub，靠 *-key 映射。 */
const tree = [
  {
    id: 'zj',
    name: '浙江',
    sub: [
      { id: 'hz', name: '杭州' },
      { id: 'nb', name: '宁波' },
    ],
  },
  {
    id: 'js',
    name: '江苏',
    sub: [{ id: 'nj', name: '南京' }],
  },
]

const region = ref<Array<string | number>>(['zj', 'hz'])
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">valueKey="id" / labelKey="name" / childrenKey="sub" + cancelButtonText</text>
    <view class="sn-demo__button" @tap="open = true">选择地区</view>
    <text class="sn-demo__meta">已选：{{ region.join(' / ') || '（未选择）' }}</text>
    <SnPicker
      v-model="region"
      v-model:visible="open"
      :columns="tree"
      cascade
      value-key="id"
      label-key="name"
      children-key="sub"
      title="选择地区"
      cancel-button-text="先不选"
      confirm-button-text="就它"
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
