<script setup lang="ts">
/** Demo: SnProgress — line variants with indicator placement, statuses, processing and custom indicator. */
import { SnProgress } from '@snui/vue-web'
</script>

<template>
  <div class="progress-demo">
    <section class="progress-demo__block">
      <h4>Basic / status colors</h4>
      <SnProgress :percentage="60" />
      <SnProgress :percentage="80" status="success" />
      <SnProgress :percentage="45" status="warning" />
      <SnProgress :percentage="30" status="error" />
      <SnProgress :percentage="70" status="info" />
    </section>

    <section class="progress-demo__block">
      <h4>Indicator placement</h4>
      <SnProgress :percentage="55" indicator-placement="outside" />
      <SnProgress :percentage="55" indicator-placement="inside" rail-color="rgba(0,0,0,0.06)" />
      <SnProgress :percentage="55" indicator-placement="top" />
    </section>

    <section class="progress-demo__block">
      <h4>Processing and custom indicator</h4>
      <SnProgress :percentage="66" processing />
      <SnProgress :percentage="42">
        <template #default="{ percentage }">
          {{ percentage }} items completed
        </template>
      </SnProgress>
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
