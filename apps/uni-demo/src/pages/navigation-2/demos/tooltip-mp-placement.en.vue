<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — all 12 placement directions (wot-ui demo grid).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** One grid row; `null` fills a cell so the left / right families mirror. */
const rows: (Placement | null)[][] = [
  ['bottom-start', 'bottom', 'bottom-end'],
  ['right-start', null, 'left-start'],
  ['right', null, 'left'],
  ['right-end', null, 'left-end'],
  ['top-start', 'top', 'top-end'],
];

const openPlacement = ref<Placement | null>(null);

function setOpen(placement: Placement, value: boolean): void {
  openPlacement.value = value
    ? placement
    : openPlacement.value === placement
      ? null
      : openPlacement.value;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-tooltip-demo__grid">
      <template v-for="(row, rowIndex) in rows" :key="rowIndex">
        <view
          v-for="(placement, cellIndex) in row"
          :key="placement ?? `empty-${rowIndex}-${cellIndex}`"
          class="sn-tooltip-demo__cell"
        >
          <SnTooltip
            v-if="placement"
            :model-value="openPlacement === placement"
            :content="`${placement} hint text`"
            :placement="placement"
            @update:model-value="setOpen(placement, $event)"
          >
            <SnButton type="primary" size="small">{{ placement }}</SnButton>
          </SnTooltip>
        </view>
      </template>
    </view>

    <text class="sn-tooltip-demo__meta">
      Miniprogram has no hover, so all 12 directions open on tap; tapping outside
      the bubble (transparent mask) closes it too.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tooltip-demo__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx 16rpx;
  padding: 40rpx 0;
}
.sn-tooltip-demo__cell {
  display: flex;
  justify-content: center;
}
.sn-tooltip-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
