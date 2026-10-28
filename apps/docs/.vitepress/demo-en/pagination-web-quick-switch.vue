<script setup lang="ts">
/** Demo: SnPagination — ellipsis quick switch + bordered nav arrows. */
import { ref } from 'vue';
import { SnPagination } from '@snui/vue-web';
const page = ref(1);
</script>

<template>
  <div class="demo-col">
    <SnPagination v-model:page="page" :item-count="1000" show-total />
    <span class="demo-log">
      Page {{ page }} — click a <code>…</code> marker to open the quick-switch panel and jump to any
      hidden page; arrows render as bordered buttons.
    </span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.demo-log code {
  padding: 0 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.06);
  font-size: 12px;
}
</style>
