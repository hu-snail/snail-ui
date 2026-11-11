<script setup lang="ts">
/** Demo: sn-radio — marker placement: `placement="right"` moves the check marker to the right side. */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const placed = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">placement="right"</text>
    <SnRadioGroup v-model="placed" placement="right">
      <SnRadio value="a">Marker on the right A</SnRadio>
      <SnRadio value="b">Marker on the right B</SnRadio>
    </SnRadioGroup>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
