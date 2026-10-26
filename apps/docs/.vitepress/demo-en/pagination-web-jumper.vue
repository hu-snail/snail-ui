<script setup lang="ts">
/** Demo: SnPagination — quick jumper combined with page-size picker; page changes are echoed live. */
import { ref } from 'vue';
import { SnPagination } from '@snui/vue-web';

const page = ref(2);
const pageSize = ref(10);
</script>

<template>
  <div class="pagination-demo">
    <SnPagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="326"
      show-quick-jumper
      show-size-picker
      :page-sizes="[10, 20, 50]"
    />
    <p class="pagination-demo__hint">
      Page {{ page }} · {{ pageSize }} per page (echoed via update:page / update:page-size; the
      jumper submits on Enter)
    </p>
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
