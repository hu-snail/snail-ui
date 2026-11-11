<script setup lang="ts">
/**
 * Demo: sn-calendar — 声明对齐参数（timeFilter / hideSecond 等）。
 *
 * 一张 cell 卡片承载入口：innerDisplayFormat / ellipsis / showTypeSwitch /
 * hideSecond / timeFilter 为参考库对齐参数——本构建没有时间滚筒与区间 tab，
 * 声明但不产生视觉效果，仅保证配置可以原样通过类型检查。
 */
import { ref } from 'vue';
import { Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const value = ref<number | number[] | null>(null);
const open = ref(false);

/** timeFilter：只保留偶数小时（声明但未实现，钩子不会运行）。 */
const evenHours = (type: string, values: number[]) =>
  type === 'hour' ? values.filter((v) => v % 2 === 0) : values;

const innerFormat = '自定义区间回显';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="声明对齐参数">
      <SnCell
        title="对齐参数"
        label="inner-display-format / ellipsis / show-type-switch / hide-second / time-filter"
        :value="Array.isArray(value) ? `${value.length} 个日期` : ''"
        placeholder="未选择"
        :prefix-icon-data="Settings"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">
      innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter
      为对齐参数：本构建没有时间滚筒与区间 tab，声明但不产生视觉效果（innerDisplayFormat
      也接受格式化函数）。
    </text>

    <SnCalendar
      v-model="value"
      v-model:visible="open"
      type="daterange"
      title="对齐参数"
      :min-date="min"
      :max-date="max"
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
