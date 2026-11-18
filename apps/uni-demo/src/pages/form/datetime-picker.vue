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
import Demo11 from './demos/datetime-picker-mp-wheel.vue';
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
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" inset />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('确认拦截（beforeConfirm）', 'Confirm veto (beforeConfirm)')"
          badge="before-confirm"
          inset
        />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('卡片', 'Card')" badge="card" inset />
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
          inset
        />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('标题与描述', 'Title & description')" badge="header" inset />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('即时写回（immediateChange）', 'Immediate write-back (immediateChange)')"
          badge="immediate-change"
          inset
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('农历', 'Lunar')" badge="lunar" inset />
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
          inset
        />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('弹层外观（文案 / 遮罩 / 层级）', 'Sheet chrome (labels / scrim / stacking)')"
          badge="sheet-chrome"
          inset
        />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('时分秒边界', 'Hour-minute-second bounds')"
          badge="time-bounds"
          inset
        />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('时间类型（type=&quot;time&quot;）', 'Time type (type=&quot;time&quot;)')"
          badge="time-type"
          inset
        />
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('wheel 风格', 'Wheel style')" badge="wheel" inset />
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 0 0 48rpx;
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

/* datetime-picker：场景模块透明变体——入口行直接使用 sn-cell（无分组卡片，模块标题由
 * 外层场景标题行承担），cell 自带 surface 背景，即组件的真实形态；白卡底
 * 会与组件背景双重叠加。去掉卡底与描边，入口行直接浮在页面画布上，层级由
 * cell 自身的圆角 / 描边 / 分隔线承担。 */
.module {
  background: transparent;
  border: none;
  box-shadow: none;
}

.module {
  padding-left: 0;
  padding-right: 0;
}

.module__body {
  padding: 0;
}
</style>
