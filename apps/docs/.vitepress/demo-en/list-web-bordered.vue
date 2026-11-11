<script setup lang="ts">
/** Demo: SnList — bordered outer frame. */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
    <SnList bordered>
      <template #header>Bordered list</template>
      <SnListItem>Keeps dividers between items by default</SnListItem>
      <SnListItem>Row padding is 12px 20px</SnListItem>
      <SnListItem>Outer frame has a 3px radius</SnListItem>
      <template #footer>bordered mode</template>
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
