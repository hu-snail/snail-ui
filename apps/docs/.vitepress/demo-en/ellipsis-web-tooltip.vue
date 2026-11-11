<script setup lang="ts">
/** Demo: SnEllipsis — overflow tooltip (default bubble + custom placement). */
import { SnEllipsis } from '@snui/vue-web';

const longText =
  'This is a very long piece of description text used to demonstrate truncation: when the container is too narrow to hold the full content,' +
  'hover over the text to see the full content via Tooltip; the bubble placement is configurable.';
</script>

<template>
  <div class="ellipsis-demo">
    <section class="ellipsis-demo__block">
      <h4>Overflow Tooltip (default bubble)</h4>
      <SnEllipsis :width="320">{{ longText }}</SnEllipsis>
    </section>

    <section class="ellipsis-demo__block">
      <h4>tooltip placement="bottom"</h4>
      <SnEllipsis :width="320" :tooltip="{ placement: 'bottom' }">{{ longText }}</SnEllipsis>
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
