<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— upload 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/upload-mp-basic.vue';
import Demo1 from './demos/upload-mp-before-hooks.vue';
import Demo2 from './demos/upload-mp-disabled-status.vue';
import Demo3 from './demos/upload-mp-events-counter.vue';
import Demo4 from './demos/upload-mp-multiple-source.vue';
import Demo5 from './demos/upload-mp-preview-custom.vue';
import Demo6 from './demos/upload-mp-request-method.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'上传'" :title-en="'Upload'">
    <view class="page">
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('before-hooks', 'Before Hooks') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('disabled-status', 'Disabled Status') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('events-counter', 'Events Counter') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('multiple-source', 'Multiple Source') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('preview-custom', 'Preview Custom') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('request-method', 'Request Method') }}</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx;
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
