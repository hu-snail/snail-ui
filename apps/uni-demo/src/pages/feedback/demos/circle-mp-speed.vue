<script setup lang="ts">
/**
 * Demo: sn-circle (uni-end) — speed.
 *
 * 三个环只展示进度，speed 标签放在各自环的下方（环心 `text` 留给短数值，
 * 「speed=…」这类参数说明塞在环心会溢出环径）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-circle from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCircle from '@snui/uni-src/components/sn-circle/sn-circle.vue';

const percent = ref(20);

/** 三档 speed 各自的环 + 环下标签。 */
const speeds = [
  { speed: 0, label: 'speed=0' },
  { speed: 200, label: 'speed=200' },
  { speed: 10, label: 'speed=10' },
] as const;

function step(): void {
  percent.value = percent.value >= 100 ? 20 : Math.min(100, percent.value + 20);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <view v-for="item in speeds" :key="item.speed" class="sn-circle-demo__cell">
        <SnCircle :model-value="percent" :size="120" :speed="item.speed" />
        <text class="sn-circle-demo__label">{{ item.label }}</text>
      </view>
    </view>

    <SnButton type="primary" block @tap="step">+20%（观察不同 speed 的过渡）</SnButton>

    <text class="sn-demo__meta">speed 是「每秒多少百分比」，0 关闭过渡。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
/* 环 + 环下标签的纵向单元。 */
.sn-circle-demo__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}
.sn-circle-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
