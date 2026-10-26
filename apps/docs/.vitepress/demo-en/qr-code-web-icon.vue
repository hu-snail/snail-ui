<script setup lang="ts">
/** Demo: SnQrCode — center icon over the matrix (level H keeps it decodable). */
import { SnQrCode } from '@snui/vue-web';

/** Self-contained icon: a small inline SVG badge as data uri. */
const ICON =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#18a058"/><path d="M12 20.5l5.5 5.5L28 15" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  );
</script>

<template>
  <div class="demo-row">
    <SnQrCode value="https://snail.aui" :icon-src="ICON" error-correction-level="H" />
    <SnQrCode
      value="https://snail.aui"
      :icon-src="ICON"
      icon-background-color="#205072"
      :icon-border-radius="8"
      error-correction-level="H"
    />
    <SnQrCode
      value="https://snail.aui"
      :icon-src="ICON"
      :icon-size="32"
      type="svg"
      error-correction-level="H"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
</style>
