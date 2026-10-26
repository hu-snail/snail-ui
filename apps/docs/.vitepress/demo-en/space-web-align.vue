<script setup lang="ts">
/** Demo: SnSpace — justify / align / wrap. */
import { SnButton, SnTag, SnSpace } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnSpace justify="space-between" style="width: 100%">
      <SnTag>Left</SnTag><SnTag>Middle</SnTag><SnTag>Right</SnTag>
    </SnSpace>
    <SnSpace align="center" style="width: 100%">
      <SnButton>Mixed content</SnButton>
      <SnText depth="2">Aligned with text</SnText>
    </SnSpace>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
