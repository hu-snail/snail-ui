<script setup lang="ts">
/**
 * Demo: sn-slide-verify — icon / successIcon / iconPrefix / cssIcon / iconSize / successIconSize.
 *
 * Without `icon` / `success-icon` the built-in SVG glyphs render; a name goes
 * through the iconfont convention (`icon-prefix` + `-` + name) and `css-icon`
 * treats the name as a bare class. `icon-size` / `success-icon-size` size the
 * two glyph boxes independently (a number is rpx).
 */
import { ref } from 'vue'
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue'

const state = ref('Not verified')
const onSuccess = (): void => { state.value = 'Verified' }
const onFail = (): void => { state.value = 'Failed' }
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSlideVerify
      icon="demo-next"
      success-icon="demo-done"
      icon-prefix="sn-icon"
      :icon-size="40"
      :success-icon-size="36"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta">icon / successIcon follow the iconfont convention (sn-icon-demo-next); sizes are independent</text>

    <SnSlideVerify
      css-icon="demo-verify-css"
      :icon-size="32"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta">cssIcon as a string: the class renders verbatim, with no iconPrefix</text>

    <SnSlideVerify
      :tolerance="24"
      custom-class="sn-demo__verify"
      custom-style="padding: 8rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta">tolerance=24 widens the right-edge slack; customClass / customStyle land on the root</text>

    <text class="sn-demo__meta">Status: {{ state }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/*
 * Placeholder iconfont glyphs: in a real app these classes come from an icon
 * font. Here tokens draw a distinguishable box that proves the class
 * passthrough works.
 */
.sn-demo :deep(.sn-icon-demo-next),
.sn-demo :deep(.sn-icon-demo-done),
.sn-demo :deep(.demo-verify-css) {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo :deep(.sn-icon-demo-next)::after { content: 'N'; }
.sn-demo :deep(.sn-icon-demo-done)::after { content: 'D'; }
.sn-demo :deep(.demo-verify-css)::after { content: 'C'; }
/* custom-class lands on the sn-slide-verify root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__verify) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
