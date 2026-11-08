<script setup lang="ts">
/**
 * Demo: sn-calendar — shortcut callback plus the parity placeholders (cell card layout).
 *
 * onShortcutsClick IS invoked. timeFilter / hideSecond / innerDisplayFormat /
 * ellipsis / showTypeSwitch are declared but unimplemented in this build (no
 * time roller, no range tabs) and exist only so a config written against the
 * reference surface type-checks unchanged. The entry row and the last-tapped
 * echo each get a cell card.
 */
import { computed, ref } from 'vue';
import { Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

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

/** Entry row's right-hand value: blank while nothing is picked, so the placeholder shows. */
const valueText = computed(() => (Array.isArray(value.value) ? displayFormat(value.value) : ''));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="Shortcut callback &amp; parity props">
      <SnCell
        title="Shortcuts"
        label="shortcuts + on-shortcuts-click + before-confirm"
        :value="valueText"
        placeholder="Not selected"
        :prefix-icon-data="Filter"
        is-link
        @click="open = true"
      />
      <SnCell title="Last shortcut tapped" :value="lastShortcut" />
    </SnCellGroup>

    <text class="sn-demo__meta">
      innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter are parity props:
      this build has no time roller and no range tabs, so they carry no visual effect
      (innerDisplayFormat also accepts a formatter function).
    </text>
    <text class="sn-demo__meta">Formatter example: {{ displayFormat(value) }}</text>

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
