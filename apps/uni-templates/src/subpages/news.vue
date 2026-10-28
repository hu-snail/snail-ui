<script setup lang="ts">
/** 模板：新闻首页 —— 频道分段 + 图文列表。 */
import { ref } from 'vue';

const tab = ref(0);
const tabs = ['推荐', '科技', '财经', '体育'];
const items = [
  { id: 1, title: 'AI-Native 组件库的下一步：从组件到场景', from: '蜗牛科技', meta: '328 评论 · 2 小时前', from1: '#6366f1', to1: '#a855f7' },
  { id: 2, title: '跨端渲染的取舍：H5 与小程序的边界', from: '前端早读', meta: '96 评论 · 4 小时前', from1: '#0ea5e9', to1: '#22d3ee' },
  { id: 3, title: 'Token 驱动的主题系统实践', from: '设计_spacing', meta: '52 评论 · 6 小时前', from1: '#f97316', to1: '#facc15' },
  { id: 4, title: '分包加载如何撑起复杂小程序', from: '小程序观察', meta: '41 评论 · 8 小时前', from1: '#34d399', to1: '#a7f3d0' },
];
</script>

<template>
  <view class="tpl-page news">
    <view class="news__seg">
      <text
        v-for="(tb, i) in tabs"
        :key="tb"
        class="news__seg-item"
        :class="{ 'is-active': tab === i }"
        @tap="tab = i"
      >{{ tb }}</text>
    </view>
    <view class="news__list">
      <view v-for="n in items" :key="n.id" class="news__row">
        <view class="news__text">
          <text class="news__title">{{ n.title }}</text>
          <text class="news__meta">{{ n.from }} · {{ n.meta }}</text>
        </view>
        <view class="news__thumb" :style="{ background: `linear-gradient(135deg, ${n.from1}, ${n.to1})` }" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.news {
  background: #ffffff;
  min-height: 100vh;
}
.news__seg {
  display: flex;
  gap: 40rpx;
  padding: 20rpx 24rpx;
  border-bottom: 1px solid #eef0f4;
}
.news__seg-item {
  font-size: 28rpx;
  color: #98a2b3;
  padding-bottom: 12rpx;
}
.news__seg-item.is-active {
  color: #1d2939;
  font-weight: 700;
  border-bottom: 4rpx solid #4f6ef7;
}
.news__list {
  padding: 0 24rpx;
}
.news__row {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1px solid #f4f6f9;
}
.news__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.news__title {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.5;
  color: #1d2939;
}
.news__meta {
  font-size: 20rpx;
  color: #98a2b3;
}
.news__thumb {
  width: 168rpx;
  height: 124rpx;
  border-radius: 14rpx;
  flex-shrink: 0;
}
</style>
