<script setup lang="ts">
/** Demo: SnNumberAnimation — show-separator renders thousands separators. */
import type { NumberAnimationInst } from '../../../../packages/vue-web/src/number-animation/SnNumberAnimation.vue'
import { ref } from 'vue'
import { SnButton, SnNumberAnimation, SnStatistic } from '@snui/vue-web'

const animationRef = ref<NumberAnimationInst | null>(null)

function handlePlay(): void {
  animationRef.value?.play()
}
</script>

<template>
  <div class="number-animation-demo">
    <SnStatistic label="一个小目标" tabular-nums>
      <SnNumberAnimation
        ref="animationRef"
        show-separator
        :from="0"
        :to="100000000"
        :active="false"
      />
    </SnStatistic>
    <SnButton @click="handlePlay">播放</SnButton>
  </div>
</template>

<style scoped>
.number-animation-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
