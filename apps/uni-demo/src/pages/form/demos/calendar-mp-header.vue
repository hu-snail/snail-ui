<script setup lang="ts">
/**
 * Demo: sn-calendar — 弹层头部插槽（`header`，additive；AGENTS.md §112.3a）。
 *
 * 插槽替换弹层顶部的默认标题行，宿主可在弹层内放 cell 摘要行等分节内容；
 * 未使用插槽时仍渲染 `title` 文本，行为不变。这里配合 `immediate-change`
 * 让弹层内摘要随点选实时更新。
 */
import { computed, ref } from 'vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const range = ref<number | number[] | null>(null);
const open = ref(false);

function fmtStamp(stamp: number): string {
  const d = new Date(stamp);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const rangeText = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  return `${fmtStamp(start)} ~ ${fmtStamp(end)}`;
});

const dayCount = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  return `${Math.round((end - start) / 86400000) + 1} 天`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="弹层头部插槽">
      <SnCell
        title="日期区间"
        label="header 插槽替换标题行，摘要随点选实时更新"
        :value="rangeText"
        placeholder="未选择"
        :prefix-icon-data="Calendar"
        is-link
        @click="open = true"
      />
      <SnCell title="已选天数" :value="dayCount" placeholder="未选择" />
    </SnCellGroup>

    <text class="sn-demo__meta">
      已选：{{ rangeText || '未选择' }}{{ dayCount === '' ? '' : `（${dayCount}）` }}
    </text>

    <SnCalendar
      v-model="range"
      v-model:visible="open"
      type="daterange"
      title="日期区间"
      confirm-text="确定区间"
      immediate-change
      :min-date="min"
      :max-date="max"
    >
      <template #header>
        <view class="sn-demo__sheet-head">
          <SnCell
            title="弹层内摘要行"
            :value="rangeText"
            placeholder="点日期选起止"
            :border="false"
          />
          <text class="sn-demo__sheet-hint">
            header 插槽内容替换默认标题；未传插槽时仍显示 title 文本。
          </text>
        </view>
      </template>
    </SnCalendar>
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

/* 弹层头部插槽内容：占满标题行宽度，纵向排布摘要行与说明。 */
.sn-demo__sheet-head {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  width: 100%;
}

.sn-demo__sheet-hint {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
