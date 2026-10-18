<script setup lang="ts">
/** Demo: SnTime — the same instant formatted in different IANA time zones. */
import { SnTime } from '@snui/vue-web'
</script>

<template>
  <div class="time-demo">
    <span>上海 <SnTime :time-zone="'Asia/Shanghai'" /></span>
    <span>匹兹堡 <SnTime :time-zone="'America/New_York'" /></span>
    <span>UTC <SnTime :time-zone="'UTC'" /></span>
  </div>
</template>

<style scoped>
.time-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--sn-web-color-text-secondary);
}
</style>
