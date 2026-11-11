<script setup lang="ts">
/** Demo: SnList — show-divider off. */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
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
