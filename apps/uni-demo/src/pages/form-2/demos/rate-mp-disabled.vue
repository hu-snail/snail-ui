<script setup lang="ts">
/** Demo: sn-rate — 禁用：disabled 图标变淡且点击无效。 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const locked = ref<number | null>(3);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnRate v-model="locked" disabled />
    <text class="sn-demo__meta">disabled：图标变淡且点击无效，当前 {{ locked }} 分</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
