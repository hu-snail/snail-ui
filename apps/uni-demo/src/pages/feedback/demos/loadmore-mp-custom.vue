<script setup lang="ts">
/**
 * Demo: sn-loadmore (uni-end) — loading-props / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loadmore from its SFC source.
 */
import SnLoadmore from '@snui/uni-src/components/sn-loadmore/sn-loadmore.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnLoadmore
      state="loading"
      loading-text="loading-props 换 spinner 形态"
      :loading-props="{ type: 'wave' }"
    />

    <SnLoadmore
      state="loading"
      loading-text="loading-props 同时改形态与颜色"
      :loading-props="{ type: 'dots', color: 'var(--sn-mp-color-feedback-success)' }"
    />

    <SnLoadmore
      state="finished"
      finished-text="custom-class 追加根节点类名"
      custom-class="sn-demo__loadmore"
    />

    <SnLoadmore
      state="error"
      error-text="custom-style 叠加内联样式"
      custom-class="sn-demo__loadmore"
      custom-style="border-radius: var(--sn-mp-radius-md);"
    />

    <text class="sn-demo__meta">
      loading-props 直接透传给内部 sn-loading，因此 type / color / size 都可以改； custom-class /
      custom-style 落在根节点。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-loadmore 根节点上。 */
.sn-demo :deep(.sn-demo__loadmore) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
