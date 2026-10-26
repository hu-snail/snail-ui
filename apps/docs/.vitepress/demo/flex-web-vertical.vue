<script setup lang="ts">
/** Demo: SnFlex — vertical & alignment. */
import { SnFlex, SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="demo-row">
    <SnFlex vertical align="flex-start" gap="small" class="box">
      <SnButton size="tiny">flex-start</SnButton>
      <SnButton size="tiny">纵向</SnButton>
    </SnFlex>
    <SnFlex vertical align="center" gap="small" class="box">
      <SnButton size="tiny">center</SnButton>
      <SnButton size="tiny">居中</SnButton>
    </SnFlex>
    <SnFlex vertical align="flex-end" gap="small" class="box">
      <SnButton size="tiny">flex-end</SnButton>
      <SnButton size="tiny">靠右</SnButton>
    </SnFlex>
    <SnFlex justify="space-between" align="center" class="box wide">
      <SnButton size="tiny">space-between</SnButton>
      <SnButton size="tiny">两端</SnButton>
    </SnFlex>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: stretch; flex-wrap: wrap; }
.box { border: 1px dashed var(--vp-c-border); border-radius: 6px; padding: 8px; }
.wide { flex: 1; min-width: 200px; }
</style>
