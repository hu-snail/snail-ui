<script setup lang="ts">
/**
 * Demo: sn-grid — 点击反馈：clickable / hover-class / click 事件。
 *
 * - `clickable` 让每个格子可点并按 `hover-class` 给出按压反馈
 * - `hover-class` 指定格子按下时附加的类名（默认 `sn-grid-item__content--hover`）
 */
import { ref } from 'vue';
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';

const tapped = ref('—');

function onCellClick(payload: { url: string; linkType: string }): void {
  tapped.value = payload.url === '' ? '（无 url）' : payload.url;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnGrid :column="4" clickable hover-class="sn-demo__cell-press" @click="onCellClick">
      <SnGridItem text="扫一扫" icon="camera" />
      <SnGridItem text="付款" icon="wallet" />
      <SnGridItem text="收款" icon="banknote" />
      <SnGridItem text="更多" icon="ellipsis" />
    </SnGrid>

    <text class="sn-demo__meta">最近点击：{{ tapped }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* hover-class 由 sn-grid 透传到每个格子，类名本身定义在 demo 里。 */
.sn-demo :deep(.sn-demo__cell-press) {
  background-color: var(--sn-mp-color-action-primary-soft);
}
</style>
