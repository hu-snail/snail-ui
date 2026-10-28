<script setup lang="ts">
/** 模板：订单页 —— 状态分段 + 订单卡 + 操作按钮。 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';

const active = ref(0);
const orders = [
  { id: 'SN20251208001', shop: '蜗蜗严选', name: '旗舰降噪耳机 Pro', price: '¥299.00', state: '待付款' },
  { id: 'SN20251207004', shop: '蜗蜗严选', name: '全场景充电底座', price: '¥129.00', state: '待发货' },
  { id: 'SN20251205012', shop: '蜗蜗自营', name: '便携收纳包', price: '¥59.00', state: '已完成' },
];
function pay(): void {
  uni.showToast({ title: '唤起收银台', icon: 'none' });
}
</script>

<template>
  <view class="tpl-page order">
    <SnTabs v-model="active">
      <SnTab title="全部" :name="0"><view class="order__list"><view v-for="o in orders" :key="o.id" class="order__card">
        <view class="order__head">
          <text class="order__shop">{{ o.shop }}</text>
          <text class="order__state">{{ o.state }}</text>
        </view>
        <view class="order__goods">
          <view class="order__thumb" />
          <view class="order__meta">
            <text class="order__name">{{ o.name }}</text>
            <text class="order__id">{{ o.id }}</text>
          </view>
          <text class="tpl-price order__price">{{ o.price }}</text>
        </view>
        <view class="order__foot">
          <SnButton size="small" type="default">查看物流</SnButton>
          <SnButton size="small" type="primary" @click="pay">去支付</SnButton>
        </view>
      </view></view></SnTab>
      <SnTab title="待付款" :name="1"><view class="order__list"><view v-for="o in orders.filter((x) => x.state === '待付款')" :key="o.id" class="order__card">
        <view class="order__head"><text class="order__shop">{{ o.shop }}</text><text class="order__state">{{ o.state }}</text></view>
        <view class="order__goods">
          <view class="order__thumb" />
          <view class="order__meta"><text class="order__name">{{ o.name }}</text><text class="order__id">{{ o.id }}</text></view>
          <text class="tpl-price order__price">{{ o.price }}</text>
        </view>
        <view class="order__foot"><SnButton size="small" type="primary" @click="pay">去支付</SnButton></view>
      </view></view></SnTab>
      <SnTab title="待发货" :name="2"><view class="order__empty"><text>暂无待发货订单</text></view></SnTab>
      <SnTab title="已完成" :name="3"><view class="order__empty"><text>暂无已完成订单</text></view></SnTab>
    </SnTabs>
  </view>
</template>

<style scoped>
.order {
  min-height: 100vh;
}
.order__list {
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.order__card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.order__head {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #667085;
}
.order__shop {
  font-weight: 700;
  color: #1d2939;
}
.order__state {
  color: #e5484d;
}
.order__goods {
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.order__thumb {
  width: 108rpx;
  height: 108rpx;
  border-radius: 14rpx;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  flex-shrink: 0;
}
.order__meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.order__name {
  font-size: 26rpx;
  color: #1d2939;
}
.order__id {
  font-size: 20rpx;
  color: #b3bac6;
}
.order__price {
  font-size: 26rpx;
}
.order__foot {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}
.order__empty {
  padding: 120rpx 0;
  text-align: center;
  color: #98a2b3;
  font-size: 24rpx;
}
</style>
