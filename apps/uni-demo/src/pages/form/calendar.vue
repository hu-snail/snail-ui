<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— calendar 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/calendar-mp-basic.vue';
import Demo1 from './demos/calendar-mp-card.vue';
import Demo2 from './demos/calendar-mp-declared-props.vue';
import Demo3 from './demos/calendar-mp-first-day-of-week.vue';
import Demo4 from './demos/calendar-mp-formatter.vue';
import Demo5 from './demos/calendar-mp-header.vue';
import Demo6 from './demos/calendar-mp-immediate-change.vue';
import Demo7 from './demos/calendar-mp-lunar.vue';
import Demo8 from './demos/calendar-mp-panel.vue';
import Demo9 from './demos/calendar-mp-range-constraints.vue';
import Demo10 from './demos/calendar-mp-sheet-chrome.vue';
import Demo11 from './demos/calendar-mp-shortcuts-events.vue';
import Demo12 from './demos/calendar-mp-shortcuts-range.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'日历选择器'"
    :title-en="'Calendar'"
    :desc="'日期区间选择弹层'"
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
        <DemoModuleHead :title="t('卡片', 'Card')" badge="card" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '声明对齐参数（timeFilter / hideSecond 等）',
              'Declared parity props (timeFilter / hideSecond etc.)',
            )
          "
          badge="declared-props"
        />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('周起始日（firstDayOfWeek）', 'First day of week (firstDayOfWeek)')"
          badge="first-day-of-week"
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('单元格格式化（formatter）', 'Cell formatting (formatter)')"
          badge="formatter"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('标题与描述', 'Title & description')" badge="header" />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('即时写回（immediateChange）', 'Immediate write-back (immediateChange)')"
          badge="immediate-change"
        />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('农历', 'Lunar')" badge="lunar" />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '面板尺寸与切换（panelHeight / switchMode）',
              'Panel size & switching (panelHeight / switchMode)',
            )
          "
          badge="panel"
        />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '区间约束（maxRange / allowSameDay / defaultTime）',
              'Range constraints (maxRange / allowSameDay / defaultTime)',
            )
          "
          badge="range-constraints"
        />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('弹层外观与底栏插槽', 'Sheet chrome & footer slot')"
          badge="sheet-chrome"
        />
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '快捷回调与确认拦截（onShortcutsClick / beforeConfirm）',
              'Shortcut callback & confirm veto (onShortcutsClick / beforeConfirm)',
            )
          "
          badge="shortcuts-events"
        />
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('shortcuts-range', 'Shortcuts Range')" badge="shortcuts-range" />
        <view class="module__body">
          <Demo12 />
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
