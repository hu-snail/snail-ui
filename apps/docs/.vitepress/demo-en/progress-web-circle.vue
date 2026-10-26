<script setup lang="ts">
/** Demo: SnProgress — circle with status glyphs and multiple-circle with legend. */
import { SnProgress } from '@snui/vue-web'
</script>

<template>
  <div class="progress-circle-demo">
    <section class="progress-circle-demo__block">
      <h4>Circle / start angle</h4>
      <div class="progress-circle-demo__row">
        <SnProgress type="circle" :percentage="75" />
        <SnProgress type="circle" :percentage="75" :offset-degree="120" color="#0e80eb" />
        <SnProgress type="circle" :percentage="100" status="success" />
        <SnProgress type="circle" :percentage="40" status="error" />
      </div>
    </section>

    <section class="progress-circle-demo__block">
      <h4>Multiple circles + legend</h4>
      <div class="progress-circle-demo__row">
        <SnProgress
          type="multiple-circle"
          :percentage="[20, 50, 86]"
          :color="['#0e80eb', '#85aa39', '#8f3c3c']"
        />
        <SnProgress
          type="multiple-circle"
          :percentage="[35, 60]"
          :color="['var(--sn-web-color-feedback-info)', 'var(--sn-web-color-feedback-warning)']"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.progress-circle-demo {
  display: grid;
  gap: 20px;
}
.progress-circle-demo__block h4 {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
.progress-circle-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}
</style>
