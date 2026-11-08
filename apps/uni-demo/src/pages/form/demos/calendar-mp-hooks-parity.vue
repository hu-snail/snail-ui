<script setup lang="ts">
/**
 * Demo: sn-calendar — 快捷回调与占位参数（cell 卡片布局）。
 *
 * onShortcutsClick 会被调用；timeFilter / hideSecond / innerDisplayFormat /
 * ellipsis / showTypeSwitch 声明但未实现（本构建没有时间滚筒与区间 tab），
 * 仅用于配置对齐。入口行与最近点击项各占一张 cell 卡片。
 */
import { computed, ref } from 'vue';
import { Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

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

/** 入口行右侧值：未选中时留空以显示 placeholder。 */
const valueText = computed(() => (Array.isArray(value.value) ? displayFormat(value.value) : ''));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="快捷回调与对齐参数">
      <SnCell
        title="快捷选项"
        label="shortcuts + on-shortcuts-click + before-confirm"
        :value="valueText"
        placeholder="未选择"
        :prefix-icon-data="Filter"
        is-link
        @click="open = true"
      />
      <SnCell title="最近点击的快捷项" :value="lastShortcut" />
    </SnCellGroup>

    <text class="sn-demo__meta">
      innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter
      为对齐参数：本构建没有时间滚筒与区间 tab，声明但不产生视觉效果（innerDisplayFormat
      也接受格式化函数）。
    </text>
    <text class="sn-demo__meta">格式化函数示例：{{ displayFormat(value) }}</text>

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
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
