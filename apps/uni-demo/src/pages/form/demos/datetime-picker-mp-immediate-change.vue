<script setup lang="ts">
/** Demo: sn-datetime-picker — 即时写回（immediateChange）：滚动即写 v-model，不必确认。 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const immediate = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openImmediate = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');
const immediateText = computed(() => {
  if (immediate.value === undefined) return '';
  const d = new Date(Number(immediate.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="即时写回"
        label="immediateChange：滚动即写 v-model，不必确认"
        :prefix-icon-data="Clock"
        :value="immediateText"
        is-link
        @click="openImmediate = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="immediate"
      v-model:visible="openImmediate"
      type="date"
      title="即时写回"
      immediate-change
    />
  </view>
</template>
