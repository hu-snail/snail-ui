<script setup lang="ts">
/**
 * card-web-footer — SnCard with footer slot (below content) for actions /
 * metadata — the `footer` slot.
 */
import { SnButton, SnCard } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;gap:16px;flex-wrap:wrap;">
    <SnCard title="Card with footer" style="width:300px;">
      <p>Order completed.</p>
      <template #footer>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--vp-c-text-2);font-size:12px;">3 minutes ago</span>
          <div style="display:flex;gap:8px;">
            <SnButton size="small" variant="ghost">View</SnButton>
            <SnButton size="small" variant="primary">Buy again</SnButton>
          </div>
        </div>
      </template>
    </SnCard>

    <SnCard title="Stats card" style="width:300px;">
      <h3 style="margin:0;font-size:32px;color:var(--sn-web-color-action-primary);">12,345</h3>
      <p style="margin:4px 0 0;color:var(--vp-c-text-2);font-size:13px;">Total visits</p>
      <template #footer>
        <span style="color:var(--sn-web-color-feedback-success);font-size:12px;">↑ 12.5% vs last week</span>
      </template>
    </SnCard>
  </div>
</template>