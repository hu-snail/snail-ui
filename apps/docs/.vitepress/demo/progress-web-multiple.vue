<script setup lang="ts">
/** Demo: SnProgress — multiple-circle rings with a per-ring colour legend. */
import { SnProgress } from '@snui/vue-web'

/** Ring → colour mapping: array index selects the ring, tokens keep them themed. */
const threeRings = [
  'var(--sn-web-color-action-primary)',
  'var(--sn-web-color-feedback-success)',
  'var(--sn-web-color-feedback-warning)',
]

const twoRings = [
  'var(--sn-web-color-feedback-info)',
  'var(--sn-web-color-feedback-danger)',
]
</script>

<template>
  <div class="progress-multiple-demo">
    <section class="progress-multiple-demo__block">
      <h4>三环对照（86% / 52% / 23%）</h4>
      <SnProgress type="multiple-circle" :percentage="[86, 52, 23]" :color="threeRings" />
    </section>

    <section class="progress-multiple-demo__block">
      <h4>两环对照（64% / 38%）</h4>
      <SnProgress type="multiple-circle" :percentage="[64, 38]" :color="twoRings" />
    </section>

    <section class="progress-multiple-demo__block">
      <h4>不显示图例（showIndicator = false）</h4>
      <SnProgress
        type="multiple-circle"
        :percentage="[45, 70, 90]"
        :color="threeRings"
        :show-indicator="false"
      />
    </section>
  </div>
</template>

<style scoped>
.progress-multiple-demo {
  display: grid;
  gap: 24px;
  justify-items: center;
}
.progress-multiple-demo__block {
  display: grid;
  gap: 12px;
  justify-items: center;
}
.progress-multiple-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
