<script setup lang="ts">
/** Demo: sn-picker-view — 块自定义：整幅浅蓝带（零内边距 + 大圆角）。纯 CSS 变量实现，跨端一致。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const times = ['08:00', '08:30', '09:00', '09:30', '10:00'];
const value = ref<Array<string | number>>(['09:00']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView
      v-model="value"
      :columns="[times]"
      wheel
      vibrate-short
      :visible-item-count="5"
      :item-height="52"
      custom-style="--sn-picker-view-wheel-inset: 0rpx; --sn-picker-view-wheel-radius: 20rpx; --sn-picker-view-wheel-band: var(--sn-mp-color-lightblue-soft)"
    />
    <text class="sn-demo__meta">已选：{{ value[0] }}（整幅浅蓝带，零内边距 + 大圆角）</text>
  </view>
</template>
