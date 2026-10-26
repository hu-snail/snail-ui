<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— swiper 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/swiper-mp-basic.vue';
import Demo1 from './demos/swiper-mp-custom.vue';
import Demo2 from './demos/swiper-mp-data.vue';
import Demo3 from './demos/swiper-mp-indicator.vue';
import Demo4 from './demos/swiper-mp-indicator-position.vue';
import Demo5 from './demos/swiper-mp-multiple.vue';
import Demo6 from './demos/swiper-mp-playback.vue';
import Demo7 from './demos/swiper-mp-vertical.vue';
import Demo8 from './demos/swiper-mp-video.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'轮播'" :title-en="'Swiper'">
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
          <text class="module__title">data</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">indicator</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">indicator-position</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">multiple</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">playback</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">垂直模式</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">video</text>
        </view>
        <view class="module__body">
          <Demo8 />
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
