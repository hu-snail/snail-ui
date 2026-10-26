<script setup lang="ts">
/**
 * Demo: sn-tooltip — 多行内容与 `content` 插槽。
 *
 * - `content` 传数组时每条渲染成一行（对象取 `label` / `text` / `content` / `name` 之一）
 * - `content` 插槽完全替换正文，可放任意 `<view>` / `<text>` 结构
 * - `offset` 支持 `number`、`[x, y]`、`{ x, y }` 三种写法，通过
 *   `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y` 参与定位计算
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把气泡的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const rowsOpen = ref(false);
const slotOpen = ref(false);

const rows = [
  { label: '发货时间：48 小时内' },
  { label: '运费：满 99 元包邮' },
  '支持 7 天无理由退换',
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      v-model="rowsOpen"
      :content="rows"
      placement="bottom"
      :offset="[0, 8]"
      custom-class="sn-demo-contained"
    >
      <SnButton block>多行提示（数组 content）</SnButton>
    </SnTooltip>

    <SnTooltip
      v-model="slotOpen"
      placement="top"
      :offset="{ x: 0, y: 10 }"
      custom-class="sn-demo-contained"
    >
      <SnButton block>插槽内容</SnButton>
      <template #content>
        <view class="sn-demo__bubble">
          <text class="sn-demo__bubble-title">自定义气泡</text>
          <text class="sn-demo__bubble-text"
            >content 插槽可以放任意结构，不再受 content 文案限制。</text
          >
        </view>
      </template>
    </SnTooltip>

    <text class="sn-demo__meta"
      >状态：{{ rowsOpen ? '多行已展开' : '多行已收起' }} /
      {{ slotOpen ? '插槽已展开' : '插槽已收起' }}</text
    >
  </view>
</template>

<style scoped>
.sn-demo__bubble {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
}
.sn-demo__bubble-title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__bubble-text {
  font-size: 22rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-tooltip.sn-demo-contained) {
  position: relative;
}
</style>
