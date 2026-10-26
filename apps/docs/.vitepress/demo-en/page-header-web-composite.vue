<script setup lang="ts">
/**
 * Demo: SnPageHeader — subtitle + `#extra` actions + `#footer`, with the
 * back control wired to real state instead of a no-op handler.
 */
import { ref } from 'vue';
import { SnButton, SnIcon, SnPageHeader, registerSnIcons } from '@snui/vue-web';
import { Clock, Download, Share2 } from 'lucide-vue-next';

registerSnIcons({ Clock, Download, Share2 });

const lastAction = ref('Waiting for action');

function handleBack(): void {
  lastAction.value = 'Went back one level (back event fired)';
}
</script>

<template>
  <div class="page-header-composite-demo">
    <SnPageHeader
      title="Order details"
      subtitle="Order SN-20240612-0088 · Completed"
      @back="handleBack"
    >
      <div class="page-header-composite-demo__body">
        <p>Last action:{{ lastAction }}</p>
        <p>
          The actions on the header's right come from the #extra slot; the footer note comes from
          #footer.
        </p>
      </div>

      <template #extra>
        <div class="page-header-composite-demo__actions">
          <SnButton size="small" icon-name="Download" @click="lastAction = 'Export report'">
            Export
          </SnButton>
          <SnButton
            size="small"
            type="primary"
            icon-name="Share2"
            @click="lastAction = 'Share link'"
          >
            Share
          </SnButton>
        </div>
      </template>

      <template #footer>
        <span class="page-header-composite-demo__footer">
          <SnIcon name="Clock" :size="12" />
          Updated 2024-06-12 18:30 · auto-synced by the system
        </span>
      </template>
    </SnPageHeader>
  </div>
</template>

<style scoped>
.page-header-composite-demo {
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  padding: 16px 20px;
  background: var(--sn-web-color-background-surface);
}
.page-header-composite-demo__body {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}
.page-header-composite-demo__body p {
  margin: 0;
}
.page-header-composite-demo__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-header-composite-demo__footer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}
</style>
