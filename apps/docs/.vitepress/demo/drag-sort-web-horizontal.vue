<script setup lang="ts">
/** Demo: SnDragSort — horizontal drag sorting. */
import { SnDragSort } from '@snui/vue-web';
import { ref } from 'vue';
const tags = ref([
  { key: 'all', label: '全部' },
  { key: 'tech', label: '技术' },
  { key: 'design', label: '设计' },
  { key: 'life', label: '生活' },
  { key: 'work', label: '职场' },
]);
</script>

<template>
  <SnDragSort v-model="tags" direction="horizontal" style="max-width: 420px">
    <template #item="{ item }">
      <span style="font-size: 13px">{{ item.label }}</span>
    </template>
  </SnDragSort>
  <p style="margin: 12px 0 0; font-size: 13px">
    当前顺序：{{ tags.map((t) => t.label).join(' / ') }}
  </p>
</template>
