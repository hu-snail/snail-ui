<script setup lang="ts">
/** Demo: SnPagination — 基础分页 + 总条数 + 快速跳页。 */
import { ref } from 'vue'
import { SnPagination } from '@snui/vue-web'

const current = ref(1)
</script>

<template>
  <div class="pagination-demo">
    <SnPagination
      v-model:page="current"
      :item-count="97"
      show-total
      show-quick-jumper
    />
    <p class="pagination-demo__hint">当前第 {{ current }} 页（v-model:page 受控）</p>
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
