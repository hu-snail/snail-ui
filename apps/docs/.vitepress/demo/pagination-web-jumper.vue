<script setup lang="ts">
/** Demo: SnPagination — 快速跳页 + 每页条数切换组合，页码变化实时回显。 */
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
      当前第 {{ page }} 页 · 每页 {{ pageSize }} 条（update:page / update:page-size
      回显，跳页输入回车提交）
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
