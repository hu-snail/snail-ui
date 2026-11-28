<script setup lang="ts">
/** Demo: sn-picker-view — wheel 胶囊带主题：`--sn-picker-view-wheel-band` 变量把高亮带换成主题浅蓝。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const minutes = [15, 20, 25, 30, 45];
const value = ref<Array<string | number>>([25]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView
      v-model="value"
      :columns="[minutes]"
      wheel
      vibrate-short
      :visible-item-count="5"
      custom-style="--sn-picker-view-wheel-band: var(--sn-mp-color-action-primary-soft); --sn-picker-view-wheel-radius: 24rpx"
    />
    <text class="sn-demo__meta">已选：{{ value[0] }} min（customStyle 覆盖胶囊带底色与圆角）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
