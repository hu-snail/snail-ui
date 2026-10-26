<script setup lang="ts">
/** Demo: sn-search — the three variants (plain / filled / light). */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const plain = ref('');
const filled = ref('');
const light = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">variant="plain" (default, bordered)</text>
    <SnSearch v-model="plain" placeholder="plain" />

    <text class="sn-demo__title">variant="filled" (tinted)</text>
    <SnSearch v-model="filled" variant="filled" placeholder="filled" />

    <text class="sn-demo__title">variant="light" (lightest)</text>
    <SnSearch v-model="light" variant="light" placeholder="light" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
