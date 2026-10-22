<script setup lang="ts">
/** Demo: SnImage — basic thumbnail with fixed width. */
import { SnImage } from '@snui/vue-web'
</script>

<template>
  <div class="demo-row">
    <SnImage width="120" src="https://picsum.photos/id/1015/400/300" />
    <SnImage width="120" height="120" object-fit="cover" src="https://picsum.photos/id/1016/400/300" />
    <SnImage width="120" height="90" alt="A river in the mountains" src="https://picsum.photos/id/1018/400/300" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: flex-start; }
</style>
