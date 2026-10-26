<script setup lang="ts">
/** Demo: sn-segmented — outline 主题、对象选项与禁用。 */
import { ref } from 'vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';

const theme = ref('card');
const options = [
  { value: 'card', label: '卡片' },
  { value: 'outline', label: '轮廓' },
  { value: 'locked', label: '禁用', disabled: true },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSegmented v-model="theme" :options="options" theme="outline" />
    <SnSegmented :options="options" disabled />
    <text class="sn-demo__meta">theme=outline；对象选项；整体 disabled</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
