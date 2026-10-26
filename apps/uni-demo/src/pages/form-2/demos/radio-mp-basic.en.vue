<script setup lang="ts">
/** Demo: sn-radio-group — basic single-select (single-value v-model). */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const picked = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRadioGroup v-model="picked">
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
      <SnRadio value="c">Option C</SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">Selected: {{ picked ?? '(none)' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
