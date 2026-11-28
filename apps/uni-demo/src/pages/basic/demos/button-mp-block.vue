<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 块级按钮（`block`）× 场景。
 *
 * block 占满父容器宽度，叠加语义色与常用形态：实心、圆角胶囊、朴素、
 * 柔和、加载态。
 *
 * 布局说明：uni-app x 不支持 flex `gap`，块级按钮的纵向间距用内联
 * `custom-style` margin 兜底。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 块级按钮纵向间距（uni-app x 无 gap 兜底）。 */
const stackGap = { 'margin-bottom': '16rpx' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">实心（block × 语义色）</text>
    <SnButton :custom-style="stackGap" block type="primary">主要按钮</SnButton>
    <SnButton :custom-style="stackGap" block type="success">成功按钮</SnButton>
    <SnButton :custom-style="stackGap" block type="danger">危险按钮</SnButton>

    <text class="sn-mp-btn-label">圆角（block × round）</text>
    <SnButton :custom-style="stackGap" block round type="primary">圆角主要按钮</SnButton>
    <SnButton :custom-style="stackGap" block round type="success">圆角成功按钮</SnButton>

    <text class="sn-mp-btn-label">朴素（block × plain）</text>
    <SnButton :custom-style="stackGap" block variant="plain" type="primary">朴素主要按钮</SnButton>
    <SnButton :custom-style="stackGap" block variant="plain" type="danger">朴素危险按钮</SnButton>

    <text class="sn-mp-btn-label">柔和（block × soft）</text>
    <SnButton :custom-style="stackGap" block variant="soft" type="primary">柔和主要按钮</SnButton>
    <SnButton :custom-style="stackGap" block variant="soft" type="success">柔和成功按钮</SnButton>

    <text class="sn-mp-btn-label">加载（block × loading）</text>
    <SnButton :custom-style="stackGap" block loading type="primary">保存中</SnButton>
    <SnButton block loading type="success">提交中</SnButton>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
