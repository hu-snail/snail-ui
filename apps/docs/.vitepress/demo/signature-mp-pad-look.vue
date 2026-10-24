<script setup lang="ts">
/** Demo: sn-signature — 画板外观与滚动：height / width / backgroundColor / disableScroll / step。 */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">height（数字按 rpx 设计值）</text>
    <SnSignature :height="320" />

    <text class="sn-demo__title">width + backgroundColor（覆盖画板底色 token）</text>
    <SnSignature
      width="100%"
      :height="280"
      background-color="var(--sn-mp-color-background-soft)"
    />

    <text class="sn-demo__title">disableScroll=false（画的时候页面仍可滚动）</text>
    <SnSignature :disable-scroll="false" :height="260" />

    <text class="sn-demo__title">step（一次撤回 2 笔，需配合 enableHistory）</text>
    <SnSignature enable-history :step="2" :height="260" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
