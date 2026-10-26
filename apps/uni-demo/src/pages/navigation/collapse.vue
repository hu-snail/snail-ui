<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— collapse 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/collapse-mp-accordion.vue';
import Demo1 from './demos/collapse-mp-basic.vue';
import Demo2 from './demos/collapse-mp-slots.vue';
import Demo3 from './demos/collapse-mp-viewmore.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'折叠面板'" :title-en="'Collapse'">
    <view class="page">
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">accordion</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">基础用法</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">插槽</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">viewmore</text>
        </view>
        <view class="module__body">
          <Demo3 />
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
