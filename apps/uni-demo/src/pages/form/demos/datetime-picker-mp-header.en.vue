<script setup lang="ts">
/**
 * Demo: sn-datetime-picker — sheet header contract (cancel left / title centre / confirm right).
 *
 * The header always has three slots: cancel flush left, a centred title (may be
 * omitted) and confirm flush right. Both actions are **text-only** buttons with
 * no icons; with the title omitted the centre slot still owns the free space, so
 * confirm is never pushed inwards. The "Custom labels" row shows that
 * cancelButtonText / confirmButtonText swap the wording only, not the layout.
 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const stamp = new Date(2026, 9, 29).getTime();

const titled = ref<string | number | undefined>(stamp);
const openTitled = ref(false);

const bare = ref<string | number | undefined>(stamp);
const openBare = ref(false);

const custom = ref<string | number | undefined>(stamp);
const openCustom = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');
const textOf = (value: string | number | undefined) => {
  if (value === undefined) return '';
  const d = new Date(Number(value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const titledText = computed(() => textOf(titled.value));
const bareText = computed(() => textOf(bare.value));
const customText = computed(() => textOf(custom.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="With a title"
        label="title: centred heading, cancel / confirm on the two edges"
        :prefix-icon-data="Calendar"
        placeholder="Select"
        :value="titledText"
        is-link
        @click="openTitled = true"
      />
      <SnCell
        title="Without a title"
        label="no title: confirm stays flush right"
        :prefix-icon-data="Calendar"
        placeholder="Select"
        :value="bareText"
        is-link
        @click="openBare = true"
      />
      <SnCell
        title="Custom labels"
        label="cancelButtonText / confirmButtonText: wording only, layout unchanged"
        :prefix-icon-data="Calendar"
        placeholder="Select"
        :value="customText"
        is-link
        @click="openCustom = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="titled"
      v-model:visible="openTitled"
      type="date"
      title="Pick a shipping date"
    />
    <SnDatetimePicker v-model="bare" v-model:visible="openBare" type="date" />
    <SnDatetimePicker
      v-model="custom"
      v-model:visible="openCustom"
      type="date"
      title="One more check"
      cancel-button-text="Not yet"
      confirm-button-text="Use it"
    />
  </view>
</template>
