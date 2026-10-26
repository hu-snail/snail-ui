<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— input-number 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/input-number-mp-basic.vue';
import Demo1 from './demos/input-number-mp-commit-hooks.vue';
import Demo2 from './demos/input-number-mp-controls.vue';
import Demo3 from './demos/input-number-mp-custom-class.vue';
import Demo4 from './demos/input-number-mp-theme-state.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'计数器'" :title-en="'Input Number'">
    <view class="page">
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('commit-hooks', 'Commit Hooks') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('controls', 'Controls') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('自定义类名', 'Custom class') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('theme-state', 'Theme State') }}</text>
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
  /* 不裁切：弹窗类 demo 的 fixed 弹层要铺满视口（弹窗不能困在卡片内）。 */
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
