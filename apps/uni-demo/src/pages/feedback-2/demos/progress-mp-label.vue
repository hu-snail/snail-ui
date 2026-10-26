<script setup lang="ts">
/**
 * Demo: sn-progress (uni-end) — percentPosition inner / outer + align + duration.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-progress from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';

const value = ref(20);

function step(): void {
  value.value = value.value >= 100 ? 0 : Math.min(100, value.value + 20);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnProgress :percentage="60" :percent-position="{ type: 'outer', align: 'left' }" />
    <SnProgress :percentage="60" :percent-position="{ type: 'outer', align: 'center' }" />
    <SnProgress :percentage="60" :percent-position="{ type: 'inner', align: 'right' }" />
    <SnProgress :percentage="60" :percent-position="{ type: 'inner', align: 'center' }" />

    <SnButton type="primary" block @click="step">duration 动画：+20%</SnButton>
    <SnProgress :percentage="value" :duration="60" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
