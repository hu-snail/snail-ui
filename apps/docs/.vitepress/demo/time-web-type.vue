<script setup lang="ts">
/** Demo: SnTime — type="date" / type="datetime". */
import { SnTime } from '@snui/vue-web';
</script>

<template>
  <div class="time-demo">
    <SnTime :time="0" type="date" />
    <SnTime :time="new Date(0)" type="datetime" />
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
