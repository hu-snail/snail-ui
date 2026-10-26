<script setup lang="ts">
/** Demo: SnCountdown — basic seconds countdown toggled by active. */
import { ref } from 'vue';
import { SnCountdown, SnSwitch } from '@snui/vue-web';

const active = ref(false);
</script>

<template>
  <div class="countdown-demo">
    <span class="countdown-value">
      <SnCountdown :duration="5000" :active="active" />
    </span>
    <SnSwitch v-model="active" />
  </div>
</template>

<style scoped>
.countdown-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.countdown-value {
  font-variant-numeric: tabular-nums;
}
</style>
