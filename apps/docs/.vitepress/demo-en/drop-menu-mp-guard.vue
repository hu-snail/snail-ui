<script setup lang="ts">
/**
 * Demo: sn-drop-menu (uni-end) — up direction, before-toggle guard, custom keys.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-drop-menu from its SFC source.
 */
import { ref } from 'vue'
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue'

const value = ref('')

/** Fields renamed — the guard demo also shows the key remapping. */
const options = [
  { name: 'Any', id: 'all' },
  { name: 'Under $50', id: 'lt50' },
  { name: '$50 - $200', id: 'mid' },
]

const blocked = ref(0)

/** Block opening twice to show the guard working, then allow. */
function beforeToggle(): boolean {
  blocked.value += 1
  return blocked.value > 2
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-drop-menu-demo__spacer" />

    <SnDropMenu
      v-model="value"
      :options="options"
      direction="up"
      label-key="name"
      value-key="id"
      title="Price range"
      :before-toggle="beforeToggle"
      custom-class="sn-demo-contained"
    />

    <text class="sn-drop-menu-demo__meta">
      The first two taps are blocked by before-toggle ({{ Math.min(blocked, 2) }} blocked)
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-drop-menu-demo__spacer {
  height: 320rpx;
}
.sn-drop-menu-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-drop-menu.sn-demo-contained {
  position: relative;
}
</style>
