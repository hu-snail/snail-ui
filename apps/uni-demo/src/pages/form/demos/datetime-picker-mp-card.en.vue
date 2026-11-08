<script setup lang="ts">
/**
 * Demo: sn-datetime-picker — card form (sn-cell card: every row renders as its own rounded card).
 *
 * Top: sn-cell-group card mode — the group goes transparent, rows are spaced by
 * a token gap and each row paints its own radius / border / shadow, so the date
 * and datetime entries each become a card.
 * Bottom: sn-cell card, a standalone card row outside any group, spaced from the
 * card group with the same token.
 * The rows only open the sheet; the sheet header keeps confirm flush right and text-only.
 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar, Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const shipping = ref<string | number | undefined>(new Date(2026, 9, 29).getTime());
const openShipping = ref(false);

const meeting = ref<string | number | undefined>(new Date(2026, 9, 29, 14, 30).getTime());
const openMeeting = ref(false);

const quiet = ref<string | number | undefined>('22:30');
const openQuiet = ref(false);

const minDate = new Date(2026, 0, 1).getTime();
const maxDate = new Date(2026, 11, 31, 23, 59, 59).getTime();

const pad = (n: number) => String(n).padStart(2, '0');
const shippingText = computed(() => {
  if (shipping.value === undefined) return '';
  const d = new Date(Number(shipping.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
const meetingText = computed(() => {
  if (meeting.value === undefined) return '';
  const d = new Date(Number(meeting.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >Card group (sn-cell-group card — one card per row, token gap)</text
    >
    <SnCellGroup card>
      <SnCell
        title="Shipping date"
        :prefix-icon-data="Calendar"
        placeholder="Select"
        :value="shippingText"
        is-link
        @click="openShipping = true"
      />
      <SnCell
        title="Meeting time"
        :prefix-icon-data="Clock"
        placeholder="Select"
        :value="meetingText"
        is-link
        @click="openMeeting = true"
      />
    </SnCellGroup>

    <text class="sn-demo__label">Standalone card row (sn-cell card, no group needed)</text>
    <view class="sn-demo__cards">
      <SnCell
        title="Quiet hours"
        :prefix-icon-data="Clock"
        :value="String(quiet)"
        is-link
        card
        @click="openQuiet = true"
      />
    </view>

    <SnDatetimePicker
      v-model="shipping"
      v-model:visible="openShipping"
      type="date"
      title="Pick a shipping date"
      :min-date="minDate"
      :max-date="maxDate"
    />
    <SnDatetimePicker
      v-model="meeting"
      v-model:visible="openMeeting"
      type="datetime"
      title="Pick a meeting time"
      :min-date="minDate"
      :max-date="maxDate"
    />
    <SnDatetimePicker
      v-model="quiet"
      v-model:visible="openQuiet"
      type="time"
      title="Pick quiet hours"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}
.sn-demo__cards {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
