<script setup lang="ts">
/** Demo: SnNumberAnimation — precision keeps decimal digits while rolling. */
import { ref } from 'vue'
import { SnButton, SnNumberAnimation, SnStatistic } from '@snui/vue-web'

const animationRef = ref<{ play: () => void } | null>(null)

function handlePlay(): void {
  animationRef.value?.play()
}
</script>

<template>
  <div class="number-animation-demo">
    <SnStatistic label="Two decimals" tabular-nums>
      <SnNumberAnimation
        ref="animationRef"
        :from="0"
        :to="24"
        :active="false"
        :precision="2"
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
