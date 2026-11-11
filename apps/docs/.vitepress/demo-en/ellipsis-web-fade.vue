<script setup lang="ts">
/** Demo: SnEllipsis — fade smoke mask on the truncated edge. */
import { SnEllipsis } from '@snui/vue-web';

const paragraph =
  "Snail AUI's text ellipsis component clamps content to the given line count. " +
  'With fade enabled the clamped edge dissolves like smoke instead of a hard cut.';
</script>

<template>
  <div class="ellipsis-fade-demo">
    <section class="ellipsis-fade-demo__block">
      <h4>Fade smoke mask (fade)</h4>
      <SnEllipsis :width="360" :line-clamp="3" fade>{{ paragraph }}</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-fade-demo {
  display: grid;
  gap: 18px;
}
.ellipsis-fade-demo__block {
  display: grid;
  gap: 10px;
}
.ellipsis-fade-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
