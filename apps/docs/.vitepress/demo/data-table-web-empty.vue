<script setup lang="ts">
/** Demo: SnDataTable — empty state with default and slotted content. */
import { SnDataTable } from '@snui/vue-web'
const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
]

const emptyData: Array<Record<string, unknown>> = []
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="emptyData" />
    <SnDataTable :columns="columns" :data="emptyData">
      <template #empty>
        <div class="sn-demo-empty">这里还没有任何记录</div>
      </template>
    </SnDataTable>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}
.sn-demo-empty {
  padding: 48px 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 14px;
  text-align: center;
}
</style>
