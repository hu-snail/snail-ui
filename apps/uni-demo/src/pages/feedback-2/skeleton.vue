<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— skeleton 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/skeleton-mp-animation.vue';
import Demo1 from './demos/skeleton-mp-basic.vue';
import Demo2 from './demos/skeleton-mp-custom.vue';
import Demo3 from './demos/skeleton-mp-custom-class-forms.vue';
import Demo4 from './demos/skeleton-mp-custom-style.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'骨架屏'" :title-en="'Skeleton'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('animation', 'Animation')" badge="animation" :index="0" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" :index="1" />
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
        <DemoModuleHead
          :title="t('custom-class-forms', 'Custom Class Forms')"
          badge="custom-class-forms"
          :index="3"
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义样式', 'Custom style')" badge="custom-style" :index="4" />
        <view class="module__body">
          <Demo4 />
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
