<script setup lang="ts">
/** Demo: SnTree — disabled nodes block selection and checking. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const checked = ref<string[]>([]);

const data: SnTreeOption[] = [
  { key: 'a', label: '可点节点' },
  { key: 'b', label: '禁用节点', disabled: true },
  {
    key: 'c',
    label: '禁用展开',
    disabled: true,
    children: [{ key: 'c-1', label: '隐藏子节点' }],
  },
  { key: 'd', label: '勾选禁用节点', checkboxDisabled: true },
];
</script>

<template>
  <div class="sn-demo">
    <SnTree v-model:checked-keys="checked" :data="data" checkable :default-expanded-keys="['c']" />
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 320px;
}
</style>
