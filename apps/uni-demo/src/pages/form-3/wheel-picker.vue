<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— wheel-picker 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/wheel-picker-mp-basic.vue';
import Demo1 from './demos/wheel-picker-mp-icons.vue';
import Demo2 from './demos/wheel-picker-mp-rich.vue';
import Demo3 from './demos/wheel-picker-mp-band-mode.vue';
import Demo4 from './demos/wheel-picker-mp-band-dots.vue';
import Demo5 from './demos/wheel-picker-mp-band-soft.vue';
import Demo6 from './demos/wheel-picker-mp-vibrate.vue';
import Demo7 from './demos/wheel-picker-mp-reminder.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'滚轮选择器'"
    :title-en="'Wheel Picker'"
    :desc="'wheel 风格内嵌滚轮'"
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
        <DemoModuleHead :title="t('图标选项', 'Icon options')" badge="icons" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('富内容行', 'Rich rows')" badge="rich" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('分列与渐变带', 'Split & gradient bands')" badge="band-mode" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('点阵纹理带', 'Dotted texture band')" badge="band-dots" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('整幅软色带', 'Full soft band')" badge="band-soft" />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('滑动震动', 'Slide haptic')" badge="vibrate" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('提醒弹层', 'Reminder sheet')" badge="reminder" />
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
