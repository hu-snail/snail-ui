<script setup lang="ts">
/**
 * Demo: sn-calendar — 即时写回（immediateChange）。
 *
 * 一张 cell 卡片承载入口：immediate-change 打开后点格子即写 v-model，
 * 无需经过确认按钮。
 */
import { computed, ref } from 'vue';
import { Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const instant = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

function fmtStamp(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const instantText = computed(() => fmtStamp(instant.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="即时写回">
      <SnCell
        title="即时写回"
        label="immediate-change：点格子即写 v-model"
        :value="instantText"
        placeholder="未选择"
        :prefix-icon-data="Zap"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnCalendar
      v-model="instant"
      v-model:visible="open"
      type="date"
      title="即时写回"
      :min-date="min"
      :max-date="max"
      immediate-change
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
