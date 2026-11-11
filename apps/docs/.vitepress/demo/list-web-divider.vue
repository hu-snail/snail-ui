<script setup lang="ts">
/** Demo: SnList — show-divider off. */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
    <SnList bordered :show-divider="false">
      <SnListItem>关闭分割线的列表</SnListItem>
      <SnListItem>行与行之间留白</SnListItem>
      <SnListItem>适合卡片式行内容</SnListItem>
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
