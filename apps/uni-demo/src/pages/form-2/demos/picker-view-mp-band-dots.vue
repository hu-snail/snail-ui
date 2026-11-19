<script setup lang="ts">
/** Demo: sn-picker-view — 块自定义: `#band` 插槽画点状纹理胶囊带（浅蓝底 + 圆点阵列 + 描边）。 */
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
      :item-height="56"
      custom-style="--sn-picker-view-wheel-inset: 12rpx"
    >
      <template #band>
        <view class="dotted-band">
          <view v-for="dot in 48" :key="dot" class="dotted-band__dot" />
        </view>
      </template>
    </SnPickerView>
    <text class="sn-demo__meta">已选：{{ value[0] }} min（#band 插槽自定义高亮块：点阵纹理）</text>
  </view>
</template>

<style scoped>
.dotted-band {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 6rpx;
  box-sizing: border-box;
  background-color: var(--sn-mp-color-lightblue-soft);
  border: 2rpx solid var(--sn-mp-color-lightblue);
  border-radius: inherit;
  flex-direction: row;
}

.dotted-band__dot {
  width: 6rpx;
  height: 6rpx;
  margin: 6rpx;
  border-radius: 3rpx;
  background-color: var(--sn-mp-color-lightblue);
  opacity: 0.55;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
