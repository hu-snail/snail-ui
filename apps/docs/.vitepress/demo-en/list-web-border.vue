<script setup lang="ts">
/** Demo: SnList — bordered 外边框 + show-divider 关闭分割线。 */
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

    <SnList bordered :show-divider="false">
      <SnListItem>List with dividers off</SnListItem>
      <SnListItem>Blank space between rows</SnListItem>
      <SnListItem>Suits card-style row content</SnListItem>
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
