<script setup lang="ts">
/** Demo: SnInput — prefix / suffix / clear-icon / count slots. */
import { ref } from 'vue'
import { SnIcon, SnInput } from '@snui/vue-web'
import { ChevronRight, Search, X } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Search, X })

const search = ref('')
const url = ref('')
const bio = ref('Hi, I am using @snui/vue-web.')
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="search" placeholder="Search…" clearable>
      <template #prefix>
        <SnIcon :icon="Search" :size="14" />
      </template>
      <template #clear-icon>
        <SnIcon :icon="X" :size="12" />
      </template>
    </SnInput>

    <SnInput v-model="url" placeholder="https://" type="url">
      <template #suffix>
        <SnIcon :icon="ChevronRight" :size="14" />
      </template>
    </SnInput>

    <SnInput v-model="bio" type="textarea" :rows="3" :maxlength="50" show-count>
      <template #count="{ current, max }">{{ current }} / {{ max }} 字符</template>
    </SnInput>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
</style>