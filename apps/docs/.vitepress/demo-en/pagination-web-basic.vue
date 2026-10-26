<script setup lang="ts">
/** Demo: SnPagination — basic paging + total count + quick jumper. */
import { ref } from 'vue';
import { SnPagination } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="pagination-demo">
    <SnPagination v-model:page="current" :item-count="97" show-total show-quick-jumper />
    <p class="pagination-demo__hint">Page {{ current }} (controlled via v-model:page)</p>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pagination-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
