<script setup lang="ts">
/** Demo: SnTree — option-level prefix/suffix vs tree-level render fns. */
import { ref } from 'vue'
import { SnTree } from '@snui/vue-web'
import type { SnTreeOption } from '@snui/vue-web'

const selected = ref<string[]>(['ts'])

const data: SnTreeOption[] = [
  {
    key: 'ts',
    label: 'typescript',
    prefix: 'TS',
    suffix: '12 个文件',
  },
  {
    key: 'vue',
    label: 'vue',
    children: [
      { key: 'vue-1', label: 'main.ts', suffix: '入口' },
      { key: 'vue-2', label: 'App.vue', suffix: '根组件' },
    ],
  },
]

const renderTreeData: SnTreeOption[] = [
  { key: 'docs', label: '文档', children: [{ key: 'docs-1', label: '需求说明' }] },
  { key: 'src', label: '源代码' },
]
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__label">节点级 prefix / suffix 字段：</p>
    <SnTree
      v-model:selected-keys="selected"
      :data="data"
      block-line
      :default-expanded-keys="['vue']"
    />

    <p class="sn-demo__label">树级 render-prefix / render-suffix（收到 option / checked / selected）：</p>
    <SnTree
      :data="renderTreeData"
      block-line
      :render-prefix="({ option, selected: isSelected }) => (isSelected ? '● ' : '') + String(option.key)"
      :render-suffix="({ checked }) => (checked ? '已勾选' : '未勾选')"
      :default-expanded-keys="['docs']"
    />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 360px; display: flex; flex-direction: column; gap: 4px; }
.sn-demo__label { margin: 8px 0 0; font-size: 12px; color: var(--sn-web-color-text-tertiary); }
</style>
