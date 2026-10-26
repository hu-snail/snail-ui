<script setup lang="ts">
/** Demo: SnImageGroup — show-toolbar-tooltip adds native title hints to the toolbar. */
import { SnImage, SnImageGroup } from '@snui/vue-web';

const urls = ['https://picsum.photos/id/1050/1200/800', 'https://picsum.photos/id/1051/1200/800'];
</script>

<template>
  <div class="demo-row">
    <SnImageGroup show-toolbar-tooltip>
      <SnImage
        v-for="url in urls"
        :key="url"
        width="120"
        height="90"
        object-fit="cover"
        :src="url"
        alt="工具栏提示"
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
