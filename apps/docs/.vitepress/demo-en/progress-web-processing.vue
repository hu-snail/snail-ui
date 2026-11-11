<script setup lang="ts">
/**
 * Demo: SnProgress — the `processing` animation on line and circle bars.
 */
import { SnProgress } from '@snui/vue-web';
</script>

<template>
  <div class="progress-processing-demo">
    <section class="progress-processing-demo__block">
      <h4>Processing (processing = true, animated stripes)</h4>
      <SnProgress :percentage="66" processing />
      <SnProgress :percentage="38" status="info" processing />
    </section>

    <section class="progress-processing-demo__block">
      <h4>Circle processing (breathing arc)</h4>
      <div class="progress-processing-demo__row">
        <SnProgress type="circle" :percentage="58" processing />
        <SnProgress type="circle" :percentage="82" status="success" processing />
      </div>
    </section>
  </div>
</template>

<style scoped>
.progress-processing-demo {
  display: grid;
  gap: 20px;
}
.progress-processing-demo__block {
  display: grid;
  gap: 10px;
}
.progress-processing-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.progress-processing-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}
</style>
