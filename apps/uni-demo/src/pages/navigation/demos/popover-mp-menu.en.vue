<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — menu mode with a tappable option list.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Edit, Download, Trash } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ Edit, Download, Trash });

const open = ref(false);
const picked = ref('—');

const menu = [
  { content: 'Edit', iconClass: 'Edit' },
  { content: 'Download', iconClass: 'Download' },
  { content: 'Delete', iconClass: 'Trash', disabled: true },
];

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '';
  open.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="open"
      mode="menu"
      :content="menu"
      placement="bottom-end"
      custom-class="sn-demo-contained"
      @menuclick="onMenuClick"
    >
      <SnButton type="primary" block>More actions</SnButton>
    </SnPopover>

    <text class="sn-popover-demo__meta">Picked: {{ picked }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-popover-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-popover.sn-demo-contained {
  position: absolute;
}
</style>
