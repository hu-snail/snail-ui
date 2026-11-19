<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — start / center / end alignment over a trigger
 * row (top-start / top / top-end), rich card content on all three.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';

type Alignment = 'start' | 'center' | 'end';

const alignments: { key: Alignment; label: string; placement: 'top-start' | 'top' | 'top-end' }[] =
  [
    { key: 'start', label: 'Start', placement: 'top-start' },
    { key: 'center', label: 'Center', placement: 'top' },
    { key: 'end', label: 'End', placement: 'top-end' },
  ];

const openAlignment = ref<Alignment | null>(null);

function setOpen(alignment: Alignment, value: boolean): void {
  openAlignment.value = value
    ? alignment
    : openAlignment.value === alignment
      ? null
      : openAlignment.value;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__row">
      <view v-for="item in alignments" :key="item.key" class="sn-popover-demo__cell">
        <SnPopover
          :model-value="openAlignment === item.key"
          :placement="item.placement"
          title="Alignment"
          :content="`Aligned to the ${item.key} of the trigger (${item.placement}).`"
          :icon-data="Settings"
          :visible-arrow="false"
          custom-class="sn-demo-contained"
          @update:model-value="setOpen(item.key, $event)"
        >
          <SnButton size="small">{{ item.label }}</SnButton>
        </SnPopover>
      </view>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__hint"
      >12 placements = 4 directions (top / left / right / bottom) × 3 alignments (-start /
      center / -end); this demo covers the top family.</text
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
.sn-popover-demo__row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16rpx;
}
.sn-popover-demo__cell {
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;
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
