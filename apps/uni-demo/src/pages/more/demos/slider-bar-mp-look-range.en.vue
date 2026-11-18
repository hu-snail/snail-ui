<script setup lang="ts">
/**
 * Demo: sn-slider-bar — 参考风格：双柄区间，白色圆盘描主题色环。
 * 对应参考图「Discount / Price range / Comfort zone / Age range」——
 * 每组标题与读数在上方，range 双柄互不交叉，中间填充主题色。
 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const discount = ref<number[]>([20, 75]);
const price = ref<number[]>([200, 800]);
const comfort = ref<number[]>([18, 24]);
const age = ref<number[]>([25, 45]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="look-head">
      <text class="look-head__label">Discount</text>
      <text class="look-head__value">{{ discount[0] }}% – {{ discount[1] }}%</text>
    </view>
    <SnSliderBar v-model="discount" range aria-label="Discount" />

    <view class="look-head">
      <text class="look-head__label">Price range</text>
      <text class="look-head__value">${{ price[0] }}.00 – ${{ price[1] }}.00</text>
    </view>
    <SnSliderBar v-model="price" range :min="0" :max="1000" aria-label="Price range" />

    <view class="look-head">
      <text class="look-head__label">Comfort zone</text>
      <text class="look-head__value">{{ comfort[0] }}°C – {{ comfort[1] }}°C</text>
    </view>
    <SnSliderBar v-model="comfort" range :min="10" :max="40" aria-label="Comfort zone" />

    <view class="look-head">
      <text class="look-head__label">Age range</text>
      <text class="look-head__value">{{ age[0] }} – {{ age[1] }}</text>
    </view>
    <SnSliderBar v-model="age" range :min="0" :max="100" aria-label="Age range" />
  </view>
</template>

<style scoped>
.look-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.look-head__label {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.look-head__value {
  font-size: 30rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
