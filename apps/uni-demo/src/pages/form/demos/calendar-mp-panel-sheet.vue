<script setup lang="ts">
/**
 * Demo: sn-calendar — 面板与弹层（cell 卡片承载每项配置）。
 *
 * 三行卡片分别覆盖：面板尺寸与切换控件（panelHeight / showPanelTitle /
 * switchMode / duration）、即时写回（immediateChange）、无确认按钮 +
 * confirm-left 插槽 + 遮罩 / 安全区 / 层级 / 自定义类名与样式。
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
    <SnCellGroup card title="面板与弹层">
      <SnCell
        title="月 / 年切换"
        label="switch-mode=year-month · panel-height=420 · show-panel-title=false · duration=320"
        :value="monthSwitchText"
        placeholder="未选择"
        :prefix-icon-data="Settings"
        is-link
        @click="openMonthSwitch = true"
      />
      <SnCell
        title="即时写回"
        label="immediate-change：点格子即写 v-model"
        :value="instantText"
        placeholder="未选择"
        :prefix-icon-data="Zap"
        is-link
        @click="openInstant = true"
      />
      <SnCell
        title="无确认按钮 + 底栏插槽"
        label="show-confirm=false · confirm-left 插槽置清空 · close-on-click-modal=false"
        :value="noConfirmText"
        placeholder="未选择"
        :prefix-icon-data="Info"
        is-link
        @click="openNoConfirm = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">
      三行配置：月 / 年切换（{{ monthSwitchText || '未选择' }}）· 即时写回（{{
        instantText || '未选择'
      }}）· 无确认按钮（{{ noConfirmText || '未选择' }}）
    </text>

    <SnCalendar
      v-model="monthSwitch"
      v-model:visible="openMonthSwitch"
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

    <SnCalendar
      v-model="instant"
      v-model:visible="openInstant"
      type="date"
      title="即时写回"
      :min-date="min"
      :max-date="max"
      immediate-change
    />

    <SnCalendar
      v-model="noConfirm"
      v-model:visible="openNoConfirm"
      type="date"
      title="无确认按钮"
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
        <view class="sn-demo__reset" role="button" aria-label="清空" @tap="noConfirm = null">
          <text>清空</text>
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
