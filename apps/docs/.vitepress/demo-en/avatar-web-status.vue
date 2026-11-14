<script setup lang="ts">
/**
 * Demo: SnAvatar — presence status & corner badge (additive capabilities).
 *
 * `status` paints an online/offline dot, `status-position` picks the corner
 * (top-right / bottom-right); `badge-icon` paints a corner badge (e.g. a
 * membership crown). Both overlays are decorative — the presence state also
 * rides on the root `aria-label` for screen readers.
 */
import { Crown } from 'lucide-vue-next';
import { registerSnIcons, SnAvatar } from '@snui/vue-web';

registerSnIcons({ Crown });
</script>

<template>
  <div class="demo-grid">
    <div class="demo-block">
      <h4>Presence status (bottom-right by default)</h4>
      <div class="demo-row">
        <SnAvatar src="/logo.svg" status="online" />
        <SnAvatar fallback-text="Zhang" status="offline" />
        <SnAvatar fallback-text="Li" status="online" circle color="var(--sn-web-color-action-primary)" />
      </div>
    </div>

    <div class="demo-block">
      <h4>Dot position (top-right / bottom-right)</h4>
      <div class="demo-row">
        <SnAvatar fallback-text="Wang" status="online" status-position="top-right" />
        <SnAvatar fallback-text="Zhao" status="online" status-position="bottom-right" size="large" />
      </div>
    </div>

    <div class="demo-block">
      <h4>Badge icon (membership level)</h4>
      <div class="demo-row">
        <SnAvatar fallback-text="SVIP" color="var(--sn-web-color-text-primary)" badge-icon="Crown" />
        <SnAvatar
          fallback-text="VIP"
          circle
          color="var(--sn-web-color-feedback-info)"
          badge-icon="Crown"
          size="large"
        />
        <SnAvatar
          src="/logo.svg"
          status="online"
          badge-icon="Crown"
          badge-position="bottom-right"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: 16px;
  justify-items: start;
}

.demo-block {
  display: grid;
  gap: 10px;
  justify-items: start;
}

.demo-block h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--sn-web-color-text-tertiary);
}

.demo-row {
  display: flex;
  gap: 24px;
  align-items: center;
}
</style>
