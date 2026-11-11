<script setup lang="ts">
/** Demo: SnProgress — line progress and the status colors. */
import { SnProgress } from '@snui/vue-web';
</script>

<template>
  <div class="progress-demo">
    <section class="progress-demo__block">
      <h4>基础 / 状态色</h4>
      <SnProgress :percentage="60" />
      <SnProgress :percentage="80" status="success" />
      <SnProgress :percentage="45" status="warning" />
      <SnProgress :percentage="30" status="error" />
      <SnProgress :percentage="70" status="info" />
    </section>
  </div>
</template>

<style scoped>
.progress-demo {
  display: grid;
  gap: 20px;
}
.progress-demo__block {
  display: grid;
  gap: 12px;
}
.progress-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
