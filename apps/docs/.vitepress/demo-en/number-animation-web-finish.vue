<script setup lang="ts">
/** Demo: SnNumberAnimation — finish event fires when the tween reaches `to`. */
import { ref } from 'vue';
import { SnButton, SnNumberAnimation, SnStatistic } from '@snui/vue-web';

const animationRef = ref<{ play: () => void } | null>(null);
const finished = ref(false);

function handlePlay(): void {
  finished.value = false;
  animationRef.value?.play();
}

function handleFinish(): void {
  finished.value = true;
}
</script>

<template>
  <div class="number-animation-demo">
    <SnStatistic label="Send a message when done" tabular-nums>
      <SnNumberAnimation
        ref="animationRef"
        show-separator
        :from="0"
        :to="100000000"
        :active="false"
        @finish="handleFinish"
      />
    </SnStatistic>
    <SnButton @click="handlePlay">Start</SnButton>
    <span v-if="finished" class="finish-note">Credited</span>
  </div>
</template>

<style scoped>
.number-animation-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.finish-note {
  font-size: 13px;
  color: var(--sn-web-color-feedback-success);
}
</style>
