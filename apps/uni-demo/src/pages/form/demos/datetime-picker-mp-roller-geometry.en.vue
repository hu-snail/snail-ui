<script setup lang="ts">
/** Demo: sn-datetime-picker — roller geometry (itemHeight / visibleItemCount): tall rows, more visible rows. */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const bigRows = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openBig = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');
const dateText = computed(() => {
  if (bigRows.value === undefined) return '';
  const d = new Date(Number(bigRows.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="Tall rows"
        label="itemHeight 44 / 6 visible rows, range limited to 2024"
        :prefix-icon-data="Calendar"
        :value="dateText"
        is-link
        @click="openBig = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="bigRows"
      v-model:visible="openBig"
      type="date"
      title="Tall rows"
      :item-height="44"
      :visible-item-count="6"
      :min-date="min"
      :max-date="max"
    />
  </view>
</template>
