<script setup lang="ts">
/** Demo: SnTree — multiple selection with cancelable toggle. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const selected = ref<string[]>([]);

const data: SnTreeOption[] = [
  {
    key: 'frontend',
    label: '前端组',
    children: [
      { key: 'vue', label: 'Vue 小队' },
      { key: 'react', label: 'React 小队' },
    ],
  },
  {
    key: 'backend',
    label: '后端组',
    children: [{ key: 'go', label: 'Go 小队' }],
  },
  { key: 'qa', label: '测试组' },
];
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:selected-keys="selected"
      :data="data"
      multiple
      :default-expanded-keys="['frontend', 'backend']"
    />
    <p class="sn-demo__hint">已选 {{ selected.length }} 项：{{ selected.join('、') || '无' }}</p>
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 320px;
}
.sn-demo__hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
