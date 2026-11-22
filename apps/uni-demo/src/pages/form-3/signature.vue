<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— signature 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/signature-mp-basic.vue';
import Demo1 from './demos/signature-mp-button-labels.vue';
import Demo2 from './demos/signature-mp-disabled.vue';
import Demo3 from './demos/signature-mp-export.vue';
import Demo4 from './demos/signature-mp-history.vue';
import Demo5 from './demos/signature-mp-pen.vue';
import Demo6 from './demos/signature-mp-scroll.vue';
import Demo7 from './demos/signature-mp-size.vue';
import Demo8 from './demos/signature-mp-step.vue';
import Demo9 from './demos/signature-mp-stroke.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'签名'"
    :title-en="'Signature'"
    :desc="'手写签名板'"
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
        <DemoModuleHead
          class="demo-host"
          :title="t('button-labels', 'Button Labels')"
          badge="button-labels"
        />
        <view class="module__body">
          <Demo1 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('禁用（`disabled`）', 'Disabled (`disabled`)')"
          badge="disabled"
        />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t(
              '导出参数（`fileType` / `quality` / `exportScale`）',
              'Export params (`fileType` / `quality` / `exportScale`)',
            )
          "
          badge="export"
        />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('撤销与恢复（`enableHistory`）', 'Undo / redo (`enableHistory`)')"
          badge="history"
        />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('笔迹外观（`penColor` / `lineWidth`）', 'Pen look (`penColor` / `lineWidth`)')"
          badge="pen"
        />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('画板滚动（`disableScroll`）', 'Pad scrolling (`disableScroll`)')"
          badge="scroll"
        />
        <view class="module__body">
          <Demo6 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('画板尺寸与底色', 'Pad size & background')"
          badge="size"
        />
        <view class="module__body">
          <Demo7 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('撤回步长（`step`）', 'Undo step (`step`)')"
          badge="step"
        />
        <view class="module__body">
          <Demo8 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t('笔迹参数（`pressure` / `lineWidth`）', 'Stroke params (`pressure` / `lineWidth`)')
          "
          badge="stroke"
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
