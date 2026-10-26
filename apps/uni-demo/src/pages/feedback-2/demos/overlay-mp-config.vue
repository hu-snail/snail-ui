<script setup lang="ts">
/**
 * Demo: sn-overlay (uni-end) — duration / lockScroll / zIndex / custom style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-overlay from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnOverlay from '@snui/uni-src/components/sn-overlay/sn-overlay.vue';

const noAnim = ref(false);
const slow = ref(false);
const unlocked = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton block @click="noAnim = true">duration=false（无动画）</SnButton>
    <SnButton block @click="slow = true">duration=800（慢动画）</SnButton>
    <SnButton block @click="unlocked = true">lockScroll=false（可穿透滚动）</SnButton>

    <SnOverlay
      :show="noAnim"
      :duration="false"
      custom-class="sn-demo-contained"
      @click="noAnim = false"
    >
      <text class="sn-overlay-demo__hint">无动画：显示 / 关闭瞬时生效</text>
    </SnOverlay>

    <SnOverlay
      :show="slow"
      :duration="800"
      :z-index="30"
      custom-class="sn-demo-contained"
      @click="slow = false"
    >
      <text class="sn-overlay-demo__hint">800ms 淡入淡出，z-index 30</text>
    </SnOverlay>

    <SnOverlay
      :show="unlocked"
      :lock-scroll="false"
      custom-class="sn-demo-contained"
      custom-style="padding: 8px"
      @click="unlocked = false"
    >
      <text class="sn-overlay-demo__hint">lockScroll=false：背景页面仍可滚动</text>
    </SnOverlay>
  </view>
</template>

<style scoped>
.sn-overlay-demo__hint {
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  background: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-size: 28rpx;
}
/* Docs-preview only: keep the fixed-position scrim inside the phone screen. */
.sn-overlay.sn-demo-contained {
  position: absolute;
}
</style>
