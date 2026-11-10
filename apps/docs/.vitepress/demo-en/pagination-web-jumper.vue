<script setup lang="ts">
/** Demo: SnPagination — quick jumper; page changes are echoed live. */
import { ref } from 'vue';
import { SnPagination } from '@snui/vue-web';

const page = ref(2);
</script>

<template>
  <div class="pagination-demo">
    <SnPagination v-model:page="page" :item-count="326" show-quick-jumper />
    <p class="pagination-demo__hint">
      Page {{ page }} (echoed via update:page; the jumper submits on Enter)
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
