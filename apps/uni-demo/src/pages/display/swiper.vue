<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— swiper 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/swiper-mp-basic.vue';
import Demo1 from './demos/swiper-mp-coverflow.vue';
import Demo2 from './demos/swiper-mp-custom.vue';
import Demo3 from './demos/swiper-mp-data.vue';
import Demo4 from './demos/swiper-mp-indicator.vue';
import Demo5 from './demos/swiper-mp-indicator-position.vue';
import Demo6 from './demos/swiper-mp-multiple.vue';
import Demo7 from './demos/swiper-mp-playback.vue';
import Demo8 from './demos/swiper-mp-vertical.vue';
import Demo9 from './demos/swiper-mp-video.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'轮播'" :title-en="'Swiper'">
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
          <text class="module__title">{{ t('coverflow', 'Coverflow') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('自定义', 'Custom') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('data', 'Data') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('indicator', 'Indicator') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('indicator-position', 'Indicator Position') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('multiple', 'Multiple') }}</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('playback', 'Playback') }}</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('垂直模式', 'Vertical') }}</text>
        </view>
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('video', 'Video') }}</text>
        </view>
        <view class="module__body">
          <Demo9 />
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
