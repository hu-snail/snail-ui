<script setup lang="ts">
/** Demo: sn-rate — 只读：readonly 拦掉点击，仅展示评分。 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const readonly = ref<number | null>(4);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate v-model="readonly" readonly />
    <text class="sn-demo__meta">readonly：只读展示 {{ readonly }} 分，点击无效</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
