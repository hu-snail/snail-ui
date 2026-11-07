<script setup lang="ts">
/** Demo: sn-slider-bar — capsule bar (uni end). */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const volume = ref(64);
const progress = ref(35);
const price = ref<number[]>([120, 480]);
const dimmer = ref(21);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">默认胶囊（主题色填充）</text>
    <SnSliderBar v-model="volume" label="音量" show-value />

    <text class="sn-demo__title">读数格式 format="value"</text>
    <SnSliderBar v-model="progress" :max="120" format="value" value-suffix="s" show-value />

    <text class="sn-demo__title">区间 range（双 knob，中间填充）</text>
    <SnSliderBar v-model="price" range :min="0" :max="1000" :step="10" show-value />

    <text class="sn-demo__title">Aurora 渐变 + 星光</text>
    <SnSliderBar v-model="volume" theme="aurora" label="亮度" show-value />

    <text class="sn-demo__title">尺寸 small / large</text>
    <SnSliderBar v-model="volume" size="small" show-value />
    <SnSliderBar v-model="volume" size="large" show-value />

    <text class="sn-demo__title">竖排 column</text>
    <view class="sn-demo__row">
      <SnSliderBar v-model="dimmer" variant="column" :min="15" :max="30" show-value />
      <SnSliderBar v-model="dimmer" variant="column" theme="aurora" :min="15" :max="30" show-value />
    </view>

    <text class="sn-demo__meta">volume = {{ volume }} · progress = {{ progress }}s</text>
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
  gap: 24rpx;
  height: 260rpx;
}
.sn-demo__meta {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
