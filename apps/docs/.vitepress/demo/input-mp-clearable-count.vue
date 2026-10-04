<script setup lang="ts">
/** Demo: sn-input — clearable + showCount (uni-end). */
import { reactive } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const form = reactive({
  clearable: 'click × to clear me',
  counter: 'hel',
})
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="form.clearable" clearable placeholder="Type then click ×" />
    <SnInput v-model="form.counter" :maxlength="10" show-count />
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>