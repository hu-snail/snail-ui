<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— picker 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/picker-mp-basic.vue';
import Demo1 from './demos/picker-mp-cascade-confirm.vue';
import Demo2 from './demos/picker-mp-fields.vue';
import Demo3 from './demos/picker-mp-rows-sheet.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'选择器'" :title-en="'Picker'">
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
          <text class="module__title">cascade-confirm</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">字段</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">rows-sheet</text>
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
