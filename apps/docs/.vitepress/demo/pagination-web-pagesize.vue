<script setup lang="ts">
/** Demo: SnPagination — 多档每页条数（label/value）+ 数据总量变化联动。 */
import { computed, ref } from 'vue';
import { SnButton, SnPagination } from '@snui/vue-web';

const itemCount = ref(87);
const page = ref(1);
const pageSize = ref(10);

/** 与组件同规则推导总页数，用于回显联动结果。 */
const pageCount = computed(() => Math.max(1, Math.ceil(itemCount.value / pageSize.value)));

/** 切换数据集：宿主负责把页码重置回第 1 页。 */
function switchDataset(next: number): void {
  itemCount.value = next;
  page.value = 1;
}
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__actions">
      <SnButton size="small" @click="switchDataset(87)">切换为 87 条数据</SnButton>
      <SnButton size="small" @click="switchDataset(1024)">切换为 1024 条数据</SnButton>
    </div>
    <SnPagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="itemCount"
      show-total
      show-size-picker
      :page-sizes="[
        { label: '10 条/页', value: 10 },
        { label: '20 条/页', value: 20 },
        { label: '50 条/页', value: 50 },
        { label: '100 条/页', value: 100 },
      ]"
    />
    <p class="pagination-demo__hint">
      共 {{ itemCount }} 条 · 推导 {{ pageCount }} 页 · 当前第
      {{ page }} 页（切换数据集或条数后页码随总页数收敛）
    </p>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pagination-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
