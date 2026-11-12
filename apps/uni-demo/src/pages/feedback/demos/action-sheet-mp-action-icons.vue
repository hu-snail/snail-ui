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
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
/* #endif */
</style>
