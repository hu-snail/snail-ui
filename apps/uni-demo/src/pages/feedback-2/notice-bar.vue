<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— notice-bar 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/notice-bar-mp-basic.vue';
import Demo1 from './demos/notice-bar-mp-custom.vue';
import Demo2 from './demos/notice-bar-mp-marquee.vue';
import Demo3 from './demos/notice-bar-mp-type.vue';
import Demo4 from './demos/notice-bar-mp-vertical.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'通知栏'" :title-en="'Notice Bar'">
    <view class="page">
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">基础用法</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">自定义</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">marquee</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">类型</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">垂直模式</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx;
}

.module {
  margin-bottom: 24rpx;
  overflow: hidden;
}

.module__head {
  padding: 24rpx 24rpx 0;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.module__body {
  padding: 24rpx;
}
</style>
