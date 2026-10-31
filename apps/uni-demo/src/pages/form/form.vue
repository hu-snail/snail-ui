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
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'表单'" :title-en="'Form'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" :index="0" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('单元格', 'Cell')" badge="cell" :index="1" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('cell-style', 'Cell Style')" badge="cell-style" :index="2" />
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
        <DemoModuleHead :title="t('禁用', 'Disabled')" badge="disabled" :index="4" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('字段', 'Fields')" badge="fields" :index="5" />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('表单类型', 'Form type')" badge="form-type" :index="6" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('拦截', 'Guard')" badge="guard" :index="7" />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('图标', 'Icon')" badge="icon" :index="8" />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('标签', 'Label')" badge="label" :index="9" />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('reset-submit', 'Reset Submit')"
          badge="reset-submit"
          :index="10"
        />
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('rules', 'Rules')" badge="rules" :index="11" />
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('schema-layout', 'Schema Layout')"
          badge="schema-layout"
          :index="12"
        />
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('状态', 'State')" badge="state" :index="13" />
        <view class="module__body">
          <Demo13 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('validate', 'Validate')" badge="validate" :index="14" />
        <view class="module__body">
          <Demo14 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('validation-flow', 'Validation Flow')"
          badge="validation-flow"
          :index="15"
        />
        <view class="module__body">
          <Demo15 />
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
