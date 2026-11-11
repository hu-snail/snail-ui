<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— textarea 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/textarea-mp-auto-height.vue';
import Demo1 from './demos/textarea-mp-basic.vue';
import Demo2 from './demos/textarea-mp-clear-trigger.vue';
import Demo3 from './demos/textarea-mp-clearable.vue';
import Demo4 from './demos/textarea-mp-compact.vue';
import Demo5 from './demos/textarea-mp-custom-class.vue';
import Demo6 from './demos/textarea-mp-disabled-readonly.vue';
import Demo7 from './demos/textarea-mp-error.vue';
import Demo8 from './demos/textarea-mp-mp-runtime.vue';
import Demo9 from './demos/textarea-mp-placeholder.vue';
import Demo10 from './demos/textarea-mp-prefix-icon.vue';
import Demo11 from './demos/textarea-mp-word-limit.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'文本域'" :title-en="'Textarea'" :desc="'多行文本输入'" :bg="''">
    <view class="page">
      <view class="module">
        <DemoModuleHead
          :title="t('自动增高（`autoHeight`）', 'Auto height (`autoHeight`)')"
          badge="auto-height"
        />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('clear-trigger', 'Clear Trigger')" badge="clear-trigger" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('可清空（`clearable`）', 'Clearable (`clearable`)')"
          badge="clearable"
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('紧凑模式（`compact`）', 'Compact (`compact`)')"
          badge="compact"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义类名', 'Custom class')" badge="custom-class" />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '只读与禁用（`readonly` / `disabled`）',
              'Readonly & disabled (`readonly` / `disabled`)',
            )
          "
          badge="disabled-readonly"
        />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('错误态（`error`）', 'Error state (`error`)')" badge="error" />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('mp-runtime', 'Mp Runtime')" badge="mp-runtime" />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('占位符样式', 'Placeholder styling')" badge="placeholder" />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('前置图标（`prefixIcon`）', 'Leading icon (`prefixIcon`)')"
          badge="prefix-icon"
        />
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('字数统计（`showWordLimit`）', 'Word limit (`showWordLimit`)')"
          badge="word-limit"
        />
        <view class="module__body">
          <Demo11 />
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
