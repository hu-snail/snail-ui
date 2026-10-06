<script setup lang="ts">
/**
 * card-web-cover — SnCard with cover slot (above header). Mirrors
 * n-card's `cover` slot for banner image / illustration at the top.
 */
import { SnButton, SnCard } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;gap:16px;flex-wrap:wrap;">
    <SnCard style="width:280px;" aria-label="Cover example">
      <template #cover>
        <div style="height:120px;background:linear-gradient(135deg,#1677ff 0%,#722ed1 100%);border-radius:6px 6px 0 0;"></div>
      </template>
      <template #header>
        <h3 style="margin:0;">Cover example</h3>
      </template>
      <p style="margin:0;color:var(--vp-c-text-2);font-size:13px;">
        Cover 槽位放置顶部 banner，header + content 跟在其后。
      </p>
      <template #action>
        <SnButton variant="primary" size="small">View details</SnButton>
      </template>
    </SnCard>

    <SnCard style="width:280px;" aria-label="Banner header">
      <template #header>
        <h3 style="margin:0;">Without cover</h3>
        <p style="margin:4px 0 0;font-size:12px;color:var(--vp-c-text-2);">subtitle goes here</p>
      </template>
      <p style="margin:0;color:var(--vp-c-text-2);font-size:13px;">
        没有 cover 时 header 直接顶到 Card 边。
      </p>
    </SnCard>
  </div>
</template>