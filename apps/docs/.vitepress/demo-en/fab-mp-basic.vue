<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — anchored floating button with an expanding menu.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fab from its SFC source.
 * Docs preview: `custom-class="sn-demo-contained"` pins the fixed layer to the
 * phone screen (the real runtime keeps `position: fixed`).
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue'

const active = ref(false)
const lastAction = ref('—')

function pick(label: string): void {
  lastAction.value = label
  active.value = false
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <text class="sn-fab-demo__meta">Triggered: {{ lastAction }}</text>

    <SnFab
      v-model:active="active"
      position="right-bottom"
      direction="top"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" round size="small" @tap="pick('Compose')">C</SnButton>
      <SnButton type="success" round size="small" @tap="pick('Upload')">U</SnButton>
      <SnButton round size="small" @tap="pick('Note')">N</SnButton>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 520rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-surface);
}
.sn-fab-demo__meta {
  padding: 24rpx;
  font-size: 26rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
