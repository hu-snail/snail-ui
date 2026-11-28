<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— action-sheet 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/action-sheet-mp-action-icons.vue';
import Demo1 from './demos/action-sheet-mp-basic.vue';
import Demo2 from './demos/action-sheet-mp-behavior.vue';
import Demo3 from './demos/action-sheet-mp-custom-style.vue';
import Demo4 from './demos/action-sheet-mp-header.vue';
import Demo5 from './demos/action-sheet-mp-panels.vue';
import Demo6 from './demos/action-sheet-mp-render.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'动作面板'"
    :title-en="'Action Sheet'"
    :desc="'底部操作列表'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('行图标（icon）', 'Row icons (`icon`)')"
          badge="action-icons"
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
        <DemoModuleHead class="demo-host" :title="t('行为', 'Behavior')" badge="behavior" />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('自定义样式', 'Custom styles')"
          badge="custom-style"
        />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('标题与关闭按钮', 'Header & close button')"
          badge="header"
        />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('多列面板', 'Panels')" badge="panels" />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('渲染时机与安全区', 'Render timing & safe area')"
          badge="render"
        />
        <view class="module__body">
          <Demo6 class="demo-host" />
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
