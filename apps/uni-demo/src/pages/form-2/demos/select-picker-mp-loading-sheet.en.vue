<script setup lang="ts">
/** Demo: sn-select-picker — loading state and sheet: loading / loadingColor / beforeConfirm / scrim / stacking / scroll-into-view / custom*. */
import { ref } from 'vue';
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const loading = ref<Array<string | number | boolean>>([]);
const openLoading = ref(false);

const guarded = ref<Array<string | number | boolean>>(['apple']);
const openGuarded = ref(false);

const scrolled = ref<Array<string | number | boolean>>(['cherry']);
const openScrolled = ref(false);
const lastGuard = ref('—');

/** At least two picks are required to confirm. */
const atLeastTwo = (payload: {
  value: string | number | boolean | Array<string | number | boolean>;
}) => {
  const list = Array.isArray(payload.value) ? payload.value : [payload.value];
  lastGuard.value = list.length >= 2 ? 'Allowed' : 'Pick at least two';
  return list.length >= 2;
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">loading + loadingColor (the option list is loading)</text>
    <view class="sn-demo__button" @tap="openLoading = true">Loading state</view>
    <SnSelectPicker
      v-model="loading"
      v-model:visible="openLoading"
      :columns="options"
      loading
      loading-color="var(--sn-mp-color-action-primary)"
      title="Loading state"
    />

    <text class="sn-demo__title"
      >beforeConfirm + closeOnClickModal=false + zIndex + safeAreaInsetBottom</text
    >
    <view class="sn-demo__button" @tap="openGuarded = true">At least two</view>
    <text class="sn-demo__meta">Guard: {{ lastGuard }}</text>
    <SnSelectPicker
      v-model="guarded"
      v-model:visible="openGuarded"
      :columns="options"
      title="At least two"
      :before-confirm="atLeastTwo"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1150"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    />

    <text class="sn-demo__title"
      >scrollIntoView (scrolls the selected row into view on open) + customContentClass</text
    >
    <view class="sn-demo__button" @tap="openScrolled = true">Scroll into view</view>
    <SnSelectPicker
      v-model="scrolled"
      v-model:visible="openScrolled"
      :columns="options"
      :scroll-into-view="true"
      custom-content-class="sn-demo__content"
      title="Scroll into view"
    />
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

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-demo__content {
  padding-top: 8rpx;
}
</style>
