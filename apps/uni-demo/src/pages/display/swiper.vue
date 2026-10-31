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
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'轮播'" :title-en="'Swiper'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" :index="0" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('coverflow', 'Coverflow')" badge="coverflow" :index="1" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义', 'Custom')" badge="custom" :index="2" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('data', 'Data')" badge="data" :index="3" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('indicator', 'Indicator')" badge="indicator" :index="4" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('indicator-position', 'Indicator Position')"
          badge="indicator-position"
          :index="5"
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('multiple', 'Multiple')" badge="multiple" :index="6" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('playback', 'Playback')" badge="playback" :index="7" />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('垂直模式', 'Vertical')" badge="vertical" :index="8" />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('video', 'Video')" badge="video" :index="9" />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx 24rpx 48rpx;
}

/* 场景模块：白底圆角卡片（组件规范视觉稿：浅灰渐变画布上的浮起分区卡）。
 * 刻意不设 overflow / transform / backdrop-filter——它们会把 position: fixed
 * 的后代变成卡片坐标系，弹窗类 demo（calendar / popup / dialog …）会被困在
 * 卡片内裁切显示不全；层级感由描边 + 柔影承担。 */
.module {
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: var(--demo-card-shadow);
}

.module__body {
  padding: 0;
}
</style>
