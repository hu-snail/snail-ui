<script setup lang="ts">
/** Demo: SnTree — block-line hover/selected background spans the whole row. */
import { ref } from 'vue'
import { SnTree } from '@snui/vue-web'
import type { SnTreeOption } from '@snui/vue-web'

const selected = ref<string[]>([])

const data: SnTreeOption[] = [
  {
    key: '1',
    label: '第一季度',
    children: [
      { key: '1-1', label: '一月' },
      { key: '1-2', label: '二月' },
    ],
  },
  {
    key: '2',
    label: '第二季度',
    children: [{ key: '2-1', label: '四月' }],
  },
]
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:selected-keys="selected"
      :data="data"
      block-line
      :default-expanded-keys="['1', '2']"
    />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 320px; }
</style>
