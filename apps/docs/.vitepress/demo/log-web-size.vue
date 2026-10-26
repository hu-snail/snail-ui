<script setup lang="ts">
/** Demo: SnLog — resize the viewer with rows. */
import { SnLog } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <SnLog
      :rows="5"
      log="1
2
3
4
5
6"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
}
</style>
