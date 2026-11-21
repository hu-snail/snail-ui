<script setup lang="ts">
/** Demo: sn-search — 悬浮卡片搜索框：variant="card" + 相机入口 + 搜索按钮。 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const withCamera = ref('');
const noCamera = ref('组件库ui设计');
const lastAction = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">variant="card" + showCamera（相机入口）</text>
    <SnSearch
      v-model="withCamera"
      variant="card"
      show-camera
      placeholder="ui设计作品集"
      @search="lastAction = `搜索: ${$event}`"
      @camera="lastAction = '相机'"
    />
    <text class="sn-demo__meta">最近操作：{{ lastAction }}</text>

    <text class="sn-demo__title">variant="card"（无相机，仅分割线 + 搜索按钮）</text>
    <SnSearch
      v-model="noCamera"
      variant="card"
      placeholder="组件库ui设计"
      @search="lastAction = `搜索: ${$event}`"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
