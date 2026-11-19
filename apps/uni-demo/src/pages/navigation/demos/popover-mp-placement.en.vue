<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — top / left / right / bottom placement grid.
 * Triggers sit at the corners so each anchored bubble has room to open; the
 * start / end alignment variants are covered by the alignment demo.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { MapPin } from '@snui/uni-src/components/sn-icon/sn-icon-set';

type Direction = 'top' | 'left' | 'right' | 'bottom';

/** Corner layout: Top/Left in row 1, Right/Bottom in row 2 (flex, MP / App safe). */
const firstRow: { key: Direction; label: string }[] = [
  { key: 'top', label: 'Top' },
  { key: 'left', label: 'Left' },
];
const secondRow: { key: Direction; label: string }[] = [
  { key: 'right', label: 'Right' },
  { key: 'bottom', label: 'Bottom' },
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
      <view v-for="(row, rowIndex) in [firstRow, secondRow]" :key="rowIndex" class="sn-popover-demo__row">
        <view v-for="cell in row" :key="cell.key" class="sn-popover-demo__cell">
          <SnPopover
            :model-value="openDirection === cell.key"
            :placement="cell.key"
            title="Quick Tip"
            :content="`This popover appears on the ${cell.key} side of the trigger button.`"
            :icon-data="MapPin"
            custom-class="sn-demo-contained"
            @update:model-value="setOpen(cell.key, $event)"
          >
            <SnButton size="small">{{ cell.label }}</SnButton>
          </SnPopover>
        </view>
        <view class="sn-popover-demo__gap" />
      </view>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__hint"
      >All four directions render an arrow pointing at the trigger; tap anywhere outside to
      close.</text
    >
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
  gap: 24rpx;
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
/* Row 1 pairs [Top … Left]: the spacer keeps Left on the right edge. */
.sn-popover-demo__gap {
  flex: 1;
}
.sn-popover-demo__space {
  height: 300rpx;
}
/* Docs-preview only — keep the bubble inside the demo flow. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
</style>
