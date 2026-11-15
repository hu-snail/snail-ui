<script setup lang="ts">
/** Demo: SnImage — previewed-img-props styles the enlarged image. */
import { SnImage } from '@snui/vue-web';
</script>

<template>
  <div class="demo-row">
    <SnImage
      width="120"
      src="https://cdn.uviewui.com/uview/album/7.jpg"
      :previewed-img-props="{
        style: { border: '8px solid var(--sn-web-color-background-surface)', borderRadius: '8px' },
      }"
      alt="预览属性"
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
