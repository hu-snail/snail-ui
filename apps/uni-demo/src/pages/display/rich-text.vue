<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— rich-text 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/rich-text-mp-basic.vue';
import Demo1 from './demos/rich-text-mp-images.vue';
import Demo2 from './demos/rich-text-mp-links.vue';
import Demo3 from './demos/rich-text-mp-media.vue';
import Demo4 from './demos/rich-text-mp-styles.vue';
import Demo5 from './demos/rich-text-mp-table.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'富文本'" :title-en="'Rich Text'">
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
          <text class="module__title">{{ t('images', 'Images') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('links', 'Links') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('media', 'Media') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('styles', 'Styles') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('table', 'Table') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
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
