<script setup lang="ts">
/** Demo: SnDragSort — basic vertical drag sorting. */
import { SnDragSort } from '@snui/vue-web';
import { ref } from 'vue';
const list = ref([
  { key: 1, label: 'Triage the backlog' },
  { key: 2, label: 'Review interaction specs' },
  { key: 3, label: 'Build the drag-sort component' },
  { key: 4, label: 'Regression pass', disabled: true },
  { key: 5, label: 'Ship the weekly report' },
]);
</script>

<template>
  <SnDragSort v-model="list" style="max-width: 360px" #item="{ item, isDragging }">
    <span :style="{ opacity: isDragging ? 0.6 : 1 }">{{ item.label }}</span>
  </SnDragSort>
  <p style="margin: 12px 0 0; font-size: 13px">
    Current order: {{ list.map((i) => i.key).join(' → ') }}
  </p>
</template>
