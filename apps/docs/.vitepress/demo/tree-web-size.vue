<script setup lang="ts">
/** Demo: SnTree — size presets (font-size + row height) side by side. */
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption, SnTreeSize } from '@snui/vue-web';

/** `indent` is independent of `size`, so each column pairs them by hand. */
const presets: Array<{ size: SnTreeSize; indent: number }> = [
  { size: 'mini', indent: 14 },
  { size: 'small', indent: 16 },
  { size: 'medium', indent: 18 },
  { size: 'large', indent: 22 },
];

const data: SnTreeOption[] = [
  {
    key: 'a',
    label: '文档',
    children: [
      { key: 'a-1', label: '需求说明' },
      { key: 'a-2', label: '设计稿' },
    ],
  },
  { key: 'b', label: 'README' },
];
</script>

<template>
  <div class="size-grid">
    <div v-for="preset in presets" :key="preset.size" class="size-col">
      <p class="size-label">{{ preset.size }}</p>
      <SnTree
        :data="data"
        :size="preset.size"
        :indent="preset.indent"
        :default-expanded-keys="['a']"
        :default-selected-keys="['a-1']"
      />
    </div>
  </div>
</template>

<style scoped>
.size-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
}

.size-col {
  flex: 1 1 132px;
  min-width: 120px;
}

.size-label {
  margin: 0 0 6px;
  padding-left: 4px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
