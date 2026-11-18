<script setup lang="ts">
/** Demo: sn-input — soft keyboard hint (inputmode): each inputmode summons the matching keyboard. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const phone = ref('');
const search = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="phone" inputmode="tel" placeholder="Phone (tel keyboard)" />
    <SnInput v-model="search" inputmode="search" placeholder="Search (search keyboard)" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
