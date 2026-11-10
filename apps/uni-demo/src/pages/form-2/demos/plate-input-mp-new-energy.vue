<script setup lang="ts">
/** Demo: sn-plate-input — 新能源车牌：maxlength=8 渲染 8 格。 */
import { ref } from 'vue';
import SnPlateInput from '@snui/uni-src/components/sn-plate-input/sn-plate-input.vue';

const plate = ref('京AD12345');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPlateInput v-model="plate" :maxlength="8" title="新能源车牌" />
    <text class="sn-demo__meta">maxlength=8 为新能源车牌（8 格）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
