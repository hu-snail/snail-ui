<script setup lang="ts">
/** Demo: sn-wheel-picker — band customization: the `#band` slot paints a dotted texture pill (soft blue + dot grid + border). */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const minutes = [15, 20, 25, 30, 45];
const value = ref<Array<string | number>>([25]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnWheelPicker
      v-model="value"
      :columns="[minutes]"
      :visible-item-count="5"
      :item-height="56"
      custom-style="--sn-picker-view-wheel-inset: 12rpx; --sn-picker-view-wheel-band: var(--sn-mp-color-lightblue-soft)"
    >
      <template #band>
        <view class="dotted-band">
          <view v-for="dot in 48" :key="dot" class="dotted-band__dot" />
        </view>
      </template>
    </SnWheelPicker>
    <text class="sn-demo__meta">Selected: {{ value[0] }} min (#band slot: dotted texture pill)</text>
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