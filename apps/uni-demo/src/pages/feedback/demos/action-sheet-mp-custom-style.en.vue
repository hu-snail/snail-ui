<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — English shadow of action-sheet-mp-custom-style.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue';

const open = ref(false);

const actions = [
  { name: 'Share with friends' },
  { name: 'Save to album' },
  { name: 'Delete', disabled: true },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">Open the styled panel</SnButton>

    <text class="sn-demo__meta">
      custom-title-class adds a class to the title; custom-style lands on the panel, so panel-level
      touches like extra padding can be layered on.
    </text>

    <SnActionSheet
      v-model="open"
      title="Custom title"
      :actions="actions"
      cancel-text="Cancel"
      custom-title-class="sn-demo__title"
      custom-style="padding-bottom: var(--sn-mp-spacing-8);"
      custom-class="sn-demo-contained"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-title-class lands on the panel title node — needs :deep to cross the boundary. */
.sn-demo :deep(.sn-demo__title) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
  letter-spacing: 2rpx;
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
