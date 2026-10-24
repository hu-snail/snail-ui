<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — position presets, colors and directions.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-fab from its SFC source.
 */
import { ref } from 'vue'
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue'

const topLeft = ref(false)
const topRight = ref(false)
const bottomLeft = ref(false)
const rightCenter = ref(false)
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <text class="sn-fab-demo__meta">
      Four anchor presets: left-top / right-top / left-bottom / right-center
    </text>

    <SnFab
      v-model:active="topLeft"
      type="success"
      position="left-top"
      direction="bottom"
      :gap="{ top: 8, left: 8 }"
      custom-class="sn-demo-contained"
    />

    <SnFab
      v-model:active="topRight"
      type="info"
      position="right-top"
      direction="left"
      :gap="{ top: 8, right: 8 }"
      custom-class="sn-demo-contained"
    />

    <SnFab
      v-model:active="bottomLeft"
      type="warning"
      position="left-bottom"
      direction="top"
      :gap="{ bottom: 8, left: 8 }"
      custom-class="sn-demo-contained"
    />

    <SnFab
      v-model:active="rightCenter"
      type="danger"
      position="right-center"
      direction="left"
      :gap="{ right: 8 }"
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
