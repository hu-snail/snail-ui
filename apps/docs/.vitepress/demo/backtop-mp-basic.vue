<script setup lang="ts">
/** Demo: sn-backtop — 滚动超过阈值后显示。 */
import { ref } from 'vue'
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue'

const scrollTop = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__meta">当前滚动距离：{{ scrollTop }} px（阈值 300）</text>
    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="scrollTop = 0">滚到顶部</text>
      <text class="sn-demo__button" @tap="scrollTop = 600">滚到 600px</text>
    </view>
    <SnBacktop :scroll-top="scrollTop" text="顶部" />
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
.sn-demo__actions {
  display: flex;
  gap: 8px;
}
.sn-demo__button {
  padding: 6px 12px;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
