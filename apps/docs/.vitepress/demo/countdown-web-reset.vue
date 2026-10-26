<script setup lang="ts">
/** Demo: SnCountdown — reset() restarts the countdown; active pauses it. */
import { ref } from 'vue';
import { SnButton, SnCountdown, SnSwitch } from '@snui/vue-web';

const active = ref(true);
const countdownRef = ref<{ reset: () => void } | null>(null);

function handleReset(): void {
  countdownRef.value?.reset();
}
</script>

<template>
  <div class="countdown-reset">
    <span class="countdown-value">
      <SnCountdown ref="countdownRef" :duration="86400000" :active="active" />
    </span>
    <SnButton @click="handleReset">重置</SnButton>
    <SnSwitch v-model="active" />
  </div>
</template>

<style scoped>
.countdown-reset {
  display: flex;
  align-items: center;
  gap: 16px;
}

.countdown-value {
  font-variant-numeric: tabular-nums;
}
</style>
