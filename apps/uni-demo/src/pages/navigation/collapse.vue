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
import DemoPageShell from '../../components/DemoPageShell.vue';
</script>

<template>
  <DemoPageShell
    :title-zh="'折叠面板'"
    :title-en="'Collapse'"
    :desc="'可展开收起的内容分组'"
    :bg="''"
  >
    <view class="page">
      <Demo0 />
      <Demo1 />
      <Demo2 />
      <Demo3 />
      <Demo4 />
      <Demo5 />
      <Demo6 />
      <Demo7 />
      <Demo8 />
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
