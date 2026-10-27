<script setup lang="ts">
/** Demo: SnDragSort — basic vertical drag sorting. */
import { SnDragSort } from '@snui/vue-web';
import { ref } from 'vue';
const list = ref([
  { key: 1, label: '整理需求清单' },
  { key: 2, label: '评审交互稿' },
  { key: 3, label: '开发拖拽排序组件' },
  { key: 4, label: '回归测试', disabled: true },
  { key: 5, label: '发布周报' },
]);
</script>

<template>
  <SnDragSort v-model="list" style="max-width: 360px" #item="{ item, isDragging }">
    <span :style="{ opacity: isDragging ? 0.6 : 1 }">{{ item.label }}</span>
  </SnDragSort>
  <p style="margin: 12px 0 0; font-size: 13px">
    当前顺序：{{ list.map((i) => i.key).join(' → ') }}
  </p>
</template>
