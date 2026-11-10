<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— tag 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/tag-mp-basic.vue';
import Demo1 from './demos/tag-mp-closable.vue';
import Demo2 from './demos/tag-mp-color.vue';
import Demo3 from './demos/tag-mp-css-icon.vue';
import Demo4 from './demos/tag-mp-dynamic.vue';
import Demo5 from './demos/tag-mp-icon.vue';
import Demo6 from './demos/tag-mp-round-mark.vue';
import Demo7 from './demos/tag-mp-shape.vue';
import Demo8 from './demos/tag-mp-size.vue';
import Demo9 from './demos/tag-mp-variant.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'标签'" :title-en="'Tag'" :desc="'多色标记与可关闭标签'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('可关闭标签（closable）', 'Closable tags (`closable`)')"
          badge="closable"
        />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('自定义颜色（bgColor / color）', 'Custom colors (`bgColor` / `color`)')"
          badge="color"
        />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('字体图标（cssIcon）', 'Font icons (`cssIcon`)')"
          badge="css-icon"
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('动态新增标签（dynamic）', 'Dynamic tags (`dynamic`)')"
          badge="dynamic"
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
        <DemoModuleHead
          :title="t('胶囊与标记形（round / mark）', 'Round & mark shapes (`round` / `mark`)')"
          badge="round-mark"
        />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('形状', 'Shape')" badge="shape" />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('尺寸（size）', 'Size (`size`)')" badge="size" />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('变体', 'Variants')" badge="variant" />
        <view class="module__body">
          <Demo9 />
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
