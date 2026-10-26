<script setup lang="ts">
/**
 * grid-web-basic — SnGrid 基础演示 (3 列 + 4 列, gap 调整)
 */
import { SnCard, SnGrid } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:24px;">
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">3 列 · xGap=16 · yGap=16</p>
      <SnGrid :cols="3" :x-gap="16" :y-gap="16">
        <SnCard v-for="i in 3" :key="`a-${i}`" :padding="'md'">
          <span style="font-weight:600;">Card {{ i }}</span>
        </SnCard>
      </SnGrid>
    </div>
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">4 列 · xGap=20 · yGap=20</p>
      <SnGrid :cols="4" :x-gap="20" :y-gap="20">
        <SnCard v-for="i in 4" :key="`b-${i}`" :padding="'md'">
          <span style="font-weight:600;">Item {{ i }}</span>
        </SnCard>
      </SnGrid>
    </div>
  </div>
</template>