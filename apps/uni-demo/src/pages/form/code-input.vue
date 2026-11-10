<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— code-input 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/code-input-mp-basic.vue';
import Demo1 from './demos/code-input-mp-shape.vue';
import Demo2 from './demos/code-input-mp-background.vue';
import Demo3 from './demos/code-input-mp-no-border.vue';
import Demo4 from './demos/code-input-mp-custom-style.vue';
import Demo5 from './demos/code-input-mp-error-info.vue';
import Demo6 from './demos/code-input-mp-gutter.vue';
import Demo7 from './demos/code-input-mp-mask.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'验证码输入框'"
    :title-en="'Code Input'"
    :desc="'验证码 / 密码方框输入'"
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
        <DemoModuleHead :title="t('形状', 'Shape')" badge="shape" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('格子背景', 'Cell background')" badge="background" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('无边框', 'No border')" badge="no-border" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义样式', 'Custom style')" badge="custom-style" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('错误态（errorInfo）', 'Error state (errorInfo)')"
          badge="error-info"
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('格子间距（gutter）', 'Cell gap (gutter)')" badge="gutter" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('明文显示（mask）', 'Plain display (mask)')" badge="mask" />
        <view class="module__body">
          <Demo7 />
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
