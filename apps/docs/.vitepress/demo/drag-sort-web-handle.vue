<script setup lang="ts">
/** Demo: SnDragSort — grip handle + locked rows. */
import { SnDragSort } from '@snui/vue-web';
import { ref } from 'vue';
const list = ref([
  { key: 'pin', label: '置顶公告（锁定）', disabled: true },
  { key: 'a', label: '产品动态' },
  { key: 'b', label: '用户精选' },
  { key: 'c', label: '活动预告' },
]);
</script>

<template>
  <SnDragSort v-model="list" handle style="max-width: 360px" />
</template>
