<script setup lang="ts">
/** Demo: sn-date-strip — 农历显示：show-lunar 在日号下方铺农历角标，初一显示月名。 */
import { ref } from 'vue';
import SnDateStrip from '@snui/uni-src/components/sn-date-strip/sn-date-strip.vue';

const start = new Date(2025, 6, 25).getTime();
const date = ref<number | number[] | null>(new Date(2025, 6, 28).getTime());
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDateStrip v-model="date" :start-date="start" :count="7" show-lunar />
  </view>
</template>
