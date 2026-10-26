<script setup lang="ts">
/** Demo: SnCountdown — precision 0 / 1 / 2 / 3. */
import { ref } from 'vue';
import { SnCountdown, SnSwitch } from '@snui/vue-web';

const active = ref(false);
</script>

<template>
  <div class="countdown-precision">
    <span class="countdown-value"><SnCountdown :duration="3600 * 1000" :active="active" /></span>
    <span class="countdown-value"
      ><SnCountdown :duration="3600 * 1000" :active="active" :precision="1"
    /></span>
    <span class="countdown-value"
      ><SnCountdown :duration="3600 * 1000" :active="active" :precision="2"
    /></span>
    <span class="countdown-value"
      ><SnCountdown :duration="3600 * 1000" :active="active" :precision="3"
    /></span>
    <SnSwitch v-model="active" />
  </div>
</template>

<style scoped>
.countdown-precision {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.countdown-value {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
