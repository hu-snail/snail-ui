<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — draggable trigger (`draggable`, wd-fab parity).
 *
 *   - Hold the bottom-right trigger and drag; on release it clamps back
 *     inside the `gap` safe area (MP reads the viewport via
 *     `uni.getSystemInfoSync()`; without one the offset is kept as-is).
 *   - Dragging and expanding do not interfere: the menu still opens after a
 *     drag and items slide out upwards.
 *   - Copy stays in parity with fab-mp-drag.vue.
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
      <text class="sn-fab-demo__hint-title">Drag</text>
      <text class="sn-fab-demo__hint-text">
        Hold the bottom-right button to drag it; on release it clamps into the safe area and still
        expands. Last action: {{ lastAction === '' ? 'none yet' : lastAction }}
      </text>
    </view>

    <SnFab
      v-model:active="active"
      position="right-bottom"
      direction="up"
      draggable
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="Music" @tap="pick('Music')">
        <SnIcon :icon="Music" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Coffee" @tap="pick('Coffee')">
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

/* Top-left: clear of the bottom-right drag / expand area. */
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
