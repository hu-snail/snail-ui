<script setup lang="ts">
/** Demo: SnEllipsis — single-line vs multi-line clamping with the same text and width. */
import { SnEllipsis } from '@snui/vue-web';

const paragraph =
  'The Snail AUI text-ellipsis component truncates content at the specified line count,' +
  'and shows the full text in a tooltip on overflow. For the same text at the same width,' +
  'lineClamp decides how many lines are kept: 1 means single-line ellipsis, 2 or more means multi-line ellipsis,' +
  'and overflow detection is computed automatically from the actual container height.';

const clamps = [
  { value: 1, label: 'lineClamp = 1 (single-line ellipsis)' },
  { value: 2, label: 'lineClamp = 2 (ellipsis after two lines)' },
  { value: 3, label: 'lineClamp = 3 (ellipsis after three lines)' },
];
</script>

<template>
  <div class="ellipsis-lines-demo">
    <section v-for="item in clamps" :key="item.value" class="ellipsis-lines-demo__block">
      <h4>{{ item.label }}</h4>
      <SnEllipsis :width="360" :line-clamp="item.value">{{ paragraph }}</SnEllipsis>
    </section>

    <section class="ellipsis-lines-demo__block">
      <h4>No tooltip when content fits</h4>
      <SnEllipsis :width="360" :line-clamp="3">Short phrases do not trigger ellipsis.</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-lines-demo {
  display: grid;
  gap: 20px;
}
.ellipsis-lines-demo__block {
  display: grid;
  gap: 8px;
}
.ellipsis-lines-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
