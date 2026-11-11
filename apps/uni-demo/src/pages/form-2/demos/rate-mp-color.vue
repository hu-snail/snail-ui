<script setup lang="ts">
/** Demo: sn-rate — 评分颜色：activeColor 支持逐图标数组。 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const colored = ref<number | null>(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate
      v-model="colored"
      :active-color="['var(--sn-mp-color-feedback-danger)', 'var(--sn-mp-color-feedback-warning)']"
    />
    <text class="sn-demo__meta">activeColor 传数组：逐图标配色（红 → 橙 → …）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
