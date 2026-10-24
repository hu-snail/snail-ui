<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — custom-title-class / custom-style /
 * lazy-render / safe-area-inset-bottom.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue'

const open = ref(false)

const actions = [
  { name: 'Share with friends' },
  { name: 'Save to album' },
  { name: 'Delete', disabled: true },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">Open custom sheet</SnButton>

    <text class="sn-demo__meta">
      custom-title-class adds a class to the title; custom-style lands on the panel;
      lazy-render=false renders the content before the first open;
      safe-area-inset-bottom=false drops the bottom safe-area padding.
    </text>

    <SnActionSheet
      v-model="open"
      title="Custom title"
      :actions="actions"
      cancel-text="Cancel"
      :lazy-render="false"
      :safe-area-inset-bottom="false"
      :root-portal="true"
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
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
</style>
