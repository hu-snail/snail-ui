<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— lucky 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/lucky-mp-basic.vue';
import Demo1 from './demos/lucky-mp-button-slot.vue';
import Demo2 from './demos/lucky-mp-cell.vue';
import Demo3 from './demos/lucky-mp-grid.vue';
import Demo4 from './demos/lucky-mp-speed.vue';
import Demo5 from './demos/lucky-mp-states.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'抽奖九宫格'"
    :title-en="'Lucky'"
    :desc="'play / stop 两段式抽奖'"
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
        <DemoModuleHead
          :title="t('自定义按钮（button 插槽）', 'Custom button slot')"
          badge="button-slot"
        />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('格子间距与高度（gutter / cellHeight）', 'Cell gap & height')"
          badge="cell"
        />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('网格规模（rows / cols）', 'Grid size')" badge="grid" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('速度与高亮色（speed）', 'Speed & highlight')" badge="speed" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('状态', 'State')" badge="states" />
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
