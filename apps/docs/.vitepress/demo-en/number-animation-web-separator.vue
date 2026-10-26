<script setup lang="ts">
/** Demo: SnNumberAnimation — show-separator renders thousands separators. */
import { ref } from 'vue';
import { SnButton, SnNumberAnimation, SnStatistic } from '@snui/vue-web';

const animationRef = ref<{ play: () => void } | null>(null);

function handlePlay(): void {
  animationRef.value?.play();
}
</script>

<template>
  <div class="number-animation-demo">
    <SnStatistic label="A small goal" tabular-nums>
      <SnNumberAnimation
        ref="animationRef"
        show-separator
        :from="0"
        :to="100000000"
        :active="false"
      />
    </SnStatistic>
    <SnButton @click="handlePlay">Play</SnButton>
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
