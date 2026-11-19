<script setup lang="ts">
/**
 * Demo: sn-popover — the legacy `iconClass` field.
 *
 * - in `mode="menu"`, `content` is a `{ content, iconClass, disabled }` list;
 *   `iconClass` (the wd-compatibility field) accepts a name (resolved through
 *   SnIcon: built-in catalog / registry) or an image address (rendered as an
 *   `<image>` when it starts with `http` / `//` / `/` / `./`)
 * - the newer `iconData` / `iconUrl` / `icon` fields take precedence (see the
 *   menu scenario)
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the bubble
 * inside the demo.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const menuOpen = ref(false);
const picked = ref('—');

/** The legacy `iconClass` field still works: name → SnIcon; URL → `<image>`. */
const legacyMenu = [
  { content: 'Mark as favourite', iconClass: 'star' },
  { content: 'Edit', iconClass: 'square-pen' },
  { content: 'Delete', iconClass: 'trash-2', disabled: true },
];

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—';
  menuOpen.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="menuOpen"
      mode="menu"
      :content="legacyMenu"
      placement="bottom-start"
      custom-class="sn-demo-contained"
      @menuclick="onMenuClick"
    >
      <SnButton block>menu mode + legacy iconClass</SnButton>
    </SnPopover>

    <text class="sn-demo__meta">Picked: {{ picked }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
</style>
