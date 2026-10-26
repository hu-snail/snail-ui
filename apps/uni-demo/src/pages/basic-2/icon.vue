<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— icon 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/icon-mp-basic.vue';
import Demo1 from './demos/icon-mp-css.vue';
import Demo2 from './demos/icon-mp-custom.vue';
import Demo3 from './demos/icon-mp-name.vue';
import Demo4 from './demos/icon-mp-registry.vue';
import Demo5 from './demos/icon-mp-size.vue';
</script>

<template>
  <view class="page">
    <view class="module">
      <view class="module__head">
        <text class="module__title">基础用法</text>
      </view>
      <view class="module__body">
        <Demo0 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">css</text>
      </view>
      <view class="module__body">
        <Demo1 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">自定义</text>
      </view>
      <view class="module__body">
        <Demo2 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">name</text>
      </view>
      <view class="module__body">
        <Demo3 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">registry</text>
      </view>
      <view class="module__body">
        <Demo4 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">尺寸</text>
      </view>
      <view class="module__body">
        <Demo5 />
      </view>
    </view>
  </view>
</template>

<style scoped>
.page {
  padding: 24rpx;
}

.module {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.module__head {
  padding: 24rpx 24rpx 0;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f1f1f;
}

.module__body {
  padding: 24rpx;
}
</style>
