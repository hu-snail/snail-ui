<script setup lang="ts">
/** 模板：商品详情页 —— 主图 / 价格 / 规格 / 评价 / 底部操作栏。 */
import { ref } from 'vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const spec = ref('深空灰');
function addToCart(): void {
  uni.showToast({ title: '已加入购物车', icon: 'success' });
}
function buyNow(): void {
  uni.showToast({ title: '跳转收银台', icon: 'none' });
}
</script>

<template>
  <view class="tpl-page goods">
    <view class="goods__hero">
      <text class="goods__hero-glyph">🎧</text>
    </view>

    <view class="goods__body">
      <view class="tpl-row tpl-row--between goods__price-row">
        <text class="tpl-price goods__price">¥2999</text>
        <text class="goods__sold">已售 1200</text>
      </view>
      <text class="goods__title">蜗蜗旗舰降噪耳机 Pro · 主动降噪 / 40h 续航</text>

      <view class="tpl-gap" />
      <view class="tpl-card goods__cells">
        <SnCell title="颜色" :value="spec" is-link />
        <SnCell title="配送" value="顺丰速运 · 免运费" is-link />
        <SnCell title="评价" value="4.9 分 · 328 条" is-link />
      </view>

      <view class="tpl-gap" />
      <text class="goods__section">商品详情</text>
      <view class="tpl-card goods__desc">
        <view class="tpl-line" style="width: 100%" />
        <view class="tpl-line" style="width: 92%" />
        <view class="tpl-line" style="width: 96%" />
        <view class="tpl-line" style="width: 64%" />
      </view>
    </view>

    <view class="goods__actionbar">
      <view class="goods__action-icon"><text>客</text></view>
      <view class="goods__action-icon"><text>车</text></view>
      <SnButton type="default" size="small" @click="addToCart">加入购物车</SnButton>
      <SnButton type="primary" size="small" @click="buyNow">立即购买</SnButton>
    </view>
  </view>
</template>

<style scoped>
.goods {
  background: #f4f6f9;
  padding-bottom: 160rpx;
}
.goods__hero {
  height: 560rpx;
  background: linear-gradient(135deg, #312e81, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120rpx;
}
.goods__body {
  padding: 24rpx;
}
.goods__price-row {
  margin-bottom: 8rpx;
}
.goods__price {
  font-size: 44rpx;
}
.goods__sold {
  font-size: 22rpx;
  color: #98a2b3;
}
.goods__title {
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.45;
}
.goods__section {
  display: block;
  margin: 24rpx 0 16rpx;
  font-size: 28rpx;
  font-weight: 700;
}
.goods__desc {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.goods__actionbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #ffffff;
  box-shadow: 0 -6rpx 24rpx rgba(31, 41, 82, 0.06);
}
.goods__actionbar :deep(.sn-button) {
  flex: 1;
}
.goods__action-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #475467;
}
</style>
