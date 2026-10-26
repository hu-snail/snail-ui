<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— form 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/form-mp-basic.vue';
import Demo1 from './demos/form-mp-cell.vue';
import Demo2 from './demos/form-mp-cell-style.vue';
import Demo3 from './demos/form-mp-disabled.vue';
import Demo4 from './demos/form-mp-icon.vue';
import Demo5 from './demos/form-mp-label.vue';
import Demo6 from './demos/form-mp-reset-submit.vue';
import Demo7 from './demos/form-mp-rules.vue';
import Demo8 from './demos/form-mp-schema-layout.vue';
import Demo9 from './demos/form-mp-validation-flow.vue';
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
        <text class="module__title">单元格</text>
      </view>
      <view class="module__body">
        <Demo1 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">cell-style</text>
      </view>
      <view class="module__body">
        <Demo2 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">禁用</text>
      </view>
      <view class="module__body">
        <Demo3 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">图标</text>
      </view>
      <view class="module__body">
        <Demo4 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">标签</text>
      </view>
      <view class="module__body">
        <Demo5 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">reset-submit</text>
      </view>
      <view class="module__body">
        <Demo6 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">rules</text>
      </view>
      <view class="module__body">
        <Demo7 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">schema-layout</text>
      </view>
      <view class="module__body">
        <Demo8 />
      </view>
    </view>
    <view class="module">
      <view class="module__head">
        <text class="module__title">validation-flow</text>
      </view>
      <view class="module__body">
        <Demo9 />
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
