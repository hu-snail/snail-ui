<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— collapse 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/collapse-mp-accordion.vue';
import Demo1 from './demos/collapse-mp-basic.vue';
import Demo2 from './demos/collapse-mp-before-expend.vue';
import Demo3 from './demos/collapse-mp-card.vue';
import Demo4 from './demos/collapse-mp-disabled.vue';
import Demo5 from './demos/collapse-mp-icon.vue';
import Demo6 from './demos/collapse-mp-more-slot.vue';
import Demo7 from './demos/collapse-mp-title-slot.vue';
import Demo8 from './demos/collapse-mp-viewmore.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'折叠面板'"
    :title-en="'Collapse'"
    :desc="'可展开收起的内容分组'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead
          :title="t('手风琴模式（accordion）', 'Accordion mode (`accordion`)')"
          badge="accordion"
        />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('展开拦截（before-expend）', 'Expand guard (`before-expend`)')"
          badge="before-expend"
        />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('卡片', 'Card')" badge="card" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('禁用面板（disabled）', 'Disabled panel (`disabled`)')"
          badge="disabled"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('图标', 'Icon')" badge="icon" />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('more 插槽', 'The `more` slot')" badge="more-slot" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('title 插槽与内容样式', '`title` slot & content styling')"
          badge="title-slot"
        />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('viewmore', 'Viewmore')" badge="viewmore" />
        <view class="module__body">
          <Demo8 />
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
