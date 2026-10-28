<script setup lang="ts">
/** 模板：文章详情 —— 作者行 / 正文 / 配图 / 互动栏。 */
import { ref } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

const liked = ref(false);
</script>

<template>
  <view class="tpl-page art">
    <text class="art__title">跨端 UI 的另一种可能：组件库到场景模板</text>
    <view class="art__author">
      <SnAvatar text="蜗" :size="56" round />
      <view class="art__author-meta">
        <text class="art__author-name">蜗蜗</text>
        <text class="art__author-time">3 天前 · 128 阅读</text>
      </view>
      <SnTag type="primary" size="small">+ 关注</SnTag>
    </view>
    <view class="art__body">
      <text class="art__para">当组件库沉淀到一定阶段，真正拉开差距的是"场景"。把按钮、输入框、单元格组合成登录页、订单页、商品详情，开发者复制即可用，这才是一个 UI 生态的复利。</text>
      <view class="art__figure" />
      <text class="art__para">这篇模板集合里，每个页面都可以独立发布成 H5 与微信小程序：主包只有目录，模板全部走分包，扫码即达。</text>
    </view>
    <view class="art__engage">
      <text class="art__engage-item" :class="{ 'is-on': liked }" @tap="liked = !liked">♥ 点赞 {{ liked ? 129 : 128 }}</text>
      <text class="art__engage-item">💬 评论 32</text>
      <text class="art__engage-item">⭐ 收藏 56</text>
    </view>
  </view>
</template>

<style scoped>
.art {
  background: #ffffff;
  min-height: 100vh;
  padding: 32rpx 32rpx 48rpx;
  box-sizing: border-box;
}
.art__title {
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1.4;
}
.art__author {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 28rpx 0;
}
.art__author-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.art__author-name {
  font-size: 26rpx;
  font-weight: 600;
}
.art__author-time {
  font-size: 20rpx;
  color: #98a2b3;
}
.art__body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.art__para {
  font-size: 28rpx;
  line-height: 1.8;
  color: #344054;
}
.art__figure {
  height: 300rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #0f172a, #475569);
}
.art__engage {
  display: flex;
  gap: 48rpx;
  margin-top: 40rpx;
  padding-top: 24rpx;
  border-top: 1px solid #eef0f4;
}
.art__engage-item {
  font-size: 24rpx;
  color: #667085;
}
.art__engage-item.is-on {
  color: #f43f5e;
}
</style>
