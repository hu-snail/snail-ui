<script setup lang="ts">
/**
 * grid-web-responsive — SnGrid responsive column count via breakpoint object
 * (mirrors n-grid `cols` accepting a responsive object). Resize the
 * browser to see columns change at xs<480 / s≥480 / m≥640 / l≥768 / xl≥1024 / xxl≥1280.
 */
import { SnCard, SnGrid } from '@snui/vue-web'
import type { ResponsiveCols } from '@snui/vue-web'

const cols: ResponsiveCols = { xs: 1, s: 2, m: 3, l: 3, xl: 4, xxl: 5 }
</script>

<template>
  <SnGrid :cols="cols" :x-gap="16" :y-gap="16">
    <SnCard v-for="i in 10" :key="i" :padding="'md'">
      <span style="font-weight:600;">Card {{ i }}</span>
    </SnCard>
  </SnGrid>
</template>