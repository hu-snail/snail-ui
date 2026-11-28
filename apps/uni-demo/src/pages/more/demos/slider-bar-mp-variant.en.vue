<script setup lang="ts">
/** Demo: sn-slider-bar — 竖排：variant="column" 轨道竖起来。 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const dimmer = ref(21);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">竖排 column</text>
    <view class="sn-demo__row">
      <view class="sn-demo__col">
        <SnSliderBar v-model="dimmer" variant="column" :min="15" :max="30" show-value />
      </view>
      <view class="sn-demo__col">
        <SnSliderBar
          v-model="dimmer"
          variant="column"
          theme="aurora"
          :min="15"
          :max="30"
          show-value
        />
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__title {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__row {
  display: flex;
  flex-direction: row;
  gap: 24rpx;
  height: 260rpx;
}
/* The column slider is width-constrained by its track; the cell owns the
   horizontal space so the two strips sit side by side. */
.sn-demo__col {
  display: flex;
  flex: 1;
  min-width: 0;
  height: 100%;
  justify-content: center;
}
</style>
