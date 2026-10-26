<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— input-number 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/input-number-mp-basic.vue';
import Demo1 from './demos/input-number-mp-commit-hooks.vue';
import Demo2 from './demos/input-number-mp-controls.vue';
import Demo3 from './demos/input-number-mp-custom-class.vue';
import Demo4 from './demos/input-number-mp-theme-state.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'计数器'" :title-en="'Input Number'">
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
          <text class="module__title">commit-hooks</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">controls</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">自定义类名</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">theme-state</text>
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
