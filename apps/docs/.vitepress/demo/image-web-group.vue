<script setup lang="ts">
/** Demo: SnImageGroup — member images share one preview with prev/next. */
import { SnImage, SnImageGroup } from '@snui/vue-web';

const urls = [
  'https://picsum.photos/id/1015/1200/800',
  'https://picsum.photos/id/1016/1200/800',
  'https://picsum.photos/id/1018/1200/800',
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
        :alt="`组内图片 ${index + 1}`"
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
