<script setup lang="ts">
/** Demo: sn-radio — the `type` shapes (circle / dot / square / button). */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const circle = ref<string | number | boolean | undefined>('a');
const dot = ref<string | number | boolean | undefined>('a');
const square = ref<string | number | boolean | undefined>('a');
const button = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">type="circle" (default)</text>
    <SnRadioGroup v-model="circle">
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">type="dot"</text>
    <SnRadioGroup v-model="dot" type="dot">
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">type="square"</text>
    <SnRadioGroup v-model="square" type="square">
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">type="button" + direction="horizontal"</text>
    <SnRadioGroup v-model="button" type="button" direction="horizontal">
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
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
