<script setup lang="ts">
/** Demo: SnPageHeader — back + title/subtitle + extra + footer with body content. */
import { SnButton, SnPageHeader } from '@snui/vue-web';

function goBack(): void {
  // 业务层处理跳转；演示中仅打印。
  // eslint-disable-next-line no-console
  console.log('[page-header-demo] back clicked');
}
</script>

<template>
  <div class="page-header-demo">
    <SnPageHeader
      title="Order details"
      subtitle="Order SN-20240612-0088 · Completed"
      extra="Export | Print"
      @back="goBack"
    >
      <div class="page-header-demo__body">
        <p>Below the header is the body content carried by the default slot.</p>
        <p>
          extra accepts text (as in this demo) or any combination of actions via the #extra slot:
        </p>
        <SnButton size="small">View logs</SnButton>
      </div>
      <template #footer>
        <span class="page-header-demo__footer-text"
          >Updated 2024-06-12 18:30 · auto-synced by the system</span
        >
      </template>
    </SnPageHeader>
  </div>
</template>

<style scoped>
.page-header-demo {
  border: 1px solid var(--sn-web-color-border-subtle, #e5e5e5);
  border-radius: var(--sn-web-card-radius, 10px);
  padding: 16px 20px;
  background: var(--sn-web-color-background-surface, #fff);
}
.page-header-demo__body {
  display: grid;
  gap: 8px;
  justify-items: start;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary, #555);
}
.page-header-demo__body p {
  margin: 0;
}
.page-header-demo__footer-text {
  font-size: 12px;
}
</style>
