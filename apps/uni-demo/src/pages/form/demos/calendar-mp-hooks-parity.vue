<script setup lang="ts">
/**
 * Demo: sn-calendar — 快捷 chip 回调与 wot-ui 对齐的占位参数。
 * onShortcutsClick 会被调用；timeFilter / hideSecond / innerDisplayFormat / ellipsis /
 * showTypeSwitch 声明但未实现（本构建没有时间滚筒与区间 tab），仅用于配置对齐。
 */
import { ref } from 'vue';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const value = ref<number | number[] | null>(null);
const open = ref(false);
const lastShortcut = ref('—');

const shortcuts = [
  { text: '今天', days: 0 },
  { text: '近一周', days: -7 },
];

/** 点快捷 chip 之后的回调。 */
const onShortcut = (shortcut: { text: string }) => {
  lastShortcut.value = shortcut.text;
};
/** timeFilter：只保留偶数小时（声明但未实现，钩子不会运行）。 */
const evenHours = (type: string, values: number[]) =>
  type === 'hour' ? values.filter((v) => v % 2 === 0) : values;
/** 区间文案回显（字符串或格式化函数，声明但未实现）。 */
const displayFormat = (payload: number | number[] | null) => {
  if (!Array.isArray(payload)) return '未选择';
  return `${payload.length} 个日期`;
};
/** beforeConfirm 拦确认。 */
const guard = (payload: number | number[] | null) => payload !== null;

const innerFormat = '自定义区间回显';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">shortcuts + onShortcutsClick + beforeConfirm</text>
    <view class="sn-demo__button" @tap="open = true">快捷选项</view>
    <text class="sn-demo__meta">最近点击的快捷项：{{ lastShortcut }}</text>
    <SnCalendar
      v-model="value"
      v-model:visible="open"
      type="daterange"
      title="快捷选项"
      :min-date="min"
      :max-date="max"
      :shortcuts="shortcuts"
      :on-shortcuts-click="onShortcut"
      :before-confirm="guard"
      confirm-text="确定区间"
      :inner-display-format="innerFormat"
      :ellipsis="true"
      :show-type-switch="false"
      :hide-second="true"
      :time-filter="evenHours"
    />

    <text class="sn-demo__meta">
      innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter 为 wot-ui
      对齐参数：本构建没有时间滚筒与区间 tab，声明但不产生视觉效果（innerDisplayFormat
      也接受格式化函数）。
    </text>
    <text class="sn-demo__meta">格式化函数示例：{{ displayFormat(value) }}</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
