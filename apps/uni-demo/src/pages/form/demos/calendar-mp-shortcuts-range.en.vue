<script setup lang="ts">
/**
 * Demo: sn-calendar — shortcuts and the range mode, carried by cell cards.
 *
 * `shortcuts` renders preset chips (`days` is relative to today);
 * `type="daterange"` picks a span; the card shows the confirmed span and the
 * second card echoes the shortcut chip that was tapped last.
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
  { text: 'Today', days: 0 },
  { text: 'Last 7 days', days: -7 },
  { text: 'Last 30 days', days: -30 },
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

/** Fired after a shortcut chip writes its value; the card echoes the last tap. */
const onShortcut = (shortcut: { text: string }) => {
  lastShortcut.value = shortcut.text;
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="Shortcuts &amp; range">
      <SnCell
        title="Range + shortcuts"
        label="shortcuts (`days` is relative to today) · type=daterange · custom confirm label"
        :value="rangeText"
        placeholder="Not selected"
        :prefix-icon-data="Filter"
        is-link
        @click="open = true"
      />
      <SnCell title="Last shortcut tapped" :value="lastShortcut" />
    </SnCellGroup>

    <text class="sn-demo__meta">Range: {{ rangeText || 'Not selected' }}</text>

    <SnCalendar
      v-model="range"
      v-model:visible="open"
      type="daterange"
      :min-date="min"
      :max-date="max"
      :shortcuts="shortcuts"
      title="Pick a range"
      confirm-text="Use it"
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
