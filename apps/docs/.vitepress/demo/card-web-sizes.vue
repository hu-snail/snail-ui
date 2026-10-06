<script setup lang="ts">
/**
 * card-web-sizes — SnCard with all 4 size presets (small/medium/large/huge).
 * `size` drives padding + font-size (mirrors n-card `size`).
 */
import { SnCard } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;">
    <SnCard size="small" title="small" style="width:200px;">
      <p style="margin:0;font-size:13px;">紧凑 padding，适合密集列表。</p>
    </SnCard>
    <SnCard size="medium" title="medium" style="width:200px;">
      <p style="margin:0;font-size:13px;">默认 size，文档推荐。</p>
    </SnCard>
    <SnCard size="large" title="large" style="width:200px;">
      <p style="margin:0;font-size:13px;">宽松 padding，hero 卡片。</p>
    </SnCard>
    <SnCard size="huge" title="huge" style="width:200px;">
      <p style="margin:0;font-size:13px;">最大 padding，宣传位。</p>
    </SnCard>
  </div>
</template>