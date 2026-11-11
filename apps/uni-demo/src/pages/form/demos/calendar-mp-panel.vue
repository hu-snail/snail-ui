<script setup lang="ts">
/**
 * Demo: sn-calendar — 面板尺寸与切换（panelHeight / switchMode）。
 *
 * 一张 cell 卡片承载入口：panel-height 拉高可滚动面板、show-panel-title 关掉
 * 月份标题、switch-mode=year-month 换成月 / 年切换控件、duration 调整动画时长。
 */
import { computed, ref } from 'vue';
import { Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const monthSwitch = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

function fmtStamp(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const monthSwitchText = computed(() => fmtStamp(monthSwitch.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="面板尺寸与切换">
      <SnCell
        title="月 / 年切换"
        label="switch-mode=year-month · panel-height=420 · show-panel-title=false · duration=320"
        :value="monthSwitchText"
        placeholder="未选择"
        :prefix-icon-data="Settings"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnCalendar
      v-model="monthSwitch"
      v-model:visible="open"
      type="date"
      title="月 / 年切换"
      :min-date="min"
      :max-date="max"
      :panel-height="420"
      :show-panel-title="false"
      switch-mode="year-month"
      :duration="320"
      custom-view-class="sn-demo__panel"
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

.sn-demo__panel {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
