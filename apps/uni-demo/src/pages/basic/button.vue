<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— button 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/button-mp.vue';
import Demo1 from './demos/button-mp-basic.vue';
import Demo2 from './demos/button-mp-cell.vue';
import Demo3 from './demos/button-mp-custom.vue';
import Demo4 from './demos/button-mp-form-type.vue';
import Demo5 from './demos/button-mp-hover.vue';
import Demo6 from './demos/button-mp-icon-button.vue';
import Demo7 from './demos/button-mp-loading-props.vue';
import Demo8 from './demos/button-mp-mp-open-type.vue';
import Demo9 from './demos/button-mp-open-type.vue';
import Demo10 from './demos/button-mp-shape.vue';
import Demo11 from './demos/button-mp-size.vue';
import Demo12 from './demos/button-mp-state.vue';
import Demo13 from './demos/button-mp-variant.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'按钮'" :title-en="'Button'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" :index="0" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" :index="1" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('单元格', 'Cell')" badge="cell" :index="2" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义', 'Custom')" badge="custom" :index="3" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('表单类型', 'Form type')" badge="form-type" :index="4" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('悬停', 'Hover')" badge="hover" :index="5" />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('图标按钮', 'Icon Button')" badge="icon-button" :index="6" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('loading-props', 'Loading Props')"
          badge="loading-props"
          :index="7"
        />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('mp-open-type', 'Mp Open Type')"
          badge="mp-open-type"
          :index="8"
        />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('open-type', 'Open Type')" badge="open-type" :index="9" />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('形状', 'Shape')" badge="shape" :index="10" />
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('尺寸', 'Size')" badge="size" :index="11" />
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('状态', 'State')" badge="state" :index="12" />
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('变体', 'Variants')" badge="variant" :index="13" />
        <view class="module__body">
          <Demo13 />
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
