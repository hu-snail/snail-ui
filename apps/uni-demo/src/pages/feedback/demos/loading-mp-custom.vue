<script setup lang="ts">
/**
 * Demo: sn-loading (uni-end) — inherit-color / custom-class / custom-style /
 * custom-spinner-class.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loading from its SFC source.
 */
import SnLoading from '@snui/uni-src/components/sn-loading/sn-loading.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__inherit">
      <SnLoading inherit-color type="circular" text="inherit-color：继承父级文字色" />
    </view>

    <SnLoading
      type="spinner"
      text="custom-class + custom-style"
      custom-class="sn-demo__block"
      custom-style="padding: var(--sn-mp-spacing-4);"
    />

    <SnLoading
      type="dots"
      text="custom-spinner-class 只作用于加载器盒子"
      custom-spinner-class="sn-demo__spinner"
    />

    <text class="sn-demo__meta">
      custom-class / custom-style 落在根节点；custom-spinner-class 只落在中间的加载器
      盒子上，因此可以单独放大 spinner 而不影响文案。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* inherit-color 读取父级 color，这里把父级设成品牌色。 */
.sn-demo__inherit {
  color: var(--sn-mp-color-feedback-success);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-loading 根节点上。 */
.sn-demo :deep(.sn-demo__block) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
/* custom-spinner-class 落在加载器盒子上。 */
.sn-demo :deep(.sn-demo__spinner) {
  transform: scale(1.4);
}
</style>
