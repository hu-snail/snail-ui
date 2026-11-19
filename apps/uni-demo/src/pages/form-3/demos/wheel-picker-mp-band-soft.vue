<script setup lang="ts">
/** Demo: sn-wheel-picker — 块自定义：`#band` 插槽画整幅浅蓝带（零内边距 + 大圆角，对齐时间滚轮参考稿）。 */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const times = ['08:00', '08:30', '09:00', '09:30', '10:00'];
const value = ref<Array<string | number>>(['09:00']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnWheelPicker
      v-model="value"
      :columns="[times]"
      :visible-item-count="5"
      :item-height="52"
      custom-style="--sn-picker-view-wheel-inset: 0rpx; --sn-picker-view-wheel-radius: 20rpx"
    >
      <template #band>
        <view class="soft-band" />
      </template>
    </SnWheelPicker>
    <text class="sn-demo__meta">已选：{{ value[0] }}（整幅浅蓝带，零内边距 + 大圆角）</text>
  </view>
</template>

<style scoped>
.soft-band {
  width: 100%;
  height: 100%;
  background-color: var(--sn-mp-color-lightblue-soft);
  border-radius: inherit;
}
</style>