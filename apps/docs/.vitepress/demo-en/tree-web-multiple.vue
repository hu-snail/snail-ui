<script setup lang="ts">
/** Demo: SnTree — multiple selection with cancelable toggle. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const selected = ref<string[]>([]);

const data: SnTreeOption[] = [
  {
    key: 'frontend',
    label: 'Frontend team',
    children: [
      { key: 'vue', label: 'Vue squad' },
      { key: 'react', label: 'React squad' },
    ],
  },
  {
    key: 'backend',
    label: 'Backend team',
    children: [{ key: 'go', label: 'Go squad' }],
  },
  { key: 'qa', label: 'QA team' },
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
    <p class="sn-demo__hint">{{ selected.length }} selected: {{ selected.join(', ') || 'none' }}</p>
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
