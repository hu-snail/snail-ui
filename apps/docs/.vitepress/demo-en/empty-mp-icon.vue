<script setup lang="ts">
/**
 * Demo: sn-empty (uni-end) — icon sources (registry / CSS icon / image URL).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-empty from its SFC source.
 */
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Home, Search, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Home, Search, Star })
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnEmpty icon="Search" tip="Registry icon: no search results" />
    <SnEmpty icon="Star" :icon-size="160" tip="Custom size: no favourites yet" />
    <SnEmpty
      :css-icon="true"
      icon-prefix="sn-demo-icon"
      icon="sn-demo-icon--box"
      tip="CSS icon (iconfont class)"
    />
    <SnEmpty
      icon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 7.5 12 3l9 4.5v9L12 21 3 16.5Z' fill='none' stroke='%23999'/%3E%3C/svg%3E"
      :icon-size="160"
      tip="Image URL mode"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
/* A stand-in iconfont glyph — a square drawn with CSS, since the demo does not
 * ship a font file. Real projects point at their own iconfont classes. */
.sn-demo-icon--box {
  display: block;
  width: 100%;
  height: 100%;
  border: 4rpx dashed var(--sn-mp-color-border-default);
  border-radius: 16rpx;
}
</style>
