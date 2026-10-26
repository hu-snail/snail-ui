<script setup lang="ts">
/** Demo: sn-radio-group — 基础单选（单值 v-model）。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const picked = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRadioGroup v-model="picked">
      <SnRadio value="a">选项 A</SnRadio>
      <SnRadio value="b">选项 B</SnRadio>
      <SnRadio value="c">选项 C</SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">已选：{{ picked ?? '（未选）' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
