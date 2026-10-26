<script setup lang="ts">
/** Demo: SnNumberAnimation — basic tween inside SnStatistic, replay via play(). */
import { ref } from 'vue';
import { SnButton, SnNumberAnimation, SnStatistic } from '@snui/vue-web';

const animationRef = ref<{ play: () => void } | null>(null);

function handlePlay(): void {
  animationRef.value?.play();
}
</script>

<template>
  <div class="number-animation-demo">
    <SnStatistic label="你一共处理了" tabular-nums>
      <SnNumberAnimation ref="animationRef" :from="0" :to="12039" />
      <template #suffix>条群消息</template>
    </SnStatistic>
    <SnButton @click="handlePlay">播放</SnButton>
  </div>
</template>

<style scoped>
.number-animation-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
</style>
