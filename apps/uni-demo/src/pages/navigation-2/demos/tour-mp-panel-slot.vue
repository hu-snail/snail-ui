<script setup lang="ts">
/**
 * Demo: sn-tour — 自定义面板与按钮（show-tour-buttons / #footer / #default）。
 *
 * - `show-tour-buttons=false` 隐藏默认按钮，改用 `footer` 插槽自行渲染
 * - 默认插槽作用域 `{ step, current, total }` 可自定义面板正文
 *
 * 预览专用：真实运行时的根节点是 `position: fixed`，会盖住整页；
 * `custom-class` 落到根节点，把预览里的引导层固定到这块 stage 内。
 */
import { ref } from 'vue';
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue';

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
      <text class="sn-demo__button" @tap="customVisible = true">打开自定义面板引导</text>

      <SnTour
        v-model="customVisible"
        v-model:current="customCurrent"
        :steps="customSteps"
        :show-tour-buttons="false"
        custom-class="sn-demo-contained"
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

    <text class="sn-demo__meta">步骤：{{ customCurrent + 1 }}</text>
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
