<script setup lang="ts">
/**
 * grid-web-gap — SnGrid with various xGap / yGap combinations.
 */
import { SnCard, SnGrid } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:24px;">
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">cols=4 · xGap=24 · yGap=24</p>
      <SnGrid :cols="4" :x-gap="24" :y-gap="24">
        <SnCard v-for="i in 4" :key="`a-${i}`" :padding="'md'">
          <span style="font-weight:600;">A {{ i }}</span>
        </SnCard>
      </SnGrid>
    </div>
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">cols=3 · xGap=8 · yGap=32 (tight cols, loose rows)</p>
      <SnGrid :cols="3" :x-gap="8" :y-gap="32">
        <SnCard v-for="i in 3" :key="`b-${i}`" :padding="'md'">
          <span style="font-weight:600;">B {{ i }}</span>
        </SnCard>
      </SnGrid>
    </div>
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">cols=6 · xGap=4 · yGap=4 (compact)</p>
      <SnGrid :cols="6" :x-gap="4" :y-gap="4">
        <SnCard v-for="i in 6" :key="`c-${i}`" :padding="'sm'">
          <span style="font-size:12px;">C {{ i }}</span>
        </SnCard>
      </SnGrid>
    </div>
  </div>
</template>