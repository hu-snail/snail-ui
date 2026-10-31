<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— icon 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/icon-mp-basic.vue';
import Demo1 from './demos/icon-mp-css.vue';
import Demo2 from './demos/icon-mp-custom.vue';
import Demo3 from './demos/icon-mp-gallery.vue';
import Demo4 from './demos/icon-mp-iconify.vue';
import Demo5 from './demos/icon-mp-name.vue';
import Demo6 from './demos/icon-mp-registry.vue';
import Demo7 from './demos/icon-mp-size.vue';
import Demo8 from './demos/icon-mp-string.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'图标'" :title-en="'Icon'" :bg="''">
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
          <text class="module__title">{{ t('css', 'Css') }}</text>
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
          <text class="module__title">{{ t('图标总览', 'Gallery') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('Iconify 按需', 'Iconify on demand') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('name', 'Name') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('registry', 'Registry') }}</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('尺寸', 'Size') }}</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('目录用法', 'Catalog names') }}</text>
        </view>
        <view class="module__body">
          <Demo8 />
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
