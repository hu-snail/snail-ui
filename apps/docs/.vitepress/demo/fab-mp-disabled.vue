<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — expandable=false, disabled and draggable.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fab from its SFC source.
 */
import { ref } from 'vue'
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue'

const clicks = ref(0)
const active = ref(false)
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <text class="sn-fab-demo__meta">
      expandable=false 只抛 click（已触发 {{ clicks }} 次）；draggable 可拖动
    </text>

    <SnFab
      position="right-bottom"
      :expandable="false"
      :gap="{ bottom: 8, right: 8 }"
      custom-class="sn-demo-contained"
      @click="clicks += 1"
    />

    <SnFab
      position="left-bottom"
      disabled
      :gap="{ bottom: 8, left: 8 }"
      custom-class="sn-demo-contained"
    />

    <SnFab
      v-model:active="active"
      type="info"
      position="right-top"
      draggable
      :gap="{ top: 8, right: 8 }"
      custom-class="sn-demo-contained"
    />
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
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
