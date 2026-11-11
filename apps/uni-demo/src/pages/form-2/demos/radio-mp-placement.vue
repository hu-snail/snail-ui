<script setup lang="ts">
/** Demo: sn-radio — 标记位置：placement="right" 把选中标记放到右侧。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const placed = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">placement="right"</text>
    <SnRadioGroup v-model="placed" placement="right">
      <SnRadio value="a">标记在右侧 A</SnRadio>
      <SnRadio value="b">标记在右侧 B</SnRadio>
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
