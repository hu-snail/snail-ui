<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— transition 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/transition-mp-basic.vue';
import Demo1 from './demos/transition-mp-combined.vue';
import Demo2 from './demos/transition-mp-custom-class.vue';
import Demo3 from './demos/transition-mp-destroy.vue';
import Demo4 from './demos/transition-mp-duration.vue';
import Demo5 from './demos/transition-mp-lazy-render.vue';
import Demo6 from './demos/transition-mp-touch-move.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'动画'" :title-en="'Transition'" :desc="'出入场过渡动画封装'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('组合动画（name 数组）', 'Combined animations (`name` array)')"
          badge="combined"
        />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义类名', 'Custom class')" badge="custom-class" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('保留节点（destroy）', 'Keep node (`destroy`)')"
          badge="destroy"
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('分段时长（duration）', 'Per-leg durations (`duration`)')"
          badge="duration"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('懒渲染（lazyRender）', 'Lazy rendering (`lazyRender`)')"
          badge="lazy-render"
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('阻止触摸滚动（disableTouchMove）', 'Block touch scroll (`disableTouchMove`)')"
          badge="touch-move"
        />
        <view class="module__body">
          <Demo6 />
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
