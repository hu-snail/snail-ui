<script setup lang="ts">
/** Demo: sn-input-number — 数字滚动动画（animation）：每次提交值变化时字段数字向上/向下翻动。 */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const rolled = ref(10);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">animation（增加向上翻，减少向下翻）</text>
    <SnInputNumber v-model="rolled" :min="0" :max="20" animation />
    <text class="sn-demo__meta">当前值：{{ rolled }}</text>
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
