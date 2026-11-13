<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — rows with icons (actions[].icon).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC
 * source. Per AGENTS.md §113, icons come from the SnIcon catalog.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue';

const open = ref(false);
const picked = ref('—');

const actions = [
  { name: '选项一', icon: 'star' },
  { name: '选项二', icon: 'heart' },
  { name: '选项三', icon: 'wallet' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">打开带图标的面板</SnButton>
    <text class="sn-action-sheet-demo__meta">已选择：{{ picked }}</text>

    <SnActionSheet
      v-model="open"
      title="带图标"
      :actions="actions"
      cancel-text="取消"
      custom-class="sn-demo-contained"
      @select="picked = $event.item.name ?? ''"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-action-sheet-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs preview only — pin the fixed layer to the phone frame. The uni-demo-x
 * generated copy strips this rule in gen-x.mjs (vapor ignores style-level
 * conditional compilation, so the App side must not ship it). */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
</style>
