<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — status glyphs and loading types.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const iconKinds = ['success', 'error', 'warning', 'info'] as const;
const loadingKinds = ['circular', 'spinner', 'dots', 'wave'] as const;

const currentIcon = ref<(typeof iconKinds)[number]>('success');
const iconOpen = ref(false);

const currentLoading = ref<(typeof loadingKinds)[number]>('circular');
const loadingOpen = ref(false);

function showIcon(kind: (typeof iconKinds)[number]): void {
  currentIcon.value = kind;
  iconOpen.value = true;
}

function showLoading(kind: (typeof loadingKinds)[number]): void {
  currentLoading.value = kind;
  loadingOpen.value = true;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-toast-demo__row">
      <SnButton v-for="kind in iconKinds" :key="kind" size="small" @tap="showIcon(kind)">{{
        kind
      }}</SnButton>
    </view>

    <view class="sn-toast-demo__row">
      <SnButton v-for="kind in loadingKinds" :key="kind" size="small" @tap="showLoading(kind)">{{
        kind
      }}</SnButton>
    </view>

    <text class="sn-toast-demo__meta">Icon: {{ currentIcon }} · Loading: {{ currentLoading }}</text>

    <SnToast
      v-model="iconOpen"
      :msg="`icon-name = ${currentIcon}`"
      :icon-name="currentIcon"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="loadingOpen"
      :msg="`loading-type = ${currentLoading}`"
      icon-name="loading"
      :loading-type="currentLoading"
      :duration="2000"
      custom-class="sn-demo-contained"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-toast-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-toast-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
