<script setup lang="ts">
/**
 * Demo: sn-calendar — shortcut callback plus the wot-ui parity placeholders.
 * onShortcutsClick IS invoked; timeFilter / hideSecond / innerDisplayFormat / ellipsis /
 * showTypeSwitch are declared but unimplemented (this build has no time roller and no
 * range tabs) and exist only so a wd-calendar config type-checks unchanged.
 */
import { ref } from 'vue';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const value = ref<number | number[] | null>(null);
const open = ref(false);
const lastShortcut = ref('—');

const shortcuts = [
  { text: 'Today', days: 0 },
  { text: 'Last 7 days', days: -7 },
];

/** Fired after a shortcut chip writes its value. */
const onShortcut = (shortcut: { text: string }) => {
  lastShortcut.value = shortcut.text;
};
/** timeFilter: keep even hours only (declared but unimplemented — never runs). */
const evenHours = (type: string, values: number[]) =>
  type === 'hour' ? values.filter((v) => v % 2 === 0) : values;
/** Range echo (a string or a formatter; declared but unimplemented). */
const displayFormat = (payload: number | number[] | null) => {
  if (!Array.isArray(payload)) return 'Nothing selected';
  return `${payload.length} dates`;
};
/** beforeConfirm veto. */
const guard = (payload: number | number[] | null) => payload !== null;

const innerFormat = 'Custom range echo';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">shortcuts + onShortcutsClick + beforeConfirm</text>
    <view class="sn-demo__button" @tap="open = true">Shortcuts</view>
    <text class="sn-demo__meta">Last shortcut tapped: {{ lastShortcut }}</text>
    <SnCalendar
      v-model="value"
      v-model:visible="open"
      type="daterange"
      title="Shortcuts"
      :min-date="min"
      :max-date="max"
      :shortcuts="shortcuts"
      :on-shortcuts-click="onShortcut"
      :before-confirm="guard"
      confirm-text="Apply range"
      :inner-display-format="innerFormat"
      :ellipsis="true"
      :show-type-switch="false"
      :hide-second="true"
      :time-filter="evenHours"
    />

    <text class="sn-demo__meta">
      innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter are wot-ui parity
      props: this build has no time roller and no range tabs, so they are declared but have no
      visual effect (innerDisplayFormat also accepts a formatter function).
    </text>
    <text class="sn-demo__meta">Formatter example: {{ displayFormat(value) }}</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
