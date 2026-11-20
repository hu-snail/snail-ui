<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — top / left / right / bottom placement grid.
 *
 * 参考稿布局：上行「上 / 左」、下行「右 / 下」，两端对齐留出中缝；每个气泡
 * 带彩色图标圆底 + 标题 + 描述（与基础 / 对齐 demo 同一卡片语言）。
 * -start / -end 对齐档见「对齐方式」场景。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { MapPin } from '@snui/uni-src/components/sn-icon/sn-icon-set';

type Direction = 'top' | 'left' | 'right' | 'bottom';

/** Corner layout: 上/左 in row 1, 右/下 in row 2 (flex, MP / App safe). */
const firstRow: { key: Direction; label: string; side: string }[] = [
  { key: 'top', label: 'Top', side: '上方' },
  { key: 'left', label: 'Left', side: '左侧' },
];
const secondRow: { key: Direction; label: string; side: string }[] = [
  { key: 'right', label: 'Right', side: '右侧' },
  { key: 'bottom', label: 'Bottom', side: '下方' },
];

const openDirection = ref<Direction | null>(null);

function setOpen(direction: Direction, value: boolean): void {
  openDirection.value = value
    ? direction
    : openDirection.value === direction
      ? null
      : openDirection.value;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__grid">
      <view class="sn-popover-demo__row">
        <view v-for="cell in firstRow" :key="cell.key" class="sn-popover-demo__cell">
          <SnPopover
            :model-value="openDirection === cell.key"
            :placement="cell.key"
            title="快速提示"
            :content="`这个气泡出现在触发器的${cell.side}。`"
            :icon-data="MapPin"
            icon-bg="var(--sn-mp-color-feedback-info-soft)"
            icon-color="var(--sn-mp-color-feedback-info)"
            custom-class="sn-demo-contained"
            @update:model-value="setOpen(cell.key, $event)"
          >
            <SnButton size="small">{{ cell.label }}</SnButton>
          </SnPopover>
        </view>
      </view>
      <view class="sn-popover-demo__row">
        <view v-for="cell in secondRow" :key="cell.key" class="sn-popover-demo__cell">
          <SnPopover
            :model-value="openDirection === cell.key"
            :placement="cell.key"
            title="快速提示"
            :content="`这个气泡出现在触发器的${cell.side}。`"
            :icon-data="MapPin"
            icon-bg="var(--sn-mp-color-feedback-info-soft)"
            icon-color="var(--sn-mp-color-feedback-info)"
            custom-class="sn-demo-contained"
            @update:model-value="setOpen(cell.key, $event)"
          >
            <SnButton size="small">{{ cell.label }}</SnButton>
          </SnPopover>
        </view>
      </view>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__hint">四个方向都带指向触发器的大箭头；点击气泡外部任意位置关闭。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-demo__grid {
  display: flex;
  flex-direction: column;
  gap: 48rpx;
  padding: 24rpx 0;
}
.sn-popover-demo__row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.sn-popover-demo__cell {
  display: flex;
  flex-direction: row;
}
.sn-popover-demo__space {
  height: 340rpx;
}
/* Docs-preview only — keep the bubble inside the demo flow. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
</style>
