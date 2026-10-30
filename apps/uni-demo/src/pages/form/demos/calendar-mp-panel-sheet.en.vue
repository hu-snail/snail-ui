<script setup lang="ts">
/**
 * Demo: sn-calendar — panel and sheet wiring, one cell card per config group.
 *
 * Three card rows cover: panel size and switcher (panelHeight / showPanelTitle /
 * switchMode / duration), immediate write-back (immediateChange), and the
 * no-confirm button sheet plus the confirm-left slot and scrim / safe area /
 * stacking / custom class and style forwarding.
 */
import { computed, ref } from 'vue';
import { Info, Settings, Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const monthSwitch = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openMonthSwitch = ref(false);

const instant = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openInstant = ref(false);

const noConfirm = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openNoConfirm = ref(false);

function fmtStamp(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const monthSwitchText = computed(() => fmtStamp(monthSwitch.value));
const instantText = computed(() => fmtStamp(instant.value));
const noConfirmText = computed(() => fmtStamp(noConfirm.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="Panel & sheet">
      <SnCell
        title="Month / year switch"
        label="switch-mode=year-month · panel-height=420 · show-panel-title=false · duration=320"
        :value="monthSwitchText"
        placeholder="Not selected"
        :prefix-icon-data="Settings"
        is-link
        @click="openMonthSwitch = true"
      />
      <SnCell
        title="Immediate write-back"
        label="immediate-change: writes v-model as soon as a cell is tapped"
        :value="instantText"
        placeholder="Not selected"
        :prefix-icon-data="Zap"
        is-link
        @click="openInstant = true"
      />
      <SnCell
        title="No confirm button + footer slot"
        label="show-confirm=false · confirm-left slot holds a clear action · close-on-click-modal=false"
        :value="noConfirmText"
        placeholder="Not selected"
        :prefix-icon-data="Info"
        is-link
        @click="openNoConfirm = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">
      Three configs: month / year switch ({{ monthSwitchText || 'Not selected' }}) · immediate
      write-back ({{ instantText || 'Not selected' }}) · no confirm button ({{
        noConfirmText || 'Not selected'
      }})
    </text>

    <SnCalendar
      v-model="monthSwitch"
      v-model:visible="openMonthSwitch"
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

    <SnCalendar
      v-model="instant"
      v-model:visible="openInstant"
      type="date"
      title="Immediate write-back"
      :min-date="min"
      :max-date="max"
      immediate-change
    />

    <SnCalendar
      v-model="noConfirm"
      v-model:visible="openNoConfirm"
      type="date"
      title="No confirm button"
      :min-date="min"
      :max-date="max"
      :show-confirm="false"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1100"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    >
      <template #confirm-left>
        <view class="sn-demo__reset" role="button" aria-label="Clear" @tap="noConfirm = null">
          <text>Clear</text>
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

.sn-demo__panel {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-demo__reset {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
