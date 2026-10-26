<script setup lang="ts">
/** Demo: SnImage — preview-disabled stops the click-to-preview overlay. */
import { SnImage } from '@snui/vue-web';
</script>

<template>
  <div class="demo-row">
    <SnImage
      width="120"
      src="https://picsum.photos/id/1035/400/300"
      preview-disabled
      alt="Preview disabled"
    />
    <SnImage width="120" src="https://picsum.photos/id/1036/400/300" alt="Previewable" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
</style>
