<script setup lang="ts">
/** 模板：数据统计 —— 指标卡 / 柱状图 / 来源分布。 */
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';

const bars = [38, 62, 50, 78, 44, 90, 66];
const sources = [
  { name: 'App', pct: 52 },
  { name: 'H5', pct: 28 },
  { name: 'MP', pct: 20 },
];
</script>

<template>
  <view class="tpl-page stats">
    <view class="stats__grid">
      <view class="tpl-card stats__stat">
        <text class="stats__label">今日活跃</text>
        <text class="stats__value">1,286</text>
        <text class="stats__up">↑ 12%</text>
      </view>
      <view class="tpl-card stats__stat">
        <text class="stats__label">转化率</text>
        <text class="stats__value">4.6%</text>
        <text class="stats__up">↑ 0.8</text>
      </view>
    </view>

    <view class="tpl-card stats__chart">
      <view
        v-for="(h, i) in bars"
        :key="i"
        class="stats__bar"
        :style="{ height: `${h}%` }"
      />
    </view>

    <text class="stats__section">来源分布</text>
    <view class="tpl-card">
      <view v-for="s in sources" :key="s.name" class="stats__source">
        <text class="stats__source-name">{{ s.name }}</text>
        <view class="stats__source-rail">
          <SnProgress type="line" :percentage="s.pct" :hide-text="true" />
        </view>
        <text class="stats__source-pct">{{ s.pct }}%</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.stats {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.stats__grid {
  display: flex;
  gap: 20rpx;
}
.stats__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.stats__label {
  font-size: 22rpx;
  color: #667085;
}
.stats__value {
  font-size: 40rpx;
  font-weight: 800;
}
.stats__up {
  font-size: 20rpx;
  color: #16a34a;
}
.stats__chart {
  display: flex;
  align-items: flex-end;
  gap: 18rpx;
  height: 240rpx;
}
.stats__bar {
  flex: 1;
  border-radius: 12rpx 12rpx 4rpx 4rpx;
  background: linear-gradient(to top, #6366f1, #a855f7);
  opacity: 0.85;
}
.stats__section {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
}
.stats__source {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 0;
}
.stats__source-name {
  width: 64rpx;
  font-size: 24rpx;
  color: #667085;
}
.stats__source-rail {
  flex: 1;
}
.stats__source-pct {
  width: 72rpx;
  text-align: right;
  font-size: 22rpx;
  color: #98a2b3;
}
</style>
