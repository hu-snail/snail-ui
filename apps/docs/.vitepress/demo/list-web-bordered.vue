<script setup lang="ts">
/** Demo: SnList — bordered outer frame. */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
    <SnList bordered>
      <template #header>带边框的列表</template>
      <SnListItem>默认保留项间分割线</SnListItem>
      <SnListItem>行内边距为 12px 20px</SnListItem>
      <SnListItem>外框带 3px 圆角</SnListItem>
      <template #footer>bordered 模式</template>
    </SnList>
  </div>
</template>

<style scoped>
.list-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
</style>
