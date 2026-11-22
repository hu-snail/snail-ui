<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— form 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/form-mp-asterisk.vue';
import Demo1 from './demos/form-mp-basic.vue';
import Demo2 from './demos/form-mp-cell-border.vue';
import Demo3 from './demos/form-mp-cell-clickable.vue';
import Demo4 from './demos/form-mp-cell-text.vue';
import Demo5 from './demos/form-mp-custom.vue';
import Demo6 from './demos/form-mp-disabled.vue';
import Demo7 from './demos/form-mp-fields.vue';
import Demo8 from './demos/form-mp-form-type.vue';
import Demo9 from './demos/form-mp-guard.vue';
import Demo10 from './demos/form-mp-icon.vue';
import Demo11 from './demos/form-mp-label.vue';
import Demo12 from './demos/form-mp-layout.vue';
import Demo13 from './demos/form-mp-message-display.vue';
import Demo14 from './demos/form-mp-reset-submit.vue';
import Demo15 from './demos/form-mp-rules.vue';
import Demo16 from './demos/form-mp-schema.vue';
import Demo17 from './demos/form-mp-size.vue';
import Demo18 from './demos/form-mp-status-icon.vue';
import Demo19 from './demos/form-mp-title-width.vue';
import Demo20 from './demos/form-mp-validate.vue';
import Demo21 from './demos/form-mp-validation-flow.vue';
import Demo22 from './demos/form-mp-value-align.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'表单'"
    :title-en="'Form'"
    :desc="'校验与布局容器'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t(
              '必填星号（asteriskPosition / hideAsterisk）',
              'Required asterisk (asteriskPosition / hideAsterisk)',
            )
          "
          badge="asterisk"
        />
        <view class="module__body">
          <Demo0 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo1 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('单元格分隔与截断', 'Cell dividers & truncation')"
          badge="cell-border"
        />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('可点击行（clickable / isLink）', 'Tappable rows (clickable / isLink)')"
          badge="cell-clickable"
        />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('占位与副文案', 'Placeholder & helper copy')"
          badge="cell-text"
        />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('自定义', 'Custom')" badge="custom" />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('禁用', 'Disabled')" badge="disabled" />
        <view class="module__body">
          <Demo6 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('字段', 'Fields')" badge="fields" />
        <view class="module__body">
          <Demo7 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('表单类型', 'Form type')" badge="form-type" />
        <view class="module__body">
          <Demo8 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('拦截', 'Guard')" badge="guard" />
        <view class="module__body">
          <Demo9 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('图标', 'Icon')" badge="icon" />
        <view class="module__body">
          <Demo10 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('标签', 'Label')" badge="label" />
        <view class="module__body">
          <Demo11 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('排布（layout / center）', 'Arrangement (layout / center)')"
          badge="layout"
        />
        <view class="module__body">
          <Demo12 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('错误消息展示策略', 'Error message display strategies')"
          badge="message-display"
        />
        <view class="module__body">
          <Demo13 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('reset-submit', 'Reset Submit')"
          badge="reset-submit"
        />
        <view class="module__body">
          <Demo14 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('rules', 'Rules')" badge="rules" />
        <view class="module__body">
          <Demo15 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('表单 schema', 'Form schema')" badge="schema" />
        <view class="module__body">
          <Demo16 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('尺寸（size）', 'Size')" badge="size" />
        <view class="module__body">
          <Demo17 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('状态图标（statusIcon）', 'Status icon (statusIcon)')"
          badge="status-icon"
        />
        <view class="module__body">
          <Demo18 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('标签列宽（titleWidth）', 'Label column width (titleWidth)')"
          badge="title-width"
        />
        <view class="module__body">
          <Demo19 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('validate', 'Validate')" badge="validate" />
        <view class="module__body">
          <Demo20 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('validation-flow', 'Validation Flow')"
          badge="validation-flow"
        />
        <view class="module__body">
          <Demo21 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('值对齐（valueAlign）', 'Value alignment (valueAlign)')"
          badge="value-align"
        />
        <view class="module__body">
          <Demo22 class="demo-host" />
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

/* #ifdef MP-WEIXIN */
/* mp 自定义组件外壳节点按内容收缩（inline 语义）：宿主转 block 铺满列宽，
 * 否则 demo 列宽 = 各宿主 max-content —— 右锚定元素（swipe 操作钮等）不贴
 * 屏幕右缘、模块徽标行停在内容宽度处（设备实测回归，同 sn-step 的
 * virtualHost 修复；H5 上不能加 display，会盖掉 demo 根的 flex）。 */
.demo-host {
  display: block;
  width: 100%;
}
/* #endif */
</style>
