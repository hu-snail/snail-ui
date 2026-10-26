<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — 自定义各阶段 class + custom-class / custom-style。
 *
 * `enter-class` / `enter-active-class` / `enter-to-class`（离开侧同理）会按阶段挂到
 * 根节点上：
 *
 *   - enter-class        进入的第一帧
 *   - enter-active-class 整个进入过程中
 *   - enter-to-class     进入结束、且 `show=true` 时
 *   - leave-class / leave-active-class / leave-to-class 离开侧一一对应
 *
 * 注意：这三个 class 只在对应阶段挂载，动画本身仍由 `name` / `duration` 驱动；
 * 下面的自定义 class 只改颜色与位移，用来肉眼确认阶段切换。
 *
 * `custom-class` 常驻根节点，`custom-style` 追加到根节点 inline style。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue';

const shown = ref(true);
const phaseLog = ref<string[]>([]);

function toggle(): void {
  shown.value = !shown.value;
}

function log(label: string): void {
  phaseLog.value = [...phaseLog.value.slice(-5), label];
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      六个阶段 class + custom-class（常驻，虚线框）+ custom-style（内联圆角与底色）
    </text>
    <SnButton size="small" @tap="toggle">{{ shown ? '收起' : '展开' }}</SnButton>

    <SnTransition
      :show="shown"
      name="fade-up"
      :duration="400"
      enter-class="sn-demo-stage--enter"
      enter-active-class="sn-demo-stage--enter-active"
      enter-to-class="sn-demo-stage--enter-to"
      leave-class="sn-demo-stage--leave"
      leave-active-class="sn-demo-stage--leave-active"
      leave-to-class="sn-demo-stage--leave-to"
      custom-class="sn-demo-stage--root"
      custom-style="border-radius: var(--sn-mp-radius-lg);"
      @before-enter="log('before-enter')"
      @after-enter="log('after-enter')"
      @before-leave="log('before-leave')"
      @after-leave="log('after-leave')"
    >
      <view class="sn-demo-stage__box">
        <text class="sn-demo-stage__text">自定义阶段 class</text>
      </view>
    </SnTransition>

    <text class="sn-demo__meta">事件序列：{{ phaseLog.join(' → ') || '—' }}</text>

    <text class="sn-demo__meta">
      只给 custom-class 的对照：节点上没有额外阶段 class，动画仍按 name 播放
    </text>
    <SnTransition :show="shown" name="zoom-in" custom-class="sn-demo-stage--root">
      <view class="sn-demo-stage__box">
        <text class="sn-demo-stage__text">只有 custom-class</text>
      </view>
    </SnTransition>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo-stage__box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo-stage__text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-primary);
}

/* custom-class：常驻根节点。 */
.sn-demo :deep(.sn-demo-stage--root) {
  padding: var(--sn-mp-spacing-2);
  border: 2rpx dashed var(--sn-mp-color-border-default);
}

/* 进入阶段：起点偏灰，过程中加阴影，结束回到品牌浅底。 */
.sn-demo :deep(.sn-demo-stage--enter) {
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo :deep(.sn-demo-stage--enter-active) {
  box-shadow: var(--sn-mp-shadow-sm);
}
.sn-demo :deep(.sn-demo-stage--enter-to) {
  background-color: var(--sn-mp-color-action-primary-soft);
}

/* 离开阶段：起点品牌浅底，过程中降饱和，结束回到极淡底。 */
.sn-demo :deep(.sn-demo-stage--leave) {
  background-color: var(--sn-mp-color-action-primary-soft);
}
.sn-demo :deep(.sn-demo-stage--leave-active) {
  opacity: 0.7;
}
.sn-demo :deep(.sn-demo-stage--leave-to) {
  background-color: var(--sn-mp-color-background-sunken);
}
</style>
