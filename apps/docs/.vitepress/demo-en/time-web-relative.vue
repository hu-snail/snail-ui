<script setup lang="ts">
/** Demo: SnTime — relative distance to a base time, built-in zh-CN wording. */
import { SnTime } from '@snui/vue-web';
</script>

<template>
  <div class="time-demo">
    <SnTime :time="0" :to="86400000" type="relative" />
    <SnTime :time="0" :to="864000000" type="relative" />
    <SnTime :time="0" :to="8640000000" type="relative" />
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
