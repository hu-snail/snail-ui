<script setup lang="ts">
/** Demo: sn-search — cancel text / hidden cancel / disabled / left-aligned placeholder. */
import { ref } from 'vue'
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue'

const query = ref('snail')
const lastCancel = ref('—')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">cancelTxt + the cancel event</text>
    <SnSearch
      v-model="query"
      cancel-txt="Clear search"
      @cancel="lastCancel = $event"
    />
    <text class="sn-demo__meta">cancel payload: {{ lastCancel }}</text>

    <text class="sn-demo__title">hideCancel</text>
    <SnSearch v-model="query" hide-cancel placeholder="No cancel text" />

    <text class="sn-demo__title">placeholderLeft</text>
    <SnSearch v-model="query" placeholder-left placeholder="Left-aligned placeholder" />

    <text class="sn-demo__title">disabled</text>
    <SnSearch v-model="query" disabled placeholder="Disabled state" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
