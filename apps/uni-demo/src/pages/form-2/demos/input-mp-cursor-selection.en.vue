<script setup lang="ts">
/** Demo: sn-input — caret and selection (cursor / selection-start / selection-end): initial caret and preselected region. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const preselect = ref('Preselected region example');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="preselect" :cursor="5" :selection-start="2" :selection-end="8" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
