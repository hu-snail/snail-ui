<script setup lang="ts">
/**
 * Demo: sn-root-portal (uni-end) — custom-class / custom-style。
 *
 * 这层是组件唯一能设置样式的节点（没有传送目标），所以两个 prop 是
 * 使用它做浮层的前提：
 *   - customClass   → 固定层类名
 *   - customStyle   → 固定层内联样式
 *
 * 文档预览里的额外处理：真实小程序中这一层是 `position: fixed`，会盖住
 * 整块手机屏幕；为了在手机壳内演示，demo 用 customClass 把它改成
 * `position: absolute`（仅预览需要，业务代码不要这么写）。
 */
import { ref } from 'vue';
import SnRootPortal from '@snui/uni-src/components/sn-root-portal/sn-root-portal.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const visible = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__host">
      <text class="sn-demo__note">宿主容器：position: relative + overflow: hidden</text>

      <SnRootPortal
        v-if="visible"
        custom-class="sn-demo__layer"
        custom-style="padding: var(--sn-mp-spacing-2);"
      >
        <view class="sn-demo__badge">custom-class 控制的固定层</view>
      </SnRootPortal>
    </view>

    <view class="sn-demo__actions">
      <SnButton size="small" @tap="visible = !visible">
        {{ visible ? '卸载传送层' : '挂载传送层' }}
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: stretch;
}
.sn-demo__host {
  position: relative;
  height: 200rpx;
  padding: var(--sn-mp-spacing-3);
  overflow: hidden;
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo__note {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__badge {
  position: absolute;
  left: 50%;
  bottom: var(--sn-mp-spacing-3);
  transform: translateX(-50%);
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
  white-space: nowrap;
}
.sn-demo__actions {
  display: flex;
  gap: 12rpx;
}
/* custom-class 落在固定层上。仅文档预览：把它约束在宿主容器里，避免盖住
 * 整个手机屏幕；真实业务里应保持组件默认的 position: fixed。 */
.sn-demo :deep(.sn-demo__layer) {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-overlay);
}
</style>
