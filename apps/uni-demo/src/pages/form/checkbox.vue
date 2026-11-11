<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— checkbox 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/checkbox-mp-basic.vue';
import Demo1 from './demos/checkbox-mp-card.vue';
import Demo2 from './demos/checkbox-mp-colors.vue';
import Demo3 from './demos/checkbox-mp-custom-style.vue';
import Demo4 from './demos/checkbox-mp-group-limits.vue';
import Demo5 from './demos/checkbox-mp-group-state.vue';
import Demo6 from './demos/checkbox-mp-indicator.vue';
import Demo7 from './demos/checkbox-mp-placement.vue';
import Demo8 from './demos/checkbox-mp-standalone.vue';
import Demo9 from './demos/checkbox-mp-toggle-all.vue';
import Demo10 from './demos/checkbox-mp-type.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'复选框'" :title-en="'Checkbox'" :desc="'多选控件'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('卡片模式（variant=card）', 'Card variant')" badge="card" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('选中颜色（checkedColor）', 'Checked colors (checkedColor)')"
          badge="colors"
        />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义样式', 'Custom style')" badge="custom-style" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('数量限制（min / max）', 'Count limits (min / max)')"
          badge="group-limits"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('组状态与半选', 'Group state & half-check')"
          badge="group-state"
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('指示器位置与选中态', 'Indicator placement & checked paint')"
          badge="indicator"
        />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('布局与标签（placement / maxWidth）', 'Layout & label (placement / maxWidth)')"
          badge="placement"
        />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('独立用法与自定义取值', 'Standalone usage & custom values')"
          badge="standalone"
        />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('全选 / 全不选（toggleAll）', 'Select all / clear all (toggleAll)')"
          badge="toggle-all"
        />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('类型', 'Type')" badge="type" />
        <view class="module__body">
          <Demo10 />
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
