<script setup lang="ts">
/** Demo: SnTree — basic data + defaultExpandedKeys + selected v-model. */
import { ref } from 'vue'
import { SnTree } from '@snui/vue-web'
import type { SnTreeOption } from '@snui/vue-web'

const selected = ref<string[]>([])

const data: SnTreeOption[] = [
  {
    key: 'a',
    label: '文档',
    children: [
      { key: 'a-1', label: '需求说明' },
      { key: 'a-2', label: '设计稿' },
    ],
  },
  {
    key: 'b',
    label: '工程',
    children: [
      { key: 'b-1', label: '源代码' },
      { key: 'b-2', label: '构建产物' },
    ],
  },
  { key: 'c', label: 'README' },
]
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:selected-keys="selected"
      :data="data"
      :default-expanded-keys="['a']"
    />
    <p class="sn-demo__hint">当前选中：{{ selected.join('、') || '无' }}</p>
  </div>
</template>

<style scoped>
.sn-demo { max-width: 320px; }
.sn-demo__hint { margin: 8px 0 0; font-size: 12px; color: var(--sn-web-color-text-tertiary); }
</style>
