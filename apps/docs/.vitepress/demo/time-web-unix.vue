<script setup lang="ts">
/** Demo: SnTime — unix timestamps (seconds) via the unix prop. */
import { SnTime } from '@snui/vue-web'
</script>

<template>
  <div class="time-demo">
    <SnTime :time="4320000000" :to="8640000000" />
    <SnTime :time="4320000" :to="8640000" unix />
    <SnTime :time="4320000000" format="yyyy-MM-dd hh:mm:ss" />
    <SnTime :time="4320000" format="yyyy-MM-dd hh:mm:ss" unix />
  </div>
</template>

<style scoped>
.time-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--sn-web-color-text-secondary);
}
</style>
