<script setup lang="ts">
/** 模板：商城首页 —— 搜索 / 宫格 / 秒杀商品 / 底部标签栏。 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const keyword = ref('');
const activeTab = ref(0);
const tabs = ['首页', '分类', '购物车', '我的'];
const cats = ['数码', '穿戴', '家居', '出行'];
const goods = [
  { id: 1, name: '蜗蜗无线降噪耳机 Pro', price: '¥299', from: '#6366f1', to: '#a855f7' },
  { id: 2, name: '全场景充电底座', price: '¥129', from: '#0ea5e9', to: '#22d3ee' },
  { id: 3, name: '便携收纳包', price: '¥59', from: '#f97316', to: '#facc15' },
  { id: 4, name: '旗舰 同款配色表', price: '¥199', from: '#34d399', to: '#a7f3d0' },
];
</script>

<template>
  <view class="tpl-page mall">
    <view class="mall__search">
      <SnSearch v-model="keyword" placeholder="搜索商品" />
    </view>

    <view class="mall__banner">
      <text>品牌精选 · 新品尝鲜</text>
    </view>

    <view class="mall__cats">
      <view v-for="c in cats" :key="c" class="mall__cat">
        <view class="mall__cat-icon"><text>{{ c.slice(0, 1) }}</text></view>
        <text class="mall__cat-name">{{ c }}</text>
      </view>
    </view>

    <text class="mall__section">限时秒杀</text>
    <view class="mall__goods">
      <view v-for="g in goods" :key="g.id" class="mall__goods-card">
        <view class="mall__goods-thumb" :style="{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }" />
        <text class="mall__goods-name">{{ g.name }}</text>
        <text class="tpl-price">{{ g.price }}</text>
      </view>
    </view>

    <view class="mall__tabbar">
      <view
        v-for="(tab, i) in tabs"
        :key="tab"
        class="mall__tab"
        :class="{ 'is-active': activeTab === i }"
        @tap="activeTab = i"
      >
        <view class="mall__tab-dot" />
        <text>{{ tab }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.mall {
  padding-bottom: 140rpx;
}
.mall__search {
  padding: 20rpx 24rpx;
  background: #ffffff;
}
.mall__banner {
  margin: 20rpx 24rpx 0;
  height: 200rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
}
.mall__cats {
  display: flex;
  justify-content: space-between;
  padding: 28rpx 40rpx 0;
}
.mall__cat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.mall__cat-icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  color: #475467;
}
.mall__cat-name {
  font-size: 22rpx;
  color: #667085;
}
.mall__section {
  display: block;
  padding: 32rpx 24rpx 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}
.mall__goods {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 0 24rpx;
}
.mall__goods-card {
  width: calc(50% - 10rpx);
  background: #ffffff;
  border-radius: 20rpx;
  padding: 16rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.mall__goods-thumb {
  height: 180rpx;
  border-radius: 14rpx;
}
.mall__goods-name {
  font-size: 24rpx;
  line-height: 1.4;
  color: #1d2939;
}
.mall__goods-card .tpl-price {
  font-size: 28rpx;
}
.mall__tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: #ffffff;
  padding: 16rpx 0 calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -6rpx 24rpx rgba(31, 41, 82, 0.06);
}
.mall__tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  font-size: 20rpx;
  color: #98a2b3;
}
.mall__tab.is-active {
  color: #4f6ef7;
}
.mall__tab-dot {
  width: 36rpx;
  height: 36rpx;
  border-radius: 12rpx;
  background: currentColor;
  opacity: 0.35;
}
.mall__tab.is-active .mall__tab-dot {
  opacity: 1;
}
</style>
