<script setup lang="ts">
/** Demo: SnTree — keyField / labelField / childrenField remapping. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const selected = ref<(string | number)[]>([]);

const data: SnTreeOption[] = [
  {
    id: 1,
    title: '华东区',
    offices: [
      { id: 11, title: '上海办事处' },
      { id: 12, title: '杭州办事处' },
    ],
  },
  { id: 2, title: '华南区' },
];
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:selected-keys="selected"
      :data="data"
      key-field="id"
      label-field="title"
      children-field="offices"
      :default-expanded-keys="[1]"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 320px;
}
</style>
