<script setup lang="ts">
/** Demo: sn-radio — allowUncheck / disabled / readonly / placement. */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const uncheckable = ref<string | number | boolean | undefined>('a');
const blocked = ref<string | number | boolean | undefined>('a');
const placed = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">allowUncheck (tap again to clear)</text>
    <SnRadioGroup v-model="uncheckable" allow-uncheck>
      <SnRadio value="a">Option A</SnRadio>
      <SnRadio value="b">Option B</SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">Current: {{ uncheckable ?? '(none)' }}</text>

    <text class="sn-demo__title">disabled</text>
    <SnRadioGroup v-model="blocked" disabled>
      <SnRadio value="a">Whole group disabled</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">readonly</text>
    <SnRadioGroup v-model="blocked" readonly>
      <SnRadio value="a">Whole group read-only</SnRadio>
    </SnRadioGroup>

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
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
