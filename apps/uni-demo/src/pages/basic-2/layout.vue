<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— layout 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/layout-mp-align.vue';
import Demo1 from './demos/layout-mp-basic.vue';
import Demo2 from './demos/layout-mp-gutter.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'布局'" :title-en="'Layout'" :bg="''">
    <view class="page">
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('align', 'Align') }}</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('gutter', 'Gutter') }}</text>
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
  padding: 24rpx 32rpx;
}

/* 场景模块：无卡片底（弥散渐变背景直接透出），标题外置在页面背景上，
 * demo 内容紧随其下；仅用间距分节。 */
.module {
  margin-bottom: 40rpx;
  /* 不裁切：弹窗类 demo 的 fixed 弹层要铺满视口（弹窗不能困在卡片内）。 */
}

.module__head {
  padding: 0 8rpx 16rpx;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.module__body {
  padding: 0;
}
</style>
