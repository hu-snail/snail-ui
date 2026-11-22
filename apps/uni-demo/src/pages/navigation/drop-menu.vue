<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— drop-menu 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/drop-menu-mp-basic.vue';
import Demo1 from './demos/drop-menu-mp-direction.vue';
import Demo2 from './demos/drop-menu-mp-disabled.vue';
import Demo3 from './demos/drop-menu-mp-guard.vue';
import Demo4 from './demos/drop-menu-mp-icon.vue';
import Demo5 from './demos/drop-menu-mp-keys.vue';
import Demo6 from './demos/drop-menu-mp-modal.vue';
import Demo7 from './demos/drop-menu-mp-popup-height.vue';
import Demo8 from './demos/drop-menu-mp-slot.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'下拉菜单'"
    :title-en="'Drop Menu'"
    :desc="'顶部下拉筛选'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('方向', 'Direction')" badge="direction" />
        <view class="module__body">
          <Demo1 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('禁用（disabled）', 'Disabled (`disabled`)')"
          badge="disabled"
        />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('开关拦截（beforeToggle）', 'Toggle guard (`beforeToggle`)')"
          badge="guard"
        />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('图标', 'Icon')" badge="icon" />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('字段重命名（labelKey / valueKey）', 'Field keys (`labelKey` / `valueKey`)')"
          badge="keys"
        />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('蒙层行为（modal）', 'Scrim behavior (`modal`)')"
          badge="modal"
        />
        <view class="module__body">
          <Demo6 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('面板高度与样式', 'Panel height & styling')"
          badge="popup-height"
        />
        <view class="module__body">
          <Demo7 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('自定义面板插槽', 'Custom panel slot')"
          badge="slot"
        />
        <view class="module__body">
          <Demo8 class="demo-host" />
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

/* drop-menu：场景模块透明变体——组件的面板是自身坐标系内的 absolute 层、
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
