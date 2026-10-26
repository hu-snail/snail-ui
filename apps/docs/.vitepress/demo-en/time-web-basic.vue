<script setup lang="ts">
/** Demo: SnTime — number / Date input, datetime by default. */
import { SnTime } from '@snui/vue-web';
</script>

<template>
  <div class="time-demo">
    <SnTime :time="0" />
    <SnTime :time="new Date(0)" />
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
