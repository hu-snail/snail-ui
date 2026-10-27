<script setup lang="ts">
/** Demo: SnDragSort — horizontal drag sorting. */
import { SnDragSort } from '@snui/vue-web';
import { ref } from 'vue';
const tags = ref([
  { key: 'all', label: 'All' },
  { key: 'tech', label: 'Tech' },
  { key: 'design', label: 'Design' },
  { key: 'life', label: 'Life' },
  { key: 'work', label: 'Career' },
]);
</script>

<template>
  <SnDragSort v-model="tags" direction="horizontal" style="max-width: 420px">
    <template #item="{ item }">
      <span style="font-size: 13px">{{ item.label }}</span>
    </template>
  </SnDragSort>
  <p style="margin: 12px 0 0; font-size: 13px">
    Current order: {{ tags.map((t) => t.label).join(' / ') }}
  </p>
</template>
