<script setup lang="ts">
/** Demo: sn-radio — 禁用与只读：disabled 整组禁用 / readonly 整组只读。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const blocked = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">disabled</text>
    <SnRadioGroup v-model="blocked" disabled>
      <SnRadio value="a">整组禁用</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">readonly</text>
    <SnRadioGroup v-model="blocked" readonly>
      <SnRadio value="a">整组只读</SnRadio>
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
