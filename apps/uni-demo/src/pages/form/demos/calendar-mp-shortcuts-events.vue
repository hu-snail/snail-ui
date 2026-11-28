<script setup lang="ts">
/**
 * Demo: sn-calendar — 快捷回调与确认拦截（onShortcutsClick / beforeConfirm）。
 *
 * 一行 sn-cell 承载入口（无分组卡片，模块标题由页面外层承担）：shortcuts 提供快捷 chip，on-shortcuts-click 回显
 * 最近点击项，before-confirm 在值为空时拦下确认，点击打开弹层。
 */
import { ref } from 'vue';
import { Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

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
/** beforeConfirm 拦确认。 */
const guard = (payload: number | number[] | null) => payload !== null;
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCell
      title="快捷选项"
      :value="Array.isArray(value) ? `${value.length} 个日期` : ''"
      placeholder="未选择"
      :prefix-icon-data="Filter"
      is-link
      @click="open = true"
    />
    <SnCell title="最近点击的快捷项" :value="lastShortcut" />

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
</style>
