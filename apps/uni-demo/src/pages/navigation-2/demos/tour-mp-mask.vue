<script setup lang="ts">
/**
 * Demo: sn-tour — 蒙版开关、蒙版色、动画时长、层级与自定义面板。
 *
 * - `mask` 关掉后只剩引导面板，没有蒙层
 * - `mask-color` 内联覆盖蒙版背景色（空串 = 令牌默认 `--sn-mp-color-background-overlay`）
 * - `duration` 参与 `--snui-tour-duration`（非 300 时才写入根节点）
 * - `z-index` / `custom-class` / `custom-style` 落在根节点
 * - `show-tour-buttons=false` 隐藏默认按钮，改用 `footer` 插槽自行渲染
 * - 默认插槽作用域 `{ step, current, total }` 可自定义面板正文
 *
 * 预览专用：真实运行时的根节点是 `position: fixed`，会盖住整页；
 * `custom-class` 落到根节点，把预览里的引导层固定到这块 stage 内。
 *
 * 说明：`offset` / `padding` / `top-safety-offset` / `bottom-safety-offset` /
 * `custom-nav` 依赖对目标元素做同步测量（uni 端无统一可用 API），因此这里只
 * 作为契约位传入，不产生可见的高亮挖孔；能测量的宿主（H5 / App）可自行定位。
 */
import { ref } from 'vue';
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue';

const plainVisible = ref(false);
const plainCurrent = ref(0);
const plainSteps = [{ content: 'mask=false：没有蒙层，只有引导面板。' }, { content: '第二步。' }];

const customVisible = ref(false);
const customCurrent = ref(0);
const customSteps = [
  { content: '这一步用 footer 插槽渲染自定义操作区。' },
  { content: '最后一步，自定义按钮文字变成「知道了」。' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__stage">
      <text class="sn-demo__button" @tap="plainVisible = true">打开无蒙层引导</text>
      <text class="sn-demo__button" @tap="customVisible = true">打开自定义蒙版色 + 自定义面板</text>

      <SnTour
        v-model="plainVisible"
        v-model:current="plainCurrent"
        :steps="plainSteps"
        :mask="false"
        :duration="150"
        :offset="20"
        :padding="8"
        :top-safety-offset="0"
        :bottom-safety-offset="100"
        :z-index="60"
        custom-class="sn-demo-contained"
      />

      <SnTour
        v-model="customVisible"
        v-model:current="customCurrent"
        :steps="customSteps"
        mask-color="var(--sn-mp-color-background-overlay)"
        :duration="300"
        :border-radius="16"
        :show-tour-buttons="false"
        custom-nav
        custom-class="sn-demo-contained"
        custom-style="--snui-tour-duration: 300ms;"
      >
        <template #default="{ step, current, total }">
          <view class="sn-demo__panel">
            <text class="sn-demo__panel-title">第 {{ current + 1 }} / {{ total }} 步</text>
            <text class="sn-demo__panel-text">{{ step?.content }}</text>
          </view>
        </template>
        <template #footer="{ current, total }">
          <view class="sn-demo__footer">
            <text class="sn-demo__button" @tap="customVisible = false">跳过</text>
            <text
              class="sn-demo__button sn-demo__button--primary"
              @tap="customVisible = current + 1 >= total ? false : (customCurrent = current + 1)"
            >
              {{ current + 1 >= total ? '知道了' : '继续' }}
            </text>
          </view>
        </template>
      </SnTour>
    </view>

    <text class="sn-demo__meta">步骤：{{ plainCurrent + 1 }} / {{ customCurrent + 1 }}</text>
  </view>
</template>

<style scoped>
.sn-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: flex-start;
  min-height: 480rpx;
  padding: var(--sn-mp-spacing-4);
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__button--primary {
  border-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__panel-title {
  font-size: 28rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__panel-text {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed guide layer to the stage. */
.sn-demo__stage :deep(.sn-tour.sn-demo-contained) {
  position: absolute;
}
</style>
