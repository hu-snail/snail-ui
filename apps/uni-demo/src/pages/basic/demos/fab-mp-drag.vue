<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 可拖拽触发按钮（`draggable`，wd-fab 对齐）。
 *
 *   - 按住右下角触发按钮拖动，松手后按 `gap` 收进屏幕安全区（MP 端经
 *     `uni.getSystemInfoSync()` 读取视口，读不到则保持原位）。
 *   - 拖动与展开互不干扰：拖完仍可点开展开动作项，动作项沿上方滑出。
 *   - 文案与 fab-mp-drag.en.vue 对等。
 *
 * Docs preview: `custom-class="sn-demo-contained"` pins the fixed layer to
 * the phone screen (the real runtime keeps `position: fixed`).
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Coffee, Music } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const active = ref(false);
const lastAction = ref('');

function pick(label: string): void {
  lastAction.value = label;
  active.value = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">拖拽</text>
      <text class="sn-fab-demo__hint-text">
        按住右下角按钮拖动，松手自动收进屏幕安全区；拖完仍可点开展开。最近动作：{{
          lastAction === '' ? '尚未选择' : lastAction
        }}
      </text>
    </view>

    <SnFab
      v-model:active="active"
      position="right-bottom"
      direction="up"
      draggable
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="音乐" @tap="pick('音乐')">
        <SnIcon :icon="Music" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="咖啡" @tap="pick('咖啡')">
        <SnIcon :icon="Coffee" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 560rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-subtle);
}

/* 左上角：给右下角的拖拽 / 展开区让位。 */
.sn-fab-demo__hint {
  position: absolute;
  top: var(--sn-mp-spacing-5);
  left: var(--sn-mp-spacing-5);
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  max-width: 55%;
}

.sn-fab-demo__hint-title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sn-fab-demo__hint-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-fab-demo__bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-sm);
  color: var(--sn-mp-color-text-secondary);
}

/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
