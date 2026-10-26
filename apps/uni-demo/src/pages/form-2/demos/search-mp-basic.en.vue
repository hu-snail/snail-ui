<script setup lang="ts">
/** Demo: sn-search — basic usage + the search event. */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const query = ref('');
const lastSearch = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSearch v-model="query" placeholder="Search products" @search="lastSearch = $event" />
    <text class="sn-demo__meta">Last search: {{ lastSearch }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
