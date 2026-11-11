<script setup lang="ts">
/**
 * Demo: sn-calendar — panel size and switcher (panelHeight / switchMode).
 *
 * One cell card carries the entry: panel-height stretches the scrollable
 * panel, show-panel-title drops the month caption, switch-mode = year-month
 * swaps in the month / year switcher and duration tunes the animation.
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
    <SnCellGroup card title="Panel size &amp; switcher">
      <SnCell
        title="Month / year switch"
        label="switch-mode=year-month · panel-height=420 · show-panel-title=false · duration=320"
        :value="monthSwitchText"
        placeholder="Not selected"
        :prefix-icon-data="Settings"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnCalendar
      v-model="monthSwitch"
      v-model:visible="open"
      type="date"
      title="Month / year switch"
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
