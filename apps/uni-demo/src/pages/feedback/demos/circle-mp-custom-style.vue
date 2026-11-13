<script setup lang="ts">
/**
 * Demo: sn-circle (uni-end) — custom-class / custom-style.
 *
 * 长说明文案放环下方的 meta 行，不塞进环心（`text` 留给短数值 / 一两个
 * 字的场景标签；长文案会撑出环径，见 gen 场景拆分说明）。环心只显示
 * 百分比，custom-class / custom-style 的落点用 meta 文字解释。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-circle from its SFC source.
 */
import { ref } from 'vue';
import SnCircle from '@snui/uni-src/components/sn-circle/sn-circle.vue';

const percent = ref(60);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCircle
      :model-value="percent"
      :size="160"
      custom-class="sn-demo__ring"
      custom-style="padding: var(--sn-mp-spacing-2);"
    />

    <text class="sn-demo__meta">custom-class 与 custom-style 都落在 sn-circle 根节点上；环心文案（text）适合短数值，长说明请放环外。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  text-align: center;
  max-width: 480rpx;
}
/* custom-class 落在 sn-circle 根节点上。 */
.sn-demo :deep(.sn-demo__ring) {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
