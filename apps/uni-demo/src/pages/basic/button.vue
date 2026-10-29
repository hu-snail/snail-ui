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
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'按钮'" :title-en="'Button'">
    <view class="page">
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('单元格', 'Cell') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('自定义', 'Custom') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('表单类型', 'Form type') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('悬停', 'Hover') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('图标按钮', 'Icon Button') }}</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('loading-props', 'Loading Props') }}</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('mp-open-type', 'Mp Open Type') }}</text>
        </view>
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('open-type', 'Open Type') }}</text>
        </view>
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('形状', 'Shape') }}</text>
        </view>
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('尺寸', 'Size') }}</text>
        </view>
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('状态', 'State') }}</text>
        </view>
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module demo-glass">
        <view class="module__head">
          <text class="module__title">{{ t('变体', 'Variants') }}</text>
        </view>
        <view class="module__body">
          <Demo13 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx;
}

.module {
  margin-bottom: 24rpx;
  /* 不裁切：弹窗类 demo 的 fixed 弹层要铺满视口（弹窗不能困在卡片内）。 */
}

.module__head {
  padding: 24rpx 24rpx 0;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.module__body {
  padding: 24rpx;
}
</style>
