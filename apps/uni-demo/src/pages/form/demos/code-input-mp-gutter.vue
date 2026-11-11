<script setup lang="ts">
/** Demo: sn-code-input — 格子间距（gutter）：默认 gutter=8（16rpx 间距），gutter=0 回到贴合布局。 */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const spaced = ref('1234');
const flush = ref('1234');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCodeInput v-model="spaced" :length="4" :gutter="8" />
    <SnCodeInput v-model="flush" :length="4" :gutter="0" />
    <text class="sn-demo__meta">默认 gutter=8（16rpx 间距）；传 gutter=0 可回到贴合布局</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
