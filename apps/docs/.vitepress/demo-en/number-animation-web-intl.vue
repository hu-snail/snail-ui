<script setup lang="ts">
/** Demo: SnNumberAnimation — locale drives decimal marks / separators (Intl). */
import { ref } from 'vue'
import { SnButton, SnNumberAnimation, SnStatistic } from '@snui/vue-web'

const animationRef = ref<{ play: () => void } | null>(null)

function handlePlay(): void {
  animationRef.value?.play()
}
</script>

<template>
  <div class="number-animation-demo">
    <SnStatistic label="Russian uses a comma as the decimal mark" tabular-nums>
      <SnNumberAnimation
        ref="animationRef"
        :from="0"
        :to="699700.699"
        :active="false"
        :precision="3"
        locale="ru-RU"
        show-separator
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
