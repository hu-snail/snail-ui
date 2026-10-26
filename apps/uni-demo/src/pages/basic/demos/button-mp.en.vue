<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — real-component live render.
 */

import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const loading = ref(false);
const lastClicked = ref<string | null>(null);

function trigger(label: string): void {
  lastClicked.value = label;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 800);
}
</script>

<template>
  <view class="sn-demo">
    <view class="sn-demo__row">
      <SnButton>Default</SnButton>
      <SnButton type="primary" @click="trigger('primary')">Primary</SnButton>
      <SnButton type="success" @click="trigger('success')">Success</SnButton>
      <SnButton type="warning" @click="trigger('warning')">Warning</SnButton>
      <SnButton type="danger" @click="trigger('danger')">Danger</SnButton>
    </view>

    <view class="sn-demo__row">
      <SnButton size="small">small</SnButton>
      <SnButton size="medium">medium</SnButton>
      <SnButton size="large">large</SnButton>
    </view>

    <view class="sn-demo__row">
      <SnButton block type="primary">Block button</SnButton>
      <SnButton round type="success">Rounded</SnButton>
    </view>

    <view class="sn-demo__row">
      <SnButton disabled>Disabled</SnButton>
      <SnButton :loading="loading" type="primary" @click="trigger('loading')"> Loading </SnButton>
    </view>

    <text v-if="lastClicked" class="sn-demo__log">
      Last clicked:<text>{{ lastClicked }}</text>
    </text>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo__log {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.sn-demo__log code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
