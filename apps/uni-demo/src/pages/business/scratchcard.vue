<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— scratchcard 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/scratchcard-mp-basic.vue';
import Demo1 from './demos/scratchcard-mp-cover.vue';
import Demo2 from './demos/scratchcard-mp-ratio.vue';
import Demo3 from './demos/scratchcard-mp-states.vue';
import Demo4 from './demos/scratchcard-mp-title-style.vue';
import Demo5 from './demos/scratchcard-mp-watermark.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'刮刮乐'"
    :title-en="'Scratchcard'"
    :desc="'刮层擦除与阈值回调'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('封面色（coverColor）', 'Cover color')" badge="cover" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('刮开阈值（ratio）', 'Scratch threshold')" badge="ratio" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('状态', 'State')" badge="states" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('标题样式（titleSize / titleColor）', 'Title styling')"
          badge="title-style"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('水印（watermark*）', 'Watermark')" badge="watermark" />
        <view class="module__body">
          <Demo5 />
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
