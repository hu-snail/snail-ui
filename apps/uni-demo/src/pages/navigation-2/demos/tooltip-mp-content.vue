<script setup lang="ts">
/**
 * Demo: sn-tooltip — 多行纯文字内容。
 *
 * - `content` 传字符串数组时每条渲染成一行；tooltip 只承载纯文字提示，
 *   富卡片（图标 / 标题 / 描述 / 操作）请用 sn-popover
 * - `offset` 支持 `number`、`[x, y]`、`{ x, y }` 三种写法，通过
 *   `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y` 参与定位计算
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把气泡的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const rowsOpen = ref(false);
const singleOpen = ref(false);

const rows = ['发货时间：48 小时内', '运费：满 99 元包邮', '支持 7 天无理由退换'];
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
      v-model="singleOpen"
      content="深色底盘、纯文字提示，与 sn-popover 的富卡片分层"
      placement="top"
      :offset="{ x: 0, y: 10 }"
      custom-class="sn-demo-contained"
    >
      <SnButton block>单行提示</SnButton>
    </SnTooltip>

    <text class="sn-demo__meta"
      >状态：{{ rowsOpen ? '多行已展开' : '多行已收起' }} /
      {{ singleOpen ? '单行已展开' : '单行已收起' }}</text
    >
    <text class="sn-demo__hint"
      >tooltip 只承载文字提示：深色底盘（toast 同款 token）；富气泡 / 菜单 / 底部面板用
      sn-popover。</text
    >
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
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-tooltip.sn-demo-contained) {
  position: relative;
}
</style>
