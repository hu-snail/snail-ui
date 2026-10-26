<script setup lang="ts">
/**
 * Demo: sn-resize (uni-end) — custom-class / custom-style 与嵌套测量边界。
 *
 * 三个 prop 分工不同：
 *   - customClass           → 外层包裹节点
 *   - customStyle           → 外层包裹节点的内联样式
 *   - customContainerClass  → 真正被 `boundingClientRect` 测量的内层节点
 *
 * 下面把外层画成虚线框、内层画成实心块，就能看出两层各自的边界。
 */
import { ref } from 'vue';
import SnResize from '@snui/uni-src/components/sn-resize/sn-resize.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const rows = ref(1);
const lastBox = ref('—');

function onResize(rect: { width: number; height: number }): void {
  lastBox.value = `${rect.width} × ${rect.height}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnResize
      custom-class="sn-demo__wrapper"
      custom-style="padding: var(--sn-mp-spacing-2);"
      custom-container-class="sn-demo__measured"
      @resize="onResize"
    >
      <view v-for="i in rows" :key="i" class="sn-demo__row">第 {{ i }} 行内容</view>
    </SnResize>
    <text class="sn-demo__meta">最近一次测量：{{ lastBox }}</text>

    <view class="sn-demo__actions">
      <SnButton size="small" @tap="rows += 1">增加一行</SnButton>
      <SnButton size="small" plain @tap="rows = 1">重置</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: stretch;
}
/* custom-class 落在外层包裹节点上。 */
.sn-demo :deep(.sn-demo__wrapper) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
/* custom-container-class 落在被测量的内层节点上。 */
.sn-demo :deep(.sn-demo__measured) {
  padding: var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo__row {
  padding: var(--sn-mp-spacing-1) 0;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__actions {
  display: flex;
  gap: 12rpx;
}
</style>
