<script setup lang="ts">
/** Demo: sn-input — compact inline form (compact): `compact` + `border="bottom"` (an inline row inside Cell / FormItem). */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const inline = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="inline" compact border="bottom" placeholder="Inline search" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
