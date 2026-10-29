<script setup lang="ts">
/** Demo: sn-backtop — semantic themes; icon and label flip to on-primary. */
import { ref } from 'vue';
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue';

const themes = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;

/** Always visible: past the default 300 threshold. */
const scrollTop = ref(500);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__grid">
      <view v-for="name in themes" :key="name" class="sn-demo__cell">
        <text class="sn-demo__cell-label">{{ name }}</text>
        <view class="sn-demo__cell-stage">
          <SnBacktop
            :scroll-top="scrollTop"
            :theme="name"
            text="Top"
            :bottom="16"
            :right="16"
            custom-class="sn-demo-pinned"
          />
        </view>
      </view>
    </view>
    <text class="sn-demo__meta">
      theme only swaps the fill and border tokens — the icon and label invert
      automatically, and everything follows the theme tokens in dark mode.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__cell {
  display: flex;
  flex: 1 1 44%;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__cell-label {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__cell-stage {
  position: relative;
  height: 160rpx;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
  overflow: hidden;
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed buttons inside each cell. */
.sn-demo__cell-stage :deep(.sn-backtop.sn-demo-pinned) {
  position: absolute;
}
</style>
