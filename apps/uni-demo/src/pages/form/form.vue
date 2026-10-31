<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— form 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/form-mp-basic.vue';
import Demo1 from './demos/form-mp-cell.vue';
import Demo2 from './demos/form-mp-cell-style.vue';
import Demo3 from './demos/form-mp-custom.vue';
import Demo4 from './demos/form-mp-disabled.vue';
import Demo5 from './demos/form-mp-fields.vue';
import Demo6 from './demos/form-mp-form-type.vue';
import Demo7 from './demos/form-mp-guard.vue';
import Demo8 from './demos/form-mp-icon.vue';
import Demo9 from './demos/form-mp-label.vue';
import Demo10 from './demos/form-mp-reset-submit.vue';
import Demo11 from './demos/form-mp-rules.vue';
import Demo12 from './demos/form-mp-schema-layout.vue';
import Demo13 from './demos/form-mp-state.vue';
import Demo14 from './demos/form-mp-validate.vue';
import Demo15 from './demos/form-mp-validation-flow.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'表单'" :title-en="'Form'">
    <view class="page">
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('单元格', 'Cell') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('cell-style', 'Cell Style') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('自定义', 'Custom') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('禁用', 'Disabled') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('字段', 'Fields') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('表单类型', 'Form type') }}</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('拦截', 'Guard') }}</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('图标', 'Icon') }}</text>
        </view>
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('标签', 'Label') }}</text>
        </view>
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('reset-submit', 'Reset Submit') }}</text>
        </view>
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('rules', 'Rules') }}</text>
        </view>
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('schema-layout', 'Schema Layout') }}</text>
        </view>
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('状态', 'State') }}</text>
        </view>
        <view class="module__body">
          <Demo13 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('validate', 'Validate') }}</text>
        </view>
        <view class="module__body">
          <Demo14 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('validation-flow', 'Validation Flow') }}</text>
        </view>
        <view class="module__body">
          <Demo15 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx;
}

/* 场景模块：无卡片底（弥散渐变背景直接透出），标题外置在页面背景上，
 * demo 内容紧随其下；仅用间距分节。 */
.module {
  margin-bottom: 40rpx;
  /* 不裁切：弹窗类 demo 的 fixed 弹层要铺满视口（弹窗不能困在卡片内）。 */
}

.module__head {
  padding: 0 8rpx 16rpx;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.module__body {
  padding: 0;
}
</style>
