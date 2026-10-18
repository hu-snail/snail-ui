<script setup lang="ts">
/** Demo: SnImage — fallback-src shown when the source fails to load. */
import { SnImage } from '@snui/vue-web'
</script>

<template>
  <div class="demo-row">
    <SnImage
      width="120"
      src="这个地址注定加载失败"
      fallback-src="https://picsum.photos/id/1020/400/300"
      alt="加载失败回退"
    />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: flex-start; }
</style>
