<script setup lang="ts">
/** Demo: sn-datetime-picker — `type="time"` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open. Opened from an sn-cell row. */
import { ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const time = ref<string | number | undefined>('10:30');
const open = ref(false);
// Only times at or after 09:00 may be confirmed — demonstrates a beforeConfirm veto.
const guard = (value: string | number) => String(value) >= '09:00';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="Time"
        label="type=time + beforeConfirm (vetoes anything before 09:00)"
        :prefix-icon-data="Clock"
        placeholder="Select"
        :value="time ? String(time) : ''"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="time"
      v-model:visible="open"
      type="time"
      title="Pick a time"
      confirm-button-text="Use it"
      :before-confirm="guard"
    />
  </view>
</template>
