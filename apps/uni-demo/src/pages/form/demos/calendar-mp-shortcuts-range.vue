<script setup lang="ts">
/**
 * Demo: sn-calendar — 快捷选项与区间（cell 卡片承载入口与回显）。
 *
 * `shortcuts` 渲染预设 chip（`days` 相对今天）；`type="daterange"` 选区间；
 * 卡片右侧显示已确认区间，第二张卡片记录最近一次确认的表单化文案。
 */
import { computed, ref } from 'vue';
import { Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const range = ref<number | number[] | null>(null);
const open = ref(false);

const shortcuts = [
  { text: '今天', days: 0 },
  { text: '近一周', days: -7 },
  { text: '近一月', days: -30 },
];

const rangeText = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  const fmt = (stamp: number) => {
    const d = new Date(stamp);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };
  return `${fmt(start)} - ${fmt(end)}`;
});

const lastShortcut = ref('—');

/** 快捷 chip 写值之后的回调，卡片右侧回显最近一次点击。 */
const onShortcut = (shortcut: { text: string }) => {
  lastShortcut.value = shortcut.text;
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="快捷选项与区间">
      <SnCell
        title="区间 + 快捷选项"
        label="shortcuts（days 相对今天）· type=daterange · confirm-text 自定义"
        :value="rangeText"
        placeholder="未选择"
        :prefix-icon-data="Filter"
        is-link
        @click="open = true"
      />
      <SnCell title="最近点击的快捷项" :value="lastShortcut" />
    </SnCellGroup>

    <text class="sn-demo__meta">区间：{{ rangeText || '未选择' }}</text>

    <SnCalendar
      v-model="range"
      v-model:visible="open"
      type="daterange"
      :min-date="min"
      :max-date="max"
      :shortcuts="shortcuts"
      title="选择区间"
      confirm-text="就用它"
      :on-shortcuts-click="onShortcut"
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
