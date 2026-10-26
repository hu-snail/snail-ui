<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— sort-button 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/sort-button-mp-basic.vue';
import Demo1 from './demos/sort-button-mp-custom-style.vue';
import Demo2 from './demos/sort-button-mp-reset-line.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'排序按钮'" :title-en="'Sort Button'">
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
          <text class="module__title">自定义样式</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">reset-line</text>
        </view>
        <view class="module__body">
          <Demo2 />
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
