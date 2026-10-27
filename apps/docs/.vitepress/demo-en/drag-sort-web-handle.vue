<script setup lang="ts">
/** Demo: SnDragSort — grip handle + locked rows. */
import { SnDragSort } from '@snui/vue-web';
import { ref } from 'vue';
const list = ref([
  { key: 'pin', label: 'Pinned notice (locked)', disabled: true },
  { key: 'a', label: 'Product updates' },
  { key: 'b', label: 'Community picks' },
  { key: 'c', label: 'Events preview' },
]);
</script>

<template>
  <SnDragSort v-model="list" handle style="max-width: 360px" />
</template>
