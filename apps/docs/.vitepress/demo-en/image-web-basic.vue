<script setup lang="ts">
/** Demo: SnImage — basic thumbnail with fixed width. */
import { SnImage } from '@snui/vue-web';
</script>

<template>
  <div class="demo-row">
    <SnImage width="120" src="https://cdn.uviewui.com/uview/album/1.jpg" />
    <SnImage
      width="120"
      height="120"
      object-fit="cover"
      src="https://cdn.uviewui.com/uview/album/2.jpg"
    />
    <SnImage
      width="120"
      height="90"
      alt="A river in the mountains"
      src="https://cdn.uviewui.com/uview/album/3.jpg"
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
