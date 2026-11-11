<script setup lang="ts">
/**
 * Demo: sn-calendar — shortcut callback and confirm veto (onShortcutsClick / beforeConfirm).
 *
 * One cell card carries the entry: shortcuts provide the chips, the
 * on-shortcuts-click callback echoes the last tapped chip, before-confirm
 * vetoes confirm while the value is empty. Tapping opens the sheet.
 */
import { ref } from 'vue';
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
/** beforeConfirm veto. */
const guard = (payload: number | number[] | null) => payload !== null;
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="Shortcut callback &amp; confirm veto">
      <SnCell
        title="Shortcuts"
        label="shortcuts + on-shortcuts-click + before-confirm"
        :value="Array.isArray(value) ? `${value.length} dates` : ''"
        placeholder="Not selected"
        :prefix-icon-data="Filter"
        is-link
        @click="open = true"
      />
      <SnCell title="Last shortcut tapped" :value="lastShortcut" />
    </SnCellGroup>

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
