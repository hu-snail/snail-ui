<script setup lang="ts">
/** Demo: SnTime — custom format strings (date-fns token subset). */
import { SnTime } from '@snui/vue-web';
</script>

<template>
  <div class="time-demo">
    <SnTime :time="0" format="yyyy-MM-dd" />
    <SnTime :time="0" format="yyyy-MM-dd hh:mm" />
    <SnTime :time="0" format="yyyy-MM-dd hh:mm:ss" />
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
