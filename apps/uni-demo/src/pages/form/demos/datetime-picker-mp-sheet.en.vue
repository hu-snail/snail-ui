<script setup lang="ts">
/** Demo: sn-datetime-picker — sheet chrome and behaviour: cancelButtonText / closeOnClickModal / safeAreaInsetBottom / zIndex / immediateChange / rootPortal / custom*, opened from sn-cell rows. */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Clock, Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const immediate = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openImmediate = ref(false);

const chrome = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openChrome = ref(false);

/** Declared but unimplemented: single-value mode has no range tabs, so the hook never runs. */
const tabLabel = (tab: 'start' | 'end') => (tab === 'start' ? 'Start' : 'End');

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
        title="Immediate write-back"
        label="immediateChange: every roll writes v-model, no confirm needed"
        :prefix-icon-data="Clock"
        :value="immediateText"
        is-link
        @click="openImmediate = true"
      />
      <SnCell
        title="Sheet chrome"
        label="button labels, mask close disabled, zIndex, custom*"
        :prefix-icon-data="Settings"
        is-link
        @click="openChrome = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="immediate"
      v-model:visible="openImmediate"
      type="date"
      title="Immediate write-back"
      immediate-change
    />

    <SnDatetimePicker
      v-model="chrome"
      v-model:visible="openChrome"
      type="date"
      title="Sheet chrome"
      cancel-button-text="Never mind"
      confirm-button-text="Use this day"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1200"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
      custom-view-class="sn-demo__roller"
      :display-format-tab-label="tabLabel"
    />
  </view>
</template>

<style scoped>
.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-demo__roller {
  padding-bottom: 8rpx;
}
</style>
