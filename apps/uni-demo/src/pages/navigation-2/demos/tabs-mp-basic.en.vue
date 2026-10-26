<script setup lang="ts">
/** Demo: sn-tabs — basic tabs with v-model. */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const active = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTabs v-model="active">
      <SnTab title="All" :name="0">All items</SnTab>
      <SnTab title="Unpaid" :name="1">Unpaid items</SnTab>
      <SnTab title="Completed" :name="2">Completed items</SnTab>
    </SnTabs>
    <text class="sn-demo__meta">Active tab: {{ active }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
