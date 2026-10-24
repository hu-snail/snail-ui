<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — all four placement families.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue'
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue'

const placements = ['top', 'bottom', 'left', 'right'] as const
const openIndex = ref<number | null>(null)

function toggle(index: number): void {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-tooltip-demo__grid">
      <view
        v-for="(placement, index) in placements"
        :key="placement"
        class="sn-tooltip-demo__cell"
      >
        <SnTooltip
          :model-value="openIndex === index"
          :content="`placement = ${placement}`"
          :placement="placement"
          @update:model-value="toggle(index)"
        >
          <view class="sn-tooltip-demo__trigger">
            <text class="sn-tooltip-demo__trigger-text">{{ placement }}</text>
          </view>
        </SnTooltip>
      </view>
    </view>

    <text class="sn-tooltip-demo__meta">
      小程序没有 hover，四个方向都用点击触发。
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
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  padding: 60rpx 0;
}
.sn-tooltip-demo__cell {
  flex: 1 1 40%;
  display: flex;
  justify-content: center;
}
.sn-tooltip-demo__trigger {
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  background: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-primary);
}
.sn-tooltip-demo__trigger-text {
  font-size: 24rpx;
}
.sn-tooltip-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
