<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— button 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/button-mp-basic.vue';
import Demo1 from './demos/button-mp-size.vue';
import Demo2 from './demos/button-mp-variant.vue';
import Demo3 from './demos/button-mp-state.vue';
import Demo4 from './demos/button-mp-icon-button.vue';
import Demo5 from './demos/button-mp-loading.vue';
import Demo6 from './demos/button-mp-block.vue';
import Demo7 from './demos/button-mp-color-override.vue';
import Demo8 from './demos/button-mp-hairline.vue';
import Demo9 from './demos/button-mp-round.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'按钮'"
    :title-en="'Button'"
    :desc="'多种类型与变体的主操作按钮'"
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
        <DemoModuleHead class="demo-host" :title="t('尺寸', 'Size')" badge="size" />
        <view class="module__body">
          <Demo1 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('变体', 'Variants')" badge="variant" />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('状态', 'State')" badge="state" />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('图标按钮', 'Icon Button')"
          badge="icon-button"
        />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('loading', 'Loading')" badge="loading" />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('块级按钮（block）', 'Block button (`block`)')"
          badge="block"
        />
        <view class="module__body">
          <Demo6 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t('内联颜色覆盖（bgColor / color）', 'Inline color overrides (`bgColor` / `color`)')
          "
          badge="color-override"
        />
        <view class="module__body">
          <Demo7 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('细边框（hairline）', 'Hairline border (`hairline`)')"
          badge="hairline"
        />
        <view class="module__body">
          <Demo8 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('圆角按钮（round）', 'Round button (`round`)')"
          badge="round"
        />
        <view class="module__body">
          <Demo9 class="demo-host" />
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
