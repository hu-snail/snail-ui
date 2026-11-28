<script setup lang="ts">
/** Demo: SnImage — preview-disabled stops the click-to-preview overlay. */
import { SnImage } from '@snui/vue-web';
</script>

<template>
  <div class="demo-row">
    <SnImage
      width="120"
      src="https://cdn.uviewui.com/uview/album/2.jpg"
      preview-disabled
      alt="Preview disabled"
    />
    <SnImage width="120" src="https://cdn.uviewui.com/uview/album/3.jpg" alt="Previewable" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
</style>
