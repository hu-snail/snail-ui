<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— popover 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/popover-mp-alignment.vue';
import Demo1 from './demos/popover-mp-basic.vue';
import Demo2 from './demos/popover-mp-content-slot.vue';
import Demo3 from './demos/popover-mp-custom-style.vue';
import Demo4 from './demos/popover-mp-height.vue';
import Demo5 from './demos/popover-mp-menu.vue';
import Demo6 from './demos/popover-mp-placement.vue';
import Demo7 from './demos/popover-mp-theme.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'气泡'"
    :title-en="'Popover'"
    :desc="'锚点弹出气泡卡片'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('对齐方式', 'Alignment')" badge="alignment" />
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
          :title="t('content 插槽', '`content` slot')"
          badge="content-slot"
        />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('节点类名与偏移', 'Node classes & offset')"
          badge="custom-style"
        />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('高度', 'Height')" badge="height" />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('menu', 'Menu')" badge="menu" />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('弹出位置', 'Placement')" badge="placement" />
        <view class="module__body">
          <Demo6 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('主题', 'Theme')" badge="theme" />
        <view class="module__body">
          <Demo7 class="demo-host" />
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

/* popover：场景模块透明变体——组件的面板是自身坐标系内的 absolute 层、
 * 遮罩是 fixed 全屏层，白底卡片会把白色面板吞进卡片；去掉卡底与描边，
 * 面板与遮罩直接浮在页面画布上，浮起感由遮罩 + 柔影承担。 */
.module {
  background: transparent;
  border: none;
  box-shadow: none;
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
