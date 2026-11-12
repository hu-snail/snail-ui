<script setup lang="ts">
/**
 * Demo: sn-popover — English shadow of popover-mp-icon-class.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const menuOpen = ref(false);
const picked = ref('—');

/** The legacy `iconClass` field: a name (resolved through SnIcon) or an image source. */
const legacyMenu = [
  { content: 'Pin to top', iconClass: 'star' },
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
      <SnButton block>Menu mode + the legacy iconClass field</SnButton>
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
