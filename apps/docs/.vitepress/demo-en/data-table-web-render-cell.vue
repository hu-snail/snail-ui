<script setup lang="ts">
/** Demo: SnDataTable — cell render fn (tag-style status via h()). */
import { h } from 'vue';
import { SnDataTable } from '@snui/vue-web';

const columns = [
  { title: 'Name', key: 'name' },
  {
    title: 'Status',
    key: 'status',
    render: (row: Record<string, unknown>) =>
      h(
        'span',
        {
          class: 'sn-demo-tag',
          style: {
            color: row.online
              ? 'var(--sn-web-color-feedback-success)'
              : 'var(--sn-web-color-text-tertiary)',
            borderColor: row.online
              ? 'var(--sn-web-color-feedback-success)'
              : 'color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface))',
          },
        },
        row.online ? 'Online' : 'Offline',
      ),
  },
];

const data = [
  { key: 0, name: 'John Brown', online: true },
  { key: 1, name: 'Jim Green', online: false },
  { key: 2, name: 'Joe Black', online: true },
];
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" />
  </div>
</template>

<style scoped>
.sn-demo :deep(.sn-demo-tag) {
  display: inline-block;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
  border: 1px solid;
  border-radius: 3px;
  font-size: 12px;
}
</style>
