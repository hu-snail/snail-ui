<script setup lang="ts">
/** Demo: SnEllipsis — single-line clamping basics. */
import { SnEllipsis } from '@snui/vue-web';

const longText =
  'This is a very long piece of description text used to demonstrate truncation: when the container is too narrow to hold the full content,' +
  'the overflow is replaced by an ellipsis; overflow detection is computed from the actual size of the container, and no tooltip pops up for text that does not overflow.';
</script>

<template>
  <div class="ellipsis-demo">
    <section class="ellipsis-demo__block">
      <h4>Single-line ellipsis</h4>
      <SnEllipsis :width="320">{{ longText }}</SnEllipsis>
    </section>

    <section class="ellipsis-demo__block">
      <h4>Short text without overflow (no tooltip)</h4>
      <SnEllipsis :width="320">Short text does not show a Tooltip.</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-demo {
  display: grid;
  gap: 18px;
}
.ellipsis-demo__block {
  display: grid;
  gap: 10px;
}
.ellipsis-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
