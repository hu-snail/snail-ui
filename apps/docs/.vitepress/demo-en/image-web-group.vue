<script setup lang="ts">
/** Demo: SnImageGroup — member images share one preview with prev/next. */
import { SnImage, SnImageGroup } from '@snui/vue-web';

const urls = [
  'https://cdn.uviewui.com/uview/album/8.jpg',
  'https://cdn.uviewui.com/uview/album/9.jpg',
  'https://cdn.uviewui.com/uview/album/10.jpg',
];
</script>

<template>
  <div class="demo-row">
    <SnImageGroup>
      <SnImage
        v-for="(url, index) in urls"
        :key="url"
        width="120"
        height="90"
        object-fit="cover"
        :src="url"
        :alt="`Group image ${index + 1}`"
      />
    </SnImageGroup>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
</style>
