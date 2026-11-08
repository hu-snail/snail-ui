<script setup lang="ts">
/** Demo: sn-tabs — basic tabs with v-model (index and name binding). */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

/** Index binding: without `name`, the pane resolves against its mount order. */
const indexActive = ref(0);

/** Name binding: a string `name` makes `v-model` carry the name. */
const nameActive = ref('unpaid');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">v-model bound to the index</text>
    <SnTabs v-model="indexActive">
      <SnTab title="All" :name="0">All items</SnTab>
      <SnTab title="Unpaid" :name="1">Unpaid items</SnTab>
      <SnTab title="Completed" :name="2">Completed items</SnTab>
    </SnTabs>

    <text class="sn-demo__label">v-model bound to the name</text>
    <SnTabs v-model="nameActive">
      <SnTab title="All" name="all">All items</SnTab>
      <SnTab title="Unpaid" name="unpaid">Unpaid items</SnTab>
      <SnTab title="Completed" name="done">Completed items</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">Active tab: {{ indexActive }} / {{ nameActive }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
  width: 100%;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
