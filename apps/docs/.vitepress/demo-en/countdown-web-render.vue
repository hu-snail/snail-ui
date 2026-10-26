<script setup lang="ts">
/** Demo: SnCountdown — custom render prop over the remaining time info. */
import { ref } from 'vue'
import { SnCountdown, SnStatistic, SnSwitch } from '@snui/vue-web'

const active = ref(false)

function renderCountdown(info: { hours: number; minutes: number; seconds: number }): string {
  return `${String(info.hours).padStart(2, '0')}h ${String(info.minutes).padStart(2, '0')}m ${String(info.seconds).padStart(2, '0')}s remaining`
}
</script>

<template>
  <div class="countdown-render">
    <SnStatistic label="Custom render" tabular-nums>
      <SnCountdown :render="renderCountdown" :duration="996 * 1000" :active="active" />
    </SnStatistic>
    <SnSwitch v-model="active" />
  </div>
</template>

<style scoped>
.countdown-render {
  display: flex;
  align-items: center;
  gap: 24px;
}
</style>
