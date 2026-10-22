<script setup lang="ts">
/** Demo: SnTree — basic data + defaultExpandedKeys + selected v-model. */
import { ref } from 'vue'
import { SnTree } from '@snui/vue-web'
import type { SnTreeOption } from '@snui/vue-web'

const selected = ref<string[]>([])

const data: SnTreeOption[] = [
  {
    key: 'a',
    label: 'Docs',
    children: [
      { key: 'a-1', label: 'Requirements' },
      { key: 'a-2', label: 'Design draft' },
    ],
  },
  {
    key: 'b',
    label: 'Engineering',
    children: [
      { key: 'b-1', label: 'Source code' },
      { key: 'b-2', label: 'Build artifacts' },
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
    <p class="sn-demo__hint">Currently selected: {{ selected.join(', ') || 'None' }}</p>
  </div>
</template>

<style scoped>
.sn-demo { max-width: 320px; }
.sn-demo__hint { margin: 8px 0 0; font-size: 12px; color: var(--sn-web-color-text-tertiary); }
</style>
