<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— datetime-picker 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/datetime-picker-mp-basic.vue';
import Demo1 from './demos/datetime-picker-mp-before-confirm.vue';
import Demo2 from './demos/datetime-picker-mp-card.vue';
import Demo3 from './demos/datetime-picker-mp-column-format.vue';
import Demo4 from './demos/datetime-picker-mp-header.vue';
import Demo5 from './demos/datetime-picker-mp-immediate-change.vue';
import Demo6 from './demos/datetime-picker-mp-lunar.vue';
import Demo7 from './demos/datetime-picker-mp-roller-geometry.vue';
import Demo8 from './demos/datetime-picker-mp-sheet-chrome.vue';
import Demo9 from './demos/datetime-picker-mp-time-bounds.vue';
import Demo10 from './demos/datetime-picker-mp-time-type.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'时间选择器'"
    :title-en="'Datetime Picker'"
    :desc="'日期时间弹层选择'"
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
        <DemoModuleHead
          :title="t('确认拦截（beforeConfirm）', 'Confirm veto (beforeConfirm)')"
          badge="before-confirm"
        />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('卡片', 'Card')" badge="card" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t('列文案与过滤（formatter / filter）', 'Column copy & filtering (formatter / filter)')
          "
          badge="column-format"
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('标题与描述', 'Title & description')" badge="header" />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('即时写回（immediateChange）', 'Immediate write-back (immediateChange)')"
          badge="immediate-change"
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('农历', 'Lunar')" badge="lunar" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="
            t(
              '滚筒几何（itemHeight / visibleItemCount）',
              'Roller geometry (itemHeight / visibleItemCount)',
            )
          "
          badge="roller-geometry"
        />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('弹层外观（文案 / 遮罩 / 层级）', 'Sheet chrome (labels / scrim / stacking)')"
          badge="sheet-chrome"
        />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('时分秒边界', 'Hour-minute-second bounds')" badge="time-bounds" />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('时间类型（type=&quot;time&quot;）', 'Time type (type=&quot;time&quot;)')"
          badge="time-type"
        />
        <view class="module__body">
          <Demo10 />
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
