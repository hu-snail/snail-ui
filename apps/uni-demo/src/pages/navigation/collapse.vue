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
    class="demo-host"
    :title-zh="'折叠面板'"
    :title-en="'Collapse'"
    :desc="'可展开收起的内容分组'"
    :bg="''"
  >
    <view class="page">
      <Demo0 class="demo-host" />
      <Demo1 class="demo-host" />
      <Demo2 class="demo-host" />
      <Demo3 class="demo-host" />
      <Demo4 class="demo-host" />
      <Demo5 class="demo-host" />
      <Demo6 class="demo-host" />
      <Demo7 class="demo-host" />
      <Demo8 class="demo-host" />
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

/* #ifdef MP-WEIXIN */
/* mp 自定义组件外壳节点按内容收缩（inline 语义）：宿主转 block 铺满列宽，
 * 否则 demo 列宽 = 各宿主 max-content —— 右锚定元素（swipe 操作钮等）不贴
 * 屏幕右缘、模块徽标行停在内容宽度处（设备实测回归，同 sn-step 的
 * virtualHost 修复；H5 上不能加 display，会盖掉 demo 根的 flex）。 */
.demo-host {
  display: block;
  width: 100%;
}
/* #endif */
</style>
