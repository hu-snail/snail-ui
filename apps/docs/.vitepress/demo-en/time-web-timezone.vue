<script setup lang="ts">
/** Demo: SnTime — the same instant formatted in different IANA time zones. */
import { SnTime } from '@snui/vue-web'
</script>

<template>
  <div class="time-demo">
    <span>Shanghai <SnTime :time-zone="'Asia/Shanghai'" /></span>
    <span>Pittsburgh <SnTime :time-zone="'America/New_York'" /></span>
    <span>UTC <SnTime :time-zone="'UTC'" /></span>
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
