<script setup lang="ts">
/**
 * card-web-hoverable — SnCard with `hoverable: true` (mouse hover lifts the
 * card with a soft shadow). Mirrors n-card's `hoverable` prop.
 */
import { SnCard } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;gap:16px;flex-wrap:wrap;">
    <SnCard hoverable style="width:240px;" aria-label="Hoverable 1">
      <h3 style="margin:0;">Hoverable 1</h3>
      <p style="margin:8px 0 0;color:var(--vp-c-text-2);font-size:13px;">鼠标悬停会上浮 + 加阴影。</p>
    </SnCard>
    <SnCard hoverable style="width:240px;" aria-label="Hoverable 2">
      <h3 style="margin:0;">Hoverable 2</h3>
      <p style="margin:8px 0 0;color:var(--vp-c-text-2);font-size:13px;">常用于卡片墙、列表项。</p>
    </SnCard>
    <SnCard hoverable variant="elevated" style="width:240px;" aria-label="Hoverable elevated">
      <h3 style="margin:0;">Hoverable + elevated</h3>
      <p style="margin:8px 0 0;color:var(--vp-c-text-2);font-size:13px;">阴影 + hover 加深。</p>
    </SnCard>
  </div>
</template>