<script setup lang="ts">
/** Demo: sn-rate — sn-rate 基础评分：num 控制图标数量，tap 图标写回 v-model。 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const score = ref<number | null>(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate v-model="score" />
    <text class="sn-demo__meta">当前评分：{{ score ?? '未评分' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
