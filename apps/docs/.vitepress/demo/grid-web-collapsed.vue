<script setup lang="ts">
/**
 * grid-web-collapsed — SnGrid collapsed mode (show only first N rows,
 * expose "+N more" affordance via the suffix slot). Mirrors n-grid
 * `collapsed` + `collapsedRows`.
 */
import { ref } from 'vue'
import { SnButton, SnCard, SnGrid } from '@snui/vue-web'

const expanded = ref(false)
const items = Array.from({ length: 9 }, (_, i) => i + 1)
</script>

<template>
  <div>
    <SnGrid :cols="3" :x-gap="16" :y-gap="16" :collapsed="!expanded" :collapsed-rows="2">
      <SnCard v-for="i in items" :key="i" :padding="'md'">
        <span style="font-weight:600;">Card {{ i }}</span>
        <p style="margin:4px 0 0;font-size:12px;color:var(--vp-c-text-2);">第 {{ i }} 张卡片</p>
      </SnCard>
      <template #suffix>
        <div style="display:flex;align-items:center;justify-content:center;height:80px;">
          <SnButton variant="ghost" size="small" @click="expanded = !expanded">
            {{ expanded ? '收起' : `展开 ${items.length - 6} 张更多` }}
          </SnButton>
        </div>
      </template>
    </SnGrid>
  </div>
</template>