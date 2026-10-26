<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— input 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/input-mp-align-compact.vue';
import Demo1 from './demos/input-mp-basic.vue';
import Demo2 from './demos/input-mp-bordered-bg-radius.vue';
import Demo3 from './demos/input-mp-clear-focus.vue';
import Demo4 from './demos/input-mp-clearable-count.vue';
import Demo5 from './demos/input-mp-custom-class.vue';
import Demo6 from './demos/input-mp-native-attrs.vue';
import Demo7 from './demos/input-mp-password-toggle.vue';
import Demo8 from './demos/input-mp-prefix-suffix.vue';
import Demo9 from './demos/input-mp-runtime.vue';
import Demo10 from './demos/input-mp-sizes.vue';
import Demo11 from './demos/input-mp-slots.vue';
import Demo12 from './demos/input-mp-states.vue';
import Demo13 from './demos/input-mp-status.vue';
import Demo14 from './demos/input-mp-types.vue';
import Demo15 from './demos/input-mp-word-limit.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell :title-zh="'输入框'" :title-en="'Input'">
    <view class="page">
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">align-compact</text>
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
          <text class="module__title">bordered-bg-radius</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">clear-focus</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">clearable-count</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">自定义类名</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">native-attrs</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">password-toggle</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">prefix-suffix</text>
        </view>
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">runtime</text>
        </view>
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">sizes</text>
        </view>
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">插槽</text>
        </view>
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">状态</text>
        </view>
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">status</text>
        </view>
        <view class="module__body">
          <Demo13 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">类型</text>
        </view>
        <view class="module__body">
          <Demo14 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">word-limit</text>
        </view>
        <view class="module__body">
          <Demo15 />
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
