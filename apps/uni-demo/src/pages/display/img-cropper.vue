<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— img-cropper 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/img-cropper-mp-export-props.vue';
import Demo1 from './demos/img-cropper-mp-frame.vue';
import Demo2 from './demos/img-cropper-mp-max-scale.vue';
import Demo3 from './demos/img-cropper-mp-ratio.vue';
import Demo4 from './demos/img-cropper-mp-rotate.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'图片裁剪'"
    :title-en="'Img Cropper'"
    :desc="'裁剪几何交互'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('导出声明参数', 'Declared export props')"
          badge="export-props"
        />
        <view class="module__body">
          <Demo0 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t('预览框尺寸（imgWidth / imgHeight）', 'Preview frame size (`imgWidth` / `imgHeight`)')
          "
          badge="frame"
        />
        <view class="module__body">
          <Demo1 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('缩放上限（maxScale）', 'Zoom cap (`maxScale`)')"
          badge="max-scale"
        />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('裁剪比例（aspectRatio）', 'Aspect ratio (`aspectRatio`)')"
          badge="ratio"
        />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t(
              '禁止旋转与按钮文案（disabledRotate）',
              'Disable rotation & button labels (`disabledRotate`)',
            )
          "
          badge="rotate"
        />
        <view class="module__body">
          <Demo4 class="demo-host" />
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
