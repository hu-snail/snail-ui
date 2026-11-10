<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— steps 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/steps-mp-basic.vue';
import Demo1 from './demos/steps-mp-connector.vue';
import Demo2 from './demos/steps-mp-custom-class.vue';
import Demo3 from './demos/steps-mp-dot.vue';
import Demo4 from './demos/steps-mp-error.vue';
import Demo5 from './demos/steps-mp-icon.vue';
import Demo6 from './demos/steps-mp-node.vue';
import Demo7 from './demos/steps-mp-slots.vue';
import Demo8 from './demos/steps-mp-space.vue';
import Demo9 from './demos/steps-mp-status.vue';
import Demo10 from './demos/steps-mp-vertical.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'步骤条'" :title-en="'Steps'" :desc="'流程步骤指示'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('连接线', 'Connector')" badge="connector" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('根节点样式（customClass）', 'Root styling (customClass)')"
          badge="custom-class"
        />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('点状步骤条（dot）', 'Dot steps (`dot`)')" badge="dot" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('错误状态（status=error）', 'Error state (`status=error`)')"
          badge="error"
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
        <DemoModuleHead :title="t('节点', 'Node')" badge="node" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('内容插槽', 'Content slots')" badge="slots" />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '间距与对齐（space / align-center）',
              'Spacing & alignment (`space` / `align-center`)',
            )
          "
          badge="space"
        />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('显式状态（status）', 'Explicit status (`status`)')"
          badge="status"
        />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('垂直步骤条（vertical）', 'Vertical steps (`vertical`)')"
          badge="vertical"
        />
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
