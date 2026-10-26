<script setup lang="ts">
/** Demo: sn-search — 基础用法 + 搜索事件。 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const query = ref('');
const lastSearch = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSearch v-model="query" placeholder="搜索商品" @search="lastSearch = $event" />
    <text class="sn-demo__meta">最近一次搜索：{{ lastSearch }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
