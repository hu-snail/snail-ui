<script setup lang="ts">
/** Demo: SnTree — option-level prefix/suffix vs tree-level render fns. */
import { ref } from 'vue';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const selected = ref<string[]>(['ts']);

const data: SnTreeOption[] = [
  {
    key: 'ts',
    label: 'typescript',
    prefix: 'TS',
    suffix: '12 files',
  },
  {
    key: 'vue',
    label: 'vue',
    children: [
      { key: 'vue-1', label: 'main.ts', suffix: 'Entry' },
      { key: 'vue-2', label: 'App.vue', suffix: 'Root component' },
    ],
  },
];

const renderTreeData: SnTreeOption[] = [
  { key: 'docs', label: 'Docs', children: [{ key: 'docs-1', label: 'Requirements' }] },
  { key: 'src', label: 'Source code' },
];
</script>

<template>
  <div class="sn-demo">
    <section class="sn-demo__section">
      <p class="sn-demo__label">Node-level prefix / suffix fields:</p>
      <SnTree
        v-model:selected-keys="selected"
        :data="data"
        block-line
        :default-expanded-keys="['vue']"
      />
    </section>

    <section class="sn-demo__section">
      <p class="sn-demo__label">
        Tree-level render-prefix / render-suffix (receives option / checked / selected):
      </p>
      <SnTree
        :data="renderTreeData"
        block-line
        :render-prefix="
          ({ option, selected: isSelected }) => (isSelected ? '● ' : '') + String(option.key)
        "
        :render-suffix="({ checked }) => (checked ? 'Checked' : 'Unchecked')"
        :default-expanded-keys="['docs']"
      />
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.sn-demo__section {
  display: flex;
  flex-direction: column;
}
.sn-demo__label {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
