<script setup lang="ts">
/** Demo: SnImageGroup — show-toolbar-tooltip adds native title hints to the toolbar. */
import { SnImage, SnImageGroup } from '@snui/vue-web';

const urls = ['https://cdn.uviewui.com/uview/album/10.jpg', 'https://cdn.uviewui.com/uview/album/1.jpg'];
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
        alt="Toolbar tooltips"
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
